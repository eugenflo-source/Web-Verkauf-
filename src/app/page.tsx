import Link from "next/link";
import { ArrowRight, Bot, Check, Code2, LayoutTemplate, PenTool, Search, Sparkles, Store } from "lucide-react";
import { categories, featuredProducts } from "@/data/products";
import { aiUseCases, faqServices, faqShop, processSteps } from "@/data/services";
import { HeroComposition } from "@/components/home/HeroComposition";
import { UseCaseExplorer } from "@/components/home/UseCaseExplorer";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductVisual } from "@/components/mockups/ProductVisual";
import { WebsiteScreen } from "@/components/mockups/screens";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqList } from "@/components/ui/FaqList";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TwoPaths />
      <FeaturedProducts />
      <WebsitesTeaser />
      <AiTeaser />
      <Process />
      <HomeFaq />
      <ClosingCta />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
      <div aria-hidden className="bg-atmosphere absolute inset-0 -z-10" />
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div className="container-x">
        <div className="mx-auto max-w-4xl text-center">
          <p className="animate-fade-up chip glass mx-auto !h-8 !px-3.5 !text-fg-muted">
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
            Shop für digitale Produkte &amp; individuelle Entwicklung
          </p>
          <h1 className="headline animate-fade-up mt-7 text-[2.65rem] [animation-delay:80ms] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Digitale Produkte.
            <br />
            Individuelle Websites.
            <br />
            <span className="bg-gradient-to-r from-fg via-[#c9f2ff] to-accent bg-clip-text text-transparent">Intelligente Lösungen.</span>
          </h1>
          <p className="lead animate-fade-up mx-auto mt-7 max-w-2xl [animation-delay:160ms]">
            Entdecke sofort nutzbare Tools oder lass eine digitale Lösung entwickeln, die zu deinem Unternehmen passt.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col justify-center gap-3 [animation-delay:240ms] sm:flex-row">
            <Link href="/shop" className="btn btn-primary btn-lg">
              Produkte entdecken <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/kontakt" className="btn btn-secondary btn-lg">
              Projekt anfragen
            </Link>
          </div>
        </div>

        <div className="animate-fade-up mt-16 [animation-delay:350ms] md:mt-20">
          <HeroComposition />
        </div>
      </div>
    </section>
  );
}

