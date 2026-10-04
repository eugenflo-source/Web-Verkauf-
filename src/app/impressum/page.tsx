import type { Metadata } from "next";
import { site } from "@/config/site";
import { LegalPage, Todo } from "@/components/ui/LegalPage";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = { title: "Impressum", robots: { index: false } };

export default function ImpressumPage() {
  const c = site.company;
  return (
    <LegalPage title="Impressum" intro="Die Angaben werden zentral in src/config/site.ts gepflegt.">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        <Placeholder value={c.legalName} />
        <br />
        <Placeholder value={c.street} />
        <br />
        <Placeholder value={c.city} />
        <br />
        {c.country}
      </p>
      <h2>Vertreten durch</h2>
      <p>
        <Placeholder value={c.representative} />
      </p>
      <h2>Kontakt</h2>
      <p>
        E-Mail: <Placeholder value={site.contact.email} />
        {site.contact.phone && (
          <>
            <br />
            Telefon: {site.contact.phone}
          </>
        )}
      </p>
      <h2>Umsatzsteuer</h2>
      <p>
        <Placeholder value={c.vatId} />
      </p>
      <h2>Registereintrag</h2>
      <p>
        <Placeholder value={c.register} />
      </p>
      <h2>Weitere Pflichtangaben</h2>
      <Todo>Je nach Rechtsform und Tätigkeit ggf. weitere Angaben ergänzen (z. B. Aufsichtsbehörde, Berufsbezeichnung, Verantwortlicher für redaktionelle Inhalte, Hinweis zur Verbraucherstreitbeilegung).</Todo>
    </LegalPage>
  );
}
