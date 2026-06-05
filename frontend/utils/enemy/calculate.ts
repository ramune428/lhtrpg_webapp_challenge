import {
  calculateEnemyValues as calculateEnemyValuesBase,
  calculateIdentification,
  getEnemyTypeExplanation,
} from "../createEnemyPiece";
import { normalizeEnemyRankForRace } from "./rank";

export function calculateEnemyValues(
  args: Parameters<typeof calculateEnemyValuesBase>[0],
) {
  return calculateEnemyValuesBase({
    ...args,
    rank: normalizeEnemyRankForRace(args.race, args.rank),
  });
}

export { calculateIdentification, getEnemyTypeExplanation };
