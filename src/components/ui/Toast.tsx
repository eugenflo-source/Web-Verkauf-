"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CircleCheck, X } from "lucide-react";

type Toast = { id: number; title: string; description?: string; action?: { href: string; label: string } };

const ToastContext = createContext<(t: Omit<Toast, "id">) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const show = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++counter.current;
      setToasts((list) => [...list.slice(-2), { ...t, id }]);
      timers.current.set(id, setTimeout(() => dismiss(id), 4200));
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="glass-strong animate-fade-up pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl p-4"
          >
            <CircleCheck className="mt-0.5 h-5 w-5 flex-none text-accent" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{t.title}</p>
              {t.description && <p className="mt-0.5 truncate text-sm text-fg-muted">{t.description}</p>}
              {t.action && (
                <Link href={t.action.href} className="mt-2 inline-block text-sm font-medium text-accent hover:underline" onClick={() => dismiss(t.id)}>
                  {t.action.label}
                </Link>
              )}
            </div>
            <button type="button" onClick={() => dismiss(t.id)} className="-m-1 rounded-full p-1 text-fg-subtle hover:text-fg" aria-label="Hinweis schließen">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
