import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleAlert, CircleCheck, Clock, Download, FileText } from "lucide-react";
import { formatPrice, getProduct } from "@/data/products";
import { getStripe } from "@/lib/stripe";
import { getOrderBySession } from "@/lib/orders";
import { isSupabaseAdminConfigured } from "@/lib/env";
import { ClearCart } from "@/components/shop/ClearCart";
import { AutoRefresh } from "@/components/shop/AutoRefresh";

export const metadata: Metadata = { title: "Bestellbestätigung", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: PageProps<"/checkout/erfolg">) {
  const { session_id } = await searchParams;
  const stripe = getStripe();
  if (!stripe || typeof session_id !== "string" || !session_id.startsWith("cs_")) redirect("/warenkorb");

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    redirect("/warenkorb");
  }

  const paidAtStripe = session.payment_status === "paid";
  const order = await getOrderBySession(session.id);
  const confirmed = order?.status === "paid";

  return (
    <div className="container-x pt-36 md:pt-44">
      {(paidAtStripe || session.status === "complete") && <ClearCart />}
      <div className="mx-auto max-w-2xl">
        <div className="glass sheen rounded-[1.75rem] p-6 sm:p-10">
          {confirmed ? (
            <CircleCheck className="h-10 w-10 text-success" aria-hidden />
          ) : paidAtStripe ? (
            <Clock className="h-10 w-10 text-accent" aria-hidden />
          ) : (
            <CircleAlert className="h-10 w-10 text-warning" aria-hidden />
          )}
          <h1 className="headline mt-6 text-3xl sm:text-4xl">
            {confirmed ? "Danke für deinen Kauf!" : paidAtStripe ? "Zahlung eingegangen" : "Zahlung wird bearbeitet"}
          </h1>
          <p className="lead mt-4">
            {confirmed
              ? "Deine Zahlung ist bestätigt. Deine Downloads stehen bereit; eine Bestätigung erhältst du zusätzlich per E-Mail von Stripe."
              : paidAtStripe
                ? "Wir bereiten deine Downloads vor. Das dauert normalerweise nur wenige Sekunden."
                : "Deine Zahlungsart benötigt etwas länger. Sobald die Zahlung bestätigt ist, findest du die Downloads im Kundenbereich."}
          </p>
          {!session.livemode && <p className="mt-4 text-sm text-warning">Stripe-Testmodus – es wurde kein echtes Geld bewegt.</p>}

          {confirmed && order && (
            <ul className="mt-8 space-y-2.5">
              {order.order_items.map((item) => {
                const product = getProduct(item.product_slug);
                return (
                  <li key={item.product_slug} className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.product_name}</p>
                      <p className="text-sm text-fg-subtle">
                        {item.quantity > 1 && `${item.quantity} × `}
                        {formatPrice(item.unit_amount)}
                      </p>
                    </div>
                    {product?.file ? (
                      <a href={`/api/download/${item.product_slug}?bestellung=${encodeURIComponent(session.id)}`} className="btn btn-primary btn-sm flex-none">
                        <Download className="h-4 w-4" aria-hidden /> Download
                      </a>
                    ) : (
                      <span className="text-sm text-fg-subtle">Datei folgt</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {paidAtStripe && !confirmed && (
            <div className="mt-8">{isSupabaseAdminConfigured() ? <AutoRefresh /> : <p className="text-sm text-warning">Die Download-Bereitstellung ist noch nicht eingerichtet (Datenbank fehlt).</p>}</div>
          )}

          <div className="mt-8 flex flex-wrap gap-3 border-t border-white/[0.08] pt-6">
            {order?.invoice_url && (
              <a href={order.invoice_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <FileText className="h-4 w-4" aria-hidden /> Rechnung ansehen
              </a>
            )}
            <Link href="/konto" className="btn btn-secondary">
              Zum Kundenbereich
            </Link>
            <Link href="/shop" className="btn btn-ghost">
              Weiter einkaufen
            </Link>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-fg-subtle">
            Die Download-Links auf dieser Seite funktionieren 72 Stunden. Danach erreichst du deine Käufe dauerhaft im Kundenbereich, indem du dich mit der beim Kauf verwendeten
            E-Mail-Adresse anmeldest.
          </p>
        </div>
      </div>
    </div>
  );
}
