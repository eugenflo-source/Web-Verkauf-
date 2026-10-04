"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { budgetOptions, inquiryServices, timeframeOptions } from "@/data/services";
import { fieldErrors, inquirySchema, type InquiryFieldErrors } from "@/lib/inquiry-schema";

type Props = {
  services?: readonly (typeof inquiryServices)[number][];
  defaultService?: (typeof inquiryServices)[number];
  source: string;
  responseNote?: string;
};

type Status = { type: "idle" } | { type: "sending" } | { type: "success"; stored: boolean } | { type: "error"; message: string };

const fieldOrder = ["name", "email", "company", "service", "website", "message", "budget", "timeframe"] as const;

export function InquiryForm({ services = inquiryServices, defaultService, source, responseNote }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<InquiryFieldErrors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [attempted, setAttempted] = useState(false);
  const [showMore, setShowMore] = useState(false);

  function readForm() {
    const fd = new FormData(formRef.current!);
    return Object.fromEntries(fieldOrder.map((k) => [k, String(fd.get(k) ?? "")]).concat([["source", source], ["fax", String(fd.get("fax") ?? "")]]));
  }

  /**
   * Nach dem ersten Absendeversuch: Fehler beim Tippen entfernen, sobald das Feld
   * gültig ist (verhindert Layoutsprünge beim Verlassen), und beim Verlassen setzen.
   */
  function validateField(name: string, mode: "change" | "blur" = "blur") {
    if (!attempted) return;
    const result = inquirySchema.safeParse(readForm());
    const message = result.success ? undefined : fieldErrors(result.error)[name as keyof InquiryFieldErrors];
    if (mode === "change" && message) return;
    setErrors((prev) => (prev[name as keyof InquiryFieldErrors] === message ? prev : { ...prev, [name]: message }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);
    const data = readForm();
    const result = inquirySchema.safeParse(data);
    if (!result.success) {
      const errs = fieldErrors(result.error);
      setErrors(errs);
      const first = fieldOrder.find((k) => errs[k]);
      if (first === "budget" || first === "timeframe" || first === "website") setShowMore(true);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
      return;
    }
    setErrors({});
    setStatus({ type: "sending" });
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => null)) as { ok: boolean; stored?: boolean; error?: string; fields?: InquiryFieldErrors } | null;
      if (!res.ok || !json?.ok) {
        if (json?.fields) setErrors(json.fields);
        setStatus({ type: "error", message: json?.error ?? "Die Anfrage konnte nicht gesendet werden. Bitte versuche es erneut." });
        return;
      }
      setStatus({ type: "success", stored: Boolean(json.stored) });
      formRef.current?.reset();
    } catch {
      setStatus({ type: "error", message: "Keine Verbindung. Bitte prüfe deine Internetverbindung und versuche es erneut." });
    }
  }

  if (status.type === "success") {
    return (
      <div className="animate-fade-up flex flex-col items-start rounded-[1.5rem] border border-success/25 bg-success/[0.05] p-7 md:p-9" role="status">
        <CircleCheck className="h-8 w-8 text-success" aria-hidden />
        <p className="mt-5 text-2xl font-semibold tracking-tight">Danke, deine Anfrage ist angekommen.</p>
        <p className="mt-2 max-w-md leading-relaxed text-fg-muted">{responseNote ?? "Du erhältst eine persönliche Rückmeldung per E-Mail."}</p>
        {!status.stored && (
          <p className="mt-5 rounded-xl border border-warning/30 bg-warning/[0.07] p-3.5 text-sm leading-relaxed text-warning">
            Testmodus: Die Eingaben wurden geprüft, aber nicht gespeichert, weil noch keine Datenbank verbunden ist.
          </p>
        )}
        <button type="button" className="btn btn-secondary mt-7" onClick={() => setStatus({ type: "idle" })}>
          Weitere Anfrage senden
        </button>
      </div>
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative space-y-5" aria-describedby={errorCount ? "form-errors" : undefined}>
      {attempted && errorCount > 0 && (
        <p id="form-errors" role="alert" className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/[0.06] p-3.5 text-sm text-danger">
          <CircleAlert className="h-4 w-4 flex-none" aria-hidden />
          {errorCount === 1 ? "Ein Feld braucht noch deine Aufmerksamkeit." : `${errorCount} Felder brauchen noch deine Aufmerksamkeit.`}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Name" error={errors.name}>
          <input id="f-name" name="name" type="text" autoComplete="name" className="input" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "f-name-err" : undefined} onChange={() => validateField("name", "change")} onBlur={() => validateField("name")} />
        </Field>
        <Field name="email" label="E-Mail" error={errors.email}>
          <input id="f-email" name="email" type="email" autoComplete="email" inputMode="email" className="input" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "f-email-err" : undefined} onChange={() => validateField("email", "change")} onBlur={() => validateField("email")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="service" label="Gewünschte Leistung" error={errors.service}>
          <select id="f-service" name="service" className="input" defaultValue={defaultService ?? ""} required aria-invalid={!!errors.service} aria-describedby={errors.service ? "f-service-err" : undefined} onChange={() => validateField("service")}>
            <option value="" disabled>
              Bitte wählen
            </option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field name="company" label="Unternehmen" optional error={errors.company}>
          <input id="f-company" name="company" type="text" autoComplete="organization" className="input" />
        </Field>
      </div>

      <Field name="message" label="Kurze Projektbeschreibung" error={errors.message} hint="Was möchtest du erreichen? Gibt es schon etwas, auf dem wir aufbauen?">
        <textarea id="f-message" name="message" rows={5} className="input" required aria-invalid={!!errors.message} aria-describedby={errors.message ? "f-message-err" : "f-message-hint"} onChange={() => validateField("message", "change")} onBlur={() => validateField("message")} />
      </Field>

      <div className="rounded-2xl border border-white/[0.07]">
        <button type="button" className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3.5 text-left text-sm" aria-expanded={showMore} aria-controls="f-more" onClick={() => setShowMore((v) => !v)}>
          <span>
            <span className="font-medium">Weitere Angaben</span> <span className="text-fg-subtle">– optional: Website, Budget, Zeitraum</span>
          </span>
          <ChevronDown className={`h-4 w-4 flex-none text-fg-muted transition-transform duration-300 ${showMore ? "rotate-180" : ""}`} aria-hidden />
        </button>
        <div id="f-more" hidden={!showMore} className="space-y-5 border-t border-white/[0.07] p-4">
          <Field name="website" label="Bestehende Website" optional error={errors.website}>
            <input id="f-website" name="website" type="text" inputMode="url" placeholder="beispiel.de" className="input" aria-invalid={!!errors.website} aria-describedby={errors.website ? "f-website-err" : undefined} onChange={() => validateField("website", "change")} onBlur={() => validateField("website")} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="budget" label="Budgetrahmen" optional>
              <select id="f-budget" name="budget" className="input" defaultValue="">
                <option value="">Keine Angabe</option>
                {budgetOptions.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field name="timeframe" label="Gewünschter Zeitraum" optional>
              <select id="f-timeframe" name="timeframe" className="input" defaultValue="">
                <option value="">Keine Angabe</option>
                {timeframeOptions.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      </div>

      {/* Honeypot gegen Spam – für Menschen unsichtbar */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Fax
          <input name="fax" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.type === "error" && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/[0.06] p-3.5 text-sm text-danger">
          <CircleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden />
          {status.message}
        </p>
      )}

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary btn-lg" disabled={status.type === "sending"}>
          {status.type === "sending" ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> Wird gesendet …
            </>
          ) : (
            <>
              Anfrage senden <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
        <p className="text-xs leading-relaxed text-fg-subtle">
          Unverbindlich und kostenlos. Hinweise zur Verarbeitung deiner Daten findest du in der{" "}
          <Link href="/datenschutz" className="underline underline-offset-2 hover:text-fg">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

function Field({ name, label, optional, error, hint, children }: { name: string; label: string; optional?: boolean; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`f-${name}`} className="field-label">
        {label} {optional ? <span className="font-normal text-fg-subtle">(optional)</span> : <span className="sr-only">(Pflichtfeld)</span>}
      </label>
      {children}
      {error ? (
        <p id={`f-${name}-err`} className="field-error animate-fade-in">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`f-${name}-hint`} className="field-hint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
