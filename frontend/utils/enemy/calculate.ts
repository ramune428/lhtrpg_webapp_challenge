import {
  calculateEnemyValues as calculateEnemyValuesBase,
  calculateIdentification,
  getEnemyTypeExplanation,
} from "../createEnemyPiece";
import { normalizeEnemyRankForRace } from "./rank";
import type { EnemyRank, EnemyType } from "./types";

type EnemyFormulaBase = {
  hateCrCoefficient: number;
  hateFix: number;
  hitPointCoefficient: number;
  hitPointFix: number;
  damageCoefficient: number;
};

const enemyFormulaBaseData: Record<EnemyType, EnemyFormulaBase> = {
  不明: {
    hateCrCoefficient: 0,
    hateFix: 0,
    hitPointCoefficient: 0,
    hitPointFix: 0,
    damageCoefficient: 0,
  },
  アーマラー: {
    hateCrCoefficient: 0,
    hateFix: 1,
    hitPointCoefficient: 8.5,
    hitPointFix: 48,
    damageCoefficient: 1,
  },
  フェンサー: {
    hateCrCoefficient: 2,
    hateFix: 1,
    hitPointCoefficient: 8.4,
    hitPointFix: 45,
    damageCoefficient: 1,
  },
  グラップラー: {
    hateCrCoefficient: 0,
    hateFix: 1,
    hitPointCoefficient: 7.5,
    hitPointFix: 45,
    damageCoefficient: 1,
  },
  サポーター: {
    hateCrCoefficient: 0,
    hateFix: 1,
    hitPointCoefficient: 5,
    hitPointFix: 35,
    damageCoefficient: 1,
  },
  ヒーラー: {
    hateCrCoefficient: 0,
    hateFix: 1,
    hitPointCoefficient: 6,
    hitPointFix: 30,
    damageCoefficient: 1,
  },
  スピア: {
    hateCrCoefficient: 0,
    hateFix: 2,
    hitPointCoefficient: 6,
    hitPointFix: 30,
    damageCoefficient: 1,
  },
  アーチャー: {
    hateCrCoefficient: 2,
    hateFix: 2,
    hitPointCoefficient: 5,
    hitPointFix: 26,
    damageCoefficient: 0.9,
  },
  シューター: {
    hateCrCoefficient: 2,
    hateFix: 2,
    hitPointCoefficient: 4,
    hitPointFix: 26,
    damageCoefficient: 1,
  },
  ボマー: {
    hateCrCoefficient: 2,
    hateFix: 2,
    hitPointCoefficient: 4,
    hitPointFix: 26,
    damageCoefficient: 0.85,
  },
};

function calculateHitPoint(
  base: EnemyFormulaBase,
  rank: EnemyRank,
  cr: number,
  isGimmick: boolean,
): number {
  const normalHitPoint = Math.floor(
    cr * base.hitPointCoefficient + base.hitPointFix,
  );

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

function roundDownToFive(value: number): number {
  return Math.floor(value) - (Math.floor(value) % 5);
}

function calculateGold(rank: EnemyRank, cr: number, isGimmick: boolean): string {
  const normalGold = roundDownToFive((cr + 2) * (cr + 2) * 0.72 + 17);

  if (isGimmick || rank === "モブ") {
    return `換金(${roundDownToFive(normalGold / 2)} G)`;
  }

  if (rank === "ボス" || rank === "レイド") {
    return `換金(${normalGold * 4} G)`;
  }

  return `換金(${normalGold} G)`;
}

function getDamageBase(enemyType: EnemyType, cr: number): number {
  if (
    ["アーマラー", "フェンサー", "グラップラー", "ヒーラー"].includes(
      enemyType,
    )
  ) {
    return cr * 3.5 + 8 + 8;
  }

  if (enemyType === "サポーター") {
    return cr * 3.5 + 8;
  }

  if (["スピア", "アーチャー"].includes(enemyType)) {
    return cr * 6 + 18 + 8;
  }

  if (["シューター", "ボマー"].includes(enemyType)) {
    return cr * 6 + 18;
  }

  return 0;
}

function calculateDamage(
  enemyType: EnemyType,
  cr: number,
  base: EnemyFormulaBase,
  fallback: string,
): string {
  if (enemyType === "不明") {
    return fallback;
  }

  const damageTotal = Math.floor(
    getDamageBase(enemyType, cr) * base.damageCoefficient,
  );
  return `${damageTotal - 7} + 2 D`;
}

export function calculateEnemyValues(
  args: Parameters<typeof calculateEnemyValuesBase>[0],
) {
  const rank = normalizeEnemyRankForRace(args.race, args.rank);
  const values = calculateEnemyValuesBase({ ...args, rank });
  const base = enemyFormulaBaseData[args.enemyType];
  const isGimmick = args.race === "ギミック";

  if (args.enemyType === "不明") {
    return values;
  }

  const hate = isGimmick
    ? 0
    : Math.floor((args.cr * base.hateCrCoefficient) / 6 + base.hateFix);

  return {
    ...values,
    hitPoint: calculateHitPoint(base, rank, args.cr, isGimmick),
    hate,
    damage: calculateDamage(args.enemyType, args.cr, base, values.damage),
    gold: calculateGold(rank, args.cr, isGimmick),
  };
}

export { calculateIdentification, getEnemyTypeExplanation };
