import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FlaskConical } from "lucide-react";
import { formatPrice } from "@/data/products";
import { decodeLines } from "@/lib/checkout";
import { paymentMode } from "@/lib/env";
import { ClearCart } from "@/components/shop/ClearCart";

export const metadata: Metadata = { title: "Testbestellung", robots: { index: false } };

export default async function TestCheckoutPage({ searchParams }: PageProps<"/checkout/test">) {
  // Sobald Stripe eingerichtet ist, gibt es keinen simulierten Ablauf mehr.
  if (paymentMode() !== "test-flow") redirect("/warenkorb");
  const { positionen } = await searchParams;
  const lines = decodeLines(typeof positionen === "string" ? positionen : undefined);
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);

  return (
    <div className="container-x pt-36 md:pt-44">
      <ClearCart />
      <div className="mx-auto max-w-2xl">
        <div className="glass sheen rounded-[1.75rem] p-6 sm:p-10">
          <span className="chip chip-demo">
            <FlaskConical className="h-3.5 w-3.5" aria-hidden /> Testablauf – keine Zahlung
          </span>
          <h1 className="headline mt-6 text-3xl sm:text-4xl">Testbestellung abgeschlossen</h1>
          <p className="lead mt-4">
            Dies war ein simulierter Ablauf. Es wurde <strong className="font-medium text-fg">keine Zahlung</strong> durchgeführt, keine Bestellung gespeichert und keine Datei freigegeben.
          </p>

          {lines.length > 0 && (
            <dl className="mt-8 space-y-2.5 border-t border-white/[0.08] pt-6 text-sm">
              {lines.map((l) => (
                <div key={l.product.slug} className="flex justify-between gap-4 text-fg-muted">
                  <dt>
                    {l.qty > 1 && `${l.qty} × `}
                    {l.product.name}
                  </dt>
                  <dd className="tabular-nums">{formatPrice(l.product.price * l.qty)}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-white/[0.08] pt-3 font-semibold">
                <dt>Summe (nicht berechnet)</dt>
                <dd className="tabular-nums">{formatPrice(total)}</dd>
              </div>
            </dl>
          )}

          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-sm leading-relaxed text-fg-muted">
            <p className="font-medium text-fg">So läuft es im echten Betrieb</p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5">
              <li>Weiterleitung zur sicheren Bezahlseite von Stripe.</li>
              <li>Stripe bestätigt die Zahlung per Webhook an den Server.</li>
              <li>Die Bestellung wird gespeichert, die Rechnung erstellt.</li>
              <li>Downloads erscheinen auf der Bestätigungsseite und im Kundenbereich.</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary">
              Zurück zum Shop
            </Link>
            <Link href="/konto" className="btn btn-secondary">
              Kundenbereich ansehen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
