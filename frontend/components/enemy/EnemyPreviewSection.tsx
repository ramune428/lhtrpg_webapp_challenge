import { getCombinedTagText, type EnemyFormData } from "@/utils/enemy";
import type { EnemyDropItemRow, EnemySkillRow } from "@/utils/enemy/form";

type EnemyPreviewSectionProps = {
  form: EnemyFormData;
  items: EnemyDropItemRow[];
  outputSkills: EnemySkillRow[];
};

function hasDropItem(item: EnemyDropItemRow) {
  return item.name.trim() || item.dice.trim();
}

function hasSkill(skill: EnemySkillRow) {
  return skill.name.trim() || skill.effect.trim();
}

export default function EnemyPreviewSection({
  form,
  items,
  outputSkills,
}: EnemyPreviewSectionProps) {
  const visibleItems = items.filter(hasDropItem);
  const visibleSkills = outputSkills.filter(hasSkill);

  return (
    <div className="space-y-6 text-sm leading-8 text-neutral-800">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <p>名称: {form.name || "-"}</p>
        <p>ランク: {form.rank}</p>
        <p>CR: {form.cr}</p>
        <p>タイプ: {form.enemyType}</p>
        <p>大種族: {form.race}</p>
        <p>知名度: {form.popularity}</p>
        <p>識別難易度: {form.identification}</p>
        <p>タグ: [{getCombinedTagText(form, ",")}]</p>
      </div>

      <div>
        <p className="mb-1 font-medium">メモ:</p>
        <p className="whitespace-pre-wrap">{form.memo || "-"}</p>
      </div>

      <hr className="border-neutral-300" />

      <div>
        <p className="mb-2 font-medium">ドロップ品:</p>
        <div className="space-y-3">
          {visibleItems.length === 0 ? (
            <p>-</p>
          ) : (
            visibleItems.map((item, index) => {
              const summaryName = item.name.trim() || "（未入力）";

              return (
                <details
                  key={item.id}
                  className="group rounded-2xl border border-neutral-300 p-4"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-2 text-base font-semibold text-neutral-950 [&::-webkit-details-marker]:hidden">
                    <span className="transition-transform group-open:rotate-90">
                      ▶
                    </span>
                    <span>ドロップ品{index + 1}：{summaryName}</span>
                  </summary>

                  <div className="mt-4 space-y-2 text-sm font-normal text-neutral-800">
                    <p>ダイス: {item.dice || "-"}</p>
                    <p>アイテム名: {item.name || "-"}</p>
                    <p>解説: {item.description || "-"}</p>
                  </div>
                </details>
              );
            })
          )}
        </div>
      </div>

      <hr className="border-neutral-300" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <p>STR: {form.strength}</p>
        <p>DEX: {form.dexterity}</p>
        <p>POW: {form.power}</p>
        <p>INT: {form.intelligence}</p>
        <p>
          回避: {form.avoid} + {form.avoidDice} D
        </p>
        <p>
          抵抗: {form.resist} + {form.resistDice} D
        </p>
        <p>物理防御力: {form.physicalDefense}</p>
        <p>魔法防御力: {form.magicDefense}</p>
        <p>最大HP: {form.hitPoint}</p>
        <p>ヘイト倍率: {form.hate}</p>
        <p>行動力: {form.action}</p>
        <p>移動力: {form.move}</p>
        <p>因果力: {form.fate}</p>
      </div>

      <hr className="border-neutral-300" />

      <div>
        <p className="mb-2 font-medium">特技:</p>
        <div className="space-y-3">
          {visibleSkills.length === 0 ? (
            <p>-</p>
          ) : (
            visibleSkills.map((skill, index) => {
              const summaryName = skill.name.trim() || "（未入力）";

              return (
                <details
                  key={skill.id}
                  className="group rounded-2xl border border-neutral-300 p-4"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-2 text-base font-semibold text-neutral-950 [&::-webkit-details-marker]:hidden">
                    <span className="transition-transform group-open:rotate-90">
                      ▶
                    </span>
                    <span>特技{index + 1}：{summaryName}</span>
                  </summary>

                  <div className="mt-4 space-y-2 text-sm font-normal text-neutral-800">
                    <p>特技名: {skill.name || "-"}</p>
                    <p>タグ: {skill.tags || "-"}</p>
                    <p>タイミング: {skill.timing || "-"}</p>
                    <p>
                      対決:{" "}
                      {skill.roleAttack && skill.roleDefense
                        ? `${skill.roleAttack}／${skill.roleDefense}`
                        : "-"}
                    </p>
                    <p>対象: {skill.target || "-"}</p>
                    <p>射程: {skill.range || "-"}</p>
                    <p>制限: {skill.limit || "-"}</p>
                    <p className="whitespace-pre-wrap">
                      効果: {skill.effect || "-"}
                    </p>
                  </div>
                </details>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
