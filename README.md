# [MARKENNAME] – Website & Shop für digitale Produkte

Website mit Shop für eigene digitale Produkte und Angebotsseiten für individuelle Websites, KI-Agenten und Automatisierungen.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · Supabase (Datenbank, Auth, Storage) · Stripe Checkout · Vercel

---

## Lokal starten

```bash
npm install
cp .env.example .env.local   # Werte nach Bedarf eintragen – leer funktioniert auch
npm run dev                   # http://localhost:3000
```

Ohne Umgebungsvariablen läuft die Seite vollständig im **Entwicklungsstand**:

| Bereich | Ohne Konfiguration | Mit Konfiguration |
| --- | --- | --- |
| Shop, Suche, Filter, Warenkorb | funktioniert | funktioniert |
| Kasse | Testablauf – deutlich als „keine Zahlung“ gekennzeichnet | Stripe Checkout |
| Anfrageformulare | Validierung + Hinweis „nicht gespeichert“ | Speicherung in Supabase (`inquiries`) |
| Kundenbereich | als Entwicklungsstand gekennzeichnet | Anmeldung per E-Mail-Link, Käufe, Downloads, Rechnungen |
| Downloads | gesperrt | erst nach per Webhook bestätigter Zahlung, signierte Links (60 s) |

## Wo wird was gepflegt?

| Was | Datei |
| --- | --- |
| Markenname, Kontakt, Firmendaten, Steuerhinweis | `src/config/site.ts` |
| Produkte, Kategorien, Preise (in Cent) | `src/data/products.ts` |
| Leistungen, KI-Anwendungsfälle, Ablauf, FAQ | `src/data/services.ts` |
| Farben, Glas-Stil, Buttons, Formulare | `src/app/globals.css` |
| Produktvorschauen (Interface-Mockups) | `src/components/mockups/` |

Werte in eckigen Klammern (z. B. `[MARKENNAME]`) sind Platzhalter. Sie werden auf der Website gelb gestrichelt markiert, solange sie nicht ersetzt sind.

## Supabase einrichten

1. Projekt auf supabase.com anlegen.
2. **SQL Editor** → Inhalt von `supabase/schema.sql` ausführen (Tabellen, Row Level Security, privater Bucket `product-files`).
3. **Project Settings → API**: URL, Anon/Publishable Key und Service-Role/Secret Key in die Umgebungsvariablen eintragen.
4. **Authentication → URL Configuration**: Site URL auf deine Domain setzen und `https://DEINE-DOMAIN/auth/callback` (und lokal `http://localhost:3000/auth/callback`) als Redirect-URL erlauben.
5. Optional: unter **Authentication → Emails** eigenen SMTP-Versand einrichten und die Vorlage „Magic Link“ auf Deutsch anpassen.
6. **Storage → product-files**: Produktdateien hochladen. Der Pfad muss dem Feld `file` in `src/data/products.ts` entsprechen (z. B. `angebotsrechner/angebotsrechner-v1.zip`).

Anfragen findest du anschließend in der Tabelle `inquiries`. Für E-Mail-Benachrichtigungen bei neuen Anfragen eignet sich ein Supabase Database Webhook oder eine Automatisierung (z. B. n8n/Make).

## Stripe einrichten

1. Im Stripe-Dashboard zunächst den **Testmodus** verwenden und `STRIPE_SECRET_KEY=sk_test_…` setzen.
2. **Developers → Webhooks** → Endpoint `https://DEINE-DOMAIN/api/stripe/webhook` mit den Events:
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `charge.refunded`.
   Das Signing Secret als `STRIPE_WEBHOOK_SECRET` eintragen.
   Lokal: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
3. Testkauf mit Karte `4242 4242 4242 4242` durchführen → Bestellung erscheint in `orders`, Download auf der Bestätigungsseite und im Kundenbereich.
4. Für den Livegang: Live-Schlüssel eintragen, Rechnungseinstellungen (Firmendaten, Steuern) in Stripe pflegen.

**Sicherheitsprinzipien**

- Preise werden ausschließlich serverseitig aus `src/data/products.ts` berechnet.
- Downloads werden nur freigegeben, wenn der Stripe-Webhook (signaturgeprüft) die Bestellung als bezahlt gespeichert hat.
- Demoprodukte (`demo: true`) lassen sich mit Live-Schlüsseln nicht kaufen.
- Geheime Schlüssel werden nur in `src/lib/env.ts` bzw. serverseitigen Modulen (`server-only`) gelesen.
- Ohne Stripe-Schlüssel gibt es nur den gekennzeichneten Testablauf; mit Schlüssel ist er deaktiviert.

## Deployment auf Vercel

1. Repository bei Vercel importieren (Framework wird automatisch erkannt).
2. Umgebungsvariablen aus `.env.example` eintragen.
3. Nach dem ersten Deployment `NEXT_PUBLIC_SITE_URL` auf die finale Domain setzen und Stripe-Webhook sowie Supabase-Redirect-URL darauf anpassen.
4. `NEXT_PUBLIC_ALLOW_INDEXING=true` erst setzen, wenn alle Platzhalter und Rechtstexte ersetzt sind (bis dahin `noindex`).

## Vor dem Livegang ersetzen

- [ ] Markenname, Logo-Wortmarke, Kontaktdaten (`src/config/site.ts`)
- [ ] Impressum, Datenschutz, AGB, Widerrufsbelehrung (rechtlich geprüft)
- [ ] Steuerhinweis zu Preisen
- [ ] Demoprodukte durch echte Produkte ersetzen (`demo: false`), Dateien hochladen
- [ ] „Über die Marke“: persönliche Geschichte und Foto
- [ ] Zustimmungstext zum Erlöschen des Widerrufsrechts im Warenkorb rechtlich prüfen lassen

## Befehle

```bash
npm run dev     # Entwicklung
npm run build   # Produktions-Build
npm run start   # Produktions-Server
npm run lint    # ESLint
```
