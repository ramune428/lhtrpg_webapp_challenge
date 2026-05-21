import type { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  children: ReactNode;
  tone?: "default" | "notice" | "info";
  className?: string;
};

const toneClassMap: Record<NonNullable<SectionCardProps["tone"]>, string> = {
  default: "border-neutral-300 bg-white",
  notice: "border-amber-300 bg-amber-50",
  info: "border-sky-300 bg-sky-50",
};

export default function SectionCard({
  title,
  children,
  tone = "default",
  className = "",
}: SectionCardProps) {
  return (
    <section className={`rounded-2xl border p-6 ${toneClassMap[tone]} ${className}`}>
      {title ? (
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-neutral-950">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
