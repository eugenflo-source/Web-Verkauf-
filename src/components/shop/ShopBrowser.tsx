"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PackageOpen, Search, SlidersHorizontal, X } from "lucide-react";
import { categories, formats, getCategory, products, type CategoryId } from "@/data/products";
import { ProductCard } from "./ProductCard";

const priceRanges = [
  { id: "bis-25", label: "Bis 25 €", test: (p: number) => p <= 2500 },
  { id: "25-50", label: "25 – 50 €", test: (p: number) => p > 2500 && p <= 5000 },
  { id: "ab-50", label: "Über 50 €", test: (p: number) => p > 5000 },
] as const;

const sorts = [
  { id: "neu", label: "Neueste zuerst" },
  { id: "preis-auf", label: "Preis aufsteigend" },
  { id: "preis-ab", label: "Preis absteigend" },
  { id: "name", label: "Name A–Z" },
] as const;

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss");
}

export function ShopBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const category = (params.get("kategorie") ?? "") as CategoryId | "";
  const format = params.get("format") ?? "";
  const price = params.get("preis") ?? "";
  const sort = params.get("sortierung") ?? "neu";
  const urlQuery = params.get("suche") ?? "";

  // Suchfeld lokal führen, URL verzögert aktualisieren
  const [query, setQuery] = useState(urlQuery);
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    const qs = sp.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  useEffect(() => {
    if (query === urlQuery) return;
    const t = setTimeout(() => update({ suche: query.trim() }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (!filtersOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFiltersOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    const terms = q.split(/\s+/).filter(Boolean);
    const range = priceRanges.find((r) => r.id === price);
    const list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (format && p.format !== format) return false;
      if (range && !range.test(p.price)) return false;
      if (terms.length) {
        const hay = normalize([p.name, p.tagline, p.format, getCategory(p.category).label, ...p.highlights].join(" "));
        return terms.every((t) => hay.includes(t));
      }
      return true;
    });
    return list.sort((a, b) => {
      if (sort === "preis-auf") return a.price - b.price;
      if (sort === "preis-ab") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name, "de");
      return b.releasedAt.localeCompare(a.releasedAt);
    });
  }, [query, category, format, price, sort]);

  const activeFilters = [
    category && { key: "kategorie", label: getCategory(category as CategoryId)?.label },
    format && { key: "format", label: format },
    price && { key: "preis", label: priceRanges.find((r) => r.id === price)?.label },
  ].filter(Boolean) as { key: string; label: string }[];

  function resetAll() {
    setQuery("");
    startTransition(() => router.replace(pathname, { scroll: false }));
    searchRef.current?.focus();
  }

  const filterPanel = (
    <div className="space-y-8">
      <FilterGroup legend="Kategorie">
        <Radio name="kategorie" label="Alle Kategorien" checked={!category} onChange={() => update({ kategorie: "" })} count={products.length} />
        {categories.map((c) => (
          <Radio
            key={c.id}
            name="kategorie"
            label={c.label}
            checked={category === c.id}
            onChange={() => update({ kategorie: c.id })}
            count={products.filter((p) => p.category === c.id).length}
          />
        ))}
      </FilterGroup>
      <FilterGroup legend="Produkttyp">
        <Radio name="format" label="Alle Produkttypen" checked={!format} onChange={() => update({ format: "" })} />
        {formats.map((f) => (
          <Radio key={f} name="format" label={f} checked={format === f} onChange={() => update({ format: f })} />
        ))}
      </FilterGroup>
      <FilterGroup legend="Preis">
        <Radio name="preis" label="Alle Preise" checked={!price} onChange={() => update({ preis: "" })} />
        {priceRanges.map((r) => (
          <Radio key={r.id} name="preis" label={r.label} checked={price === r.id} onChange={() => update({ preis: r.id })} />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
      {/* Filter Desktop */}
      <aside className="hidden lg:block" aria-label="Filter">
        <div className="sticky top-28">{filterPanel}</div>
      </aside>

      <div className="min-w-0">
        {/* Suche & Sortierung */}
        <div className="glass sticky top-[4.75rem] z-30 -mx-1 flex flex-col gap-2 rounded-2xl p-2 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Produkte durchsuchen</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" aria-hidden />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Produkte durchsuchen, z. B. „Angebot“ oder „Notion“"
              className="input !min-h-11 !rounded-xl !border-transparent !bg-white/[0.04] !pl-10"
              autoComplete="off"
            />
          </label>
          <div className="flex gap-2">
            <button type="button" className="btn btn-secondary !min-h-11 !rounded-xl lg:hidden" onClick={() => setFiltersOpen(true)} aria-haspopup="dialog">
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Filter{activeFilters.length > 0 && <span className="rounded-full bg-accent px-1.5 text-xs text-ink-950">{activeFilters.length}</span>}
            </button>
            <label className="flex-1 sm:flex-none">
              <span className="sr-only">Sortierung</span>
              <select value={sort} onChange={(e) => update({ sortierung: e.target.value === "neu" ? "" : e.target.value })} className="input !min-h-11 !rounded-xl !border-transparent !bg-white/[0.04] !text-sm sm:w-48">
                {sorts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 flex min-h-8 flex-wrap items-center gap-2">
          <p className="mr-2 text-sm text-fg-muted" aria-live="polite" aria-atomic="true">
            {results.length} {results.length === 1 ? "Produkt" : "Produkte"}
          </p>
          {activeFilters.map((f) => (
            <button key={f.key} type="button" onClick={() => update({ [f.key]: "" })} className="chip chip-accent transition-opacity hover:opacity-80" aria-label={`Filter ${f.label} entfernen`}>
              {f.label} <X className="h-3 w-3" aria-hidden />
            </button>
          ))}
          {(activeFilters.length > 0 || query) && (
            <button type="button" onClick={resetAll} className="text-sm text-fg-subtle underline-offset-4 hover:text-fg hover:underline">
              Alles zurücksetzen
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <li key={p.slug} className="animate-fade-in">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="surface mt-6 flex flex-col items-center rounded-[1.5rem] px-6 py-20 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
              <PackageOpen className="h-6 w-6 text-fg-muted" aria-hidden />
            </span>
            <p className="mt-5 text-lg font-medium">Keine passenden Produkte gefunden</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">
              Versuche einen anderen Suchbegriff oder entferne einzelne Filter. Du suchst etwas Individuelles? Dann frag uns direkt an.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={resetAll} className="btn btn-secondary btn-sm">
                Filter zurücksetzen
              </button>
              <a href="/kontakt" className="btn btn-ghost btn-sm">
                Individuelle Lösung anfragen
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Filter Mobil */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[55] lg:hidden" role="dialog" aria-modal="true" aria-label="Filter">
          <div className="animate-fade-in absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} aria-hidden />
          <div className="glass-strong animate-fade-up absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-[1.75rem]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <p className="text-lg font-semibold">Filter</p>
              <button type="button" onClick={() => setFiltersOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/[0.06]" aria-label="Filter schließen" autoFocus>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-6">{filterPanel}</div>
            <div className="flex gap-2 border-t border-white/[0.08] p-4">
              <button type="button" onClick={resetAll} className="btn btn-ghost flex-1">
                Zurücksetzen
              </button>
              <button type="button" onClick={() => setFiltersOpen(false)} className="btn btn-primary flex-[2]">
                {results.length} {results.length === 1 ? "Produkt" : "Produkte"} anzeigen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-fg-subtle">{legend}</legend>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  );
}

function Radio({ name, label, checked, onChange, count }: { name: string; label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
        checked ? "bg-white/[0.07] text-fg" : "text-fg-muted hover:bg-white/[0.03] hover:text-fg"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
        <span aria-hidden className={`h-1.5 w-1.5 rounded-full transition-colors ${checked ? "bg-accent" : "bg-white/15"}`} />
        {label}
      </span>
      {count !== undefined && <span className="text-xs tabular-nums text-fg-subtle">{count}</span>}
    </label>
  );
}
