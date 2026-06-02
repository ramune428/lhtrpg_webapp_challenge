import { formatDropDiceForOutput, getMaxDropDice } from "./dice";
import type { EnemyDropItemInput, EnemyFormData, EnemySkillInput } from "./types";

export type EnemySkillRow = EnemySkillInput & { id: string };
export type EnemyDropItemRow = EnemyDropItemInput & { id: string };

export function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function toNonNegativeNumber(value: string) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? Math.max(0, numberValue) : 0;
}

export function clampInteger(
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

export function buildCurrentFormData(
  form: EnemyFormData,
  skills: EnemySkillRow[],
  items: EnemyDropItemRow[],
): EnemyFormData {
  const maxDropDice = getMaxDropDice(form.rank);

  return {
    ...form,
    skills: skills.map((skill) => ({
      name: skill.name,
      tags: skill.tags,
      timing: skill.timing,
      roleAttack: skill.roleAttack,
      roleDefense: skill.roleDefense,
      target: skill.target,
      range: skill.range,
      limit: skill.limit,
      effect: skill.effect,
    })),
    items: items.map((item) => ({
      dice: formatDropDiceForOutput(item.dice, maxDropDice),
      name: item.name,
      description: item.description,
    })),
  };
}
