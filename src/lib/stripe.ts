import "server-only";
import Stripe from "stripe";
import { stripeSecretKey } from "./env";

let client: Stripe | null = null;

/** Stripe-Client oder `null`, wenn kein Schlüssel hinterlegt ist. */
export function getStripe() {
  const key = stripeSecretKey();
  if (!key) return null;
  client ??= new Stripe(key, { appInfo: { name: "web-verkauf" } });
  return client;
}
