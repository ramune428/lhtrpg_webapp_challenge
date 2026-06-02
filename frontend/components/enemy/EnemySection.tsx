import type { ReactNode } from "react";

type EnemySectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function EnemySection({
  title,
  description,
  children,
}: EnemySectionProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 p-5">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-7 text-neutral-700">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
