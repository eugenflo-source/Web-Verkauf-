import { Plus } from "lucide-react";
import type { Faq } from "@/data/services";

/** Akkordeon auf Basis von <details> – funktioniert ohne JavaScript und mit Tastatur. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
      {items.map((item) => (
        <details key={item.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-5 text-left text-base font-medium md:text-lg [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/10 transition-transform duration-300 group-open:rotate-45">
              <Plus className="h-4 w-4" aria-hidden />
            </span>
          </summary>
          <p className="max-w-3xl pb-6 pr-12 leading-relaxed text-fg-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
