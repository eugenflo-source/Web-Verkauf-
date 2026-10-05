/**
 * Inhalte für Dienstleistungen, Abläufe und FAQ – zentral gepflegt.
 * Preise stehen bewusst auf „Preis auf Anfrage“, bis echte Preise feststehen.
 */

export const PRICE_ON_REQUEST = "Preis auf Anfrage";

export type WebsiteService = {
  id: string;
  title: string;
  summary: string;
  forWhom: string;
  scope: string[];
  price: string;
};

export const websiteServices: WebsiteService[] = [
  {
    id: "unternehmenswebsite",
    title: "Unternehmenswebsite",
    summary: "Eine mehrseitige Website, die erklärt, was du anbietest, und Interessenten den Kontakt leicht macht.",
    forWhom: "Für Unternehmen, Selbstständige und Praxen, die online professionell auftreten möchten.",
    scope: ["Seitenstruktur und Inhaltskonzept", "Individuelles Design für alle Bildschirmgrößen", "Kontaktformular und Grundlagen der Suchmaschinenoptimierung", "Einweisung in die Pflege der Inhalte"],
    price: PRICE_ON_REQUEST,
  },
  {
    id: "landingpage",
    title: "Landingpage",
    summary: "Eine fokussierte Seite für ein Angebot, eine Kampagne oder eine Veranstaltung.",
    forWhom: "Für Produktstarts, Aktionen und Angebote, die eine klare Handlung auslösen sollen.",
    scope: ["Botschaft und Seitenaufbau", "Gestaltung und Umsetzung", "Anbindung von Formular oder Buchung", "Vorbereitung für Reichweitenmessung nach Absprache"],
    price: PRICE_ON_REQUEST,
  },
  {
    id: "onlineshop",
    title: "Onlineshop",
    summary: "Ein Shop für physische oder digitale Produkte mit verständlichem Kaufprozess.",
    forWhom: "Für Unternehmen, die Produkte direkt online verkaufen möchten.",
    scope: ["Produktstruktur, Kategorien und Filter", "Warenkorb und Zahlungsanbindung", "Bestellbestätigungen und Kundenkonto nach Bedarf", "Übergabe mit Anleitung zur Produktpflege"],
    price: PRICE_ON_REQUEST,
  },
  {
    id: "redesign",
    title: "Website-Redesign",
    summary: "Deine bestehende Website wird modernisiert – inhaltlich, gestalterisch und technisch.",
    forWhom: "Für Websites, die veraltet wirken, langsam laden oder auf dem Smartphone schlecht bedienbar sind.",
    scope: ["Analyse der bestehenden Seite", "Neue Struktur und zeitgemäßes Design", "Übernahme und Überarbeitung vorhandener Inhalte", "Weiterleitungen für bestehende Adressen"],
    price: PRICE_ON_REQUEST,
  },
  {
    id: "webanwendung",
    title: "Individuelle Webanwendung",
    summary: "Ein Werkzeug im Browser, das genau zu deinem Arbeitsablauf passt – etwa ein Kundenportal oder ein interner Rechner.",
    forWhom: "Für Abläufe, die mit Standardsoftware nur umständlich abbildbar sind.",
    scope: ["Anforderungsanalyse und Prototyp", "Benutzeroberfläche und Datenmodell", "Benutzerkonten und Rechte nach Bedarf", "Dokumentation und Übergabe"],
    price: PRICE_ON_REQUEST,
  },
];

export const qualityPoints = [
  {
    title: "Auf jedem Bildschirm gut bedienbar",
    text: "Jede Seite wird für Smartphone, Tablet und Desktop gestaltet und auf allen drei Größen geprüft – nicht nachträglich angepasst.",
  },
  {
    title: "Verständliche Inhalte",
    text: "Besucher sollen in wenigen Sekunden erkennen, was du anbietest und wie es weitergeht. Deshalb beginnt jedes Projekt mit Struktur und Texten, nicht mit Farben.",
  },
  {
    title: "Schnelle Ladezeiten",
    text: "Schlanker Code, optimierte Bilder und keine unnötigen Erweiterungen. Ladezeiten werden vor der Übergabe gemessen.",
  },
  {
    title: "Einfache Kontaktwege",
    text: "Kontaktformular, Telefonnummer oder Buchung sind dort, wo Besucher sie erwarten – gut sichtbar und mit wenigen Pflichtfeldern.",
  },
];

