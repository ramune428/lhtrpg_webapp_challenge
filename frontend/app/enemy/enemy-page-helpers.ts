import type {
  EnemyDropItemInput,
  EnemyFormData,
  EnemySkillInput,
} from "@/utils/createEnemyPiece";

export type EnemySkillRow = EnemySkillInput & { id: string };
export type EnemyDropItemRow = EnemyDropItemInput & { id: string };

function normalizeDropDiceText(dice: string): string {
  return dice
    .replace(/[０-９]/g, (value) =>
      String.fromCharCode(value.charCodeAt(0) - 0xfee0),
    )
    .replace(/[，、]/g, ",")
    .replace(/[～〜－―ー−]/g, "~");
}

export function getSelectedDiceValues(dice: string): Set<string> {
  const selected = new Set<string>();
  const normalized = normalizeDropDiceText(dice);

  for (const match of normalized.matchAll(/([1-6])\s*[~-]\s*([1-6])/g)) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    const min = Math.min(start, end);
    const max = Math.max(start, end);

    for (let value = min; value <= max; value += 1) {
      selected.add(String(value));
    }
  }

  for (const match of normalized.matchAll(/[1-6]/g)) {
    selected.add(match[0]);
  }

  return selected;
}

export function getDiceRangeBoundaryValues(selected: Set<string>): Set<string> {
  const sortedValues = Array.from(selected)
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= 6)
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

function toFullWidthDiceValue(value: number): string {
  return String.fromCharCode("０".charCodeAt(0) + value);
}

export function normalizeDiceRangeSelection(selected: Set<string>): string {
  const sortedValues = Array.from(selected)
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= 6)
    .sort((a, b) => a - b);

  if (sortedValues.length === 0) {
    return "";
  }

  if (sortedValues.length === 1) {
    return toFullWidthDiceValue(sortedValues[0]);
  }

  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];

  return `${toFullWidthDiceValue(min)}～${toFullWidthDiceValue(max)}`;
}

function formatDropDiceForOutput(dice: string): string {
  const trimmedDice = dice.trim();

  if (trimmedDice === "固定") {
    return "固定";
  }

  const selected = getSelectedDiceValues(trimmedDice);
  const formattedDice = normalizeDiceRangeSelection(selected);

  return formattedDice || trimmedDice;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function toNonNegativeNumber(value: string) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? Math.max(0, numberValue) : 0;
}

function clampInteger(
  value: number,
  min: number,
  max: number,
  fallback: number,
) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, Math.floor(value)));
}

export function normalizeCr(value: number) {
  return clampInteger(value, 1, 30, 1);
}

export function normalizeCount(value: number, fallback: number) {
  return clampInteger(value, 1, 99, fallback);
}

export function withSkillRowId(skill: EnemySkillInput): EnemySkillRow {
  return { id: makeId(), ...skill };
}

export function withDropRowId(item: EnemyDropItemInput): EnemyDropItemRow {
  return { id: makeId(), ...item };
}

export function downloadTextFile(
  filename: string,
  content: string,
  mimeType: string,
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function downloadBlobFile(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function buildCurrentFormData(
  form: EnemyFormData,
  skills: EnemySkillRow[],
  items: EnemyDropItemRow[],
): EnemyFormData {
  return {
    ...form,
    skills: skills.map(({ id, ...skill }) => skill),
    items: items.map(({ id, ...item }) => ({
      ...item,
      dice: formatDropDiceForOutput(item.dice),
    })),
  };
}
