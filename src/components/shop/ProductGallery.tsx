"use client";

import { useState } from "react";
import type { VisualKind } from "@/data/products";
import { ProductVisual } from "@/components/mockups/ProductVisual";

export function ProductGallery({ kind, name }: { kind: VisualKind; name: string }) {
  const views = [
    { id: "detail" as const, label: "Gesamtansicht" },
    { id: "zoom" as const, label: "Detail" },
    ...(kind === "website" || kind === "landing" ? [{ id: "mobile" as const, label: "Smartphone" }] : []),
  ];
  const [active, setActive] = useState(0);
  const view = views[active];

  return (
    <div>
      <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.08]">
        <div key={view.id} className="animate-fade-in">
          <ProductVisual kind={kind} mode={view.id} label={`${name} – ${view.label}`} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3" role="group" aria-label="Ansicht wählen">
        {views.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`group overflow-hidden rounded-xl border text-left transition-all ${i === active ? "border-accent/60" : "border-white/[0.08] opacity-70 hover:opacity-100"}`}
          >
            <span className="pointer-events-none block" aria-hidden>
              <ProductVisual kind={kind} mode={v.id} label="" />
            </span>
            <span className="block px-3 py-2 text-xs text-fg-muted">{v.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-fg-subtle">Vorschauen sind schematische Darstellungen der Vorlage.</p>
    </div>
  );
}