export type AiUseCase = {
  id: string;
  title: string;
  short: string;
  problem: string;
  solution: string[];
  flow: string[];
  benefit: string;
  requirements: string[];
  integrations: string[];
};

export const aiUseCases: AiUseCase[] = [
  {
    id: "kundenanfragen",
    title: "Kundenanfragen vorsortieren",
    short: "Eingehende Anfragen werden kategorisiert und mit einem Antwortentwurf versehen.",
    problem: "Anfragen kommen über Formular, E-Mail und Telefonnotizen. Jede muss gelesen, eingeordnet und einzeln beantwortet werden.",
    solution: ["Liest neue Anfragen aus festgelegten Quellen", "Ordnet sie Themen und Dringlichkeit zu", "Erstellt einen Antwortentwurf auf Basis deiner Vorgaben", "Legt alles zur Prüfung in deinem gewohnten Werkzeug ab"],
    flow: ["Anfrage geht ein", "Einordnung nach Thema", "Antwortentwurf entsteht", "Du prüfst und sendest"],
    benefit: "Du startest bei jeder Anfrage mit einem geordneten Überblick und einem Entwurf statt mit einer leeren Nachricht. Die Entscheidung bleibt bei dir.",
    requirements: ["Zugriff auf das Postfach oder Formular per Schnittstelle", "Beispiele für typische Anfragen und Antworten", "Festgelegte Regeln, was nie automatisch versendet wird"],
    integrations: ["E-Mail-Postfächer mit Schnittstelle", "Website-Formulare", "Tabellen oder CRM-Systeme"],
  },
  {
    id: "wissen",
    title: "Unternehmenswissen zugänglich machen",
    short: "Ein Assistent beantwortet Fragen auf Basis deiner eigenen Dokumente – mit Quellenangabe.",
    problem: "Wichtiges Wissen steckt in Handbüchern, PDFs und Köpfen. Neue Mitarbeitende fragen dieselben Dinge immer wieder.",
    solution: ["Durchsucht freigegebene Dokumente", "Beantwortet Fragen in verständlicher Sprache", "Nennt die Quelle jeder Antwort", "Sagt deutlich, wenn eine Antwort nicht in den Unterlagen steht"],
    flow: ["Frage wird gestellt", "Passende Stellen werden gesucht", "Antwort mit Quelle", "Rückfrage bei Unklarheit"],
    benefit: "Informationen sind schneller auffindbar, und jede Antwort lässt sich über die Quellenangabe nachprüfen.",
    requirements: ["Sammlung der Dokumente, die einbezogen werden dürfen", "Klärung von Zugriffsrechten", "Ansprechperson für die Pflege der Inhalte"],
    integrations: ["Dateiablagen und Wikis", "Interne Chat-Werkzeuge", "Website als Hilfe-Assistent"],
  },
  {
    id: "angebote",
    title: "Angebote vorbereiten",
    short: "Aus einer Anfrage entsteht eine strukturierte Vorlage für dein Angebot.",
    problem: "Für jedes Angebot werden Informationen aus Anfrage, Preisliste und früheren Projekten zusammengesucht.",
    solution: ["Liest die relevanten Angaben aus der Anfrage", "Gleicht sie mit deinen Leistungen und Preisen ab", "Erstellt eine Angebotsgliederung mit offenen Fragen", "Markiert, was du noch klären musst"],
    flow: ["Anfrage wird übergeben", "Abgleich mit Leistungskatalog", "Angebotsentwurf", "Prüfung und Anpassung durch dich"],
    benefit: "Die Vorarbeit für ein Angebot liegt strukturiert vor. Fehlende Informationen werden sichtbar, bevor du kalkulierst.",
    requirements: ["Gepflegte Leistungs- und Preisliste", "Vorlage für dein Angebotsdokument"],
    integrations: ["Tabellen und Dokumentvorlagen", "Buchhaltungs- oder Angebotssoftware mit Schnittstelle"],
  },
  {
    id: "routine",
    title: "Wiederkehrende Aufgaben vereinfachen",
    short: "Daten werden automatisch zwischen deinen Werkzeugen übertragen – ohne Kopieren und Einfügen.",
    problem: "Dieselben Angaben werden von einem System ins nächste übertragen. Das ist eintönig und fehleranfällig.",
    solution: ["Erkennt definierte Auslöser, z. B. eine neue Bestellung", "Überträgt Daten in die richtigen Systeme", "Prüft Pflichtangaben und meldet Auffälligkeiten", "Protokolliert jeden Durchlauf"],
    flow: ["Ereignis tritt ein", "Daten werden geprüft", "Übertragung ins Zielsystem", "Protokoll und Hinweis bei Fehlern"],
    benefit: "Weniger manuelle Übertragungen und ein nachvollziehbares Protokoll, wenn etwas nicht wie erwartet läuft.",
    requirements: ["Werkzeuge mit Schnittstelle oder Exportfunktion", "Beschreibung des bisherigen Ablaufs"],
    integrations: ["Automatisierungsplattformen wie n8n oder Make", "Tabellen, Shops und CRM-Systeme", "Eigene Schnittstellen nach Bedarf"],
  },
];

