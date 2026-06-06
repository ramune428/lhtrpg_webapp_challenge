"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
const HP_MULTIPLIER_CHANGE_EVENT = "enemy-hp-multiplier-change";

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

function dispatchHitPointMultiplierChange(multiplier: number) {
  window.dispatchEvent(
    new CustomEvent(HP_MULTIPLIER_CHANGE_EVENT, {
      detail: { multiplier },
    }),
  );
}

function setReactInputValue(input: HTMLInputElement, value: number) {
  const valueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;

  valueSetter?.call(input, String(value));
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function toNonNegativeInteger(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
}

export function EnemyHitPointMultiplierPreview({ rank }: { rank: EnemyRank }) {
  const settings = getPreviewSettings(rank);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const [multiplier, setMultiplier] = useState(settings.multiplier);

  useEffect(() => {
    setMultiplier(settings.multiplier);
  }, [settings.multiplier]);

  useEffect(() => {
    dispatchHitPointMultiplierChange(multiplier);
  }, [multiplier]);

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
      <label className="mb-2 block min-h-5 text-sm font-medium">HP倍率</label>

      <select
        value={String(multiplier)}
        disabled={settings.isFixed}
        onChange={(e) => setMultiplier(Number(e.target.value))}
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-600"
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
          : `${rank}は×${settings.minMultiplier}～×${settings.maxMultiplier}から選択できます。`}
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
  const defaultMultiplier = settings.multiplier;
  const baseHitPoint = useMemo(
    () => Math.floor(hitPoint / defaultMultiplier),
    [defaultMultiplier, hitPoint],
  );
  const [multiplier, setMultiplier] = useState(defaultMultiplier);
  const [finalHitPoint, setFinalHitPoint] = useState(hitPoint);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const hitPointInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMultiplier(defaultMultiplier);
    setFinalHitPoint(Math.floor(baseHitPoint * defaultMultiplier));
  }, [baseHitPoint, defaultMultiplier]);

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<{ multiplier: number }>;
      const nextMultiplier = customEvent.detail?.multiplier;

      if (typeof nextMultiplier !== "number") {
        return;
      }

      setMultiplier(nextMultiplier);
      setFinalHitPoint(Math.floor(baseHitPoint * nextMultiplier));
    };

    window.addEventListener(HP_MULTIPLIER_CHANGE_EVENT, listener);
    return () => window.removeEventListener(HP_MULTIPLIER_CHANGE_EVENT, listener);
  }, [baseHitPoint]);

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
    hitPointInputRef.current = existingHitPointField?.querySelector<HTMLInputElement>(
      "input",
    ) ?? null;

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

  useEffect(() => {
    if (!hitPointInputRef.current) {
      return;
    }

    setReactInputValue(hitPointInputRef.current, finalHitPoint);
  }, [finalHitPoint]);

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
                value={`×${multiplier}`}
                readOnly
                className="w-full cursor-default rounded-xl border border-neutral-300 bg-white px-4 py-3 font-medium text-neutral-700 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">最終HP</label>
              <input
                type="number"
                min={0}
                value={finalHitPoint}
                onChange={(e) => setFinalHitPoint(toNonNegativeInteger(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-500"
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
            基準HP {baseHitPoint} × HP倍率 {multiplier} ＝ 最終HP {Math.floor(baseHitPoint * multiplier)}
          </p>
        </section>,
        portalTarget,
      )
    : null;
}
