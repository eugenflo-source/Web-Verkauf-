import type { Metadata } from "next";
import { LegalPage, Todo } from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Widerrufsbelehrung", robots: { index: false } };

export default function WiderrufPage() {
  return (
    <LegalPage title="Widerrufsbelehrung">
      <h2>Widerrufsrecht für Verbraucher</h2>
      <Todo>Widerrufsbelehrung für digitale Inhalte einfügen (Muster nach Anlage 1 zu Art. 246a § 1 Abs. 2 EGBGB), inklusive Kontaktdaten für den Widerruf.</Todo>
      <h2>Vorzeitiges Erlöschen bei digitalen Inhalten</h2>
      <p>
        Technisch vorbereitet: Vor der Zahlung muss im Warenkorb ausdrücklich zugestimmt werden, dass mit der Bereitstellung der digitalen Inhalte vor Ablauf der
        Widerrufsfrist begonnen wird, und bestätigt werden, dass dadurch das Widerrufsrecht erlischt. Die Zustimmung wird mit der Bestellung gespeichert.
      </p>
      <Todo>Rechtlich geprüften Hinweis zum Erlöschen des Widerrufsrechts (§ 356 Abs. 5 BGB) ergänzen und Formulierung im Warenkorb abgleichen.</Todo>
      <h2>Muster-Widerrufsformular</h2>
      <Todo>Muster-Widerrufsformular (Anlage 2 zu Art. 246a § 1 Abs. 2 EGBGB) einfügen.</Todo>
      <h2>Individuelle Dienstleistungen</h2>
      <Todo>Widerrufsregelungen für Dienstleistungsverträge mit Verbrauchern ergänzen.</Todo>
    </LegalPage>
  );
}
