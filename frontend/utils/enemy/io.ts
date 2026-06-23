import {
  createEnemyJson as createEnemyJsonBase,
  createEnemyXlsx as createEnemyXlsxBase,
  parseEnemyJson as parseEnemyJsonBase,
  parseEnemyXlsx as parseEnemyXlsxBase,
} from "../createEnemyPiece";
import { normalizeEnemyRankForRace } from "./rank";
import type { EnemyFormData } from "./types";

function normalizeFormRank(data: EnemyFormData): EnemyFormData {
  return {
    ...data,
    rank: normalizeEnemyRankForRace(data.race, data.rank),
  };
}

export function createEnemyJson(data: EnemyFormData): string {
  return createEnemyJsonBase(normalizeFormRank(data));
}

export function createEnemyXlsx(data: EnemyFormData): Blob {
  return createEnemyXlsxBase(normalizeFormRank(data));
}

export function parseEnemyJson(text: string): EnemyFormData {
  return normalizeFormRank(parseEnemyJsonBase(text));
}

export function parseEnemyXlsx(buffer: ArrayBuffer): EnemyFormData {
  return normalizeFormRank(parseEnemyXlsxBase(buffer));
}
