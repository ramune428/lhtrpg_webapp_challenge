"use client";

import Link from "next/link";
import { useState } from "react";

type NavigationKey = "character" | "enemy";

type AppNavProps = {
  current?: NavigationKey;
};

type NavigationItem = {
  label: string;
  href: string;
};

type NavigationGroup = {
  key: NavigationKey;
  label: string;
  items: NavigationItem[];
};

const navigationGroups: NavigationGroup[] = [
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

const navigationStyles = {
  nav: "mb-8 flex flex-wrap gap-4 sm:gap-6",
  group: "relative",
  triggerBase: "rounded-xl border px-4 py-2 text-sm font-medium transition",
  triggerActive: "border-black bg-black text-white hover:bg-black hover:text-white",
  triggerDefault:
    "border-neutral-300 bg-white text-black hover:bg-neutral-50 hover:text-black",
  menu: "absolute left-0 z-20 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg",
  item: "block rounded-lg px-3 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100",
} as const;

function getTriggerClassName(isActive: boolean) {
  return [
    navigationStyles.triggerBase,
    isActive ? navigationStyles.triggerActive : navigationStyles.triggerDefault,
  ].join(" ");
}

export default function AppNav({ current }: AppNavProps) {
  const [openNavigationKey, setOpenNavigationKey] =
    useState<NavigationKey | null>(null);

  const toggleNavigation = (key: NavigationKey) => {
    setOpenNavigationKey((currentKey) => (currentKey === key ? null : key));
  };

  return (
    <nav className={navigationStyles.nav}>
      {navigationGroups.map((group) => {
        const isActive = current === group.key;
        const isOpen = openNavigationKey === group.key;

        return (
          <div key={group.key} className={navigationStyles.group}>
            <button
              type="button"
              onClick={() => toggleNavigation(group.key)}
              className={getTriggerClassName(isActive)}
              aria-expanded={isOpen}
            >
              <span className="mr-2">{isOpen ? "▼" : "▶"}</span>
              {group.label}
            </button>

            {isOpen ? (
              <div className={navigationStyles.menu}>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={navigationStyles.item}
                    onClick={() => setOpenNavigationKey(null)}
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
