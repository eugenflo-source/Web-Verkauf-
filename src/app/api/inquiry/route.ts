import { NextResponse } from "next/server";
import { fieldErrors, inquirySchema } from "@/lib/inquiry-schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Einfache Drosselung pro Instanz. Für hohe Last durch einen zentralen Dienst ersetzen.
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  recent.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    // Honeypot ausgefüllt → still „erfolgreich“ antworten, nichts speichern
    if (parsed.error.issues.some((i) => i.path[0] === "fax")) {
      return NextResponse.json({ ok: true, stored: false });
    }
    return NextResponse.json({ ok: false, error: "Bitte prüfe deine Angaben.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unbekannt";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Zu viele Anfragen in kurzer Zeit. Bitte versuche es später erneut." }, { status: 429 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    // Entwicklungsstand: keine Datenbank verbunden – ehrlich zurückmelden
    return NextResponse.json({ ok: true, stored: false });
  }

  const { fax: _honeypot, ...data } = parsed.data;
  void _honeypot;
  const { error } = await supabase.from("inquiries").insert({
    name: data.name,
    email: data.email,
    company: data.company || null,
    service: data.service,
    website: data.website || null,
    message: data.message,
    budget: data.budget || null,
    timeframe: data.timeframe || null,
    source: data.source || null,
  });

  if (error) {
    console.error("[inquiry] Speichern fehlgeschlagen:", error.message);
    return NextResponse.json({ ok: false, error: "Deine Anfrage konnte gerade nicht gespeichert werden. Bitte versuche es erneut oder schreib uns per E-Mail." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stored: true });
}
