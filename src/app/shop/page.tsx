import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Shop für digitale Produkte",
  description: "Website-Vorlagen, Business-Tools, Prompt-Pakete, Planer und Automations-Vorlagen – nach bestätigter Zahlung sofort als Download verfügbar.",
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Digitale Produkte, sofort nutzbar."
        lead="Vorlagen, Rechner und Werkzeuge mit klaren Angaben zu Inhalt, Voraussetzungen und Lizenz. Nach bestätigter Zahlung steht dein Download bereit."
      />
      <section className="container-x pb-8" aria-label="Produkte">
        <Suspense fallback={<ShopSkeleton />}>
          <ShopBrowser />
        </Suspense>
      </section>
      <section className="container-x mt-16">
        <Reveal>
          <div className="surface flex flex-col items-start justify-between gap-6 rounded-[1.5rem] p-7 md:flex-row md:items-center md:p-9">
            <div>
              <p className="text-xl font-semibold tracking-tight">Nicht das Richtige dabei?</p>
              <p className="mt-1.5 text-fg-muted">Wir entwickeln Werkzeuge, Websites und Automatisierungen auch individuell für dich.</p>
            </div>
            <Link href="/kontakt" className="btn btn-primary">
              Individuelle Lösung anfragen <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function ShopSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-12" aria-busy="true" aria-label="Produkte werden geladen">
      <div className="hidden space-y-3 lg:block">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-9 rounded-xl" />
        ))}
      </div>
      <div>
        <div className="skeleton h-14 rounded-2xl" />
        <div className="mt-11 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton aspect-[4/5] rounded-[1.25rem]" />
          ))}
        </div>
      </div>
    </div>
  );
}
