"use client";

import { useSyncExternalStore } from "react";
import { getProduct } from "@/data/products";

/**
 * Warenkorb im Browser (localStorage). Gespeichert werden nur Produkt-Slugs
 * und Mengen – Preise werden immer aus den Produktdaten bzw. serverseitig
 * berechnet.
 */
export type CartItem = { slug: string; qty: number };

const STORAGE_KEY = "cart.v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function sanitize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return EMPTY;
  const out: CartItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const { slug, qty } = entry as Record<string, unknown>;
    if (typeof slug !== "string" || typeof qty !== "number") continue;
    const product = getProduct(slug);
    if (!product || out.some((i) => i.slug === slug)) continue;
    out.push({ slug, qty: clampQty(qty, product.quantity.max) });
  }
  return out;
}

function clampQty(qty: number, max: number) {
  return Math.min(Math.max(1, Math.round(qty)), max);
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    items = sanitize(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    items = EMPTY;
  }
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      items = sanitize(JSON.parse(e.newValue ?? "[]"));
    } catch {
      items = EMPTY;
    }
    emit();
  });
}

function emit() {
  listeners.forEach((l) => l());
}

function commit(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Speichern nicht möglich (z. B. privater Modus) – Warenkorb bleibt für diese Sitzung erhalten. */
  }
  emit();
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const cart = {
  add(slug: string, qty = 1) {
    hydrate();
    const product = getProduct(slug);
    if (!product) return;
    const existing = items.find((i) => i.slug === slug);
    if (existing) {
      commit(items.map((i) => (i.slug === slug ? { ...i, qty: clampQty(i.qty + qty, product.quantity.max) } : i)));
    } else {
      commit([...items, { slug, qty: clampQty(qty, product.quantity.max) }]);
    }
  },
  setQty(slug: string, qty: number) {
    const product = getProduct(slug);
    if (!product) return;
    commit(items.map((i) => (i.slug === slug ? { ...i, qty: clampQty(qty, product.quantity.max) } : i)));
  },
  remove(slug: string) {
    commit(items.filter((i) => i.slug !== slug));
  },
  clear() {
    commit(EMPTY);
  },
};

/** Liefert `null`, solange der Warenkorb noch nicht aus dem Speicher geladen ist. */
export function useCart(): CartItem[] | null {
  return useSyncExternalStore(
    subscribe,
    () => (hydrated ? items : null),
    () => null,
  );
}

export function useCartCount() {
  const list = useCart();
  return list ? list.reduce((sum, i) => sum + i.qty, 0) : 0;
}
