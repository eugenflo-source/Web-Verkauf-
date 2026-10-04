import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripeWebhookSecret } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { setOrderStatusByPaymentIntent, syncOrderFromSession } from "@/lib/orders";

/**
 * Stripe-Webhook: einzige Stelle, an der Zahlungen als bestätigt gespeichert werden.
 * Erst danach werden Downloads freigegeben.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = stripeWebhookSecret();
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook nicht konfiguriert." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", secret);
  } catch (err) {
    console.warn("[webhook] Ungültige Signatur:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Ungültige Signatur." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await syncOrderFromSession(event.data.object.id);
        break;
      case "checkout.session.async_payment_failed":
        await syncOrderFromSession(event.data.object.id, "failed");
        break;
      case "charge.refunded": {
        const charge = event.data.object;
        const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        if (pi && charge.refunded) await setOrderStatusByPaymentIntent(pi, "refunded");
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[webhook] Verarbeitung fehlgeschlagen:", err instanceof Error ? err.message : err);
    // 500 → Stripe wiederholt die Zustellung automatisch
    return NextResponse.json({ error: "Verarbeitung fehlgeschlagen." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
