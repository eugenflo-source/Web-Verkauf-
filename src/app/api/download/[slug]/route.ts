import { NextResponse, type NextRequest } from "next/server";
import { getProduct } from "@/data/products";
import { getOrderBySession, getOrdersForUser, type OrderRow } from "@/lib/orders";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const BUCKET = "product-files";
/** Wie lange der Link auf der Bestellbestätigung ohne Anmeldung funktioniert. */
const SESSION_LINK_HOURS = 72;
/** Gültigkeit des signierten Datei-Links in Sekunden. */
const SIGNED_URL_SECONDS = 60;

function deny(request: NextRequest, reason: string) {
  return NextResponse.redirect(new URL(`/konto?hinweis=${reason}`, request.url), 303);
}

function containsPaid(order: OrderRow | null | undefined, slug: string) {
  return Boolean(order && order.status === "paid" && order.order_items.some((i) => i.product_slug === slug));
}

/**
 * Geschützter Download. Freigabe nur, wenn eine serverseitig (per Webhook)
 * als bezahlt gespeicherte Bestellung das Produkt enthält.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/download/[slug]">) {
  const { slug } = await ctx.params;
  const product = getProduct(slug);
  if (!product?.file) return deny(request, "download-unbekannt");

  const db = createSupabaseAdminClient();
  if (!db) return deny(request, "download-nicht-eingerichtet");

  let allowed = false;

  // 1) Direkt nach dem Kauf: Link mit Checkout-Session-ID (zeitlich begrenzt)
  const sessionId = request.nextUrl.searchParams.get("bestellung");
  if (sessionId?.startsWith("cs_")) {
    const order = await getOrderBySession(sessionId);
    const fresh = order && Date.now() - new Date(order.created_at).getTime() < SESSION_LINK_HOURS * 3600 * 1000;
    allowed = Boolean(fresh && containsPaid(order, slug));
  }

  // 2) Angemeldet im Kundenbereich
  if (!allowed) {
    const user = await getCurrentUser();
    if (user) {
      const orders = await getOrdersForUser(user.id, user.email_confirmed_at ? user.email : undefined);
      allowed = Boolean(orders?.some((o) => containsPaid(o, slug)));
    } else if (!sessionId) {
      return deny(request, "anmeldung-erforderlich");
    }
  }

  if (!allowed) return deny(request, "download-nicht-freigegeben");

  const { data, error } = await db.storage.from(BUCKET).createSignedUrl(product.file, SIGNED_URL_SECONDS, { download: true });
  if (error || !data?.signedUrl) {
    console.error("[download] Signierter Link fehlgeschlagen:", error?.message);
    return deny(request, "datei-fehlt");
  }
  return NextResponse.redirect(data.signedUrl, 303);
}
