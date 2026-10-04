"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CircleAlert, LoaderCircle, MailCheck } from "lucide-react";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const emailSchema = z.email();

/** Anmeldung ohne Passwort: Supabase sendet einen Link per E-Mail. */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ type: "idle" } | { type: "sending" } | { type: "sent" } | { type: "error"; message: string }>({ type: "idle" });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!emailSchema.safeParse(email.trim()).success) {
      setState({ type: "error", message: "Bitte gib eine gültige E-Mail-Adresse an." });
      return;
    }
    setState({ type: "sending" });
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/konto` },
    });
    if (error) {
      setState({ type: "error", message: error.status === 429 ? "Zu viele Versuche. Bitte warte einen Moment." : "Der Anmeldelink konnte nicht gesendet werden. Bitte versuche es erneut." });
      return;
    }
    setState({ type: "sent" });
  }

  if (state.type === "sent") {
    return (
      <div className="animate-fade-up" role="status">
        <MailCheck className="h-8 w-8 text-accent" aria-hidden />
        <p className="mt-4 text-xl font-semibold tracking-tight">Prüfe dein Postfach.</p>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Wir haben einen Anmeldelink an <span className="text-fg">{email}</span> gesendet. Der Link ist nur kurze Zeit gültig.
        </p>
        <button type="button" className="btn btn-ghost btn-sm mt-5 !px-0" onClick={() => setState({ type: "idle" })}>
          Andere E-Mail-Adresse verwenden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="login-email" className="field-label">
          E-Mail-Adresse
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state.type === "error"}
          aria-describedby="login-hint"
          required
        />
        <p id="login-hint" className="field-hint">
          Verwende die E-Mail-Adresse, mit der du bestellt hast.
        </p>
      </div>
      {state.type === "error" && (
        <p role="alert" className="flex items-center gap-2 text-sm text-danger">
          <CircleAlert className="h-4 w-4" aria-hidden /> {state.message}
        </p>
      )}
      <button type="submit" className="btn btn-primary w-full" disabled={state.type === "sending"}>
        {state.type === "sending" ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : null}
        Anmeldelink senden {state.type !== "sending" && <ArrowRight className="h-4 w-4" aria-hidden />}
      </button>
    </form>
  );
}
