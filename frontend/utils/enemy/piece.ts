import {
  createEmptyDropItemInput,
  createEmptySkillInput,
  createEnemyPiece as createEnemyPieceBase,
  getCombinedTagText as getCombinedTagTextBase,
  getDefaultEnemyForm,
  getDefaultTags as getDefaultTagsBase,
  getGimmickSkill,
  getSkillExample,
} from "../createEnemyPiece";
import { normalizeEnemyRankForRace } from "./rank";
import type { EnemyFormData, EnemyRace, EnemyRank } from "./types";

function normalizeFormRank(data: EnemyFormData): EnemyFormData {
  return {
    ...data,
    rank: normalizeEnemyRankForRace(data.race, data.rank),
  };
}

export function createEnemyPiece(data: EnemyFormData): string {
  return createEnemyPieceBase(normalizeFormRank(data));
}

export function getDefaultTags(rank: EnemyRank, race: EnemyRace): string {
  return getDefaultTagsBase(normalizeEnemyRankForRace(race, rank), race);
}

export function getCombinedTagText(
  data: Pick<EnemyFormData, "rank" | "race" | "tags">,
  delimiter = ",",
): string {
  return getCombinedTagTextBase(
    {
      ...data,
      rank: normalizeEnemyRankForRace(data.race, data.rank),
    },
    delimiter,
  );
}

export {
  createEmptyDropItemInput,
  createEmptySkillInput,
  getDefaultEnemyForm,
  getGimmickSkill,
  getSkillExample,
};
