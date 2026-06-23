import { enemyTypes } from "../createEnemyPiece";

export {
  enemyRaces,
  enemyRanks,
  enemyTypes,
  popularityList,
  skillTimings,
} from "../createEnemyPiece";

export const selectableEnemyTypes = enemyTypes.filter(
  (enemyType) => enemyType !== "不明",
);
