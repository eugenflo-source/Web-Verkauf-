import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="headline mt-4 text-4xl md:text-6xl">Diese Seite gibt es nicht.</h1>
      <p className="lead mx-auto mt-5 max-w-md">Vielleicht wurde sie verschoben. Über den Shop oder die Startseite findest du weiter.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Zur Startseite
        </Link>
        <Link href="/shop" className="btn btn-secondary">
          Zum Shop
        </Link>
      </div>
    </div>
  );
}
