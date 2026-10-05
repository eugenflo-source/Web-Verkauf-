import { z } from "zod";
import { budgetOptions, inquiryServices, timeframeOptions } from "@/data/services";

/** Gemeinsame Validierung für Browser und Server. */
export const inquirySchema = z.object({
  name: z.string().trim().min(2, { error: "Bitte gib deinen Namen an." }).max(120, { error: "Der Name ist zu lang." }),
  email: z.email({ error: "Bitte gib eine gültige E-Mail-Adresse an." }).max(200),
  company: z.string().trim().max(160).optional().default(""),
  service: z.enum(inquiryServices, { error: "Bitte wähle eine Leistung aus." }),
  website: z
    .string()
    .trim()
    .max(300)
    .optional()
    .default("")
    .refine((v) => !v || /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(v), { error: "Bitte gib eine gültige Adresse an, z. B. beispiel.de." }),
  message: z
    .string()
    .trim()
    .min(20, { error: "Beschreibe dein Vorhaben bitte in mindestens 20 Zeichen." })
    .max(4000, { error: "Bitte fasse dich etwas kürzer (max. 4.000 Zeichen)." }),
  budget: z.union([z.enum(budgetOptions), z.literal("")]).optional().default(""),
  timeframe: z.union([z.enum(timeframeOptions), z.literal("")]).optional().default(""),
  source: z.string().max(60).optional().default(""),
  /** Honeypot – muss leer bleiben. */
  fax: z.string().max(0).optional().default(""),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryFieldErrors = Partial<Record<keyof InquiryInput, string>>;

export function fieldErrors(error: z.ZodError): InquiryFieldErrors {
  const out: InquiryFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof InquiryInput;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
