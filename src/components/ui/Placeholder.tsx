import type { ReactNode } from "react";
import { isPlaceholder } from "@/config/site";

/**
 * Markiert offene Inhalte sichtbar, damit sie vor dem Livegang nicht
 * übersehen werden. Ist der Wert kein Platzhalter mehr, wird er normal angezeigt.
 */
export function Placeholder({ value, children }: { value?: string; children?: ReactNode }) {
  const content = children ?? value;
  if (value !== undefined && !isPlaceholder(value)) return <>{value}</>;
  return (
    <mark
      className="rounded-md border border-dashed border-warning/50 bg-warning/10 px-1.5 py-0.5 font-mono text-[0.85em] text-warning"
      title="Offener Inhalt – vor Veröffentlichung ersetzen"
    >
      {content}
    </mark>
  );
}

export function OpenContentNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-dashed border-warning/40 bg-warning/[0.06] p-4 text-sm leading-relaxed text-warning">
      <span aria-hidden className="mt-0.5 inline-block h-2 w-2 flex-none rounded-full bg-warning" />
      <div>{children}</div>
    </div>
  );
}
