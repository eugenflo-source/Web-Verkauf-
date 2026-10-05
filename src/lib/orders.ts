import "server-only";
import type Stripe from "stripe";
import { getProduct } from "@/data/products";
import { createSupabaseAdminClient } from "./supabase/admin";
import { getStripe } from "./stripe";

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderRow = {
  id: string;
  stripe_session_id: string;
  email: string | null;
  status: OrderStatus;
  amount_total: number;
  currency: string;
  invoice_url: string | null;
  livemode: boolean;
  created_at: string;
  order_items: { product_slug: string; product_name: string; quantity: number; unit_amount: number }[];
};

/** Bestellung aus einer Stripe-Checkout-Session anlegen bzw. aktualisieren (idempotent). */
export async function syncOrderFromSession(sessionId: string, statusOverride?: OrderStatus) {
  const stripe = getStripe();
  const db = createSupabaseAdminClient();
  if (!stripe || !db) throw new Error("Stripe oder Supabase ist nicht konfiguriert.");

  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["invoice"] });
  const status: OrderStatus = statusOverride ?? (session.payment_status === "paid" || session.payment_status === "no_payment_required" ? "paid" : "pending");
  const invoice = session.invoice && typeof session.invoice === "object" ? (session.invoice as Stripe.Invoice) : null;

  const { data: order, error } = await db
    .from("orders")
    .upsert(
      {
        stripe_session_id: session.id,
        stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
        user_id: session.client_reference_id || null,
        email: (session.customer_details?.email ?? session.customer_email ?? null)?.toLowerCase() ?? null,
        status,
        amount_total: session.amount_total ?? 0,
        currency: session.currency ?? "eur",
        invoice_url: invoice?.hosted_invoice_url ?? null,
        consent_waiver_at: session.metadata?.consent_at ?? null,
        livemode: session.livemode,
      },
      { onConflict: "stripe_session_id" },
    )
    .select("id")
    .single();
  if (error || !order) throw new Error(`Bestellung konnte nicht gespeichert werden: ${error?.message}`);

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100, expand: ["data.price.product"] });
  const rows = lineItems.data.flatMap((li) => {
    const product = li.price?.product;
    const slug = product && typeof product === "object" && !("deleted" in product && product.deleted) ? (product as Stripe.Product).metadata.slug : undefined;
    if (!slug || !getProduct(slug)) return [];
    return [{ order_id: order.id, product_slug: slug, product_name: li.description ?? slug, quantity: li.quantity ?? 1, unit_amount: li.price?.unit_amount ?? 0 }];
  });
  if (rows.length) {
    const { error: itemsError } = await db.from("order_items").upsert(rows, { onConflict: "order_id,product_slug" });
    if (itemsError) throw new Error(`Positionen konnten nicht gespeichert werden: ${itemsError.message}`);
  }
  return { id: order.id as string, status };
}

export async function setOrderStatusByPaymentIntent(paymentIntentId: string, status: OrderStatus) {
  const db = createSupabaseAdminClient();
  if (!db) return;
  await db.from("orders").update({ status }).eq("stripe_payment_intent_id", paymentIntentId);
}

const ORDER_SELECT = "id, stripe_session_id, email, status, amount_total, currency, invoice_url, livemode, created_at, order_items(product_slug, product_name, quantity, unit_amount)";

export async function getOrderBySession(sessionId: string) {
  const db = createSupabaseAdminClient();
  if (!db) return null;
  const { data } = await db.from("orders").select(ORDER_SELECT).eq("stripe_session_id", sessionId).maybeSingle();
  return (data as OrderRow | null) ?? null;
}

/** Bestellungen einer angemeldeten Person (über Nutzer-ID oder bestätigte E-Mail). */
export async function getOrdersForUser(userId: string, email: string | undefined) {
  const db = createSupabaseAdminClient();
  if (!db) return null;
  // Zwei getrennte Abfragen statt eines zusammengesetzten Filter-Strings
  const queries = [db.from("orders").select(ORDER_SELECT).eq("user_id", userId)];
  if (email) queries.push(db.from("orders").select(ORDER_SELECT).eq("email", email.toLowerCase()));
  const results = await Promise.all(queries);
  const byId = new Map<string, OrderRow>();
  for (const { data, error } of results) {
    if (error) console.error("[orders] Laden fehlgeschlagen:", error.message);
    for (const row of (data as OrderRow[] | null) ?? []) byId.set(row.id, row);
  }
  return [...byId.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
}
