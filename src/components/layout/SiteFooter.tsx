import Link from "next/link";
import { footerNav, site } from "@/config/site";
import { Placeholder } from "@/components/ui/Placeholder";
import { paymentMode } from "@/lib/env";
import { LogoMark } from "./Logo";

export function SiteFooter() {
  const mode = paymentMode();
  return (
    <footer className="relative mt-24 border-t border-white/[0.07] bg-ink-900">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-semibold tracking-tight">{site.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
            Fertige digitale Produkte und individuell entwickelte Websites, KI-Agenten und Automatisierungen.
          </p>
          <div className="mt-6 space-y-1.5 text-sm">
            <p className="text-fg-subtle">Kontakt</p>
            <p>
              <Placeholder value={site.contact.email} />
            </p>
            {site.contact.phone && <p>{site.contact.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7 md:col-start-6">
          <FooterColumn title="Angebot" links={footerNav.angebot} />
          <FooterColumn title="Marke" links={footerNav.marke} />
          <FooterColumn title="Rechtliches" links={footerNav.rechtliches} />
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Alle Rechte vorbehalten.
          </p>
          <p className="flex items-center gap-2">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${mode === "live" ? "bg-success" : "bg-warning"}`}
              aria-hidden
            />
            {mode === "live"
              ? "Zahlungen über Stripe aktiv"
              : mode === "stripe-test"
                ? "Stripe-Testmodus – keine echten Zahlungen"
                : "Entwicklungsstand – Shop im Testablauf, keine echten Zahlungen"}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="text-sm font-medium">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
