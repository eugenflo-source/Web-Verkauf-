/**
 * Zentrale Produktpflege.
 *
 * Preise in Cent. Der Server berechnet den Warenkorb ausschließlich anhand
 * dieser Datei – Preise aus dem Browser werden nie übernommen.
 *
 * `demo: true` kennzeichnet Beispielprodukte. Sie werden im Shop als Demo
 * markiert und lassen sich nur im Testablauf oder mit Stripe-Testschlüsseln
 * kaufen, niemals mit Live-Schlüsseln.
 *
 * `file` ist der Pfad der Produktdatei im privaten Supabase-Storage-Bucket
 * (siehe README). Die Datei wird erst nach serverseitig bestätigter Zahlung
 * über einen kurzlebigen, signierten Link ausgeliefert.
 */

export type CategoryId =
  | "website-vorlagen"
  | "business-tools"
  | "ki-prompts"
  | "planer-vorlagen"
  | "automatisierungen";

export type VisualKind =
  | "calculator"
  | "planner"
  | "website"
  | "landing"
  | "dashboard"
  | "prompts"
  | "automation"
  | "kanban"
  | "rate";

export type Product = {
  slug: string;
  name: string;
  /** Ein Satz: welcher konkrete Nutzen? */
  tagline: string;
  category: CategoryId;
  /** Produkttyp / Format, wird als Filter verwendet. */
  format: Format;
  price: number;
  releasedAt: string;
  featured?: boolean;
  demo: boolean;
  version: string;
  visual: VisualKind;
  quantity: { editable: boolean; max: number; unit: string; unitPlural: string };
  highlights: string[];
  details: {
    what: string;
    audience: string[];
    problem: string;
    included: string[];
    requirements: string[];
    delivery: string;
    license: string;
    support: string;
  };
  file?: string;
};

export const categories: { id: CategoryId; label: string; description: string }[] = [
  {
    id: "website-vorlagen",
    label: "Website-Vorlagen",
    description: "Fertig gestaltete Seiten, die du mit eigenen Inhalten füllst.",
  },
  {
    id: "business-tools",
    label: "Business-Tools",
    description: "Rechner und Dashboards für Angebote, Preise und Zahlen.",
  },
  {
    id: "ki-prompts",
    label: "KI & Prompts",
    description: "Erprobte Prompt-Vorlagen für wiederkehrende Aufgaben.",
  },
  {
    id: "planer-vorlagen",
    label: "Planer & Vorlagen",
    description: "Struktur für Inhalte, Projekte und Aufgaben.",
  },
  {
    id: "automatisierungen",
    label: "Automatisierungen",
    description: "Importierbare Abläufe für gängige Automatisierungstools.",
  },
];

export const formats = [
  "Tabellenvorlage",
  "Website-Vorlage",
  "Notion-Vorlage",
  "Prompt-Paket",
  "Automations-Vorlage",
] as const;
export type Format = (typeof formats)[number];

const singleLicense = { editable: false, max: 1, unit: "Lizenz", unitPlural: "Lizenzen" };
const multiLicense = { editable: true, max: 10, unit: "Lizenz", unitPlural: "Lizenzen" };

const standardLicense =
  "Einzellizenz für die Nutzung in deinem eigenen Unternehmen. Weiterverkauf und Weitergabe der Vorlage selbst sind nicht gestattet. Die verbindlichen Lizenzbedingungen findest du in den AGB.";
const standardSupport =
  "Bei Fragen zur Einrichtung erreichst du uns per E-Mail. Updates innerhalb der Hauptversion stehen dir im Kundenbereich zur Verfügung.";

