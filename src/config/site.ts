/**
 * Zentrale Marken- und Kontaktdaten.
 *
 * Alles, was in eckigen Klammern steht, ist ein offener Platzhalter und muss
 * vor dem Livegang ersetzt werden. Platzhalter werden auf der Website bewusst
 * sichtbar markiert (siehe <Placeholder />), damit nichts versehentlich
 * online geht.
 */
export const site = {
  name: "[MARKENNAME]",
  /** Kurzform für enge Stellen (Logo, Browser-Tab). */
  shortName: "[MARKENNAME]",
  claim: "Digitale Produkte. Individuelle Websites. Intelligente Lösungen.",
  description:
    "Sofort nutzbare digitale Produkte und individuell entwickelte Websites, KI-Agenten und Automatisierungen für Selbstständige, Unternehmen und Privatpersonen.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "de_DE",

  contact: {
    email: "[E-MAIL-ADRESSE]",
    /** Leer lassen (""), wenn keine Telefonnummer angezeigt werden soll. */
    phone: "",
    /** Wird bei Formularen angezeigt. Nur eintragen, was du einhalten kannst. */
    responseNote: "Du erhältst eine persönliche Rückmeldung per E-Mail.",
  },

  /** Angaben für Impressum & Rechtstexte – bewusst nicht ausgefüllt. */
  company: {
    legalName: "[VOLLSTÄNDIGER NAME / FIRMA]",
    street: "[STRASSE UND HAUSNUMMER]",
    city: "[PLZ ORT]",
    country: "Deutschland",
    representative: "[VERTRETUNGSBERECHTIGTE PERSON]",
    vatId: "[USt-IdNr. ODER HINWEIS]",
    register: "[HANDELSREGISTER, FALLS VORHANDEN]",
  },

  pricing: {
    currency: "EUR",
    /**
     * Steuerhinweis neben Preisen. Muss zu deinem steuerlichen Status passen,
     * z. B. „inkl. MwSt.“ oder „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“
     */
    taxNote: "[STEUERHINWEIS ERGÄNZEN]",
  },

  social: [] as { label: string; href: string }[],
} as const;

export const mainNav = [
  { href: "/shop", label: "Shop" },
  { href: "/websites", label: "Websites" },
  { href: "/ki-automatisierung", label: "KI & Automatisierung" },
  { href: "/ueber", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const footerNav = {
  angebot: [
    { href: "/shop", label: "Shop" },
    { href: "/websites", label: "Individuelle Websites" },
    { href: "/ki-automatisierung", label: "KI-Agenten & Automatisierung" },
    { href: "/kontakt", label: "Projekt anfragen" },
  ],
  marke: [
    { href: "/ueber", label: "Über die Marke" },
    { href: "/faq", label: "FAQ" },
    { href: "/kontakt", label: "Kontakt" },
    { href: "/konto", label: "Kundenbereich" },
  ],
  rechtliches: [
    { href: "/impressum", label: "Impressum" },
    { href: "/datenschutz", label: "Datenschutz" },
    { href: "/agb", label: "AGB" },
    { href: "/widerruf", label: "Widerruf" },
  ],
} as const;

/** true, wenn ein Wert noch ein Platzhalter in eckigen Klammern ist. */
export function isPlaceholder(value: string) {
  return /^\[.*\]$/.test(value.trim());
}
