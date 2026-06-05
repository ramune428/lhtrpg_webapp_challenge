import type { EnemyRace, EnemyRank } from "./types";

export const GIMMICK_ENEMY_RANK: EnemyRank = "ノーマル";

export function normalizeEnemyRankForRace(
  race: EnemyRace,
  rank: EnemyRank,
): EnemyRank {
  return race === "ギミック" ? GIMMICK_ENEMY_RANK : rank;
}
