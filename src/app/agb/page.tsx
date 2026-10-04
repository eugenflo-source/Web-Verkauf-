import type { Metadata } from "next";
import { LegalPage, Todo } from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Allgemeine Geschäftsbedingungen", robots: { index: false } };

export default function AgbPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <h2>1. Geltungsbereich und Vertragspartner</h2>
      <Todo>Vertragspartner, Geltungsbereich für Verbraucher und Unternehmer.</Todo>
      <h2>2. Vertragsschluss im Shop</h2>
      <Todo>Ablauf der Bestellung, Zeitpunkt des Vertragsschlusses, Korrekturmöglichkeiten, Vertragssprache, Speicherung des Vertragstextes.</Todo>
      <h2>3. Preise und Zahlung</h2>
      <Todo>Preisangaben (inkl. Steuerhinweis), verfügbare Zahlungsarten, Fälligkeit.</Todo>
      <h2>4. Bereitstellung digitaler Produkte</h2>
      <Todo>Bereitstellung per Download nach Zahlungseingang, Verfügbarkeitsdauer der Downloads, technische Voraussetzungen.</Todo>
      <h2>5. Nutzungsrechte und Lizenzen</h2>
      <Todo>Umfang der Einzellizenz, Mehrfachlizenzen, Verbot der Weitergabe und des Weiterverkaufs, Nutzung für Kundenprojekte.</Todo>
      <h2>6. Gewährleistung und Updates</h2>
      <Todo>Gewährleistung für digitale Produkte (§§ 327 ff. BGB), Aktualisierungspflichten, Haftung.</Todo>
      <h2>7. Individuelle Dienstleistungen</h2>
      <Todo>Regelungen für individuelle Entwicklungsprojekte (Angebot, Abnahme, Mitwirkungspflichten, Nutzungsrechte) – ggf. als gesonderte Bedingungen.</Todo>
      <h2>8. Schlussbestimmungen</h2>
      <Todo>Anwendbares Recht, Gerichtsstand (für Unternehmer), salvatorische Klausel.</Todo>
    </LegalPage>
  );
}
