import {
  calculateEnemyValues as calculateEnemyValuesBase,
  calculateIdentification,
  getEnemyTypeExplanation,
} from "../createEnemyPiece";
import { normalizeEnemyRankForRace } from "./rank";
import type { EnemyType } from "./types";

const hateBaseData: Record<EnemyType, { crCoefficient: number; fix: number }> = {
  不明: { crCoefficient: 0, fix: 1 },
  アーマラー: { crCoefficient: 0, fix: 1 },
  フェンサー: { crCoefficient: 2, fix: 1 },
  グラップラー: { crCoefficient: 0, fix: 1 },
  サポーター: { crCoefficient: 0, fix: 1 },
  ヒーラー: { crCoefficient: 0, fix: 1 },
  スピア: { crCoefficient: 0, fix: 2 },
  アーチャー: { crCoefficient: 2, fix: 2 },
  シューター: { crCoefficient: 2, fix: 2 },
  ボマー: { crCoefficient: 2, fix: 2 },
};

export function calculateEnemyValues(
  args: Parameters<typeof calculateEnemyValuesBase>[0],
) {
  const rank = normalizeEnemyRankForRace(args.race, args.rank);
  const values = calculateEnemyValuesBase({ ...args, rank });
  const hateBase = hateBaseData[args.enemyType];

  const hate =
    args.race === "ギミック"
      ? 0
      : rank === "ボス" || rank === "レイド"
        ? Math.floor(args.cr / 2.4 + 4)
        : Math.floor((args.cr * hateBase.crCoefficient) / 6 + hateBase.fix);

  return { ...values, hate };
}

export { calculateIdentification, getEnemyTypeExplanation };
