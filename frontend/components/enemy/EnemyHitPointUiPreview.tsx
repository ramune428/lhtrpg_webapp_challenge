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

const SIDE_TEXT_CLASS = "whitespace-nowrap text-xs font-medium text-black";

function getPreviewSettings(rank: EnemyRank): HitPointPreviewSettings {
  switch (rank) {
    case "モブ":
      return {
        multiplier: 0.5,
        minMultiplier: 0.5,
        maxMultiplier: 0.5,
        options: [0.5],
        isFixed: true,
      };
    case "ノーマル":
      return {
        multiplier: 1,
        minMultiplier: 1,
        maxMultiplier: 1,
        options: [1],
        isFixed: true,
      };
    case "ボス":
      return {
        multiplier: 4,
        minMultiplier: 2,
        maxMultiplier: 4,
        options: [2, 3, 4],
        isFixed: false,
      };
    case "レイド":
      return {
        multiplier: 10,
        minMultiplier: 5,
        maxMultiplier: 10,
        options: [5, 6, 7, 8, 9, 10],
        isFixed: false,
      };
  }
}

function getLabelText(label: HTMLLabelElement): string {
  return label.childNodes[0]?.textContent?.trim() ?? label.textContent?.trim() ?? "";
}

function findFieldByLabel(root: ParentNode, labelText: string): HTMLElement | null {
  const labels = Array.from(root.querySelectorAll<HTMLLabelElement>("label"));
  const label = labels.find((currentLabel) => getLabelText(currentLabel) === labelText);

  let field = label?.parentElement ?? null;
  while (field && !field.querySelector("input, select, textarea")) {
    field = field.parentElement;
  }

  return field;
}

function setColumnSpan(
  field: HTMLElement | null,
  classNamesToRemove: string[],
  classNamesToAdd: string[],
) {
  if (!field) {
    return;
  }

  field.classList.remove(...classNamesToRemove);
  field.classList.add(...classNamesToAdd);
}

function setLabelSideText(
  field: HTMLElement | null,
  key: string,
  text: string,
) {
  const label = field?.querySelector<HTMLLabelElement>("label");
  if (!label) {
    return;
  }

  label.classList.remove("block");
  label.classList.add(
    "flex",
    "items-center",
    "justify-between",
    "gap-3",
    "text-sm",
    "font-medium",
  );

  let sideText = label.querySelector<HTMLSpanElement>(
    `span[data-enemy-ui-side-text="${key}"]`,
  );

  if (!sideText) {
    sideText = document.createElement("span");
    sideText.dataset.enemyUiSideText = key;
    label.appendChild(sideText);
  }

  sideText.className = SIDE_TEXT_CLASS;
  sideText.textContent = text;
}

function getRecommendedIdentification(formGrid: HTMLElement): string {
  const crInput = findFieldByLabel(formGrid, "CR")?.querySelector<HTMLInputElement>(
    "input",
  );
  const popularitySelect = findFieldByLabel(formGrid, "知名度")?.querySelector<HTMLSelectElement>(
    "select",
  );

  if (!crInput || !popularitySelect) {
    return "";
  }

  return calculateIdentification(
    popularitySelect.value as EnemyFormData["popularity"],
    Number(crInput.value),
  );
}

function applyHeaderLayout(formGrid: HTMLElement) {
  setColumnSpan(findFieldByLabel(formGrid, "名称"), [], ["sm:col-span-2", "lg:col-span-2"]);
  setColumnSpan(
    findFieldByLabel(formGrid, "知名度"),
    ["sm:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-4"],
    [],
  );
  setColumnSpan(
    findFieldByLabel(formGrid, "初期タグ"),
    ["lg:col-span-3", "lg:col-span-4"],
    ["lg:col-span-2"],
  );
  setColumnSpan(
    findFieldByLabel(formGrid, "タグ"),
    ["lg:col-span-3", "lg:col-span-4"],
    ["lg:col-span-2"],
  );
}

function applyRightSideTextSize() {
  document
    .querySelectorAll<HTMLSpanElement>(
      ".mb-2.flex.items-center.justify-between span, .mb-2.flex.min-h-5.items-center.justify-between span",
    )
    .forEach((sideText) => sideText.classList.add("text-xs"));
}

function moveIdentificationField(formGrid: HTMLElement) {
  const recommendedIdentification = getRecommendedIdentification(formGrid);
  const identificationField = findFieldByLabel(document, "識別難易度");
  const hateField = findFieldByLabel(document, "ヘイト倍率");

  setLabelSideText(
    findFieldByLabel(formGrid, "知名度"),
    "identification-top",
    `識別難易度 ${recommendedIdentification}`,
  );

  if (!identificationField || !hateField?.parentElement) {
    return;
  }

  setColumnSpan(
    identificationField,
    ["sm:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-4"],
    [],
  );
  hateField.parentElement.insertBefore(identificationField, hateField.nextSibling);
  setLabelSideText(
    identificationField,
    "identification-recommended",
    `推奨値 ${recommendedIdentification}`,
  );
}

export function EnemyHitPointMultiplierPreview({ rank }: { rank: EnemyRank }) {
  const settings = getPreviewSettings(rank);
  const fieldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const formGrid = fieldRef.current?.parentElement;
    if (!formGrid) {
      return;
    }

    applyHeaderLayout(formGrid);
    moveIdentificationField(formGrid);
    applyRightSideTextSize();
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
    const judgementHeading = Array.from(document.querySelectorAll("h3")).find(
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

    const existingHitPointField = findFieldByLabel(document, "最大HP");
    const previousDisplay = existingHitPointField?.style.display ?? "";

    if (existingHitPointField) {
      existingHitPointField.style.display = "none";
    }

    applyRightSideTextSize();

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

  return portalTarget
    ? createPortal(
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
        </section>,
        portalTarget,
      )
    : null;
}
