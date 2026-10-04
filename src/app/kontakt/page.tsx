import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, ShoppingBag } from "lucide-react";
import { site } from "@/config/site";
import { inquiryServices, processSteps } from "@/data/services";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { InquiryForm } from "@/components/forms/InquiryForm";

export const metadata: Metadata = {
  title: "Kontakt & Projekt anfragen",
  description: "Beschreibe dein Vorhaben – Website, Onlineshop, KI-Agent oder Automatisierung. Du erhältst eine persönliche Rückmeldung.",
};

export default async function ContactPage({ searchParams }: PageProps<"/kontakt">) {
  const { leistung } = await searchParams;
  const defaultService = inquiryServices.find((s) => s === leistung);

  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="Lass uns über dein Projekt sprechen."
        lead="Beschreibe kurz, was du vorhast. Du musst noch nicht alles wissen – offene Fragen klären wir gemeinsam."
      />
      <section className="container-x" aria-label="Anfrageformular">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:gap-14">
          <Reveal className="glass sheen rounded-[1.75rem] p-5 sm:p-8 md:p-10">
            <h2 className="text-2xl font-semibold tracking-tight">Projekt anfragen</h2>
            <p className="mb-8 mt-2 text-sm text-fg-muted">Pflichtfelder: Name, E-Mail, Leistung und Beschreibung.</p>
            <InquiryForm key={defaultService ?? "none"} source="kontakt" defaultService={defaultService} responseNote={site.contact.responseNote} />
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={80} className="surface rounded-[1.5rem] p-6">
              <Mail className="h-5 w-5 text-accent" aria-hidden />
              <p className="mt-4 font-medium">Lieber per E-Mail?</p>
              <p className="mt-1 text-sm text-fg-muted">
                <Placeholder value={site.contact.email} />
              </p>
              {site.contact.phone && <p className="mt-1 text-sm text-fg-muted">{site.contact.phone}</p>}
            </Reveal>
            <Reveal delay={140} className="surface rounded-[1.5rem] p-6">
              <MessageSquare className="h-5 w-5 text-accent" aria-hidden />
              <p className="mt-4 font-medium">So geht es weiter</p>
              <ol className="mt-3 space-y-3">
                {processSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-white/12 text-xs tabular-nums text-fg-muted">{i + 1}</span>
                    <span className="pt-0.5 text-fg-muted">{s.title}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={200} className="surface rounded-[1.5rem] p-6">
              <ShoppingBag className="h-5 w-5 text-accent" aria-hidden />
              <p className="mt-4 font-medium">Frage zu einer Bestellung?</p>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                Deine Käufe und Downloads findest du im{" "}
                <Link href="/konto" className="text-accent hover:underline">
                  Kundenbereich
                </Link>
                . Antworten zum Shop gibt es in den{" "}
                <Link href="/faq" className="text-accent hover:underline">
                  FAQ
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
