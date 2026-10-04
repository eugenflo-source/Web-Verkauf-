import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPrice, getCategory, type Product } from "@/data/products";
import { ProductVisual } from "@/components/mockups/ProductVisual";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const category = getCategory(product.category);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-white/[0.07] bg-ink-850 transition-[border-color,transform,box-shadow] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
      <div className="relative">
        <ProductVisual kind={product.visual} label={`Vorschau: ${product.name}`} />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="chip glass !border-white/10 !text-fg">{category.label}</span>
          {product.demo && <span className="chip chip-demo glass">Demo</span>}
        </div>
        {priority && <span className="sr-only">Ausgewählt</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-fg-subtle">{product.format}</p>
        <h3 className="mt-1.5 text-lg font-semibold tracking-tight">
          <Link href={`/shop/${product.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">{product.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="text-lg font-semibold tabular-nums">{formatPrice(product.price)}</p>
          <div className="relative z-10 flex items-center gap-2">
            <span className="hidden items-center gap-1 text-sm text-fg-muted transition-colors group-hover:text-fg sm:inline-flex">
              Details <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </span>
            <AddToCartButton slug={product.slug} name={product.name} size="sm" />
          </div>
        </div>
      </div>
      {/* Fokusring für die gesamte Karte bei Tastaturbedienung */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-2 ring-accent opacity-0 transition-opacity group-has-[a:focus-visible]:opacity-100" />
    </article>
  );
}
