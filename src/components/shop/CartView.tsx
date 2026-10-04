"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CircleAlert, FlaskConical, LoaderCircle, Lock, ShoppingBag, Trash } from "lucide-react";
import { formatPrice, getCategory, getProduct, type Product } from "@/data/products";
import { cart, useCart } from "@/lib/cart-store";
import { ProductVisual } from "@/components/mockups/ProductVisual";
import { QuantityStepper } from "./QuantityStepper";

type Mode = "test-flow" | "stripe-test" | "live";

export function CartView({ mode, taxNote }: { mode: Mode; taxNote: ReactNode }) {
  const items = useCart();
  const [terms, setTerms] = useState(false);
  const [waiver, setWaiver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [state, setState] = useState<{ type: "idle" } | { type: "loading" } | { type: "error"; message: string }>({ type: "idle" });

  if (items === null) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]" aria-busy="true" aria-label="Warenkorb wird geladen">
        <div className="space-y-3">
          <div className="skeleton h-32 rounded-2xl" />
          <div className="skeleton h-32 rounded-2xl" />
        </div>
        <div className="skeleton h-80 rounded-[1.5rem]" />
      </div>
    );
  }

  const lines = items
    .map((i) => ({ ...i, product: getProduct(i.slug) }))
    .filter((l): l is { slug: string; qty: number; product: Product } => Boolean(l.product));

  if (lines.length === 0) {
    return (
      <div className="surface animate-fade-in flex flex-col items-center rounded-[1.75rem] px-6 py-20 text-center md:py-28">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <ShoppingBag className="h-7 w-7 text-fg-muted" aria-hidden />
        </span>
        <p className="mt-6 text-2xl font-semibold tracking-tight">Dein Warenkorb ist leer.</p>
        <p className="mt-2 max-w-sm text-fg-muted">Entdecke Vorlagen, Rechner und Werkzeuge, die du sofort nutzen kannst.</p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Zum Shop <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    );
  }

  const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const hasDemo = lines.some((l) => l.product.demo);
  const demoBlocked = mode === "live" && hasDemo;
  const consentMissing = !terms || !waiver;

  async function checkout() {
    setSubmitted(true);
    if (consentMissing || demoBlocked) return;
    setState({ type: "loading" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines.map((l) => ({ slug: l.slug, qty: l.qty })), consent: { terms, waiver } }),
      });
      const json = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !json?.url) {
        setState({ type: "error", message: json?.error ?? "Der Bezahlvorgang konnte nicht gestartet werden. Bitte versuche es erneut." });
        return;
      }
      window.location.assign(json.url);
    } catch {
      setState({ type: "error", message: "Keine Verbindung. Bitte prüfe deine Internetverbindung." });
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
      <ul className="space-y-3" aria-label="Artikel im Warenkorb">
        {lines.map(({ slug, qty, product }) => (
          <li key={slug} className="surface animate-fade-in flex gap-4 rounded-2xl p-3 sm:p-4">
            <Link href={`/shop/${slug}`} className="block w-24 flex-none overflow-hidden rounded-xl sm:w-36" tabIndex={-1} aria-hidden>
              <ProductVisual kind={product.visual} label="" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-fg-subtle">
                    {getCategory(product.category).label} · {product.format}
                  </p>
                  <Link href={`/shop/${slug}`} className="mt-0.5 block font-medium leading-snug hover:text-accent">
                    {product.name}
                  </Link>
                  {product.demo && <span className="chip chip-demo mt-2">Demo</span>}
                </div>
                <p className="flex-none font-semibold tabular-nums">{formatPrice(product.price * qty)}</p>
              </div>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                {product.quantity.editable ? (
                  <QuantityStepper value={qty} max={product.quantity.max} onChange={(v) => cart.setQty(slug, v)} label={`Anzahl ${product.quantity.unitPlural} für ${product.name}`} />
                ) : (
                  <p className="text-sm text-fg-subtle">1 {product.quantity.unit}</p>
                )}
                <button type="button" onClick={() => cart.remove(slug)} className="btn btn-ghost btn-sm !px-2.5" aria-label={`${product.name} entfernen`}>
                  <Trash className="h-4 w-4" aria-hidden /> <span className="hidden sm:inline">Entfernen</span>
                </button>
              </div>
            </div>
          </li>
        ))}
        <li className="pt-2">
          <Link href="/shop" className="text-sm text-fg-muted hover:text-fg">
            ← Weiter einkaufen
          </Link>
        </li>
      </ul>

      <aside aria-label="Bestellübersicht" className="lg:sticky lg:top-28 lg:self-start">
        <div className="glass sheen rounded-[1.5rem] p-5 sm:p-6">
          <p className="text-lg font-semibold">Übersicht</p>
          <dl className="mt-5 space-y-2.5 text-sm">
            {lines.map((l) => (
              <div key={l.slug} className="flex justify-between gap-4 text-fg-muted">
                <dt className="truncate">
                  {l.qty > 1 && `${l.qty} × `}
                  {l.product.name}
                </dt>
                <dd className="tabular-nums">{formatPrice(l.product.price * l.qty)}</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-white/[0.08] pt-3 text-base font-semibold text-fg">
              <dt>Gesamt</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="mt-1.5 text-right text-xs text-fg-subtle">{taxNote}</p>
          <p className="mt-4 text-xs text-fg-subtle">Digitale Produkte – kein Versand. Bereitstellung als Download nach bestätigter Zahlung.</p>

          <fieldset className="mt-6 space-y-3.5 border-t border-white/[0.08] pt-5">
            <legend className="sr-only">Zustimmungen</legend>
            <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-fg-muted">
              <input type="checkbox" className="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} aria-invalid={submitted && !terms} />
              <span>
                Ich habe die{" "}
                <Link href="/agb" className="text-accent hover:underline" target="_blank">
                  AGB
                </Link>{" "}
                und die{" "}
                <Link href="/widerruf" className="text-accent hover:underline" target="_blank">
                  Widerrufsbelehrung
                </Link>{" "}
                gelesen.
              </span>
            </label>
            <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-fg-muted">
              <input type="checkbox" className="checkbox" checked={waiver} onChange={(e) => setWaiver(e.target.checked)} aria-invalid={submitted && !waiver} />
              <span>
                Ich stimme ausdrücklich zu, dass mit der Bereitstellung der digitalen Inhalte vor Ablauf der Widerrufsfrist begonnen wird. Mir ist bekannt, dass ich dadurch mein
                Widerrufsrecht verliere.
              </span>
            </label>
            {submitted && consentMissing && (
              <p role="alert" className="field-error flex items-center gap-1.5">
                <CircleAlert className="h-3.5 w-3.5" aria-hidden /> Bitte bestätige beide Punkte, um fortzufahren.
              </p>
            )}
          </fieldset>

          {mode !== "live" && (
            <div className="mt-5 flex gap-2.5 rounded-xl border border-warning/25 bg-warning/[0.06] p-3.5 text-xs leading-relaxed text-warning">
              <FlaskConical className="h-4 w-4 flex-none" aria-hidden />
              {mode === "test-flow" ? (
                <span>Testablauf: Es ist noch kein Zahlungsanbieter verbunden. Es findet keine Zahlung statt und es werden keine Dateien freigegeben.</span>
              ) : (
                <span>Stripe-Testmodus: Bezahlung nur mit Stripe-Testkarten möglich, es wird kein echtes Geld bewegt.</span>
              )}
            </div>
          )}
          {demoBlocked && (
            <p role="alert" className="mt-5 rounded-xl border border-danger/30 bg-danger/[0.06] p-3.5 text-xs leading-relaxed text-danger">
              Dein Warenkorb enthält Demoprodukte. Diese können nicht kostenpflichtig bestellt werden.
            </p>
          )}

          {state.type === "error" && (
            <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/[0.06] p-3.5 text-sm text-danger">
              <CircleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden /> {state.message}
            </p>
          )}

          <button type="button" onClick={checkout} disabled={state.type === "loading" || demoBlocked} className="btn btn-primary btn-lg mt-5 w-full">
            {state.type === "loading" ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> Einen Moment …
              </>
            ) : mode === "test-flow" ? (
              "Testbestellung durchführen (keine Zahlung)"
            ) : (
              <>
                <Lock className="h-4 w-4" aria-hidden /> Zahlungspflichtig bestellen
              </>
            )}
          </button>
          {mode !== "test-flow" && <p className="mt-3 text-center text-xs text-fg-subtle">Du wirst zur sicheren Bezahlseite von Stripe weitergeleitet.</p>}
        </div>
      </aside>
    </div>
  );
}
