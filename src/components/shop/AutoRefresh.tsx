"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

/** Lädt die Seite in Abständen neu, bis der Webhook die Zahlung gespeichert hat. */
export function AutoRefresh({ intervalMs = 3000, maxTries = 10 }: { intervalMs?: number; maxTries?: number }) {
  const router = useRouter();
  const [tries, setTries] = useState(0);
  useEffect(() => {
    if (tries >= maxTries) return;
    const t = setTimeout(() => {
      router.refresh();
      setTries((n) => n + 1);
    }, intervalMs);
    return () => clearTimeout(t);
  }, [tries, maxTries, intervalMs, router]);

  if (tries >= maxTries) {
    return <p className="text-sm text-fg-muted">Das dauert länger als üblich. Du erhältst die Downloads auch im Kundenbereich, sobald die Zahlung bestätigt ist.</p>;
  }
  return (
    <p className="flex items-center gap-2 text-sm text-fg-muted" role="status">
      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> Zahlungsbestätigung wird abgerufen …
    </p>
  );
}
