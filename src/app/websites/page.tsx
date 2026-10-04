import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Gauge, MessageSquare, MonitorSmartphone, TextQuote } from "lucide-react";
import { site } from "@/config/site";
import { faqServices, qualityPoints, websiteServices } from "@/data/services";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FaqList } from "@/components/ui/FaqList";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { ProductVisual, Screen } from "@/components/mockups/ProductVisual";

export const metadata: Metadata = {
  title: "Individuelle Websites",
  description: "Unternehmenswebsites, Landingpages, Onlineshops, Redesigns und Webanwendungen – verständlich geplant, sorgfältig gestaltet, schnell ladend.",
};

const qualityIcons = [MonitorSmartphone, TextQuote, Gauge, MessageSquare];

const websiteFormServices = ["Unternehmenswebsite", "Landingpage", "Onlineshop", "Website-Redesign", "Individuelle Webanwendung", "Etwas anderes"] as const;

export default async function WebsitesPage({ searchParams }: PageProps<"/websites">) {
  const { leistung } = await searchParams;
  const defaultService = websiteFormServices.find((s) => s === leistung);
  return (
    <>
      <PageHero
        eyebrow="Individuelle Websites"
        title="Websites, die verstanden werden."
        lead="Von der Unternehmenswebsite bis zur Webanwendung: Wir planen Inhalte und Struktur mit dir, gestalten ein eigenständiges Erscheinungsbild und setzen alles technisch sauber um."
      >
        <Link href="#anfrage" className="btn btn-primary btn-lg">
          Meine Website planen <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link href="#leistungen" className="btn btn-secondary btn-lg">
          Leistungen ansehen
        </Link>
      </PageHero>

      {/* Vorschau */}
      <section className="container-x" aria-label="Beispielgestaltungen">
        <Reveal className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.08]">
            <ProductVisual kind="website" mode="detail" label="Beispielgestaltung: Website eines Handwerksbetriebs" />
          </div>
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-ink-850 p-[6%]">
              <Screen kind="landing" />
            </div>
            <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-ink-850 p-[6%]">
              <Screen kind="dashboard" />
            </div>
          </div>
        </Reveal>
        <p className="mt-3 text-xs text-fg-subtle">Beispielgestaltungen zur Veranschaulichung – keine Kundenprojekte.</p>
      </section>

      {/* Leistungen */}
      <section id="leistungen" className="section" aria-labelledby="leistungen-h">
        <div className="container-x">
          <SectionHeading
            eyebrow="Leistungen"
            title={<span id="leistungen-h">Was wir für dich umsetzen</span>}
            lead="Jede Leistung hat einen klar beschriebenen Umfang. Den genauen Rahmen und Preis legen wir nach einem kurzen Gespräch schriftlich fest."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {websiteServices.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 80} className={i === 0 ? "lg:col-span-2" : ""}>
                <article id={s.id} className={`flex h-full flex-col rounded-[1.5rem] p-7 ${i === 0 ? "glass sheen" : "surface"}`}>
                  <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-fg-muted">{s.summary}</p>
                  <p className="mt-3 text-sm text-fg-subtle">{s.forWhom}</p>
                  <ul className="mt-6 space-y-2">
                    {s.scope.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-4 pt-7">
                    <p className="text-sm font-medium">{s.price}</p>
                    <Link href={`/websites?leistung=${encodeURIComponent(s.title)}#anfrage`} className="link-arrow text-sm" aria-label={`${s.title} anfragen`}>
                      Anfragen <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Qualität */}
      <section className="bg-ink-900 py-20 md:py-28" aria-labelledby="qualitaet">
        <div className="container-x">
          <SectionHeading
            eyebrow="Qualität"
            title={<span id="qualitaet">Woran du eine gute Website erkennst</span>}
            lead="Diese vier Punkte prüfen wir bei jedem Projekt vor der Übergabe – unabhängig vom Umfang."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
            {qualityPoints.map((q, i) => {
              const Icon = qualityIcons[i];
              return (
                <Reveal key={q.title} className="bg-ink-900 p-7 md:p-9">
                  <Icon className="h-6 w-6 text-accent" aria-hidden />
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{q.title}</h3>
                  <p className="mt-2 leading-relaxed text-fg-muted">{q.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Anfrage */}
      <section id="anfrage" className="section" aria-labelledby="anfrage-h">
        <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.3fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Projekt anfragen"
              title={<span id="anfrage-h">Erzähl uns von deinem Vorhaben.</span>}
              lead="Ein paar Sätze genügen. Wir melden uns mit Rückfragen oder einem Vorschlag für die nächsten Schritte."
            />
            <Reveal className="mt-10 space-y-4 text-sm text-fg-muted">
              {["Unverbindlich und kostenlos", "Schriftliches Angebot vor Projektbeginn", "Preis auf Anfrage – abhängig vom vereinbarten Umfang"].map((t) => (
                <p key={t} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" aria-hidden /> {t}
                </p>
              ))}
            </Reveal>
          </div>
          <Reveal className="glass sheen rounded-[1.75rem] p-5 sm:p-8">
            <InquiryForm key={defaultService ?? "none"} source="websites" services={websiteFormServices} defaultService={defaultService} responseNote={site.contact.responseNote} />
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-8" aria-labelledby="faq-web">
        <h2 id="faq-web" className="headline mb-8 text-3xl">
          Fragen zu individuellen Websites
        </h2>
        <FaqList items={faqServices.slice(0, 3)} />
      </section>
    </>
  );
}
