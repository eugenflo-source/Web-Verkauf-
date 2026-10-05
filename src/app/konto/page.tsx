import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert, Download, FileText, LogOut, Package, Receipt, ShieldCheck, UserRound } from "lucide-react";
import { formatPrice, getProduct } from "@/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";
import { getOrdersForUser, type OrderRow } from "@/lib/orders";
import { LoginForm } from "@/components/account/LoginForm";

export const metadata: Metadata = { title: "Kundenbereich", robots: { index: false } };
export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  "anmeldung-erforderlich": "Bitte melde dich an, um deine Downloads abzurufen.",
  "download-nicht-freigegeben": "Für diesen Download liegt keine bestätigte Zahlung vor – oder der Link auf der Bestellbestätigung ist abgelaufen. Melde dich an, um deine Käufe zu sehen.",
  "download-nicht-eingerichtet": "Die Download-Bereitstellung ist noch nicht eingerichtet.",
  "download-unbekannt": "Dieses Produkt ist nicht als Download verfügbar.",
  "datei-fehlt": "Die Datei ist momentan nicht verfügbar. Bitte kontaktiere uns, wir helfen dir weiter.",
  "link-ungueltig": "Der Anmeldelink ist ungültig oder abgelaufen. Bitte fordere einen neuen an.",
};

const statusLabel: Record<OrderRow["status"], { label: string; className: string }> = {
  paid: { label: "Bezahlt", className: "text-success border-success/30 bg-success/10" },
  pending: { label: "Zahlung ausstehend", className: "text-warning border-warning/30 bg-warning/10" },
  failed: { label: "Zahlung fehlgeschlagen", className: "text-danger border-danger/30 bg-danger/10" },
  refunded: { label: "Erstattet", className: "text-fg-muted border-white/15 bg-white/5" },
};

export default async function AccountPage({ searchParams }: PageProps<"/konto">) {
  const { hinweis } = await searchParams;
  const notice = typeof hinweis === "string" ? notices[hinweis] : undefined;

  return (
    <div className="container-x pt-32 md:pt-40">
      <p className="eyebrow mb-4">Kundenbereich</p>
      <h1 className="headline text-4xl md:text-5xl">Deine Käufe &amp; Downloads</h1>
      {notice && (
        <p role="status" className="mt-6 flex max-w-2xl gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-fg-muted">
          <CircleAlert className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden /> {notice}
        </p>
      )}
      <div className="mt-10">{isSupabaseConfigured ? <AccountContent /> : <NotConfigured />}</div>
    </div>
  );
}

async function AccountContent() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="glass sheen rounded-[1.75rem] p-6 sm:p-9">
          <UserRound className="h-7 w-7 text-accent" aria-hidden />
          <h2 className="mt-5 text-2xl font-semibold tracking-tight">Anmelden</h2>
          <p className="mb-7 mt-2 text-sm leading-relaxed text-fg-muted">Ohne Passwort: Du erhältst einen sicheren Anmeldelink per E-Mail.</p>
          <LoginForm />
        </div>
        <Features />
      </div>
    );
  }

  const orders = await getOrdersForUser(user.id, user.email_confirmed_at ? user.email : undefined);

  return (
    <div className="space-y-8">
      <div className="surface flex flex-col justify-between gap-4 rounded-2xl p-5 sm:flex-row sm:items-center">
        <p className="text-sm text-fg-muted">
          Angemeldet als <span className="text-fg">{user.email}</span>
        </p>
        <form action="/auth/signout" method="post">
          <button type="submit" className="btn btn-secondary btn-sm">
            <LogOut className="h-4 w-4" aria-hidden /> Abmelden
          </button>
        </form>
      </div>

      {orders === null ? (
        <p className="rounded-xl border border-warning/30 bg-warning/[0.06] p-4 text-sm text-warning">
          Bestellungen können noch nicht geladen werden: Der serverseitige Datenbankzugang (Service-Schlüssel) ist nicht eingerichtet.
        </p>
      ) : orders.length === 0 ? (
        <div className="surface flex flex-col items-center rounded-[1.75rem] px-6 py-16 text-center">
          <Package className="h-8 w-8 text-fg-muted" aria-hidden />
          <p className="mt-5 text-xl font-semibold">Noch keine Käufe</p>
          <p className="mt-2 max-w-sm text-sm text-fg-muted">Käufe erscheinen hier, sobald die Zahlung bestätigt ist – sofern du mit dieser E-Mail-Adresse bestellt hast.</p>
          <Link href="/shop" className="btn btn-primary mt-7">
            Zum Shop
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="surface rounded-[1.5rem] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
                <div>
                  <p className="font-medium">Bestellung vom {new Date(order.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</p>
                  <p className="text-sm text-fg-subtle">
                    {formatPrice(order.amount_total)}
                    {!order.livemode && " · Testbestellung"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`chip ${statusLabel[order.status].className}`}>{statusLabel[order.status].label}</span>
                  {order.invoice_url && (
                    <a href={order.invoice_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                      <Receipt className="h-4 w-4" aria-hidden /> Rechnung
                    </a>
                  )}
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {order.order_items.map((item) => {
                  const product = getProduct(item.product_slug);
                  return (
                    <li key={item.product_slug} className="flex items-center justify-between gap-4">
                      <span className="min-w-0 truncate text-sm">
                        {item.quantity > 1 && `${item.quantity} × `}
                        {item.product_name}
                      </span>
                      {order.status === "paid" && product?.file ? (
                        <a href={`/api/download/${item.product_slug}`} className="btn btn-secondary btn-sm flex-none">
                          <Download className="h-4 w-4" aria-hidden /> Download
                        </a>
                      ) : (
                        <span className="text-xs text-fg-subtle">{order.status === "paid" ? "Datei folgt" : "Nicht freigegeben"}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Features() {
  const items = [
    { icon: Package, title: "Käufe", text: "Alle Bestellungen mit Status auf einen Blick." },
    { icon: Download, title: "Downloads", text: "Dateien jederzeit erneut herunterladen – freigegeben erst nach bestätigter Zahlung." },
    { icon: FileText, title: "Rechnungen", text: "Rechnungen zu jeder Bestellung abrufen." },
    { icon: ShieldCheck, title: "Geschützt", text: "Download-Links sind persönlich und nur kurz gültig." },
  ];
  return (
    <ul className="grid content-start gap-3 sm:grid-cols-2">
      {items.map((f) => (
        <li key={f.title} className="surface rounded-2xl p-5">
          <f.icon className="h-5 w-5 text-accent" aria-hidden />
          <p className="mt-3 font-medium">{f.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-fg-muted">{f.text}</p>
        </li>
      ))}
    </ul>
  );
}

function NotConfigured() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
      <div className="rounded-[1.75rem] border border-dashed border-warning/40 bg-warning/[0.04] p-6 sm:p-9">
        <span className="chip chip-demo">Entwicklungsstand</span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight">Der Kundenbereich ist vorbereitet, aber noch nicht aktiv.</h2>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          Für Anmeldung, Bestellhistorie und geschützte Downloads wird eine verbundene Datenbank mit Authentifizierung (Supabase) benötigt. Bis dahin ist keine Anmeldung möglich
          und es werden keine Käufe gespeichert.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-fg-muted">Die Einrichtungsschritte stehen in der README des Projekts.</p>
      </div>
      <Features />
    </div>
  );
}
