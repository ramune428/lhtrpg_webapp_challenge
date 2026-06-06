"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { calculateIdentification, type EnemyFormData } from "@/utils/enemy";

type EnemyRank = EnemyFormData["rank"];

type HitPointPreviewSettings = {
  multiplier: number;
  minMultiplier: number;
  maxMultiplier: number;
  options: number[];
  isFixed: boolean;
};

function getPreviewSettings(rank: EnemyRank): HitPointPreviewSettings {
  if (rank === "モブ") {
    return {
      multiplier: 0.5,
      minMultiplier: 0.5,
      maxMultiplier: 0.5,
      options: [0.5],
      isFixed: true,
    };
  }

  if (rank === "ノーマル") {
    return {
      multiplier: 1,
      minMultiplier: 1,
      maxMultiplier: 1,
      options: [1],
      isFixed: true,
    };
  }

  if (rank === "ボス") {
    return {
      multiplier: 4,
      minMultiplier: 2,
      maxMultiplier: 4,
      options: [2, 3, 4],
      isFixed: false,
    };
  }

  return {
    multiplier: 10,
    minMultiplier: 5,
    maxMultiplier: 10,
    options: [5, 6, 7, 8, 9, 10],
    isFixed: false,
  };
}

function getFieldLabelText(label: HTMLLabelElement): string {
  return label.childNodes[0]?.textContent?.trim() ?? label.textContent?.trim() ?? "";
}

function findLabel(text: string): HTMLLabelElement | undefined {
  return Array.from(document.querySelectorAll("label")).find(
    (label): label is HTMLLabelElement => getFieldLabelText(label as HTMLLabelElement) === text,
  );
}

function findFieldByLabel(text: string): HTMLElement | undefined {
  const label = findLabel(text);
  let current = label?.parentElement;

  while (current) {
    if (current.querySelector("input, select, textarea")) {
      return current;
    }
    current = current.parentElement;
  }

  return undefined;
}

function setLabelSideText(
  label: HTMLLabelElement | undefined,
  key: string,
  text: string,
) {
  if (!label) {
    return;
  }

  label.classList.remove("block");
  label.classList.add("flex", "items-center", "justify-between", "gap-3", "text-sm", "font-medium");

  let badge = label.querySelector<HTMLSpanElement>(`span[data-enemy-ui-badge="${key}"]`);
  if (!badge) {
    badge = document.createElement("span");
    badge.dataset.enemyUiBadge = key;
    badge.className = "whitespace-nowrap text-black";
    label.appendChild(badge);
  }

  badge.className = "whitespace-nowrap text-black";
  badge.textContent = text;
}

function getRecommendedIdentification(grid: HTMLElement | null): string {
  const crField = Array.from(grid?.children ?? []).find((field) => {
    const label = field.querySelector("label");
    return label && getFieldLabelText(label as HTMLLabelElement) === "CR";
  }) as HTMLElement | undefined;
  const popularityField = Array.from(grid?.children ?? []).find((field) => {
    const label = field.querySelector("label");
    return label && getFieldLabelText(label as HTMLLabelElement) === "知名度";
  }) as HTMLElement | undefined;

  const crInput = crField?.querySelector<HTMLInputElement>("input");
  const popularitySelect = popularityField?.querySelector<HTMLSelectElement>("select");

  if (!crInput || !popularitySelect) {
    return "";
  }

  return calculateIdentification(
    popularitySelect.value as EnemyFormData["popularity"],
    Number(crInput.value),
  );
}

