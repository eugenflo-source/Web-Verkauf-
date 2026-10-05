export default function Loading() {
  return (
    <div className="container-x pt-40" aria-busy="true" aria-label="Seite wird geladen">
      <div className="skeleton h-4 w-24 rounded-full" />
      <div className="skeleton mt-6 h-14 w-full max-w-2xl rounded-2xl" />
      <div className="skeleton mt-4 h-5 w-full max-w-xl rounded-full" />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="skeleton aspect-[4/5] rounded-[1.25rem]" />
        ))}
      </div>
    </div>
  );
}