export const products: Product[] = [
  {
    slug: "angebotsrechner",
    name: "Angebotsrechner",
    tagline: "Kalkuliere Angebote mit Positionen, Rabatten und Marge – nachvollziehbar statt geschätzt.",
    category: "business-tools",
    format: "Tabellenvorlage",
    price: 4900,
    releasedAt: "2026-09-02",
    featured: true,
    demo: true,
    version: "1.0",
    visual: "calculator",
    quantity: multiLicense,
    highlights: ["Positionen mit Stunden- und Pauschalpreisen", "Marge und Rabatt auf einen Blick", "Druckfertige Angebotsübersicht"],
    details: {
      what: "Eine strukturierte Tabellenvorlage, mit der du Angebote aus einzelnen Positionen zusammenstellst. Stundensätze, Pauschalen, Rabatte und Materialkosten werden automatisch zusammengerechnet; eine Übersicht zeigt dir Gesamtpreis und Marge.",
      audience: ["Selbstständige und Freelancer", "Agenturen und kleine Dienstleistungsteams", "Handwerks- und Servicebetriebe mit wiederkehrenden Angeboten"],
      problem: "Angebote entstehen oft aus Bauchgefühl oder alten Dokumenten. Dabei gehen Positionen verloren und die tatsächliche Marge bleibt unklar.",
      included: ["Tabellenvorlage (.xlsx) mit Positionsliste und Auswertung", "Kopierlink für Google Sheets", "Kurzanleitung als PDF", "Beispielangebot zum Nachvollziehen"],
      requirements: ["Microsoft Excel (aktuelle Version) oder ein kostenloses Google-Konto", "Grundkenntnisse in Tabellenprogrammen"],
      delivery: "Nach bestätigter Zahlung steht der Download im Kundenbereich und auf der Bestellbestätigung bereit. Kein Versand.",
      license: standardLicense,
      support: standardSupport,
    },
    file: "angebotsrechner/angebotsrechner-v1.zip",
  },
  {
    slug: "content-planer",
    name: "Content-Planer",
    tagline: "Plane Beiträge für zwölf Monate mit Themen, Kanälen und Status an einem Ort.",
    category: "planer-vorlagen",
    format: "Notion-Vorlage",
    price: 2900,
    releasedAt: "2026-08-18",
    featured: true,
    demo: true,
    version: "1.2",
    visual: "planner",
    quantity: singleLicense,
    highlights: ["Monats-, Wochen- und Kanalansicht", "Themenpool mit Statusverfolgung", "Wiederverwendbare Beitragsvorlagen"],
    details: {
      what: "Ein vorbereiteter Notion-Arbeitsbereich für deine Inhaltsplanung. Du sammelst Ideen, ordnest sie Kanälen zu und siehst in Kalender- und Boardansicht, was als Nächstes ansteht.",
      audience: ["Selbstständige, die regelmäßig Inhalte veröffentlichen", "Kleine Marketingteams", "Vereine und Initiativen mit Social-Media-Auftritt"],
      problem: "Ideen liegen verstreut in Notizen, Chats und Tabellen. Ohne Überblick entstehen Lücken im Veröffentlichungsrhythmus.",
      included: ["Notion-Vorlage zum Duplizieren", "Kalender-, Board- und Tabellenansicht", "Vorlagen für Beitrag, Newsletter und Kampagne", "Einrichtungsanleitung als PDF"],
      requirements: ["Kostenloses Notion-Konto", "Keine Vorkenntnisse nötig"],
      delivery: "Nach bestätigter Zahlung erhältst du im Kundenbereich ein PDF mit dem Link zum Duplizieren der Vorlage.",
      license: standardLicense,
      support: standardSupport,
    },
    file: "content-planer/content-planer-v1-2.zip",
  },
  {
    slug: "website-vorlage-lokal",
    name: "Website-Vorlage „Lokal“",
    tagline: "Eine klare Website für lokale Unternehmen – mit Leistungen, Öffnungszeiten und Kontakt.",
    category: "website-vorlagen",
    format: "Website-Vorlage",
    price: 7900,
    releasedAt: "2026-09-20",
    featured: true,
    demo: true,
    version: "1.0",
    visual: "website",
    quantity: singleLicense,
    highlights: ["Für Smartphone, Tablet und Desktop gestaltet", "Bereiche für Leistungen, Team und Anfahrt", "Ohne Baukasten-Abo nutzbar"],
    details: {
      what: "Eine fertig gestaltete, mehrseitige Website-Vorlage in HTML und CSS. Texte, Farben und Bilder passt du in klar kommentierten Dateien an und veröffentlichst die Seite bei einem Hosting-Anbieter deiner Wahl.",
      audience: ["Handwerksbetriebe, Praxen und Studios", "Cafés, Läden und lokale Dienstleister", "Alle, die eine schlanke Website ohne Baukasten möchten"],
      problem: "Viele lokale Unternehmen haben keine oder eine veraltete Website. Baukästen sind schnell begonnen, wirken aber oft austauschbar und verursachen laufende Kosten.",
      included: ["Startseite, Leistungen, Über uns, Kontakt", "Vorbereitete Seiten für Impressum und Datenschutz (ohne Rechtstexte)", "Anleitung zu Anpassung und Veröffentlichung", "Lizenzfreie Platzhaltergrafiken"],
      requirements: ["Ein Texteditor (z. B. Visual Studio Code)", "Hosting mit eigener Domain", "Grundverständnis von HTML ist hilfreich"],
      delivery: "Nach bestätigter Zahlung steht das ZIP-Archiv im Kundenbereich zum Download bereit.",
      license: "Einzellizenz für eine Website (eine Domain). Für weitere Websites benötigst du weitere Lizenzen. Die Weitergabe der Vorlage selbst ist nicht gestattet.",
      support: standardSupport,
    },
    file: "website-vorlage-lokal/lokal-v1.zip",
  },
  {
    slug: "landingpage-vorlage-launch",
    name: "Landingpage-Vorlage „Launch“",
    tagline: "Eine fokussierte Seite für ein Angebot, ein Produkt oder eine Veranstaltung.",
    category: "website-vorlagen",
    format: "Website-Vorlage",
    price: 5900,
    releasedAt: "2026-07-28",
    demo: true,
    version: "1.1",
    visual: "landing",
    quantity: singleLicense,
    highlights: ["Klare Abfolge von Nutzen bis Anmeldung", "Abschnitte für Ablauf, FAQ und Preis", "Leichtgewichtig und schnell ladend"],
    details: {
      what: "Eine einseitige Website-Vorlage, die Besucher Schritt für Schritt zu einer Handlung führt – etwa einer Anmeldung, Buchung oder Anfrage.",
      audience: ["Coaches, Trainer und Berater", "Produktstarts und Aktionen", "Veranstalter von Workshops und Events"],
      problem: "Ein einzelnes Angebot geht auf einer allgemeinen Website leicht unter. Eine fokussierte Seite erklärt es ohne Ablenkung.",
      included: ["Einseitige HTML/CSS-Vorlage", "Vier Farbvarianten", "Anleitung zur Anbindung eines Formular-Dienstes", "Beispieltexte als Strukturhilfe"],
      requirements: ["Texteditor", "Hosting", "Optional: Konto bei einem Formular- oder Newsletter-Dienst"],
      delivery: "Nach bestätigter Zahlung steht das ZIP-Archiv im Kundenbereich zum Download bereit.",
      license: "Einzellizenz für eine Website (eine Domain). Die Weitergabe der Vorlage selbst ist nicht gestattet.",
      support: standardSupport,
    },
    file: "landingpage-launch/launch-v1-1.zip",
  },
  {
    slug: "liquiditaets-dashboard",
    name: "Liquiditäts-Dashboard",
    tagline: "Sieh Einnahmen, Ausgaben und Kontostand der nächsten Monate in einer Übersicht.",
    category: "business-tools",
    format: "Tabellenvorlage",
    price: 3900,
    releasedAt: "2026-06-30",
    featured: true,
    demo: true,
    version: "1.0",
    visual: "dashboard",
    quantity: multiLicense,
    highlights: ["Monatliche Planung über 12 Monate", "Diagramme aktualisieren sich automatisch", "Szenarien für vorsichtige und optimistische Planung"],
    details: {
      what: "Eine Tabellenvorlage mit Dashboard, in die du erwartete Einnahmen und Ausgaben einträgst. Die Vorlage zeigt dir den voraussichtlichen Kontostand je Monat und markiert Monate mit Engpässen.",
      audience: ["Selbstständige und Kleinunternehmen", "Gründerinnen und Gründer", "Vereine mit eigenem Budget"],
      problem: "Ob das Geld in drei Monaten reicht, ist oft erst klar, wenn es knapp wird. Eine vorausschauende Planung macht Engpässe früh sichtbar.",
      included: ["Tabellenvorlage (.xlsx) mit Dashboard", "Kopierlink für Google Sheets", "Kurzanleitung als PDF"],
      requirements: ["Microsoft Excel oder ein Google-Konto"],
      delivery: "Nach bestätigter Zahlung steht der Download im Kundenbereich bereit.",
      license: standardLicense,
      support: standardSupport + " Die Vorlage ersetzt keine steuerliche oder finanzielle Beratung.",
    },
    file: "liquiditaets-dashboard/liquiditaet-v1.zip",
  },
  {
    slug: "prompt-paket-kundenkommunikation",
    name: "Prompt-Paket Kundenkommunikation",
    tagline: "Vorlagen für Antworten, Nachfassmails und Reklamationen – sachlich und in deinem Ton.",
    category: "ki-prompts",
    format: "Prompt-Paket",
    price: 1900,
    releasedAt: "2026-09-10",
    featured: true,
    demo: true,
    version: "1.0",
    visual: "prompts",
    quantity: singleLicense,
    highlights: ["Prompts mit Platzhaltern für deinen Kontext", "Hinweise zur Prüfung von KI-Antworten", "Für gängige KI-Assistenten geeignet"],
    details: {
      what: "Eine Sammlung strukturierter Prompt-Vorlagen für typische Situationen in der Kundenkommunikation. Jede Vorlage enthält Platzhalter für Tonalität, Kontext und gewünschtes Ergebnis.",
      audience: ["Selbstständige mit viel E-Mail-Verkehr", "Kundenservice in kleinen Teams", "Alle, die KI-Assistenten gezielter nutzen möchten"],
      problem: "Allgemeine Prompts liefern allgemeine Antworten. Mit klarer Struktur und Kontext werden Entwürfe brauchbarer und brauchen weniger Nacharbeit.",
      included: ["Prompt-Sammlung als PDF und Textdatei", "Anleitung zum Anpassen von Ton und Kontext", "Checkliste zur Prüfung von Entwürfen"],
      requirements: ["Zugang zu einem KI-Assistenten deiner Wahl", "Keine technischen Vorkenntnisse"],
      delivery: "Nach bestätigter Zahlung steht der Download im Kundenbereich bereit.",
      license: standardLicense,
      support: standardSupport,
    },
    file: "prompt-paket-kundenkommunikation/prompts-kk-v1.zip",
  },
  {
    slug: "prompt-paket-content",
    name: "Prompt-Paket Content & Marketing",
    tagline: "Von der Themenidee bis zum Beitragsentwurf – mit nachvollziehbaren Arbeitsschritten.",
    category: "ki-prompts",
    format: "Prompt-Paket",
    price: 2400,
    releasedAt: "2026-08-05",
    demo: true,
    version: "1.0",
    visual: "prompts",
    quantity: singleLicense,
    highlights: ["Prompt-Ketten statt Einzelbefehle", "Vorlagen für Blog, Newsletter und Social Media", "Hinweise für eigene Markensprache"],
    details: {
      what: "Prompt-Ketten, die dich vom Thema über Gliederung und Entwurf bis zur Überarbeitung führen. Du behältst die inhaltliche Kontrolle, die KI übernimmt Vorarbeit.",
      audience: ["Selbstständige mit eigenem Blog oder Newsletter", "Marketingverantwortliche in kleinen Teams"],
      problem: "Leere Seiten kosten Zeit. Gleichzeitig klingen ungeprüfte KI-Texte schnell austauschbar.",
      included: ["Prompt-Ketten als PDF und Textdatei", "Leitfaden zur Markensprache", "Beispiele für Überarbeitungsschritte"],
      requirements: ["Zugang zu einem KI-Assistenten deiner Wahl"],
      delivery: "Nach bestätigter Zahlung steht der Download im Kundenbereich bereit.",
      license: standardLicense,
      support: standardSupport,
    },
    file: "prompt-paket-content/prompts-content-v1.zip",
  },
  {
    slug: "projektplaner",
    name: "Projekt- & Aufgabenplaner",
    tagline: "Behalte Projekte, Fristen und Zuständigkeiten im Blick – ohne neues Projekttool.",
    category: "planer-vorlagen",
    format: "Notion-Vorlage",
    price: 1900,
    releasedAt: "2026-05-14",
    demo: true,
    version: "2.0",
    visual: "kanban",
    quantity: singleLicense,
    highlights: ["Board-, Listen- und Zeitachsenansicht", "Projekte mit Aufgaben verknüpft", "Wochenrückblick als Vorlage"],
    details: {
      what: "Ein Notion-Arbeitsbereich für Projekte und Aufgaben. Aufgaben sind mit Projekten verknüpft, Fristen und Status lassen sich nach Bedarf filtern.",
      audience: ["Selbstständige mit mehreren Kundenprojekten", "Kleine Teams ohne eigenes Projekttool"],
      problem: "Aufgaben verteilen sich auf Zettel, Mails und Kalender. Was dringend ist, wird erst spät sichtbar.",
      included: ["Notion-Vorlage zum Duplizieren", "Board, Liste und Zeitachse", "Einrichtungsanleitung als PDF"],
      requirements: ["Kostenloses Notion-Konto"],
      delivery: "Nach bestätigter Zahlung erhältst du im Kundenbereich ein PDF mit dem Link zum Duplizieren.",
      license: standardLicense,
      support: standardSupport,
    },
    file: "projektplaner/projektplaner-v2.zip",
  },
  {
    slug: "automation-anfrage-workflow",
    name: "Automations-Vorlage „Anfrage → Tabelle → Antwort“",
    tagline: "Übertrage Formularanfragen automatisch in eine Tabelle und erstelle einen Antwortentwurf.",
    category: "automatisierungen",
    format: "Automations-Vorlage",
    price: 4900,
    releasedAt: "2026-09-26",
    featured: true,
    demo: true,
    version: "1.0",
    visual: "automation",
    quantity: singleLicense,
    highlights: ["Importierbarer Ablauf für n8n und Make", "Schritt-für-Schritt-Anleitung", "Leicht um eigene Schritte erweiterbar"],
    details: {
      what: "Ein vorbereiteter Automatisierungsablauf: Eine neue Formularanfrage wird in eine Tabelle geschrieben, nach Kategorie markiert und als Antwortentwurf in deinem E-Mail-Postfach vorbereitet. Versendet wird erst nach deiner Prüfung.",
      audience: ["Selbstständige mit regelmäßigen Anfragen über die Website", "Kleine Teams, die Anfragen gemeinsam bearbeiten"],
      problem: "Anfragen werden manuell kopiert, sortiert und beantwortet. Dabei geht Zeit verloren und einzelne Anfragen bleiben liegen.",
      included: ["Importdatei für n8n", "Blueprint für Make", "Anleitung mit Screenshots der Einrichtung", "Hinweise zum Datenschutz bei der Verarbeitung"],
      requirements: ["Konto bei n8n oder Make (ggf. kostenpflichtig)", "Formular-Dienst, Tabellenprogramm und E-Mail-Konto mit Schnittstelle", "Grundverständnis von Automatisierungstools"],
      delivery: "Nach bestätigter Zahlung steht das ZIP-Archiv im Kundenbereich bereit.",
      license: standardLicense,
      support: standardSupport,
    },
    file: "automation-anfrage/anfrage-workflow-v1.zip",
  },
  {
    slug: "stundensatz-rechner",
    name: "Stundensatz-Rechner",
    tagline: "Ermittle einen Stundensatz, der deine Kosten, Ausfallzeiten und Ziele berücksichtigt.",
    category: "business-tools",
    format: "Tabellenvorlage",
    price: 1500,
    releasedAt: "2026-04-22",
    demo: true,
    version: "1.0",
    visual: "rate",
    quantity: multiLicense,
    highlights: ["Berücksichtigt Urlaub, Krankheit und Akquise", "Vergleich mehrerer Szenarien", "Verständliche Erklärung jeder Annahme"],
    details: {
      what: "Eine Tabellenvorlage, die aus deinen Fixkosten, deinem Wunscheinkommen und den tatsächlich abrechenbaren Stunden einen Mindest-Stundensatz berechnet.",
      audience: ["Freelancer und Gründende", "Selbstständige, die ihre Preise überprüfen möchten"],
      problem: "Stundensätze werden oft an Mitbewerbern ausgerichtet statt an den eigenen Kosten. Nicht abrechenbare Zeit wird dabei häufig unterschätzt.",
      included: ["Tabellenvorlage (.xlsx)", "Kopierlink für Google Sheets", "Erklärung aller Berechnungsschritte"],
      requirements: ["Microsoft Excel oder ein Google-Konto"],
      delivery: "Nach bestätigter Zahlung steht der Download im Kundenbereich bereit.",
      license: standardLicense,
      support: standardSupport + " Die Vorlage ersetzt keine steuerliche Beratung.",
    },
    file: "stundensatz-rechner/stundensatz-v1.zip",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: CategoryId) {
  return categories.find((c) => c.id === id)!;
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export const featuredProducts = products.filter((p) => p.featured);
