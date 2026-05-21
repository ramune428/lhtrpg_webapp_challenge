import type { EnemySkillInput } from "@/utils/createEnemyPiece";
import { EnemyExampleDetails } from "@/components/enemy/enemy-tool-layout";

type EnemySkillExamplesProps = {
  exampleSkill: EnemySkillInput;
  gimmickSkill: EnemySkillInput;
  showGimmickSkill: boolean;
};

export default function EnemySkillExamples({
  exampleSkill,
  gimmickSkill,
  showGimmickSkill,
}: EnemySkillExamplesProps) {
  return (
    <>
      <EnemyExampleDetails title="例">
        <div className="grid gap-4 text-sm leading-8 text-neutral-800 sm:grid-cols-2 lg:grid-cols-3">
          <p>特技名: {exampleSkill.name}</p>
          <p>タグ: {exampleSkill.tags}</p>
          <p>タイミング: {exampleSkill.timing}</p>
          <p>命中値: {exampleSkill.roleAttack}</p>
          <p>判定: {exampleSkill.roleDefense}</p>
          <p>対象: {exampleSkill.target}</p>
          <p>射程: {exampleSkill.range}</p>
          <p>制限: {exampleSkill.limit || "-"}</p>
          <p className="lg:col-span-3">効果: {exampleSkill.effect}</p>
        </div>
      </EnemyExampleDetails>

      {showGimmickSkill ? (
        <EnemyExampleDetails title="ギミック専用特技">
          <div className="space-y-2 text-sm leading-8 text-neutral-800">
            <p>特技名: {gimmickSkill.name}</p>
            <p>タグ: {gimmickSkill.tags}</p>
            <p>タイミング: {gimmickSkill.timing}</p>
            <p>対象: {gimmickSkill.target}</p>
            <p>射程: {gimmickSkill.range}</p>
            <p>効果: {gimmickSkill.effect}</p>
          </div>
        </EnemyExampleDetails>
      ) : null}
    </>
  );
}
