import type { ReactNode } from "react";

/**
 * Rahmen für Interface-Mockups. Alle Maße in `em`, damit sich Mockups über
 * `.mock` / `.mock-canvas` (Container-Einheiten) proportional skalieren.
 */

export function BrowserFrame({ url, children, className = "" }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-[0.9em] border border-white/10 bg-ink-900 shadow-[0_2em_5em_-1.5em_rgba(0,0,0,0.8)] ${className}`}>
      <div className="flex flex-none items-center gap-[0.6em] border-b border-white/[0.07] bg-white/[0.03] px-[0.9em] py-[0.6em]">
        <span className="flex gap-[0.35em]">
          <i className="block h-[0.6em] w-[0.6em] rounded-full bg-white/15" />
          <i className="block h-[0.6em] w-[0.6em] rounded-full bg-white/15" />
          <i className="block h-[0.6em] w-[0.6em] rounded-full bg-white/15" />
        </span>
        <span className="mx-auto flex h-[1.6em] w-[55%] items-center justify-center gap-[0.4em] rounded-[0.5em] bg-white/[0.05] text-[0.8em] text-fg-subtle">
          <svg viewBox="0 0 10 12" className="h-[0.8em] w-[0.8em]" aria-hidden>
            <rect x="1" y="5" width="8" height="6.5" rx="1.5" fill="currentColor" />
            <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" fill="none" strokeWidth="1.2" />
          </svg>
          {url}
        </span>
        <span className="w-[2.3em]" />
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

export function AppFrame({ title, children, className = "", right }: { title: string; children: ReactNode; className?: string; right?: ReactNode }) {
  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-[0.9em] border border-white/10 bg-ink-900 shadow-[0_2em_5em_-1.5em_rgba(0,0,0,0.8)] ${className}`}>
      <div className="flex flex-none items-center gap-[0.6em] border-b border-white/[0.07] bg-white/[0.03] px-[0.9em] py-[0.6em]">
        <span className="flex gap-[0.35em]">
          <i className="block h-[0.6em] w-[0.6em] rounded-full bg-white/15" />
          <i className="block h-[0.6em] w-[0.6em] rounded-full bg-white/15" />
          <i className="block h-[0.6em] w-[0.6em] rounded-full bg-white/15" />
        </span>
        <span className="text-[0.85em] font-medium text-fg-muted">{title}</span>
        <span className="ml-auto">{right}</span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

/** Graue Textzeile als Platzhalter für Fließtext im Mockup. */
export function Line({ w = "100%", className = "" }: { w?: string; className?: string }) {
  return <span className={`block h-[0.45em] rounded-full bg-white/10 ${className}`} style={{ width: w }} />;
}
