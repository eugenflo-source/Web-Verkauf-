import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Check, Download, FileText, LifeBuoy, ScrollText, Users, Wrench } from "lucide-react";
import { formatPrice, getCategory, getProduct, products } from "@/data/products";
import { site } from "@/config/site";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { PurchaseBox } from "@/components/shop/PurchaseBox";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.tagline };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category).concat(products.filter((p) => p.category !== product.category)).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    category: category.label,
    offers: { "@type": "Offer", price: (product.price / 100).toFixed(2), priceCurrency: "EUR", availability: "https://schema.org/InStock" },
  };

  const sections = [
    { icon: FileText, title: "Was ist das Produkt?", body: <p>{product.details.what}</p> },
    { icon: Users, title: "Für wen ist es geeignet?", body: <List items={product.details.audience} /> },
    { icon: BadgeCheck, title: "Welches Problem löst es?", body: <p>{product.details.problem}</p> },
    { icon: Check, title: "Was ist im Kauf enthalten?", body: <List items={product.details.included} /> },
    { icon: Wrench, title: "Was brauchst du zur Nutzung?", body: <List items={product.details.requirements} /> },
    { icon: Download, title: "Wie erfolgt die Bereitstellung?", body: <p>{product.details.delivery}</p> },
    { icon: ScrollText, title: "Lizenz", body: <p>{product.details.license}</p> },
    { icon: LifeBuoy, title: "Support", body: <p>{product.details.support}</p> },
  ];

  return (
    <>
      {!product.demo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <div className="container-x pt-28 md:pt-32">
        <nav aria-label="Brotkrumen" className="flex items-center gap-2 text-sm text-fg-subtle">
          <Link href="/shop" className="inline-flex items-center gap-1.5 hover:text-fg">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Shop
          </Link>
          <span aria-hidden>/</span>
          <Link href={`/shop?kategorie=${category.id}`} className="hover:text-fg">
            {category.label}
          </Link>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          <div className="animate-fade-up min-w-0">
            <ProductGallery kind={product.visual} name={product.name} />
          </div>

          <div className="animate-fade-up [animation-delay:100ms] lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-wrap gap-2">
              <span className="chip">{category.label}</span>
              <span className="chip">{product.format}</span>
              {product.demo && <span className="chip chip-demo">Demoinhalt</span>}
            </div>
            <h1 className="headline mt-5 text-4xl md:text-5xl">{product.name}</h1>
            <p className="lead mt-4">{product.tagline}</p>
            <ul className="mt-6 space-y-2.5">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>

            <PurchaseBox
              slug={product.slug}
              name={product.name}
              price={product.price}
              priceLabel={formatPrice(product.price)}
              taxNote={<Placeholder value={site.pricing.taxNote} />}
              quantity={product.quantity}
            />

            {product.demo && (
              <p className="mt-4 rounded-xl border border-warning/25 bg-warning/[0.06] p-3.5 text-sm leading-relaxed text-warning">
                Dies ist ein Demoprodukt des Entwicklungsstands. Inhalte, Preis und Datei sind Beispiele und werden vor dem Livegang ersetzt.
              </p>
            )}
            <p className="mt-4 text-xs text-fg-subtle">
              Version {product.version} · Digitaler Download, kein Versand
            </p>
          </div>
        </div>

        <section className="mt-20 md:mt-28" aria-labelledby="details">
          <h2 id="details" className="headline text-3xl md:text-4xl">
            Alles, was du vor dem Kauf wissen solltest
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-white/[0.07] md:grid-cols-2">
            {sections.map((s) => (
              <Reveal key={s.title} className="bg-ink-850 p-6 md:p-8">
                <s.icon className="h-5 w-5 text-accent" aria-hidden />
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <div className="mt-2 text-sm leading-relaxed text-fg-muted">{s.body}</div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-20 md:mt-28" aria-labelledby="weitere">
          <div className="flex items-end justify-between gap-4">
            <h2 id="weitere" className="headline text-3xl">
              Weitere Produkte
            </h2>
            <Link href="/shop" className="link-arrow text-sm">
              Alle ansehen
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((i) => (
        <li key={i} className="flex gap-2.5">
          <span aria-hidden className="mt-2 h-1 w-1 flex-none rounded-full bg-fg-subtle" />
          {i}
        </li>
      ))}
    </ul>
  );
}
