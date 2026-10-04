import type { Metadata } from "next";
import { site } from "@/config/site";
import { paymentMode } from "@/lib/env";
import { CartView } from "@/components/shop/CartView";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = { title: "Warenkorb", robots: { index: false } };

export default async function CartPage({ searchParams }: PageProps<"/warenkorb">) {
  const { abgebrochen } = await searchParams;
  return (
    <div className="container-x pt-32 md:pt-40">
      <h1 className="headline text-4xl md:text-5xl">Warenkorb</h1>
      {abgebrochen && (
        <p role="status" className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-fg-muted">
          Der Bezahlvorgang wurde abgebrochen. Es wurde nichts berechnet – dein Warenkorb ist unverändert.
        </p>
      )}
      <div className="mt-10">
        <CartView mode={paymentMode()} taxNote={<Placeholder value={site.pricing.taxNote} />} />
      </div>
    </div>
  );
}
