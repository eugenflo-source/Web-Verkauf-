import type { Metadata } from "next";
import Link from "next/link";
import { faqServices, faqShop } from "@/data/services";
import { PageHero } from "@/components/ui/PageHero";
import { FaqList } from "@/components/ui/FaqList";

export const metadata: Metadata = {
  title: "Häufige Fragen",
  description: "Antworten zu Downloads, Lizenzen, Zahlung sowie zu individuellen Websites und KI-Lösungen.",
};

export default function FaqPage() {
  const all = [...faqShop, ...faqServices];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: all.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="FAQ" title="Häufige Fragen" lead="Kurze Antworten zum Shop und zu individuellen Projekten. Deine Frage ist nicht dabei? Schreib uns." />
      <div className="container-x grid gap-16">
        <section aria-labelledby="faq-shop">
          <h2 id="faq-shop" className="headline mb-6 text-2xl md:text-3xl">
            Shop &amp; digitale Produkte
          </h2>
          <FaqList items={faqShop} />
        </section>
        <section aria-labelledby="faq-projekte">
          <h2 id="faq-projekte" className="headline mb-6 text-2xl md:text-3xl">
            Websites, KI-Agenten &amp; Automatisierung
          </h2>
          <FaqList items={faqServices} />
        </section>
        <p className="text-fg-muted">
          Noch Fragen?{" "}
          <Link href="/kontakt" className="text-accent hover:underline">
            Nimm Kontakt auf
          </Link>
          .
        </p>
      </div>
    </>
  );
}
