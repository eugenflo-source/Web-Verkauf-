"use client";

import { useState } from "react";
import { Check, Plus, ShoppingBag } from "lucide-react";
import { cart } from "@/lib/cart-store";
import { useToast } from "@/components/ui/Toast";

type Props = { slug: string; name: string; qty?: number; size?: "sm" | "lg"; className?: string };

export function AddToCartButton({ slug, name, qty = 1, size = "lg", className = "" }: Props) {
  const toast = useToast();
  const [added, setAdded] = useState(false);

  function handleClick() {
    cart.add(slug, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    toast({ title: "Zum Warenkorb hinzugefügt", description: name, action: { href: "/warenkorb", label: "Zum Warenkorb" } });
  }

  if (size === "sm") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`btn btn-sm ${added ? "btn-accent" : "btn-secondary"} !px-3 ${className}`}
        aria-label={`${name} in den Warenkorb legen`}
      >
        {added ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
        <span className="sr-only sm:not-sr-only">{added ? "Hinzugefügt" : "Hinzufügen"}</span>
      </button>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={`btn btn-lg ${added ? "btn-accent" : "btn-primary"} ${className}`}>
      {added ? <Check className="h-[1.1rem] w-[1.1rem]" aria-hidden /> : <ShoppingBag className="h-[1.1rem] w-[1.1rem]" aria-hidden />}
      {added ? "Im Warenkorb" : "In den Warenkorb"}
    </button>
  );
}