export function EnemyHitPointMultiplierPreview({ rank }: { rank: EnemyRank }) {
  const settings = getPreviewSettings(rank);
  const fieldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const grid = fieldRef.current?.parentElement;
    if (!grid) {
      return;
    }

    const fields = Array.from(grid.children) as HTMLElement[];
    const nameField = fields.find((field) => {
      const label = field.querySelector("label");
      return label && getFieldLabelText(label as HTMLLabelElement) === "名称";
    });
    const popularityField = fields.find((field) => {
      const label = field.querySelector("label");
      return label && getFieldLabelText(label as HTMLLabelElement) === "知名度";
    });
    const initialTagsField = fields.find((field) => {
      const label = field.querySelector("label");
      return label && getFieldLabelText(label as HTMLLabelElement) === "初期タグ";
    });
    const tagsField = fields.find((field) => {
      const label = field.querySelector("label");
      return label && getFieldLabelText(label as HTMLLabelElement) === "タグ";
    });
    const identificationField = findFieldByLabel("識別難易度");
    const hateField = findFieldByLabel("ヘイト倍率");
    const recommendedIdentification = getRecommendedIdentification(grid);

    nameField?.classList.add("sm:col-span-2", "lg:col-span-2");

    popularityField?.classList.remove("sm:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-4");
    setLabelSideText(
      popularityField?.querySelector("label") as HTMLLabelElement | undefined,
      "identification-top",
      `識別難易度${recommendedIdentification}`,
    );

    initialTagsField?.classList.remove("lg:col-span-3", "lg:col-span-4");
    initialTagsField?.classList.add("lg:col-span-2");

    tagsField?.classList.remove("lg:col-span-3", "lg:col-span-4");
    tagsField?.classList.add("lg:col-span-2");

    if (identificationField && hateField?.parentElement) {
      identificationField.classList.remove("sm:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-4");
      hateField.parentElement.insertBefore(identificationField, hateField.nextSibling);
      setLabelSideText(
        identificationField.querySelector("label") as HTMLLabelElement | undefined,
        "identification-recommended",
        `推奨値 ${recommendedIdentification}`,
      );
    }
  });

  return (
    <div ref={fieldRef}>
      <div className="mb-2 flex min-h-5 items-center justify-between gap-2">
        <label className="block text-sm font-medium">HP倍率</label>
        <span className="whitespace-nowrap text-xs font-medium text-amber-700">
          UI確認用
        </span>
      </div>

      <select
        defaultValue={String(settings.multiplier)}
        disabled
        className="w-full cursor-not-allowed rounded-xl border border-neutral-300 bg-neutral-100 px-4 py-3 text-neutral-600 outline-none"
      >
        {settings.options.map((value) => (
          <option key={value} value={value}>
            ×{value}
          </option>
        ))}
      </select>

      <p className="mt-2 text-xs leading-6 text-neutral-500">
        {settings.isFixed
          ? `${rank}は×${settings.multiplier}で固定されます。`
          : `${rank}は×${settings.minMultiplier}～×${settings.maxMultiplier}を選択する想定です。`}
        現在は計算に反映されません。
      </p>
    </div>
  );
}

export function EnemyHitPointRecommendationPreview({
  rank,
  hitPoint,
}: {
  rank: EnemyRank;
  hitPoint: number;
}) {
  const settings = getPreviewSettings(rank);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll("h3"));
    const judgementHeading = headings.find(
      (heading) => heading.textContent?.trim() === "判定値",
    );
    const judgementSection = judgementHeading?.parentElement;

    if (!judgementSection?.parentElement) {
      return;
    }

    const placeholder = document.createElement("div");
    placeholder.dataset.enemyHitPointPreview = "true";
    judgementSection.parentElement.insertBefore(placeholder, judgementSection);
    setPortalTarget(placeholder);

    const existingHitPointField = findFieldByLabel("最大HP");
    const previousDisplay = existingHitPointField?.style.display ?? "";

    if (existingHitPointField) {
      existingHitPointField.style.display = "none";
    }

    return () => {
      placeholder.remove();
      if (existingHitPointField) {
        existingHitPointField.style.display = previousDisplay;
      }
    };
  }, []);

  const baseHitPoint = Math.floor(hitPoint / settings.multiplier);
  const minHitPoint = Math.floor(baseHitPoint * settings.minMultiplier);
  const maxHitPoint = Math.floor(baseHitPoint * settings.maxMultiplier);
  const rangeLabel = settings.isFixed
    ? `${minHitPoint}（固定）`
    : `${minHitPoint} ～ ${maxHitPoint}`;

  const content = (
    <section className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-neutral-700">最大HP</h3>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          表示のみ・未実装
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium">基準HP</label>
          <input
            type="text"
            value={baseHitPoint}
            readOnly
            className="w-full cursor-default rounded-xl border border-neutral-300 bg-white px-4 py-3 font-medium text-neutral-700 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">HP倍率</label>
          <input
            type="text"
            value={`×${settings.multiplier}`}
            readOnly
            className="w-full cursor-default rounded-xl border border-neutral-300 bg-white px-4 py-3 font-medium text-neutral-700 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">最終HP</label>
          <input
            type="text"
            value={hitPoint}
            readOnly
            className="w-full cursor-default rounded-xl border border-neutral-300 bg-white px-4 py-3 font-medium text-neutral-700 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">推奨範囲</label>
          <input
            type="text"
            value={rangeLabel}
            readOnly
            className="w-full cursor-default rounded-xl border border-neutral-300 bg-white px-4 py-3 font-medium text-neutral-700 outline-none"
          />
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-neutral-600">
        基準HP {baseHitPoint} × HP倍率 {settings.multiplier} ＝ 最終HP {hitPoint}
      </p>
      <p className="mt-1 text-xs leading-6 text-neutral-500">
        現在はUI確認用です。最大HPの編集方法と計算反映は未実装です。
      </p>
    </section>
  );

  return portalTarget ? createPortal(content, portalTarget) : null;
}
