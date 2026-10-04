import { NextResponse } from "next/server";
import { checkoutSchema, encodeLines, resolveLines } from "@/lib/checkout";
import { paymentMode, siteUrl } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    const consentIssue = parsed.error.issues.some((i) => i.path[0] === "consent");
    return NextResponse.json(
      { error: consentIssue ? "Bitte bestätige AGB, Widerrufsbelehrung und den Beginn der Bereitstellung." : "Der Warenkorb ist ungültig." },
      { status: 400 },
    );
  }

  const lines = resolveLines(parsed.data.items);
  if (!Array.isArray(lines)) return NextResponse.json({ error: lines.error }, { status: 400 });

  const mode = paymentMode();
  const base = siteUrl(request);

  // Ohne Zahlungsanbieter: klar gekennzeichneter Testablauf, keine Zahlung, keine Freigabe
  if (mode === "test-flow") {
    return NextResponse.json({ url: `${base}/checkout/test?positionen=${encodeURIComponent(encodeLines(lines))}` });
  }

  if (mode === "live" && lines.some((l) => l.product.demo)) {
    return NextResponse.json({ error: "Demoprodukte können nicht kostenpflichtig bestellt werden." }, { status: 400 });
  }

  const stripe = getStripe()!;
  const user = await getCurrentUser().catch(() => null);
  const consentAt = new Date().toISOString();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "de",
      line_items: lines.map(({ product, qty }) => ({
        quantity: qty,
        price_data: {
          currency: "eur",
          unit_amount: product.price,
          product_data: {
            name: product.name,
            description: product.tagline,
            metadata: { slug: product.slug },
          },
        },
      })),
      customer_creation: "always",
      customer_email: user?.email ?? undefined,
      client_reference_id: user?.id,
      invoice_creation: { enabled: true },
      metadata: {
        cart: encodeLines(lines).slice(0, 500),
        consent_terms: "true",
        consent_waiver: "true",
        consent_at: consentAt,
      },
      success_url: `${base}/checkout/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/warenkorb?abgebrochen=1`,
    });
    if (!session.url) throw new Error("Keine Checkout-URL erhalten");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Stripe-Fehler:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Der Bezahlvorgang konnte nicht gestartet werden. Bitte versuche es später erneut." }, { status: 502 });
  }
}
