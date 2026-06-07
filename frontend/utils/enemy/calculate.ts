import {
  calculateEnemyValues as calculateEnemyValuesBase,
  calculateIdentification,
  getEnemyTypeExplanation,
} from "../createEnemyPiece";
import { normalizeEnemyRankForRace } from "./rank";
import type { EnemyRank, EnemyType } from "./types";

const hateBaseData: Record<EnemyType, { crBonus: number; fix: number }> = {
  不明: { crBonus: 0, fix: 0 },
  アーマラー: { crBonus: 0, fix: 1 },
  フェンサー: { crBonus: 2, fix: 1 },
  グラップラー: { crBonus: 0, fix: 1 },
  サポーター: { crBonus: 0, fix: 1 },
  ヒーラー: { crBonus: 0, fix: 1 },
  スピア: { crBonus: 0, fix: 2 },
  アーチャー: { crBonus: 2, fix: 2 },
  シューター: { crBonus: 2, fix: 2 },
  ボマー: { crBonus: 2, fix: 2 },
};

const damageCoefficientData: Record<EnemyType, number> = {
  不明: 1,
  アーマラー: 1,
  フェンサー: 1,
  グラップラー: 1,
  サポーター: 1,
  ヒーラー: 1,
  スピア: 1,
  アーチャー: 1,
  シューター: 1,
  ボマー: 1,
};

function calculateHitPoint(
  normalHitPoint: number,
  rank: EnemyRank,
  isGimmick: boolean,
): number {
  if (isGimmick || rank === "モブ") {
    return Math.floor(normalHitPoint / 2);
  }

  if (rank === "ボス") {
    return normalHitPoint * 4;
  }

  if (rank === "レイド") {
    return normalHitPoint * 10;
  }

  return normalHitPoint;
}

function calculateGold(rank: EnemyRank, cr: number, isGimmick: boolean): string {
  const normalGold = Math.floor((cr + 2) * (cr + 2) * 0.72 + 17);

  if (isGimmick || rank === "モブ") {
    return `換金(${Math.floor(normalGold / 2)} G)`;
  }

  if (rank === "ボス" || rank === "レイド") {
    return `換金(${normalGold * 4} G)`;
  }

  return `換金(${normalGold} G)`;
}

function calculateHate(
  rank: EnemyRank,
  cr: number,
  enemyType: EnemyType,
  isGimmick: boolean,
): number {
  if (rank === "ボス" || rank === "レイド") {
    return Math.floor(cr / 2.4 + 4);
  }

  if (isGimmick) {
    return 0;
  }

  const hateBase = hateBaseData[enemyType];
  return Math.floor((cr + hateBase.crBonus) / 6 + hateBase.fix);
}

function applyDamageCoefficient(damage: string, coefficient: number): string {
  const match = damage.match(/^(-?\d+)\s*\+\s*2\s*D$/);

  if (!match || coefficient === 1) {
    return damage;
  }

  const fixedValue = Number(match[1]);
  const expectedDiceValue = 7;
  const adjustedFixedValue =
    Math.floor((fixedValue + expectedDiceValue) * coefficient) -
    expectedDiceValue;

  return `${adjustedFixedValue} + 2 D`;
}

export function calculateEnemyValues(
  args: Parameters<typeof calculateEnemyValuesBase>[0],
) {
  const rank = normalizeEnemyRankForRace(args.race, args.rank);
  const values = calculateEnemyValuesBase({ ...args, rank });

  if (args.enemyType === "不明") {
    return values;
  }

  const normalValues = calculateEnemyValuesBase({
    ...args,
    race: "人型",
    rank: "ノーマル",
  });
  const isGimmick = args.race === "ギミック";

  return {
    ...values,
    hitPoint: calculateHitPoint(normalValues.hitPoint, rank, isGimmick),
    hate: calculateHate(rank, args.cr, args.enemyType, isGimmick),
    damage: applyDamageCoefficient(
      normalValues.damage,
      damageCoefficientData[args.enemyType],
    ),
    gold: calculateGold(rank, args.cr, isGimmick),
  };
}

export { calculateIdentification, getEnemyTypeExplanation };
