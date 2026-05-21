import type { ReactNode } from "react";
import SectionCard from "@/components/ui/section-card";

export type EnemyToolTabKey = "basic" | "skills" | "output";

type EnemyToolTab = {
  key: EnemyToolTabKey;
  label: string;
};

const enemyToolTabs: EnemyToolTab[] = [
  { key: "basic", label: "エネミー情報" },
  { key: "skills", label: "特技情報" },
  { key: "output", label: "データ出力" },
];

export function EnemyToolHeading() {
  return (
    <section className="mb-4">
      <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
        エネミーデータ/駒作成ツール
      </h2>
    </section>
  );
}

export function EnemyTabNavigation({
  activeTab,
  onChange,
  onClear,
}: {
  activeTab: EnemyToolTabKey;
  onChange: (tab: EnemyToolTabKey) => void;
  onClear: () => void;
}) {
  return (
    <section className="mb-6 border-b border-neutral-300">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {enemyToolTabs.map((tab) => {
            const active = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onChange(tab.key)}
                className={[
                  "border-b-2 px-3 py-2 text-sm transition",
                  active
                    ? "border-red-500 text-red-500"
                    : "border-transparent text-neutral-700 hover:text-neutral-900",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClear}
          className="mb-1 rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          入力内容をクリア
        </button>
      </div>
    </section>
  );
}

export function EnemyStatusMessage({ message }: { message: string }) {
  return <p className="mb-6 min-h-[1.5rem] text-sm text-neutral-600">{message}</p>;
}

export function EnemyToolPanel({ children }: { children: ReactNode }) {
  return <SectionCard>{children}</SectionCard>;
}

export function EnemySubPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
      {children}
    </div>
  );
}

export function EnemyExampleDetails({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="mb-6 rounded-2xl border border-neutral-300 p-4" open>
      <summary className="cursor-pointer text-sm font-medium">{title}</summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
