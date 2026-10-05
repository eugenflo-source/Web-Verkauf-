/* ==========================================================================
   DIEK ABRISS – Konfiguration
   ========================================================================== */
window.DIEK_CONFIG = {
  // Supabase (Anfragen + Foto-Upload). Der Publishable/Anon Key darf im Browser
  // verwendet werden, wenn RLS korrekt konfiguriert ist (siehe supabase.sql).
  supabaseUrl: 'https://serufdhqlhbpcldnyntk.supabase.co',
  supabaseAnonKey: 'sb_publishable_tQU5E-0ZDyfY4yBzcew9pw_5fBtI0W1',

  // TRACKING-IDs HIER EINTRAGEN (leer lassen = kein Tracking, kein Cookie-Banner).
  // Sobald eine ID gesetzt ist, erscheint automatisch ein Consent-Banner;
  // Google-Skripte laden erst nach Zustimmung (Consent Mode v2).
  // Datenschutzerklärung vorher um Google Analytics/GTM ergänzen!
  ga4Id: '',   // z. B. 'G-XXXXXXXXXX'
  gtmId: ''    // z. B. 'GTM-XXXXXXX'
};
