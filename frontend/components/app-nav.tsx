"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NAV_GROUPS, type ToolKey } from "@/components/tool-config";

type AppNavProps = {
  current?: ToolKey;
};

const summaryBaseClass =
  "rounded-lg border px-4 py-2 text-sm font-medium transition";
const activeSummaryClass =
  "border-black bg-black text-white hover:bg-black hover:text-white";
const normalSummaryClass =
  "border-neutral-300 bg-white text-black hover:bg-neutral-50 hover:text-black";
const itemClass =
  "block rounded-lg px-3 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100";

export default function AppNav({ current }: AppNavProps) {
  const [openKey, setOpenKey] = useState<ToolKey | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!openKey) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        navRef.current &&
        !navRef.current.contains(target)
      ) {
        setOpenKey(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenKey(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openKey]);

  return (
    <nav ref={navRef} className="mb-8 flex flex-wrap gap-10">
      {NAV_GROUPS.map((group) => {
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
              <span className="mr-2">{isOpen ? "▼" : "▶"}</span>
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