function TwoPaths() {
  const paths = [
    {
      icon: Store,
      eyebrow: "Sofort nutzbar",
      title: "Fertige digitale Produkte kaufen",
      text: "Vorlagen, Rechner, Planer und Prompt-Pakete. Bezahlen, herunterladen, loslegen.",
      points: ["Download nach bestätigter Zahlung", "Klare Angaben zu Voraussetzungen", "Einmaliger Preis"],
      href: "/shop",
      cta: "Zum Shop",
    },
    {
      icon: Code2,
      eyebrow: "Individuell entwickelt",
      title: "Website oder KI-Lösung entwickeln lassen",
      text: "Websites, Shops, KI-Agenten und Automatisierungen – zugeschnitten auf deinen Ablauf.",
      points: ["Schriftliches Angebot vorab", "Zwischenstände zur Abstimmung", "Übergabe mit Einweisung"],
      href: "/kontakt",
      cta: "Projekt anfragen",
    },
  ];
  return (
    <section aria-labelledby="wege" className="container-x">
      <h2 id="wege" className="sr-only">
        Zwei Wege zu deiner Lösung
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {paths.map((p, i) => (
          <Reveal key={p.title} delay={i * 90}>
            <Link
              href={p.href}
              className="group glass sheen flex h-full flex-col rounded-[1.5rem] p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-white/20 md:p-9"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <p.icon className="h-5 w-5 text-accent" aria-hidden />
              </span>
              <p className="eyebrow mt-6">{p.eyebrow}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight md:text-[1.75rem]">{p.title}</p>
              <p className="mt-3 max-w-md leading-relaxed text-fg-muted">{p.text}</p>
              <ul className="mt-6 space-y-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5 text-sm text-fg-muted">
                    <Check className="h-4 w-4 text-accent" aria-hidden /> {pt}
                  </li>
                ))}
              </ul>
              <span className="link-arrow mt-8">
                {p.cta} <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FeaturedProducts() {
  return (
    <section className="section" aria-labelledby="produkte">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Shop"
            title={<span id="produkte">Ausgewählte Produkte</span>}
            lead="Werkzeuge für Angebote, Planung, Inhalte und Abläufe. Jede Produktseite erklärt genau, was enthalten ist und was du zur Nutzung brauchst."
          />
          <Reveal>
            <Link href="/shop" className="btn btn-secondary">
              <Search className="h-4 w-4" aria-hidden /> Alle Produkte durchsuchen
            </Link>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/shop?kategorie=${c.id}`} className="chip !h-9 !px-4 !text-sm transition-colors hover:!border-white/20 hover:!text-fg">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.slice(0, 6).map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-sm text-fg-subtle">Alle gezeigten Produkte sind Demoinhalte des Entwicklungsstands.</p>
      </div>
    </section>
  );
}

function WebsitesTeaser() {
  const phases = [
    { icon: Search, title: "Konzeption", text: "Ziele, Zielgruppe und Seitenstruktur – bevor gestaltet wird." },
    { icon: PenTool, title: "Design", text: "Ein eigenständiges Erscheinungsbild für alle Bildschirmgrößen." },
    { icon: Code2, title: "Entwicklung", text: "Schnell ladende, saubere Umsetzung mit einfacher Pflege." },
    { icon: LayoutTemplate, title: "Nach dem Start", text: "Unterstützung im vereinbarten Umfang, wenn du sie brauchst." },
  ];
  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 md:py-32" aria-labelledby="websites">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Individuelle Websites"
            title={<span id="websites">Eine Website, die erklärt, was du tust.</span>}
            lead="Unternehmenswebsites, Landingpages, Onlineshops und Redesigns – geplant für deine Besucher, gestaltet für dein Unternehmen und technisch so gebaut, dass sie schnell lädt."
          />
          <div className="mt-10 grid gap-x-6 gap-y-7 sm:grid-cols-2">
            {phases.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <p.icon className="h-5 w-5 text-accent" aria-hidden />
                <p className="mt-3 font-medium">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">{p.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 flex flex-wrap gap-3">
            <Link href="/websites#anfrage" className="btn btn-primary btn-lg">
              Meine Website planen <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/websites" className="btn btn-ghost btn-lg">
              Leistungen ansehen
            </Link>
          </Reveal>
        </div>

        <Reveal className="relative">
          <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.08]">
            <ProductVisual kind="website" mode="detail" label="Beispiel: Website eines Tischlereibetriebs auf dem Desktop" />
          </div>
          <div className="absolute -bottom-8 -left-3 w-[30%] max-w-[11rem] sm:-left-8">
            <div className="glass-strong rounded-[1.6rem] p-1.5">
              <div className="mock aspect-[9/19] overflow-hidden rounded-[1.2rem]">
                <div className="mock-canvas h-full !text-[4.6cqw]">
                  <div className="h-full" aria-hidden>
                    <WebsiteScreen compact />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-12 text-right text-xs text-fg-subtle">Beispielgestaltung, kein Kundenprojekt</p>
        </Reveal>
      </div>
    </section>
  );
}

function AiTeaser() {
  return (
    <section className="section" aria-labelledby="ki">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="KI-Agenten & Automatisierung"
            title={<span id="ki">Weniger Routine. Mehr Überblick.</span>}
            lead="Individuell entwickelte Assistenten und Abläufe, die wiederkehrende Arbeit vorbereiten. Du legst fest, was automatisch passiert – und was deine Freigabe braucht."
          />
          <Reveal className="flex-none">
            <span className="chip">
              <Bot className="h-3.5 w-3.5" aria-hidden /> Individuelle Entwicklung, kein Fertigprodukt
            </span>
          </Reveal>
        </div>
        <Reveal className="mt-12">
          <UseCaseExplorer items={aiUseCases} />
        </Reveal>
        <Reveal className="mt-10 flex flex-wrap gap-3">
          <Link href="/ki-automatisierung" className="btn btn-secondary">
            Alle Anwendungsfälle
          </Link>
          <Link href="/kontakt?leistung=KI-Agent" className="btn btn-ghost">
            KI-Lösung anfragen <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="relative bg-ink-900 py-20 md:py-28" aria-labelledby="ablauf">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="container-x">
        <SectionHeading
          eyebrow="Zusammenarbeit"
          title={<span id="ablauf">So funktioniert die Zusammenarbeit</span>}
          lead="Vier Schritte, klar abgegrenzt. Du weißt jederzeit, woran gerade gearbeitet wird und was als Nächstes kommt."
        />
        <ol className="relative mt-14 grid gap-4 md:grid-cols-4 md:gap-5">
          <span aria-hidden className="absolute left-0 right-0 top-[1.4rem] hidden h-px bg-gradient-to-r from-accent/40 via-white/10 to-transparent md:block" />
          {processSteps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 90} className="relative">
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-ink-850 text-sm font-medium tabular-nums text-accent">
                {i + 1}
              </span>
              <p className="mt-5 text-lg font-medium tracking-tight">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function HomeFaq() {
  return (
    <section className="section" aria-labelledby="faq">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
        <SectionHeading
          eyebrow="FAQ"
          title={<span id="faq">Häufige Fragen</span>}
          lead={
            <>
              Weitere Antworten findest du in den{" "}
              <Link href="/faq" className="text-accent underline-offset-4 hover:underline">
                ausführlichen FAQ
              </Link>
              .
            </>
          }
        />
        <Reveal>
          <FaqList items={[faqShop[0], faqServices[0], faqServices[1], faqShop[2], faqServices[4]]} />
        </Reveal>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="container-x" aria-labelledby="abschluss">
      <Reveal>
        <div className="glass-strong sheen relative overflow-hidden rounded-[2rem] px-6 py-16 text-center md:px-16 md:py-24">
          <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent-strong/20 blur-[100px]" />
          <h2 id="abschluss" className="headline mx-auto max-w-3xl text-4xl sm:text-5xl md:text-6xl">
            Sofort starten oder gemeinsam entwickeln?
          </h2>
          <p className="lead mx-auto mt-6 max-w-xl">
            Wähle ein fertiges Produkt aus dem Shop oder beschreibe kurz dein Vorhaben – du erhältst eine persönliche Rückmeldung.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="btn btn-primary btn-lg">
              Shop entdecken
            </Link>
            <Link href="/kontakt" className="btn btn-secondary btn-lg">
              Projekt anfragen <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
