import type { Metadata } from "next";
import { LegalPage, Todo } from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Datenschutzerklärung", robots: { index: false } };

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung" intro="Unten findest du die Dienste, die in dieser Website technisch vorbereitet sind. Sie müssen in der Datenschutzerklärung berücksichtigt werden, sobald sie aktiv sind.">
      <h2>1. Verantwortliche Stelle</h2>
      <Todo>Name und Kontaktdaten des Verantwortlichen sowie ggf. Datenschutzbeauftragter.</Todo>
      <h2>2. Hosting</h2>
      <Todo>Angaben zum Hosting-Anbieter (z. B. Vercel), Serverstandorte, Server-Logfiles, Rechtsgrundlage, Auftragsverarbeitungsvertrag.</Todo>
      <h2>3. Kontakt- und Projektanfragen</h2>
      <p>Technisch vorbereitet: Formulareingaben (Name, E-Mail, optional Unternehmen, Website, Budget, Zeitraum und Projektbeschreibung) werden in einer Datenbank bei Supabase gespeichert, sobald diese verbunden ist.</p>
      <Todo>Zweck, Rechtsgrundlage, Speicherdauer, Empfänger und Drittlandübermittlung beschreiben.</Todo>
      <h2>4. Bestellungen und Zahlungsabwicklung</h2>
      <p>Technisch vorbereitet: Zahlungen werden über Stripe abgewickelt. Bestelldaten (E-Mail, gekaufte Produkte, Beträge, Zahlungsstatus) werden zur Bereitstellung der Downloads gespeichert.</p>
      <Todo>Angaben zu Stripe (Zahlungsdienstleister), Rechnungsstellung, gesetzlichen Aufbewahrungsfristen und Rechtsgrundlagen.</Todo>
      <h2>5. Kundenbereich und Anmeldung</h2>
      <p>Technisch vorbereitet: Anmeldung per E-Mail-Link über Supabase Auth. Dafür werden E-Mail-Adresse und Sitzungs-Cookies verarbeitet.</p>
      <Todo>Beschreibung der Anmeldung, erforderliche Cookies, Speicherdauer.</Todo>
      <h2>6. Lokale Speicherung im Browser</h2>
      <p>Der Warenkorb wird im lokalen Speicher deines Browsers (localStorage) abgelegt und nicht an den Server übertragen, bis du zur Kasse gehst.</p>
      <h2>7. Deine Rechte</h2>
      <Todo>Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Beschwerderecht bei einer Aufsichtsbehörde.</Todo>
      <h2>8. Analyse- und Marketingdienste</h2>
      <p>Derzeit sind keine Analyse- oder Marketingdienste eingebunden. Schriften werden lokal ausgeliefert.</p>
    </LegalPage>
  );
}
