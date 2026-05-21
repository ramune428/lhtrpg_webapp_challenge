"use client";

import Link from "next/link";
import { useState } from "react";

type AppNavProps = {
  current?: "character" | "enemy";
};

type NavItem = {
  label: string;
  href: string;
};

type NavGroup = {
  key: "character" | "enemy";
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    key: "character",
    label: "キャラクター駒作成",
    items: [
      { label: "キャラクター駒作成ツール", href: "/" },
      { label: "使い方（詳細）", href: "/character/how-to" },
      { label: "コマンド内訳", href: "/character/command-details" },
      { label: "アップデート情報", href: "/character/updates" },
    ],
  },
  {
    key: "enemy",
    label: "エネミーデータ作成",
    items: [
      { label: "エネミーデータ作成ツール", href: "/enemy" },
      { label: "公式データについて", href: "/enemy/official-data" },
      { label: "使い方（詳細）", href: "/enemy/how-to" },
      { label: "計算式", href: "/enemy/formula" },
      { label: "アップデート情報", href: "/enemy/updates" },
    ],
  },
];

export default function AppNav({ current }: AppNavProps) {
  const [openKey, setOpenKey] = useState<NavGroup["key"] | null>(null);

  const summaryBaseClass =
    "rounded-xl border px-4 py-2 text-sm font-medium tracking-tight transition";
  const activeSummaryClass =
    "border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-950 hover:text-white";
  const normalSummaryClass =
    "border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-50 hover:text-neutral-950";
  const itemClass =
    "block rounded-lg px-3 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100";

  return (
    <nav className="mb-8 flex flex-wrap gap-3" aria-label="メインナビゲーション">
      {navGroups.map((group) => {
        const isActive = current === group.key;
        const isOpen = openKey === group.key;

        return (
          <div key={group.key} className="relative">
            <button
              type="button"
              onClick={() => setOpenKey(isOpen ? null : group.key)}
              className={`${summaryBaseClass} ${
                isActive ? activeSummaryClass : normalSummaryClass
              }`}
              aria-expanded={isOpen}
            >
              <span className="mr-2" aria-hidden="true">
                {isOpen ? "▼" : "▶"}
              </span>
              {group.label}
            </button>

            {isOpen ? (
              <div className="absolute left-0 z-20 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={itemClass}
                    onClick={() => setOpenKey(null)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
