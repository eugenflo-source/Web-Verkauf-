import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Layers, MessageCircleQuestion, Ruler } from "lucide-react";
import { site } from "@/config/site";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { OpenContentNotice } from "@/components/ui/Placeholder";

export const metadata: Metadata = {
  title: "Über die Marke",
  description: `Wofür ${site.name} steht: verständliche digitale Produkte und individuelle Lösungen ohne leere Versprechen.`,
};

const principles = [
  { icon: Eye, title: "Verständlich", text: "Jedes Produkt und jedes Angebot wird so erklärt, dass du ohne Fachwissen einschätzen kannst, ob es zu dir passt." },
  { icon: Ruler, title: "Sorgfältig", text: "Details entscheiden über die Nutzbarkeit. Deshalb wird jede Vorlage und jede Website auf mehreren Geräten geprüft." },
  { icon: MessageCircleQuestion, title: "Ehrlich", text: "Keine erfundenen Bewertungen, keine pauschalen Ersparnisversprechen. Was eine Lösung leisten kann, besprechen wir konkret." },
  { icon: Layers, title: "Erweiterbar", text: "Lösungen werden so gebaut, dass sie mit deinen Anforderungen wachsen können – statt bei der ersten Änderung neu zu beginnen." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Über die Marke"
        title={<>Digitale Werkzeuge, die im Alltag funktionieren.</>}
        lead={`${site.name} entwickelt digitale Produkte, Websites und KI-Lösungen für Selbstständige, Unternehmen und Privatpersonen – mit dem Anspruch, dass sie verständlich, zuverlässig und angenehm zu bedienen sind.`}
      />

      <section className="container-x" aria-labelledby="geschichte">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Hintergrund" title={<span id="geschichte">Wer hinter {site.name} steht</span>} />
          <Reveal className="space-y-5 leading-relaxed text-fg-muted">
            <OpenContentNotice>
              <strong className="font-medium">Offener Inhalt:</strong> Hier gehört deine persönliche Geschichte hin – wer du bist, wie du zu digitalen Produkten
              gekommen bist und was dich antreibt. Ein authentisches Foto oder Porträt ergänzt diesen Abschnitt. Bitte keine Angaben erfinden.
            </OpenContentNotice>
            <p>
              Unser Angebot hat zwei Seiten: fertige digitale Produkte, die du sofort nutzen kannst, und individuelle Entwicklung, wenn dein Bedarf über eine Vorlage
              hinausgeht. Beide folgen denselben Grundsätzen.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="grundsaetze">
        <div className="container-x">
          <SectionHeading eyebrow="Grundsätze" title={<span id="grundsaetze">Woran wir uns messen lassen</span>} />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 80} className={`rounded-[1.5rem] p-7 md:p-9 ${i === 0 ? "glass sheen" : "surface"}`}>
                <p.icon className="h-6 w-6 text-accent" aria-hidden />
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-fg-muted">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x" aria-label="Nächste Schritte">
        <Reveal className="surface flex flex-col items-start justify-between gap-6 rounded-[1.5rem] p-7 md:flex-row md:items-center md:p-10">
          <div>
            <p className="text-2xl font-semibold tracking-tight">Lerne unsere Arbeit kennen.</p>
            <p className="mt-1.5 text-fg-muted">Im Shop oder in einem ersten Gespräch über dein Vorhaben.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-secondary">
              Shop entdecken
            </Link>
            <Link href="/kontakt" className="btn btn-primary">
              Projekt anfragen <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
