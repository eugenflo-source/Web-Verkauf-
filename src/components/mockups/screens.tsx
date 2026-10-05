import { AppFrame, BrowserFrame, Line } from "./frames";

/* Alle Screens sind rein dekorativ; die beschreibende Alternative setzt der umgebende Container. */

export function WebsiteScreen({ compact = false }: { compact?: boolean }) {
  return (
    <BrowserFrame url="werkstatt-lindner.de">
      <div className="flex h-full flex-col bg-[#0b0d10]">
        <div className="flex items-center justify-between px-[1.4em] py-[0.9em]">
          <span className="flex items-center gap-[0.45em] text-[0.95em] font-semibold">
            <i className="block h-[0.9em] w-[0.9em] rounded-[0.25em] bg-accent" />
            Werkstatt Lindner
          </span>
          {!compact && (
            <span className="flex gap-[1.2em] text-[0.8em] text-fg-muted">
              <span>Leistungen</span>
              <span>Über uns</span>
              <span>Kontakt</span>
            </span>
          )}
        </div>
        <div className={`grid flex-1 gap-[1.2em] px-[1.4em] pb-[1.2em] ${compact ? "grid-cols-1 grid-rows-[auto_1fr]" : "grid-cols-[1.1fr_1fr]"}`}>
          <div className="flex flex-col justify-center">
            <span className="text-[0.7em] uppercase tracking-[0.18em] text-accent">Tischlerei seit 1998</span>
            <span className="mt-[0.5em] text-[2.1em] font-semibold leading-[1.02] tracking-tight">
              Möbel nach Maß.
              <br />
              <span className="text-fg-muted">Aus der Region.</span>
            </span>
            <span className="mt-[0.9em] space-y-[0.45em]">
              <Line w="88%" />
              <Line w="70%" />
            </span>
            <span className="mt-[1.1em] flex gap-[0.5em]">
              <span className="rounded-full bg-fg px-[1em] py-[0.5em] text-[0.75em] font-medium text-ink-950">Termin anfragen</span>
              <span className="rounded-full border border-white/15 px-[1em] py-[0.5em] text-[0.75em]">Arbeiten ansehen</span>
            </span>
          </div>
          <div className="relative overflow-hidden rounded-[0.8em] bg-gradient-to-br from-[#1c2530] via-[#121820] to-[#0b0f14]">
            <div className="absolute inset-x-[12%] bottom-0 h-[58%] rounded-t-[0.4em] bg-gradient-to-b from-[#2b3644] to-[#18202a]" />
            <div className="absolute inset-x-[18%] bottom-[44%] h-[0.5em] rounded-full bg-[#3a4757]" />
            <div className="absolute bottom-[12%] left-[22%] h-[25%] w-[24%] rounded-[0.3em] border border-white/10 bg-white/[0.04]" />
            <div className="absolute bottom-[12%] right-[22%] h-[25%] w-[24%] rounded-[0.3em] border border-white/10 bg-white/[0.04]" />
            <div className="absolute right-[10%] top-[12%] h-[3em] w-[3em] rounded-full bg-accent/25 blur-[1em]" />
            <span className="absolute left-[0.8em] top-[0.8em] rounded-full bg-black/40 px-[0.7em] py-[0.35em] text-[0.65em] text-fg-muted backdrop-blur">
              Projekt: Einbauküche
            </span>
          </div>
        </div>
        {!compact && (
          <div className="grid grid-cols-3 gap-[0.7em] border-t border-white/[0.06] px-[1.4em] py-[1em]">
            {["Möbelbau", "Innenausbau", "Reparatur"].map((t) => (
              <div key={t} className="rounded-[0.6em] bg-white/[0.035] p-[0.8em]">
                <span className="block text-[0.8em] font-medium">{t}</span>
                <Line w="80%" className="mt-[0.5em]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}

export function LandingScreen() {
  return (
    <BrowserFrame url="workshop-launch.de">
      <div className="flex h-full flex-col items-center bg-[radial-gradient(ellipse_at_50%_0%,rgba(111,220,255,0.16),transparent_60%)] px-[2em] pt-[1.8em] text-center">
        <span className="rounded-full border border-accent/30 bg-accent/10 px-[0.9em] py-[0.3em] text-[0.7em] text-accent">Online-Workshop · 3 Termine</span>
        <span className="mt-[0.8em] text-[2.2em] font-semibold leading-[1.02] tracking-tight">
          Klarer schreiben
          <br />
          in vier Wochen.
        </span>
        <span className="mt-[0.9em] w-[60%] space-y-[0.45em]">
          <Line />
          <Line w="70%" className="mx-auto" />
        </span>
        <div className="mt-[1.2em] flex w-[64%] gap-[0.5em]">
          <span className="flex-1 rounded-full border border-white/12 bg-white/[0.04] px-[1em] py-[0.6em] text-left text-[0.75em] text-fg-subtle">deine@email.de</span>
          <span className="rounded-full bg-fg px-[1.1em] py-[0.6em] text-[0.75em] font-medium text-ink-950">Platz sichern</span>
        </div>
        <div className="mt-[1.6em] grid w-full grid-cols-3 gap-[0.7em]">
          {["Woche 1", "Woche 2", "Woche 3"].map((t, i) => (
            <div key={t} className="rounded-[0.7em] border border-white/[0.07] bg-white/[0.03] p-[0.8em] text-left">
              <span className="text-[0.7em] text-accent">{t}</span>
              <Line w={["80%", "65%", "75%"][i]} className="mt-[0.5em]" />
              <Line w="50%" className="mt-[0.4em]" />
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

export function CalculatorScreen() {
  const rows = [
    ["Konzeption", "6 Std.", "95 €", "570 €"],
    ["Gestaltung", "14 Std.", "95 €", "1.330 €"],
    ["Umsetzung", "18 Std.", "95 €", "1.710 €"],
    ["Lizenzen", "pauschal", "", "240 €"],
  ];
  return (
    <AppFrame title="Angebotsrechner" right={<span className="rounded-[0.4em] bg-accent/15 px-[0.6em] py-[0.2em] text-[0.7em] text-accent">Angebot 2026-014</span>}>
      <div className="grid h-full grid-cols-[1.55fr_1fr] gap-[1em] p-[1.1em]">
        <div className="overflow-hidden rounded-[0.7em] border border-white/[0.07]">
          <div className="grid grid-cols-[1.6fr_1fr_0.8fr_1fr] bg-white/[0.04] px-[0.8em] py-[0.55em] text-[0.7em] uppercase tracking-wider text-fg-subtle">
            <span>Position</span>
            <span>Menge</span>
            <span>Satz</span>
            <span className="text-right">Summe</span>
          </div>
          {rows.map((r, i) => (
            <div key={r[0]} className={`grid grid-cols-[1.6fr_1fr_0.8fr_1fr] px-[0.8em] py-[0.62em] text-[0.82em] ${i % 2 ? "bg-white/[0.015]" : ""}`}>
              <span>{r[0]}</span>
              <span className="text-fg-muted">{r[1]}</span>
              <span className="text-fg-muted">{r[2]}</span>
              <span className="text-right tabular-nums">{r[3]}</span>
            </div>
          ))}
          <div className="grid grid-cols-[1.6fr_1fr_0.8fr_1fr] border-t border-white/[0.07] px-[0.8em] py-[0.62em] text-[0.82em]">
            <span className="text-fg-muted">Rabatt</span>
            <span className="text-fg-muted">5 %</span>
            <span />
            <span className="text-right tabular-nums text-fg-muted">−193 €</span>
          </div>
        </div>
        <div className="flex flex-col gap-[0.8em]">
          <div className="rounded-[0.7em] border border-accent/25 bg-accent/[0.07] p-[0.9em]">
            <span className="text-[0.7em] uppercase tracking-wider text-accent">Angebotssumme</span>
            <span className="mt-[0.2em] block text-[1.9em] font-semibold tabular-nums tracking-tight">3.657 €</span>
            <span className="text-[0.72em] text-fg-subtle">netto · Beispielwerte</span>
          </div>
          <div className="rounded-[0.7em] border border-white/[0.07] bg-white/[0.03] p-[0.9em]">
            <span className="flex justify-between text-[0.75em]">
              <span className="text-fg-muted">Marge</span>
              <span className="tabular-nums">42 %</span>
            </span>
            <span className="mt-[0.5em] block h-[0.45em] overflow-hidden rounded-full bg-white/10">
              <span className="block h-full w-[42%] rounded-full bg-accent" />
            </span>
            <span className="mt-[0.8em] flex justify-between text-[0.75em]">
              <span className="text-fg-muted">Aufwand</span>
              <span className="tabular-nums">38 Std.</span>
            </span>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

export function PlannerScreen() {
  const entries: Record<number, [string, string][]> = {
    2: [["Blog", "bg-accent/70"]],
    4: [["Newsletter", "bg-white/60"]],
    8: [["Reel", "bg-accent/40"]],
    9: [["Blog", "bg-accent/70"]],
    11: [["Post", "bg-white/35"]],
    15: [["Newsletter", "bg-white/60"]],
    16: [["Blog", "bg-accent/70"]],
    18: [["Reel", "bg-accent/40"], ["Post", "bg-white/35"]],
    22: [["Kampagne", "bg-accent"]],
    23: [["Blog", "bg-accent/70"]],
    25: [["Post", "bg-white/35"]],
    29: [["Newsletter", "bg-white/60"]],
    30: [["Blog", "bg-accent/70"]],
  };
  return (
    <AppFrame title="Content-Planer · Oktober" right={<span className="text-[0.7em] text-fg-subtle">Monat · Woche · Kanal</span>}>
      <div className="flex h-full flex-col p-[1em]">
        <div className="grid grid-cols-7 gap-[0.35em] pb-[0.4em] text-[0.65em] uppercase tracking-wider text-fg-subtle">
          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
            <span key={d} className="px-[0.3em]">{d}</span>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-7 grid-rows-5 gap-[0.35em]">
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 1;
            const inMonth = day >= 1 && day <= 31;
            return (
              <div key={i} className={`flex flex-col gap-[0.25em] rounded-[0.45em] p-[0.35em] ${inMonth ? "bg-white/[0.035]" : "bg-transparent"} ${day === 14 ? "ring-1 ring-accent/60" : ""}`}>
                {inMonth && <span className={`text-[0.62em] ${day === 14 ? "text-accent" : "text-fg-subtle"}`}>{day}</span>}
                {inMonth &&
                  entries[day]?.map(([label, color]) => (
                    <span key={label} className="flex items-center gap-[0.25em] truncate rounded-[0.3em] bg-white/[0.06] px-[0.3em] py-[0.15em] text-[0.55em]">
                      <i className={`block h-[0.5em] w-[0.5em] flex-none rounded-full ${color}`} />
                      {label}
                    </span>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    </AppFrame>
  );
}

export function DashboardScreen({ title = "Liquidität · 12 Monate" }: { title?: string }) {
  const bars = [62, 48, 70, 55, 82, 64, 90, 58, 74, 68, 86, 78];
  return (
    <AppFrame title={title} right={<span className="text-[0.7em] text-fg-subtle">Beispieldaten</span>}>
      <div className="flex h-full flex-col gap-[0.8em] p-[1em]">
        <div className="grid grid-cols-3 gap-[0.7em]">
          {[
            ["Kontostand", "18.420 €", "+4,2 %"],
            ["Einnahmen", "9.860 €", "geplant"],
            ["Ausgaben", "6.310 €", "geplant"],
          ].map(([k, v, s], i) => (
            <div key={k} className="rounded-[0.7em] border border-white/[0.07] bg-white/[0.03] p-[0.75em]">
              <span className="text-[0.68em] text-fg-subtle">{k}</span>
              <span className="mt-[0.15em] block text-[1.3em] font-semibold tabular-nums tracking-tight">{v}</span>
              <span className={`text-[0.65em] ${i === 0 ? "text-accent" : "text-fg-subtle"}`}>{s}</span>
            </div>
          ))}
        </div>
        <div className="relative flex-1 rounded-[0.7em] border border-white/[0.07] bg-white/[0.02] p-[0.8em]">
          <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="absolute inset-x-[0.8em] bottom-[2.2em] top-[0.8em] h-[calc(100%-3em)] w-[calc(100%-1.6em)]" aria-hidden>
            <defs>
              <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#6fdcff" stopOpacity="0.35" />
                <stop offset="1" stopColor="#6fdcff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[25, 50, 75].map((y) => (
              <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
            ))}
            <path d="M0 70 C 30 62, 45 66, 60 58 S 100 40, 120 46 S 160 30, 180 34 S 220 20, 240 26 S 280 12, 300 14 L 300 100 L 0 100 Z" fill="url(#dash-area)" />
            <path d="M0 70 C 30 62, 45 66, 60 58 S 100 40, 120 46 S 160 30, 180 34 S 220 20, 240 26 S 280 12, 300 14" fill="none" stroke="#6fdcff" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            <path d="M0 80 C 40 78, 80 74, 120 72 S 200 64, 300 60" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="absolute inset-x-[0.8em] bottom-[0.6em] flex h-[1.3em] items-end gap-[0.3em]">
            {bars.map((b, i) => (
              <span key={i} className="flex-1 rounded-t-[0.15em] bg-white/15" style={{ height: `${b}%` }} />
            ))}
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

export function PromptsScreen() {
  const prompts = [
    ["Antwort auf Preisanfrage", "Ton: {freundlich, klar} · Kontext: {Leistung}"],
    ["Nachfassen nach Angebot", "Frist: {Datum} · Bezug: {Angebotsnummer}"],
    ["Reklamation beantworten", "Sachverhalt: {kurz} · Lösung: {Vorschlag}"],
  ];
  return (
    <AppFrame title="Prompt-Bibliothek" right={<span className="text-[0.7em] text-fg-subtle">24 Vorlagen</span>}>
      <div className="flex h-full flex-col gap-[0.6em] p-[1em]">
        <div className="flex gap-[0.4em]">
          {["Alle", "E-Mail", "Angebote", "Service"].map((t, i) => (
            <span key={t} className={`rounded-full px-[0.8em] py-[0.3em] text-[0.7em] ${i === 0 ? "bg-fg text-ink-950" : "bg-white/[0.06] text-fg-muted"}`}>{t}</span>
          ))}
        </div>
        {prompts.map(([title, meta], i) => (
          <div key={title} className={`rounded-[0.7em] border p-[0.8em] ${i === 0 ? "border-accent/30 bg-accent/[0.06]" : "border-white/[0.07] bg-white/[0.03]"}`}>
            <span className="flex items-center justify-between">
              <span className="text-[0.85em] font-medium">{title}</span>
              <span className="rounded-[0.35em] border border-white/10 px-[0.5em] py-[0.15em] text-[0.62em] text-fg-muted">Kopieren</span>
            </span>
            <span className="mt-[0.35em] block font-mono text-[0.68em] text-fg-muted">{meta}</span>
            {i === 0 && (
              <span className="mt-[0.6em] block space-y-[0.4em]">
                <Line w="92%" />
                <Line w="76%" />
              </span>
            )}
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

export function AutomationScreen() {
  const nodes = [
    { x: 6, y: 18, t: "Formular", s: "Neue Anfrage" },
    { x: 37, y: 18, t: "Tabelle", s: "Zeile anlegen" },
    { x: 37, y: 60, t: "Einordnen", s: "Kategorie" },
    { x: 68, y: 60, t: "E-Mail", s: "Entwurf erstellen" },
  ];
  return (
    <AppFrame title="Ablauf: Anfrage → Tabelle → Antwort" right={<span className="flex items-center gap-[0.35em] text-[0.7em] text-fg-subtle"><i className="block h-[0.5em] w-[0.5em] rounded-full bg-success/80" />Vorlage</span>}>
      <div className="relative h-full bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:1.4em_1.4em]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M28 28 L37 28" stroke="#6fdcff" strokeOpacity="0.6" strokeWidth="0.5" vectorEffect="non-scaling-stroke" fill="none" />
          <path d="M48 38 L48 60" stroke="#6fdcff" strokeOpacity="0.6" strokeWidth="0.5" vectorEffect="non-scaling-stroke" fill="none" />
          <path d="M59 70 L68 70" stroke="#6fdcff" strokeOpacity="0.6" strokeWidth="0.5" vectorEffect="non-scaling-stroke" fill="none" strokeDasharray="2 2" />
        </svg>
        {nodes.map((n, i) => (
          <div
            key={n.t}
            className={`absolute w-[24%] rounded-[0.7em] border p-[0.7em] ${i === 3 ? "border-accent/40 bg-accent/[0.08]" : "border-white/10 bg-ink-800"}`}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span className="flex items-center gap-[0.4em] text-[0.82em] font-medium">
              <i className={`block h-[1.2em] w-[1.2em] rounded-[0.35em] ${i === 3 ? "bg-accent/70" : "bg-white/15"}`} />
              {n.t}
            </span>
            <span className="mt-[0.25em] block text-[0.66em] text-fg-subtle">{n.s}</span>
          </div>
        ))}
        <span className="absolute bottom-[0.9em] right-[0.9em] rounded-[0.4em] border border-white/10 bg-ink-800 px-[0.7em] py-[0.35em] text-[0.68em] text-fg-muted">
          Versand erst nach Freigabe
        </span>
      </div>
    </AppFrame>
  );
}

export function KanbanScreen() {
  const cols: [string, string[]][] = [
    ["Offen", ["Briefing prüfen", "Texte sammeln", "Bilder anfragen"]],
    ["In Arbeit", ["Startseite gestalten", "Formular testen"]],
    ["Erledigt", ["Kick-off", "Seitenstruktur"]],
  ];
  return (
    <AppFrame title="Projekte · Website Relaunch">
      <div className="grid h-full grid-cols-3 gap-[0.7em] p-[1em]">
        {cols.map(([title, cards], ci) => (
          <div key={title} className="flex flex-col gap-[0.5em] rounded-[0.7em] bg-white/[0.025] p-[0.6em]">
            <span className="flex items-center justify-between px-[0.2em] text-[0.72em] text-fg-muted">
              {title}
              <span className="text-fg-subtle">{cards.length}</span>
            </span>
            {cards.map((c, i) => (
              <div key={c} className="rounded-[0.55em] border border-white/[0.07] bg-ink-800 p-[0.6em]">
                <span className={`block text-[0.75em] ${ci === 2 ? "text-fg-subtle line-through" : ""}`}>{c}</span>
                <span className="mt-[0.45em] flex items-center justify-between">
                  <span className={`h-[0.4em] w-[2.4em] rounded-full ${ci === 1 && i === 0 ? "bg-accent/70" : "bg-white/12"}`} />
                  <i className="block h-[1.1em] w-[1.1em] rounded-full bg-white/10" />
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

export function RateScreen() {
  return (
    <AppFrame title="Stundensatz-Rechner">
      <div className="grid h-full grid-cols-[1fr_1.1fr] gap-[1em] p-[1.1em]">
        <div className="flex flex-col gap-[0.55em]">
          {[
            ["Wunscheinkommen / Jahr", "60.000 €"],
            ["Fixkosten / Monat", "1.150 €"],
            ["Urlaub & Feiertage", "38 Tage"],
            ["Abrechenbar", "60 %"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[0.55em] border border-white/[0.07] bg-white/[0.03] px-[0.7em] py-[0.5em]">
              <span className="block text-[0.62em] text-fg-subtle">{k}</span>
              <span className="text-[0.85em] tabular-nums">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-between rounded-[0.7em] border border-accent/25 bg-accent/[0.06] p-[1em]">
          <span className="text-[0.7em] uppercase tracking-wider text-accent">Mindest-Stundensatz</span>
          <span className="text-[2.6em] font-semibold tabular-nums tracking-tight">
            78 €<span className="text-[0.4em] font-normal text-fg-muted"> / Std.</span>
          </span>
          <span className="space-y-[0.45em]">
            {[
              ["Einkommen", 64],
              ["Fixkosten", 22],
              ["Rücklagen", 14],
            ].map(([k, v]) => (
              <span key={k} className="block">
                <span className="flex justify-between text-[0.65em] text-fg-muted">
                  <span>{k}</span>
                  <span>{v} %</span>
                </span>
                <span className="mt-[0.2em] block h-[0.35em] rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-accent/80" style={{ width: `${v}%` }} />
                </span>
              </span>
            ))}
          </span>
          <span className="text-[0.6em] text-fg-subtle">Beispielwerte</span>
        </div>
      </div>
    </AppFrame>
  );
}

export function ChatScreen({ animated = false }: { animated?: boolean }) {
  return (
    <AppFrame
      title="Anfrage-Assistent"
      right={<span className="rounded-full border border-warning/30 bg-warning/10 px-[0.6em] py-[0.15em] text-[0.62em] text-warning">Demo</span>}
    >
      <div className="flex h-full flex-col gap-[0.6em] p-[0.9em]">
        <div className="max-w-[85%] self-end rounded-[0.8em] rounded-br-[0.25em] bg-white/[0.08] px-[0.8em] py-[0.55em] text-[0.78em]">
          Neue Anfrage: Relaunch einer Praxis-Website, Budget offen.
        </div>
        <div className="max-w-[92%] rounded-[0.8em] rounded-bl-[0.25em] border border-accent/20 bg-accent/[0.07] px-[0.8em] py-[0.6em] text-[0.78em]">
          <span className="mb-[0.35em] flex flex-wrap gap-[0.3em]">
            <span className="rounded-full bg-accent/20 px-[0.55em] py-[0.1em] text-[0.8em] text-accent">Website-Redesign</span>
            <span className="rounded-full bg-white/10 px-[0.55em] py-[0.1em] text-[0.8em] text-fg-muted">Rückfrage nötig</span>
          </span>
          Ich habe einen Antwortentwurf mit zwei Rückfragen zum Umfang vorbereitet.
        </div>
        <div className="rounded-[0.7em] border border-white/[0.07] bg-white/[0.03] p-[0.7em]">
          <span className="text-[0.65em] uppercase tracking-wider text-fg-subtle">Entwurf</span>
          <span className="mt-[0.4em] block space-y-[0.4em]">
            <Line w="94%" />
            <Line w="82%" />
            <Line w="60%" />
          </span>
          <span className="mt-[0.7em] flex gap-[0.4em]">
            <span className="rounded-full bg-fg px-[0.8em] py-[0.35em] text-[0.68em] font-medium text-ink-950">Prüfen & senden</span>
            <span className="rounded-full border border-white/12 px-[0.8em] py-[0.35em] text-[0.68em] text-fg-muted">Bearbeiten</span>
          </span>
        </div>
        <div className="mt-auto flex items-center gap-[0.3em] px-[0.2em] text-fg-subtle">
          {[0, 1, 2].map((i) => (
            <i
              key={i}
              className="block h-[0.4em] w-[0.4em] rounded-full bg-current"
              style={animated ? { animation: `typing 1.4s ${i * 0.18}s infinite` } : undefined}
            />
          ))}
          <span className="ml-[0.3em] text-[0.68em]">ordnet weitere Anfragen ein …</span>
        </div>
      </div>
    </AppFrame>
  );
}
