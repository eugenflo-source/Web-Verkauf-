"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({ value, max, onChange, label }: { value: number; max: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="flex items-center rounded-full border border-white/12 bg-white/[0.03]" role="group" aria-label={label}>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:text-fg disabled:opacity-30"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Anzahl verringern"
      >
        <Minus className="h-4 w-4" />
      </button>
      <output className="w-7 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:text-fg disabled:opacity-30"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Anzahl erhöhen"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
