import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({ eyebrow, title, lead, align = "left", as: H = "h2", className = "" }: Props) {
  const centered = align === "center";
  return (
    <Reveal className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <H className={`headline ${H === "h1" ? "text-4xl sm:text-5xl md:text-6xl" : "text-3xl sm:text-4xl md:text-5xl"}`}>{title}</H>
      {lead && <p className={`lead mt-5 ${centered ? "mx-auto" : ""} max-w-2xl`}>{lead}</p>}
    </Reveal>
  );
}
