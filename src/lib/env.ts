import "server-only";

/**
 * Feature-Flags aus Umgebungsvariablen. Geheime Schlüssel werden nur hier
 * (serverseitig) gelesen und nie an den Browser übergeben.
 */

export function stripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY?.trim() || null;
}

export function stripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() || null;
}

/**
 * - "test-flow":   kein Stripe-Schlüssel → simulierter Testablauf, keine Zahlung
 * - "stripe-test": Stripe-Testschlüssel (sk_test_…) → echte Stripe-Abläufe ohne echtes Geld
 * - "live":        Live-Schlüssel → echte Zahlungen
 */
export type PaymentMode = "test-flow" | "stripe-test" | "live";

export function paymentMode(): PaymentMode {
  const key = stripeSecretKey();
  if (!key) return "test-flow";
  return key.startsWith("sk_live_") || key.startsWith("rk_live_") ? "live" : "stripe-test";
}

export function supabaseSecretKey() {
  return (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim() || null;
}

export function isSupabaseAdminConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && supabaseSecretKey());
}

/** Basis-URL für Weiterleitungen. Ohne Konfiguration wird der Origin der Anfrage verwendet. */
export function siteUrl(request?: Request) {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (request ? new URL(request.url).origin : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return url.replace(/\/$/, "");
}
