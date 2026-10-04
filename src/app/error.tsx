"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
      <p className="font-mono text-sm text-danger">Fehler</p>
      <h1 className="headline mt-4 text-4xl md:text-5xl">Da ist etwas schiefgelaufen.</h1>
      <p className="lead mx-auto mt-5 max-w-md">Bitte versuche es erneut. Wenn das Problem bleibt, melde dich gern bei uns.</p>
      <button type="button" onClick={reset} className="btn btn-primary mt-9">
        Erneut versuchen
      </button>
    </div>
  );
}
