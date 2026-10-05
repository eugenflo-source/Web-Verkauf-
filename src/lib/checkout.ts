import "server-only";
import { z } from "zod";
import { getProduct, type Product } from "@/data/products";

export const checkoutSchema = z.object({
  items: z
    .array(z.object({ slug: z.string().min(1).max(100), qty: z.number().int().min(1).max(100) }))
    .min(1)
    .max(50),
  consent: z.object({ terms: z.literal(true), waiver: z.literal(true) }),
});

export type CheckoutLine = { product: Product; qty: number };

/** Ermittelt die Positionen ausschließlich aus den serverseitigen Produktdaten. */
export function resolveLines(items: { slug: string; qty: number }[]): CheckoutLine[] | { error: string } {
  const lines: CheckoutLine[] = [];
  for (const item of items) {
    const product = getProduct(item.slug);
    if (!product) return { error: "Ein Produkt im Warenkorb ist nicht mehr verfügbar. Bitte lade die Seite neu." };
    if (lines.some((l) => l.product.slug === product.slug)) continue;
    const qty = product.quantity.editable ? Math.min(item.qty, product.quantity.max) : 1;
    lines.push({ product, qty });
  }
  return lines;
}

/** Kompakte Darstellung für URLs/Metadaten: „slug:menge,slug:menge“ */
export function encodeLines(lines: CheckoutLine[]) {
  return lines.map((l) => `${l.product.slug}:${l.qty}`).join(",");
}

export function decodeLines(value: string | undefined | null): CheckoutLine[] {
  if (!value) return [];
  const result = resolveLines(
    value
      .split(",")
      .map((part) => part.split(":"))
      .filter(([slug, qty]) => slug && Number(qty) > 0)
      .map(([slug, qty]) => ({ slug, qty: Number(qty) })),
  );
  return Array.isArray(result) ? result : [];
}
