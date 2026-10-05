"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { cart } from "@/lib/cart-store";
import { AddToCartButton } from "./AddToCartButton";
import { QuantityStepper } from "./QuantityStepper";

type Props = {
  slug: string;
  name: string;
  price: number;
  priceLabel: string;
  taxNote: ReactNode;
  quantity: Product["quantity"];
};

export function PurchaseBox({ slug, name, price, priceLabel, taxNote, quantity }: Props) {
  const router = useRouter();
  const [qty, setQty] = useState(1);

  return (
    <div className="glass sheen mt-8 rounded-[1.5rem] p-5 sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-semibold tabular-nums tracking-tight">{qty > 1 ? formatPrice(price * qty) : priceLabel}</p>
          <p className="mt-1 text-xs text-fg-subtle">
            {qty > 1 && <>{qty} × {priceLabel} · </>}
            {taxNote}
          </p>
        </div>
        {quantity.editable && (
          <QuantityStepper value={qty} max={quantity.max} onChange={setQty} label={`Anzahl ${quantity.unitPlural}`} />
        )}
      </div>
      {quantity.editable && <p className="mt-3 text-xs text-fg-subtle">Eine Lizenz je Person, die die Vorlage nutzt.</p>}
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <AddToCartButton slug={slug} name={name} qty={qty} className="w-full" />
        <button
          type="button"
          className="btn btn-secondary btn-lg w-full"
          onClick={() => {
            cart.add(slug, qty);
            router.push("/warenkorb");
          }}
        >
          Direkt zur Kasse <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
