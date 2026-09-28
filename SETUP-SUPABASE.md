# Diek Abriss – Supabase & STRATO Einrichtung

## 1. Supabase-Datenbank

1. Supabase Dashboard öffnen.
2. **SQL Editor** öffnen.
3. Inhalt von `supabase.sql` vollständig einfügen.
4. Ausführen.
5. Danach unter **Storage** prüfen, dass der private Bucket `diek-abriss-fotos` vorhanden ist.

Die Website verwendet eine UUID pro Anfrage. Fotos werden in einem Unterordner dieser UUID gespeichert. Besucher dürfen nur neue Anfragen anlegen; Lesen, Ändern und Löschen sind auf eingeloggte Benutzer beschränkt.

## 2. Internen Benutzer anlegen

Unter **Authentication → Users** einen Benutzer für den internen Bereich anlegen bzw. einladen.

Empfohlen:
- nur die tatsächlich benötigten Mitarbeiter anlegen
- ein starkes, eigenes Passwort verwenden
- **Allow new users to sign up** deaktivieren, wenn keine öffentliche Registrierung benötigt wird
- E-Mail-Bestätigung nach gewünschtem Sicherheitsniveau aktivieren

Supabase beschreibt das Deaktivieren öffentlicher Sign-ups und das Anlegen von Benutzern im Dashboard in der offiziellen Auth-Dokumentation.

## 3. API-Key

In `config.js` gehört ausschließlich der **Publishable Key** (`sb_publishable_...`) bzw. der alte `anon`-Key hinein.

Niemals in:
- `config.js`
- `script.js`
- HTML
- GitHub
- STRATO-Webspace

gehören:
- `sb_secret_...`
- `service_role`

Secret Keys umgehen RLS und gehören ausschließlich auf sichere Backend-/Server-Seite.

## 4. Kontaktformular

Das Formular:
- legt zuerst eine Anfrage mit UUID an
- akzeptiert maximal 5 Fotos
- maximal 5 MB je Foto
- erlaubt JPG, PNG und WebP
- maximal 20 MB insgesamt im Browser
- lädt Fotos nur in den Ordner der jeweiligen Anfrage
- macht Fotos nicht öffentlich
- speichert keine Kundendaten in `localStorage`

Zusätzlich ist ein unsichtbares Honeypot-Feld gegen einfache Bots eingebaut.

## 5. Interner Bereich

`anfragen.html` enthält:
- Login mit Supabase Auth
- Session-Prüfung
- Abmelden
- Suche
- Statusfilter
- Statusänderung
- Foto-Vorschau über zeitlich begrenzte Signed URLs
- Löschen einer Anfrage inklusive zugehöriger Fotos
- CSV-Export

## 6. STRATO

Die Dateien aus diesem Ordner können auf den STRATO-Webspace geladen werden.

Für die Domain `diek-abriss.de` sollte das Webroot auf den Ordner zeigen, in dem `index.html` liegt.

HTTPS/SSL in STRATO aktivieren, bevor die Seite öffentlich beworben wird.

## 7. Vor Veröffentlichung ersetzen

Noch vorhandene Platzhalter:
- Name/Inhaber im Impressum
- Anschrift
- Telefonnummer
- E-Mail-Adresse
- USt-ID, falls vorhanden
- Musterbewertungen
- Beispielbilder/Referenzen

Diese Angaben müssen vor dem Livegang mit den echten Unternehmensdaten ersetzt und rechtlich geprüft werden.

## 8. Sicherheitskontrolle vor Livegang

- [ ] SQL ausgeführt
- [ ] RLS aktiv
- [ ] Bucket privat
- [ ] kein Secret-/Service-Role-Key im Frontend
- [ ] öffentlicher Sign-up deaktiviert
- [ ] interner Benutzer angelegt
- [ ] Login getestet
- [ ] Testanfrage erstellt
- [ ] Testfoto hochgeladen
- [ ] Foto im Dashboard sichtbar
- [ ] Statusänderung getestet
- [ ] Löschen inkl. Foto getestet
- [ ] CSV-Export getestet
- [ ] HTTPS/SSL aktiv
- [ ] Impressum angepasst
- [ ] Datenschutz angepasst
