"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AiUseCase } from "@/data/services";

/** Tabs für KI-Anwendungsfälle (Pfeiltasten-Navigation nach WAI-ARIA). */
export function UseCaseExplorer({ items }: { items: AiUseCase[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = items[active];

  function onKeyDown(e: KeyboardEvent) {
    const last = items.length - 1;
    let next = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-10">
      <div
        role="tablist"
        aria-label="Anwendungsfälle"
        aria-orientation="vertical"
        className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${baseId}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group relative min-w-[15rem] snap-start rounded-2xl border p-4 text-left transition-all duration-300 lg:min-w-0 lg:p-5 ${
                selected ? "glass sheen border-white/15" : "border-white/[0.06] bg-transparent hover:border-white/12 hover:bg-white/[0.02]"
              }`}
            >
              <span className={`text-xs tabular-nums ${selected ? "text-accent" : "text-fg-subtle"}`}>0{i + 1}</span>
              <span className="mt-1 block font-medium">{item.title}</span>
              <span className={`mt-1 block text-sm leading-relaxed ${selected ? "text-fg-muted" : "text-fg-subtle"}`}>{item.short}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        tabIndex={0}
        className="surface overflow-hidden rounded-[1.5rem]"
      >
        <div key={current.id} className="animate-fade-up grid gap-8 p-6 md:grid-cols-2 md:p-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-subtle">Ausgangsproblem</p>
            <p className="mt-2 leading-relaxed">{current.problem}</p>
            <p className="mt-7 text-xs font-medium uppercase tracking-[0.14em] text-fg-subtle">Was die Lösung übernimmt</p>
            <ul className="mt-3 space-y-2.5">
              {current.solution.map((s) => (
                <li key={s} className="flex gap-3 text-sm leading-relaxed text-fg-muted">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-subtle">Beispielhafter Ablauf</p>
            <ol className="relative mt-4 space-y-3">
              {current.flow.map((step, i) => (
                <li key={step} className="relative flex items-center gap-3">
                  <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border text-xs tabular-nums ${i === current.flow.length - 1 ? "border-accent/50 bg-accent/10 text-accent" : "border-white/12 text-fg-muted"}`}>
                    {i + 1}
                  </span>
                  <span className="text-sm">{step}</span>
                  {i < current.flow.length - 1 && <span aria-hidden className="absolute left-4 top-8 h-3 w-px bg-white/12" />}
                </li>
              ))}
            </ol>
            <div className="mt-7 rounded-2xl border border-accent/15 bg-accent/[0.05] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">Möglicher Nutzen</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{current.benefit}</p>
            </div>
            <Link href={`/ki-automatisierung#${current.id}`} className="link-arrow mt-6 text-sm">
              Details zu diesem Anwendungsfall <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
