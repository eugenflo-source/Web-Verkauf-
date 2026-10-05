import Link from "next/link";
import { site } from "@/config/site";

export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="lm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#6fdcff" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="29" height="29" rx="9" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" />
      <path d="M9 21.5 15.5 9l3.2 6.2" fill="none" stroke="url(#lm-g)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="21.5" cy="20.5" r="3" fill="#6fdcff" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5 rounded-lg" aria-label={`${site.name} – zur Startseite`}>
      <LogoMark className="h-7 w-7 transition-transform duration-500 group-hover:rotate-[8deg]" />
      <span className="text-[0.95rem] font-semibold tracking-tight">{site.shortName}</span>
    </Link>
  );
}
