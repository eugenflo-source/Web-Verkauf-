# Diek Abriss – Website v3 (Redesign)

One-Page-Website für **Diek Abriss** (Abriss · Entrümpelung · Demontage · Entsorgung, Augsburg & Umgebung).
Statisches HTML/CSS/JS, kein Build-Schritt nötig. Einfach den gesamten Ordner auf den Webspace (STRATO) hochladen.

## Designprinzipien
- **Kraftvoll statt generisch:** kondensierte Display-Typo (Archivo Variable, `font-stretch` 62–72 %) + Mono-Labels (JetBrains Mono), scharfe Kanten, abgeschrägte Button-Ecke, Messraster, Film-Grain.
- **Farben:** Primärblau `#1747d6` (auf Dunkel `#4d78ff`), Anthrazit `#0c0e11`, warmes Papier-Grau `#f2f0eb`, Metall `#8a939e`. Tokens in `style.css` → Abschnitt 2.
- **Layout:** asymmetrische 5/7-Raster, sticky Spalten, Akkordeon-Index statt Card-Grids, schematische Einsatzkarte (maßstäblich in km um Augsburg).

## Dateien
| Datei | Zweck |
|---|---|
| `index.html` | Startseite inkl. Meta, Open Graph, Twitter Cards, JSON-LD (LocalBusiness, 4× Service, FAQPage, BreadcrumbList, WebSite/WebPage) |
| `style.css` | Komplettes Design (Mobile First, Dark Mode, Reduced Motion, Print) |
| `script.js` | Lenis Smooth Scroll, GSAP/ScrollTrigger, Intersection Observer, Rechner, Formular, Consent |
| `config.js` | **Supabase-Zugang + GA4/GTM-IDs** |
| `impressum.html`, `datenschutz.html`, `404.html` | Unterseiten im neuen Design |
| `anfragen.html` + `admin.css` | Interner Bereich aus dem aktuellen Stand (Aufträge + „Website-Funktionen“), Supabase lokal eingebunden |
| `robots.txt`, `sitemap.xml`, `manifest.webmanifest` | SEO / PWA |
| `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `assets/icons/*` | Favicons (16/32/48/180/192/512 + maskable) |
| `.htaccess` | HTTPS/non-www-Redirect, gzip, Caching, Security-Header, 404 |
| `assets/fonts`, `assets/vendor` | Selbst gehostete Schriften und Bibliotheken (GSAP 3, Lenis, Supabase JS) – keine Drittanbieter-CDNs |
| `supabase.sql`, `SETUP-SUPABASE.md` | Datenbank-Setup (wie bisher) |

## Vor dem Livegang – Checkliste
1. **Fotos ersetzen** (`assets/img/`). Jeder Platzhalter ist im Bild beschriftet; Dateinamen beibehalten, jeweils `.avif` + `.webp` + `.jpg` exportieren (z. B. mit squoosh.app):
   - `hero` 2000×1250 + `hero-m` 900×563 – Einsatzfoto, dunkel/kontrastreich
   - `leistung-abriss|entruempelung|demontage|entsorgung` 1200×900
   - `warum-diek` 1100×1400 (Hochformat, Inhaber/Team)
   - `og-image.jpg` 1200×630 (Social-Media-Vorschau; aktuelle Version kann bleiben)
2. **`supabase.sql` erneut ausführen** (legt `site_settings` an, falls noch nicht geschehen) und eine Testanfrage senden.
3. **Inhalte pflegen:** Hero-Texte, Kontaktdaten, Einsatzgebiet, FAQ und alle Preise werden im internen Bereich unter „Website-Funktionen“ geändert – die Seite übernimmt sie beim Laden automatisch (inkl. FAQ- und Kontakt-Daten im JSON-LD). Die Werte in `index.html` sind nur Standardwerte, falls Supabase nicht erreichbar ist.
4. **Hero-Kennzahlen** (4 / 21 / 0 € / 100 %) ggf. anpassen.
5. **Tracking (optional):** In `config.js` `ga4Id` und/oder `gtmId` eintragen → Consent-Banner erscheint automatisch, Google lädt erst nach Zustimmung (Consent Mode v2). Datenschutzerklärung Abschnitt 7 ergänzen.
6. **Search Console:** Verifizierungs-Meta-Tag im `<head>` von `index.html` einkommentieren und Code eintragen, danach `sitemap.xml` einreichen.
7. **Domain:** Alle absoluten URLs nutzen `https://diek-abriss.de/`. Bei www-Variante: `index.html`, `sitemap.xml`, `robots.txt`, `.htaccess` anpassen.
8. **Rechtstexte** rechtlich prüfen (USt-IdNr. o. Ä. ggf. im Impressum ergänzen).
9. Öffnungszeiten vorhanden? → im JSON-LD `openingHoursSpecification` ergänzen.

## Performance / Qualität (Lighthouse, lokal mit gzip gemessen)
| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Mobile | 97 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Werte mit den Platzhalterbildern gemessen; echte Fotos gut komprimieren (AVIF ≤ 150 KB für den Hero).

## Technik-Notizen
- Supabase-Bibliothek wird erst beim ersten Fokus ins Formular nachgeladen (spart ~200 KB beim Seitenaufruf). Die Datenstruktur für `contact_requests` ist unverändert.
- Website-Einstellungen (`site_settings`, key `site`) werden per schlankem REST-Aufruf geladen; nur geänderte Inhalte werden ersetzt (kein Flackern). Validierung/Grenzen wie bisher (max. 15 FAQ, 60 Orte, Preise 0–100.000 €).
- Der Preisrechner erkennt „Mit Entsorgung“ über den Schlüssel, nicht über den Betrag – funktioniert also auch bei 0 € Zuschlag.
- Einsatzkarte: Orte, die im internen Bereich entfernt werden, verschwinden auch von der Karte. Neue Orte erscheinen in der Liste; für einen Kartenpunkt im SVG in `index.html` eine Position (km relativ zu Augsburg) ergänzen.
- Max. 10 Fotos pro Anfrage. Ohne Supabase wird keine Anfrage gespeichert, sondern auf Telefon/WhatsApp verwiesen.
- `prefers-reduced-motion` schaltet Lenis, Parallax, Ticker, Pulse und Reveals ab.
- Preisrechner-Formel wie bisher: 400 € + Objekt + Aufwand + Entsorgung (+ Material), auf 10 € gerundet. „Anfrage senden“ übernimmt die Auswahl ins Formular.
