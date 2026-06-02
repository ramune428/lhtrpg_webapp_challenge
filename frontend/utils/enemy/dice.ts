import type { EnemyFormData } from "./types";

export const diceButtonValues = [
  "固定",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "以上",
] as const;

export type DiceButtonValue = (typeof diceButtonValues)[number];

export function getMaxDropDice(rank: EnemyFormData["rank"]) {
  return rank === "レイド" ? 10 : 6;
}

export function normalizeDropDiceText(dice: string): string {
  return dice
    .replace(/[０-９]/g, (value) =>
      String.fromCharCode(value.charCodeAt(0) - 0xfee0),
    )
    .replace(/[，、]/g, ",")
    .replace(/[～〜－―ー−]/g, "~");
}

export function toFullWidthNumber(value: number): string {
  return String(value).replace(/[0-9]/g, (digit) =>
    String.fromCharCode("０".charCodeAt(0) + Number(digit)),
  );
}

export function isNumericDiceButton(
  diceValue: DiceButtonValue,
): diceValue is Exclude<DiceButtonValue, "固定" | "以上"> {
  return diceValue !== "固定" && diceValue !== "以上";
}

export function isDiceButtonEnabled(
  diceValue: DiceButtonValue,
  maxDropDice: number,
) {
  if (diceValue === "固定" || diceValue === "以上") {
    return true;
  }

  return Number(diceValue) <= maxDropDice;
}

export function clampDropDiceValue(value: number, maxDropDice: number) {
  return Math.max(1, Math.min(value, maxDropDice));
}

export function getDropDiceAboveStartValue(
  dice: string,
  maxDropDice: number,
): number | null {
  const normalized = normalizeDropDiceText(dice).trim();
  const match = normalized.match(/^(10|[1-9])\s*~\s*$/);

  if (!match) {
    return null;
  }

  return clampDropDiceValue(Number(match[1]), maxDropDice);
}

export function formatDiceAboveSelection(
  selected: Set<string>,
  maxDropDice: number,
): string {
  const selectedNumbers = Array.from(selected)
    .map((value) => Number(value))
    .filter(
      (value) =>
        Number.isInteger(value) && value >= 1 && value <= maxDropDice,
    )
    .sort((a, b) => a - b);

  const start = selectedNumbers[0] ?? 1;

  return `${toFullWidthNumber(start)}～`;
}

export function getSelectedDiceValues(
  dice: string,
  maxDropDice: number,
): Set<string> {
  const selected = new Set<string>();
  const aboveStart = getDropDiceAboveStartValue(dice, maxDropDice);

  if (aboveStart !== null) {
    selected.add(String(aboveStart));
    return selected;
  }

  const normalized = normalizeDropDiceText(dice);

  for (const match of normalized.matchAll(
    /(10|[1-9])\s*[~-]\s*(10|[1-9])/g,
  )) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    const min = Math.max(1, Math.min(start, end));
    const max = Math.min(Math.max(start, end), maxDropDice);

    for (let value = min; value <= max; value += 1) {
      selected.add(String(value));
    }
  }

  for (const match of normalized.matchAll(/10|[1-9]/g)) {
    const value = Number(match[0]);

    if (value >= 1 && value <= maxDropDice) {
      selected.add(String(value));
    }
  }

  return selected;
}

export function getDiceRangeBoundaryValues(
  selected: Set<string>,
  maxDropDice: number,
): Set<string> {
  const sortedValues = Array.from(selected)
    .map((value) => Number(value))
    .filter(
      (value) =>
        Number.isInteger(value) && value >= 1 && value <= maxDropDice,
    )
    .sort((a, b) => a - b);

  const boundaries = new Set<string>();

  if (sortedValues.length === 0) {
    return boundaries;
  }

  boundaries.add(String(sortedValues[0]));

  if (sortedValues.length >= 2) {
    boundaries.add(String(sortedValues[sortedValues.length - 1]));
  }

  return boundaries;
}

export function normalizeDiceRangeSelection(
  selected: Set<string>,
  maxDropDice: number,
): string {
  const sortedValues = Array.from(selected)
    .map((value) => Number(value))
    .filter(
      (value) =>
        Number.isInteger(value) && value >= 1 && value <= maxDropDice,
    )
    .sort((a, b) => a - b);

  if (sortedValues.length === 0) {
    return "";
  }

  if (sortedValues.length === 1) {
    return toFullWidthNumber(sortedValues[0]);
  }

  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];

  return `${toFullWidthNumber(min)}～${toFullWidthNumber(max)}`;
}

export function formatDropDiceForOutput(
  dice: string,
  maxDropDice: number,
): string {
  const trimmedDice = dice.trim();

  if (trimmedDice === "固定") {
    return "固定";
  }

  const aboveStart = getDropDiceAboveStartValue(trimmedDice, maxDropDice);

  if (aboveStart !== null) {
    return `${toFullWidthNumber(aboveStart)}～`;
  }

  const selected = getSelectedDiceValues(trimmedDice, maxDropDice);
  const formattedDice = normalizeDiceRangeSelection(selected, maxDropDice);

  return formattedDice || trimmedDice;
}

export function getDropDicePreview(dice: string, maxDropDice: number): string {
  const preview = formatDropDiceForOutput(dice, maxDropDice).trim();

  return preview || "未選択";
}
