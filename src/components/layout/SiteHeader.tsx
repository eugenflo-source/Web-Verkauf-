"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, ShoppingBag, User, X } from "lucide-react";
import { mainNav } from "@/config/site";
import { useCartCount } from "@/lib/cart-store";
import { Logo } from "./Logo";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const count = useCartCount();
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Warenkorb-Symbol reagiert kurz, wenn etwas hinzugefügt wurde
  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 450);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  // Menü bei Seitenwechsel schließen
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const button = menuButton.current;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const focusables = panel.current.querySelectorAll<HTMLElement>("a,button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  return (
    <>
      <a href="#inhalt" className="sr-only z-[70] rounded-full bg-fg px-4 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Zum Inhalt springen
      </a>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
        <div
          className={`mx-auto flex h-14 max-w-[78rem] items-center gap-3 rounded-2xl px-3 transition-all duration-500 sm:px-4 ${
            scrolled || open ? "glass-strong" : "border border-transparent"
          }`}
        >
          <Logo />

          <nav aria-label="Hauptnavigation" className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                        active ? "bg-white/[0.08] text-fg" : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <Link
              href="/konto"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-white/[0.06] hover:text-fg sm:inline-flex"
              aria-label="Kundenbereich"
            >
              <User className="h-[1.15rem] w-[1.15rem]" />
            </Link>
            <Link
              href="/warenkorb"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
              aria-label={count > 0 ? `Warenkorb, ${count} ${count === 1 ? "Artikel" : "Artikel"}` : "Warenkorb, leer"}
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
              {count > 0 && (
                <span
                  className={`absolute right-0.5 top-0.5 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-accent px-1 text-[0.65rem] font-semibold text-ink-950 ${bump ? "animate-pop" : ""}`}
                >
                  {count}
                </span>
              )}
            </Link>
            <Link href="/kontakt" className="btn btn-primary btn-sm ml-2 hidden md:inline-flex">
              Projekt anfragen
            </Link>
            <button
              ref={menuButton}
              type="button"
              className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-fg transition-colors hover:bg-white/[0.06] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Menü schließen" : "Menü öffnen"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
            className="glass-strong animate-fade-in mx-auto mt-2 max-h-[calc(100dvh-5.5rem)] max-w-[78rem] overflow-y-auto rounded-2xl p-3 lg:hidden"
          >
            <nav aria-label="Mobile Navigation">
              <ul>
                {[{ href: "/", label: "Start" }, ...mainNav, { href: "/konto", label: "Kundenbereich" }].map((item, i) => {
                  const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
                  return (
                    <li key={item.href} className="animate-fade-up" style={{ animationDelay: `${i * 35}ms` }}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-medium tracking-tight transition-colors ${
                          active ? "bg-white/[0.07] text-fg" : "text-fg-muted hover:bg-white/[0.04] hover:text-fg"
                        }`}
                      >
                        {item.label}
                        <ArrowRight className="h-4 w-4 opacity-40" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.08] pt-3">
              <Link href="/shop" className="btn btn-secondary">
                Produkte entdecken
              </Link>
              <Link href="/kontakt" className="btn btn-primary">
                Projekt anfragen
              </Link>
            </div>
          </div>
        )}
      </header>
      {open && <div className="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm lg:hidden" aria-hidden onClick={() => setOpen(false)} />}
    </>
  );
}
