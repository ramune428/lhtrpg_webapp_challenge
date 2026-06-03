import { skillTimings } from "@/utils/enemy";
import type { EnemySkillRow } from "@/utils/enemy/form";

type EnemySkillSectionProps = {
  skills: EnemySkillRow[];
  exampleSkill: EnemySkillRow;
  gimmickSkill: EnemySkillRow;
  isGimmick: boolean;
  onSkillCountChange: (nextCountRaw: number) => void;
  onUpdateSkill: (
    id: string,
    key: keyof Omit<EnemySkillRow, "id">,
    value: string,
  ) => void;
  onRemoveSkill: (id: string) => void;
};

export default function EnemySkillSection({
  skills,
  exampleSkill,
  gimmickSkill,
  isGimmick,
  onSkillCountChange,
  onUpdateSkill,
  onRemoveSkill,
}: EnemySkillSectionProps) {
  return (
    <section className="rounded-2xl border border-neutral-300 p-6">
      <details className="mb-6 rounded-2xl border border-neutral-300 p-4" open>
        <summary className="cursor-pointer text-sm font-medium">例</summary>
        <div className="mt-4 grid gap-4 text-sm leading-8 text-neutral-800 sm:grid-cols-2 lg:grid-cols-3">
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
      </details>

      {isGimmick ? (
        <details className="mb-6 rounded-2xl border border-neutral-300 p-4" open>
          <summary className="cursor-pointer text-sm font-medium">
            ギミック専用特技
          </summary>
          <div className="mt-4 space-y-2 text-sm leading-8 text-neutral-800">
            <p>特技名: {gimmickSkill.name}</p>
            <p>タグ: {gimmickSkill.tags}</p>
            <p>タイミング: {gimmickSkill.timing}</p>
            <p>対象: {gimmickSkill.target}</p>
            <p>射程: {gimmickSkill.range}</p>
            <p>効果: {gimmickSkill.effect}</p>
          </div>
        </details>
      ) : null}

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">特技の数</label>
          <input
            type="number"
            min={1}
            max={99}
            value={skills.length}
            onChange={(event) => onSkillCountChange(Number(event.target.value))}
            className="w-28 rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => {
          const summaryName = skill.name.trim() || "（未入力）";

          return (
            <details
              key={skill.id}
              className="rounded-2xl border border-neutral-300 p-4"
            >
              <summary className="cursor-pointer text-sm font-medium">
                特技{index + 1}：{summaryName}
              </summary>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium">特技名</label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(event) =>
                      onUpdateSkill(skill.id, "name", event.target.value)
                    }
                    placeholder={exampleSkill.name}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">タグ</label>
                  <input
                    type="text"
                    value={skill.tags}
                    onChange={(event) =>
                      onUpdateSkill(skill.id, "tags", event.target.value)
                    }
                    placeholder={exampleSkill.tags}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    タイミング
                  </label>
                  <select
                    value={skill.timing}
                    onChange={(event) =>
                      onUpdateSkill(skill.id, "timing", event.target.value)
                    }
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  >
                    {skillTimings.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">命中値</label>
                  <input
                    type="text"
                    value={skill.roleAttack}
                    onChange={(event) =>
                      onUpdateSkill(skill.id, "roleAttack", event.target.value)
                    }
                    placeholder={exampleSkill.roleAttack}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">判定</label>
                  <input
                    type="text"
                    value={skill.roleDefense}
                    onChange={(event) =>
                      onUpdateSkill(skill.id, "roleDefense", event.target.value)
                    }
                    placeholder={exampleSkill.roleDefense}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">対象</label>
                  <input
                    type="text"
                    value={skill.target}
                    onChange={(event) =>
                      onUpdateSkill(skill.id, "target", event.target.value)
                    }
                    placeholder={exampleSkill.target}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">射程</label>
                  <input
                    type="text"
                    value={skill.range}
                    onChange={(event) =>
                      onUpdateSkill(skill.id, "range", event.target.value)
                    }
                    placeholder={exampleSkill.range}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="mb-2 block text-sm font-medium">制限</label>
                  <input
                    type="text"
                    value={skill.limit}
                    onChange={(event) =>
                      onUpdateSkill(skill.id, "limit", event.target.value)
                    }
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="mb-2 block text-sm font-medium">効果</label>
                  <textarea
                    value={skill.effect}
                    onChange={(event) =>
                      onUpdateSkill(skill.id, "effect", event.target.value)
                    }
                    placeholder={exampleSkill.effect}
                    className="min-h-[120px] w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <button
                    type="button"
                    onClick={() => onRemoveSkill(skill.id)}
                    className="rounded-xl border border-neutral-300 px-4 py-2 text-sm transition hover:bg-neutral-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
