import type { ReactNode } from "react";
import { OpenContentNotice } from "./Placeholder";

export function LegalPage({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="container-x pt-36 md:pt-44">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow mb-5">Rechtliches</p>
        <h1 className="headline text-4xl md:text-5xl">{title}</h1>
        <div className="mt-8">
          <OpenContentNotice>
            <strong className="font-medium">Offener Inhalt:</strong> Diese Seite ist vorbereitet, enthält aber noch keine rechtsverbindlichen Texte. Bitte lass die Inhalte
            von einer fachkundigen Stelle erstellen oder prüfen (z. B. Rechtsanwalt oder geprüfter Rechtstext-Dienst) und ersetze die markierten Abschnitte.
            {intro && <span className="mt-2 block">{intro}</span>}
          </OpenContentNotice>
        </div>
        <div className="prose-site mt-10">{children}</div>
      </div>
    </div>
  );
}

export function Todo({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-warning/40 bg-warning/[0.05] px-4 py-3 font-mono text-sm text-warning">[OFFEN] {children}</p>
  );
}
