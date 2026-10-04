import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Check, PlugZap, ShieldCheck, ShoppingBag, Workflow } from "lucide-react";
import { site } from "@/config/site";
import { aiUseCases, faqServices } from "@/data/services";
import { products } from "@/data/products";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FaqList } from "@/components/ui/FaqList";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { ChatScreen } from "@/components/mockups/screens";
import { Screen } from "@/components/mockups/ProductVisual";
import { ProductCard } from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "KI-Agenten & Automatisierung",
  description: "Individuell entwickelte KI-Assistenten und Automatisierungen für Kundenanfragen, Wissenssuche, Angebotsvorbereitung und wiederkehrende Aufgaben.",
};

export default async function AiPage({ searchParams }: PageProps<"/ki-automatisierung">) {
  const { leistung } = await searchParams;
  const defaultService = leistung === "Automatisierung" ? "Automatisierung" : "KI-Agent";
  const shopItems = products.filter((p) => p.category === "automatisierungen" || p.category === "ki-prompts").slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="KI-Agenten & Automatisierung"
        title="Digitale Assistenten für wiederkehrende Arbeit."
        lead="Wir entwickeln KI-Agenten und Automatisierungen, die Informationen sortieren, Entwürfe vorbereiten und Daten zwischen deinen Werkzeugen übertragen. Was automatisch geschieht und was deine Freigabe braucht, legst du fest."
      >
        <Link href="#anfrage" className="btn btn-primary btn-lg">
          KI-Lösung anfragen <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link href="#anwendungsfaelle" className="btn btn-secondary btn-lg">
          Anwendungsfälle ansehen
        </Link>
      </PageHero>

      {/* Zwei Wege klar trennen */}
      <section className="container-x" aria-labelledby="unterschied">
        <h2 id="unterschied" className="sr-only">
          Fertige Produkte und individuelle Entwicklung
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal className="glass sheen rounded-[1.5rem] p-7 md:p-9">
            <span className="chip chip-accent">
              <Bot className="h-3.5 w-3.5" aria-hidden /> Individuelle Entwicklung
            </span>
            <p className="mt-5 text-2xl font-semibold tracking-tight">KI-Agenten und Abläufe nach Maß</p>
            <p className="mt-3 leading-relaxed text-fg-muted">
              Auf deine Werkzeuge, Daten und Regeln abgestimmt. Umfang, Integrationen und Preis werden im Angebot festgelegt. Nicht im Shop kaufbar.
            </p>
            <Link href="#anfrage" className="link-arrow mt-6 text-sm">
              Bedarf schildern <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
          <Reveal delay={90} className="surface rounded-[1.5rem] p-7 md:p-9">
            <span className="chip">
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden /> Sofort kaufbar
            </span>
            <p className="mt-5 text-2xl font-semibold tracking-tight">Vorlagen zum Selbsteinrichten</p>
            <p className="mt-3 leading-relaxed text-fg-muted">
              Prompt-Pakete und Automations-Vorlagen aus dem Shop. Du richtest sie selbst in deinen eigenen Konten ein.
            </p>
            <Link href="/shop?kategorie=automatisierungen" className="link-arrow mt-6 text-sm">
              Zu den Vorlagen <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Anwendungsfälle */}
      <section id="anwendungsfaelle" className="section" aria-labelledby="faelle">
        <div className="container-x">
          <SectionHeading
            eyebrow="Anwendungsfälle"
            title={<span id="faelle">Wo ein Assistent sinnvoll unterstützen kann</span>}
            lead="Vier typische Einsatzbereiche. Ob und wie sie sich bei dir umsetzen lassen, klären wir gemeinsam anhand deiner Abläufe und Werkzeuge."
          />

          <div className="mt-14 space-y-6">
            {aiUseCases.map((u, i) => (
              <Reveal key={u.id} id={u.id} className="surface scroll-mt-28 overflow-hidden rounded-[1.75rem]">
                <article className="grid lg:grid-cols-[1.1fr_1fr]">
                  <div className="p-7 md:p-10">
                    <p className="text-sm tabular-nums text-accent">0{i + 1}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{u.title}</h3>

                    <h4 className="mt-8 text-xs font-medium uppercase tracking-[0.14em] text-fg-subtle">Ausgangsproblem</h4>
                    <p className="mt-2 leading-relaxed text-fg-muted">{u.problem}</p>

                    <h4 className="mt-7 text-xs font-medium uppercase tracking-[0.14em] text-fg-subtle">Aufgaben der Lösung</h4>
                    <ul className="mt-3 space-y-2">
                      {u.solution.map((s) => (
                        <li key={s} className="flex gap-2.5 text-sm leading-relaxed">
                          <Check className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden />
                          {s}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-fg-subtle">
                          <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Voraussetzungen
                        </h4>
                        <ul className="mt-2.5 space-y-1.5 text-sm text-fg-muted">
                          {u.requirements.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-fg-subtle">
                          <PlugZap className="h-3.5 w-3.5" aria-hidden /> Mögliche Integrationen
                        </h4>
                        <ul className="mt-2.5 space-y-1.5 text-sm text-fg-muted">
                          {u.integrations.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Link href={`/ki-automatisierung?leistung=${i === 3 ? "Automatisierung" : "KI-Agent"}#anfrage`} className="btn btn-secondary mt-9">
                      Diesen Anwendungsfall anfragen <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>

                  <div className="relative flex flex-col justify-center border-t border-white/[0.06] bg-ink-900 p-7 md:p-10 lg:border-l lg:border-t-0">
                    <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-fg-subtle">Beispielhafter Ablauf</h4>
                    <ol className="mt-5 space-y-2.5">
                      {u.flow.map((step, si) => (
                        <li key={step} className="glass flex items-center gap-4 rounded-2xl px-4 py-3.5">
                          <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs tabular-nums ${si === u.flow.length - 1 ? "bg-accent text-ink-950" : "border border-white/15 text-fg-muted"}`}>
                            {si + 1}
                          </span>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-6 rounded-2xl border border-accent/15 bg-accent/[0.05] p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">Möglicher Nutzen</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{u.benefit}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Demo-Darstellung */}
      <section className="bg-ink-900 py-20 md:py-28" aria-labelledby="demo">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="So kann es aussehen"
              title={<span id="demo">Vorschläge statt Blackbox.</span>}
              lead="Ein gut gebauter Assistent zeigt dir, was er vorbereitet hat und warum. Er arbeitet zu – die Entscheidung bleibt bei dir."
            />
            <Reveal className="mt-8 space-y-3 text-sm text-fg-muted">
              {["Nachvollziehbare Einordnung mit Begründung", "Entwürfe werden erst nach Freigabe versendet", "Protokoll aller automatischen Schritte"].map((t) => (
                <p key={t} className="flex items-center gap-3">
                  <Workflow className="h-4 w-4 text-accent" aria-hidden /> {t}
                </p>
              ))}
            </Reveal>
            <p className="mt-8 rounded-xl border border-warning/25 bg-warning/[0.05] p-3.5 text-sm leading-relaxed text-warning">
              Die Darstellungen rechts sind statische Demos zur Veranschaulichung. Es sind keine aktiven Integrationen oder Live-Funktionen angebunden.
            </p>
          </div>
          <Reveal className="relative">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-ink-850 p-[5%]">
              <Screen kind="automation" />
            </div>
            <div className="glass-strong absolute -bottom-8 right-3 w-[52%] rounded-[1.1rem] p-1 sm:-right-6">
              <div className="mock aspect-[10/8]" aria-hidden>
                <div className="mock-canvas h-full !text-[3.4cqw]">
                  <ChatScreen />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Shop-Vorlagen */}
      <section className="section" aria-labelledby="vorlagen">
        <div className="container-x">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Im Shop" title={<span id="vorlagen">Vorlagen zum Selbsteinrichten</span>} />
            <Link href="/shop?kategorie=automatisierungen" className="link-arrow hidden text-sm sm:inline-flex">
              Alle Vorlagen
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shopItems.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Anfrage */}
      <AiInquiry defaultService={defaultService} />

      <section className="container-x pb-8 pt-20" aria-labelledby="faq-ki">
        <h2 id="faq-ki" className="headline mb-8 text-3xl">
          Fragen zu KI-Lösungen
        </h2>
        <FaqList items={[faqServices[3], faqServices[4], faqServices[0], faqServices[1]]} />
      </section>
    </>
  );
}

function AiInquiry({ defaultService }: { defaultService: "KI-Agent" | "Automatisierung" }) {
  return (
    <section id="anfrage" className="container-x scroll-mt-24" aria-labelledby="anfrage-ki">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.3fr] lg:gap-20">
        <SectionHeading
          eyebrow="Anfrage"
          title={<span id="anfrage-ki">Welche Aufgabe soll einfacher werden?</span>}
          lead="Beschreibe den Ablauf, wie er heute läuft, und welche Werkzeuge du nutzt. Wir prüfen, ob und wie sich das sinnvoll automatisieren lässt."
        />
        <Reveal className="glass sheen rounded-[1.75rem] p-5 sm:p-8">
          <InquiryForm key={defaultService} source="ki-automatisierung" services={["KI-Agent", "Automatisierung", "Etwas anderes"]} defaultService={defaultService} responseNote={site.contact.responseNote} />
        </Reveal>
      </div>
    </section>
  );
}
