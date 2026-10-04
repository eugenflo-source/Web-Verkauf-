"use client";

import { useEffect } from "react";
import { cart } from "@/lib/cart-store";

/** Leert den Warenkorb nach abgeschlossenem Bestellvorgang. */
export function ClearCart() {
  useEffect(() => {
    cart.clear();
  }, []);
  return null;
}