export const processSteps = [
  { title: "Bedarf schildern", text: "Du beschreibst kurz, was du erreichen möchtest. Ein Formular oder eine E-Mail genügt – technisches Vorwissen brauchst du nicht." },
  { title: "Umfang und Angebot abstimmen", text: "Wir klären offene Fragen, legen den Leistungsumfang fest und du erhältst ein schriftliches Angebot mit Zeitrahmen." },
  { title: "Entwickeln und gemeinsam prüfen", text: "Die Lösung entsteht in nachvollziehbaren Schritten. Du siehst Zwischenstände und gibst Rückmeldung, bevor es weitergeht." },
  { title: "Übergabe und Betreuung", text: "Du erhältst die fertige Lösung mit Einweisung. Auf Wunsch vereinbaren wir eine laufende Betreuung." },
];

export type Faq = { q: string; a: string };

export const faqShop: Faq[] = [
  { q: "Wie erhalte ich ein gekauftes Produkt?", a: "Digitale Produkte werden nicht versendet. Nach serverseitig bestätigter Zahlung steht der Download auf der Bestellbestätigung und in deinem Kundenbereich bereit." },
  { q: "Welche Programme brauche ich?", a: "Das steht auf jeder Produktseite unter „Voraussetzungen“. Viele Vorlagen funktionieren mit kostenlosen Konten, z. B. Google Sheets oder Notion." },
  { q: "Kann ich ein digitales Produkt widerrufen?", a: "Bei digitalen Inhalten erlischt das Widerrufsrecht, wenn du vor dem Kauf ausdrücklich zustimmst, dass die Bereitstellung sofort beginnt. Details findest du in der Widerrufsbelehrung." },
  { q: "Erhalte ich eine Rechnung?", a: "Ja. Die Rechnung wird mit der Bestellung erstellt und ist – sobald der Kundenbereich aktiv ist – dort abrufbar." },
];

export const faqServices: Faq[] = [
  { q: "Was kostet eine individuelle Website oder KI-Lösung?", a: "Das hängt vom Umfang ab. Nach einem kurzen Gespräch erhältst du ein schriftliches Angebot mit festem Leistungsumfang. Bis dahin entstehen dir keine Kosten." },
  { q: "Muss ich mich technisch auskennen?", a: "Nein. Du beschreibst dein Ziel, wir übersetzen es in eine technische Lösung und erklären dir alles Nötige für den Alltag." },
  { q: "Wie lange dauert ein Projekt?", a: "Eine Landingpage ist schneller umgesetzt als ein Onlineshop oder eine Webanwendung. Den Zeitrahmen legen wir gemeinsam im Angebot fest." },
  { q: "Was passiert mit meinen Daten bei KI-Lösungen?", a: "Welche Daten verarbeitet werden und bei welchem Anbieter, klären wir vor Projektbeginn schriftlich. Sensible Daten werden nur nach ausdrücklicher Absprache einbezogen." },
  { q: "Bleibt eine KI-Lösung unter meiner Kontrolle?", a: "Ja. Wir legen fest, welche Schritte automatisch laufen und welche deine Freigabe brauchen – etwa das Versenden von Antworten." },
];

export const inquiryServices = [
  "Unternehmenswebsite",
  "Landingpage",
  "Onlineshop",
  "Website-Redesign",
  "Individuelle Webanwendung",
  "KI-Agent",
  "Automatisierung",
  "Etwas anderes",
] as const;

export const budgetOptions = ["Noch unklar", "bis 1.500 €", "1.500 – 5.000 €", "5.000 – 15.000 €", "über 15.000 €"] as const;
export const timeframeOptions = ["Flexibel", "In den nächsten 4 Wochen", "In 1–3 Monaten", "In mehr als 3 Monaten"] as const;
