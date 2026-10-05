import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Einheitlicher Seitenkopf für Unterseiten. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-14 md:pt-44 md:pb-20">
      <div aria-hidden className="bg-atmosphere absolute inset-0 -z-10" />
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-60" />
      <div className="container-x">
        <Reveal className="max-w-3xl">
          {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
          <h1 className="headline text-[2.6rem] sm:text-6xl md:text-7xl">{title}</h1>
          {lead && <p className="lead mt-6 max-w-2xl">{lead}</p>}
          {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
