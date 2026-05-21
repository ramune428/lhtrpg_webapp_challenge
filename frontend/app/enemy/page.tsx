"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import EnemyDropDiceButtons from "@/components/enemy/enemy-drop-dice-buttons";
import EnemyFileImportButton from "@/components/enemy/enemy-file-import-button";
import {
  EnemyFormGrid,
  EnemySectionDivider,
  EnemySelectField,
  EnemyTextField,
  EnemyTextareaField,
} from "@/components/enemy/enemy-form-controls";
import EnemyOutputActions from "@/components/enemy/enemy-output-actions";
import EnemyOutputSummary from "@/components/enemy/enemy-output-summary";
import EnemySkillExamples from "@/components/enemy/enemy-skill-examples";
import {
  CharacterToolLinkSection,
  EnemyGuideSection,
  EnemyHowToSection,
  EnemyNoticeSection,
  EnemyPageHeader,
} from "@/components/enemy/enemy-static-sections";
import {
  EnemyStatusMessage,
  EnemyTabNavigation,
  EnemyToolHeading,
  EnemyToolPanel,
  type EnemyToolTabKey,
} from "@/components/enemy/enemy-tool-layout";
import {
  FormControl,
  inputClassName,
  smallButtonClassName,
} from "@/components/ui/form-control";
import PageShell from "@/components/page-shell";
import {
  calculateEnemyValues,
  calculateIdentification,
  createEmptyDropItemInput,
  createEmptySkillInput,
  createEnemyJson,
  createEnemyPiece,
  createEnemyXlsx,
  enemyRaces,
  enemyRanks,
  enemyTypes,
  getDefaultEnemyForm,
  getDefaultTags,
  getEnemyTypeExplanation,
  getGimmickSkill,
  getSkillExample,
  parseEnemyJson,
  parseEnemyXlsx,
  popularityList,
  skillTimings,
  type EnemyDropItemInput,
  type EnemyFormData,
  type EnemySkillInput,
} from "@/utils/createEnemyPiece";
import {
  formatDropDiceForOutput,
  makeClientRowId,
  normalizeCount,
  normalizeCr,
  toNonNegativeNumber,
} from "@/utils/enemyPageInput";

type EnemySkillRow = EnemySkillInput & { id: string };
type EnemyDropItemRow = EnemyDropItemInput & { id: string };

function withSkillRowId(skill: EnemySkillInput): EnemySkillRow {
  return { id: makeClientRowId(), ...skill };
}

function withDropRowId(item: EnemyDropItemInput): EnemyDropItemRow {
  return { id: makeClientRowId(), ...item };
}

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function downloadBlobFile(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function buildCurrentFormData(
  form: EnemyFormData,
  skills: EnemySkillRow[],
  items: EnemyDropItemRow[],
): EnemyFormData {
  return {
    ...form,
    skills: skills.map(({ id, ...skill }) => skill),
    items: items.map(({ id, ...item }) => ({
      ...item,
      dice: formatDropDiceForOutput(item.dice),
    })),
  };
}

export default function EnemyPage() {
  const initialForm = useMemo(() => getDefaultEnemyForm(), []);
  const [activeTab, setActiveTab] = useState<EnemyToolTabKey>("basic");
  const [form, setForm] = useState<EnemyFormData>(initialForm);
  const [skills, setSkills] = useState<EnemySkillRow[]>(
    initialForm.skills.map(withSkillRowId),
  );
  const [items, setItems] = useState<EnemyDropItemRow[]>(
    initialForm.items.map(withDropRowId),
  );
  const [result, setResult] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const calculated = useMemo(
    () =>
      calculateEnemyValues({
        enemyType: form.enemyType,
        race: form.race,
        rank: form.rank,
        cr: form.cr,
      }),
    [form.enemyType, form.race, form.rank, form.cr],
  );

  const exampleSkill = useMemo(() => getSkillExample(calculated), [calculated]);
  const gimmickSkill = useMemo(() => getGimmickSkill(), []);
  const initialTags = useMemo(
    () => getDefaultTags(form.rank, form.race),
    [form.rank, form.race],
  );
  const outputSkills = useMemo<EnemySkillRow[]>(() => {
    if (form.race === "ギミック") {
      return [{ id: "gimmick-auto-skill", ...gimmickSkill }, ...skills];
    }

    return skills;
  }, [form.race, gimmickSkill, skills]);

  const currentData = useMemo(
    () => buildCurrentFormData(form, skills, items),
    [form, skills, items],
  );

  const updateForm = <K extends keyof EnemyFormData>(
    key: K,
    value: EnemyFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateSkill = <K extends keyof Omit<EnemySkillRow, "id">>(
    id: string,
    key: K,
    value: EnemySkillRow[K],
  ) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, [key]: value } : skill,
      ),
    );
  };

  const updateItem = <K extends keyof Omit<EnemyDropItemRow, "id">>(
    id: string,
    key: K,
    value: EnemyDropItemRow[K],
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  };

  const handleApplyCalculatedValues = () => {
    setForm((prev) => ({
      ...prev,
      strength: calculated.strength,
      dexterity: calculated.dexterity,
      power: calculated.power,
      intelligence: calculated.intelligence,
      avoid: calculated.avoid,
      avoidDice: calculated.avoidDice,
      resist: calculated.resist,
      resistDice: calculated.resistDice,
      physicalDefense: calculated.physicalDefense,
      magicDefense: calculated.magicDefense,
      hitPoint: calculated.hitPoint,
      hate: calculated.hate,
      action: calculated.action,
      move: calculated.move,
      fate: calculated.fate,
    }));
    setStatusMessage("推奨能力値を反映しました。");
  };

  const handleGenerate = () => {
    if (!form.name.trim()) {
      setStatusMessage("名称を入力してください。");
      setActiveTab("basic");
      return;
    }

    // 出力内容は createEnemyPiece の戻り値をそのまま表示する。
    const piece = createEnemyPiece(currentData);
    setResult(piece);
    setStatusMessage("CCFOLIA用コマンドを生成しました。");
    setActiveTab("output");
  };

  const handleCopy = async () => {
    if (!result) {
      setStatusMessage("コピーする内容がありません。");
      return;
    }

    try {
      await navigator.clipboard.writeText(result);
      setStatusMessage("CCFOLIA用コマンドをコピーしました。");
    } catch (error) {
      console.error(error);
      setStatusMessage("コピーに失敗しました。");
    }
  };

  const handleClear = () => {
    const confirmed = window.confirm("入力内容をすべてクリアします。よろしいですか？");

    if (!confirmed) {
      return;
    }

    const next = getDefaultEnemyForm();
    setForm(next);
    setSkills(next.skills.map(withSkillRowId));
    setItems(next.items.map(withDropRowId));
    setResult("");
    setStatusMessage("入力内容をクリアしました。");
    setActiveTab("basic");
  };

  const handleDownloadJson = () => {
    if (!form.name.trim()) {
      setStatusMessage("名称を入力してください。");
      return;
    }

    downloadTextFile(
      `${form.name || "enemy"}_CR${form.cr}.json`,
      createEnemyJson(currentData),
      "application/json;charset=utf-8",
    );
    setStatusMessage("JSONをダウンロードしました。");
  };

  const handleDownloadXlsx = () => {
    if (!form.name.trim()) {
      setStatusMessage("名称を入力してください。");
      return;
    }

    downloadBlobFile(
      `${form.name || "enemy"}_CR${form.cr}.xlsx`,
      createEnemyXlsx(currentData),
    );
    setStatusMessage("XLSXをダウンロードしました。");
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const lowerName = file.name.toLowerCase();
      const imported = lowerName.endsWith(".json")
        ? parseEnemyJson(await file.text())
        : lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")
          ? parseEnemyXlsx(await file.arrayBuffer())
          : (() => {
              throw new Error("対応している入力ファイルは JSON / XLSX です。");
            })();

      setForm(imported);
      setSkills(imported.skills.map(withSkillRowId));
      setItems(imported.items.map(withDropRowId));
      setResult("");
      setStatusMessage(
        lowerName.endsWith(".json")
          ? "JSONを読み込みました。"
          : "XLSXを読み込みました。",
      );
    } catch (error) {
      console.error(error);
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "入力ファイルの読み込みに失敗しました。",
      );
    } finally {
      event.target.value = "";
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      return next.length > 0
        ? next
        : [withDropRowId(createEmptyDropItemInput())];
    });
  };

  const handleItemCountChange = (nextCountRaw: number) => {
    setItems((prev) => {
      const nextCount = normalizeCount(nextCountRaw, prev.length);

      if (nextCount === prev.length) {
        return prev;
      }

      if (nextCount > prev.length) {
        const additional = Array.from({ length: nextCount - prev.length }, () =>
          withDropRowId(createEmptyDropItemInput()),
        );
        return [...prev, ...additional];
      }

      return prev.slice(0, nextCount);
    });
  };

  const handleSkillCountChange = (nextCountRaw: number) => {
    setSkills((prev) => {
      const nextCount = normalizeCount(nextCountRaw, prev.length);

      if (nextCount === prev.length) {
        return prev;
      }

      if (nextCount > prev.length) {
        const additional = Array.from({ length: nextCount - prev.length }, () =>
          withSkillRowId(createEmptySkillInput()),
        );
        return [...prev, ...additional];
      }

      return prev.slice(0, nextCount);
    });
  };

  return (
    <PageShell current="enemy">
      <EnemyPageHeader />
      <CharacterToolLinkSection />
      <EnemyGuideSection />
      <EnemyHowToSection />

      <EnemyToolHeading />
      <EnemyTabNavigation
        activeTab={activeTab}
        onChange={setActiveTab}
        onClear={handleClear}
      />
      <EnemyStatusMessage message={statusMessage} />

      {activeTab === "basic" ? (
        <EnemyToolPanel>
          <EnemyFileImportButton onChange={handleImportFile} />

          <EnemyFormGrid>
            <EnemyTextField
              label="名称"
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              className="lg:col-span-2"
            />

            <EnemySelectField
              label="ランク"
              value={form.rank}
              options={enemyRanks as readonly EnemyFormData["rank"][]}
              onChange={(e) =>
                updateForm("rank", e.target.value as EnemyFormData["rank"])
              }
            />

            <EnemyTextField
              label="CR"
              type="number"
              min={1}
              max={30}
              value={form.cr}
              onChange={(e) => {
                const nextCr = normalizeCr(Number(e.target.value));
                setForm((prev) => ({
                  ...prev,
                  cr: nextCr,
                  identification: calculateIdentification(prev.popularity, nextCr),
                }));
              }}
            />

            <EnemySelectField
              label="タイプ"
              value={form.enemyType}
              options={enemyTypes as readonly EnemyFormData["enemyType"][]}
              onChange={(e) =>
                updateForm(
                  "enemyType",
                  e.target.value as EnemyFormData["enemyType"],
                )
              }
            />

            <EnemySelectField
              label="大種族"
              value={form.race}
              options={enemyRaces as readonly EnemyFormData["race"][]}
              onChange={(e) =>
                updateForm("race", e.target.value as EnemyFormData["race"])
              }
            />

            <EnemySelectField
              label="知名度"
              value={form.popularity}
              options={popularityList as readonly EnemyFormData["popularity"][]}
              onChange={(e) => {
                const popularity = e.target.value as EnemyFormData["popularity"];
                setForm((prev) => ({
                  ...prev,
                  popularity,
                  identification: calculateIdentification(popularity, prev.cr),
                }));
              }}
            />

            <EnemyTextField
              label="識別難易度"
              value={form.identification}
              onChange={(e) => updateForm("identification", e.target.value)}
            />

            <EnemyTextField
              label="初期タグ"
              value={initialTags}
              readOnly
              className="sm:col-span-2 lg:col-span-2"
            />

            <EnemyTextField
              label="タグ"
              value={form.tags}
              onChange={(e) => updateForm("tags", e.target.value)}
              placeholder="追加タグを入力（、 と , のどちらでも可）"
              className="sm:col-span-2 lg:col-span-2"
            />

            <EnemyTextareaField
              label="メモ"
              value={form.memo}
              onChange={(e) => updateForm("memo", e.target.value)}
              minHeightClassName="min-h-[160px]"
              className="sm:col-span-2 lg:col-span-4"
            />
          </EnemyFormGrid>

          {getEnemyTypeExplanation(form.enemyType) ? (
            <div className="mt-6 text-sm leading-8 text-neutral-800">
              {form.enemyType}：{getEnemyTypeExplanation(form.enemyType)}
            </div>
          ) : null}

          <EnemySectionDivider />

          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold">推奨ドロップ品</h2>
            <div className="grid gap-3 text-sm leading-8 text-neutral-800 sm:grid-cols-3">
              <p>{calculated.gold}</p>
              <p>{calculated.dropCore}</p>
              <p>{calculated.dropCatalyst}</p>
            </div>
          </div>

          <div className="mb-6">
            <FormControl label="ドロップ品の数">
              <input
                type="number"
                min={1}
                max={99}
                value={items.length}
                onChange={(e) => handleItemCountChange(e.target.valueAsNumber)}
                className={`${inputClassName} mb-4 w-24 text-sm`}
              />
            </FormControl>

            <div className="space-y-4">
              {items.map((item, index) => {
                const summaryName = item.name.trim() || "（未入力）";

                return (
                  <details
                    key={item.id}
                    className="rounded-2xl border border-neutral-300 p-4"
                  >
                    <summary className="cursor-pointer text-sm font-medium">
                      ドロップ品{index + 1}：{summaryName}
                    </summary>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <FormControl label="ダイス">
                        <EnemyDropDiceButtons
                          value={item.dice}
                          onChange={(value) => updateItem(item.id, "dice", value)}
                        />
                        <p className="mt-2 text-xs text-neutral-500">
                          ※
                          1〜6は複数選択が可能です。2つの数字を選択すると、間の数字は自動で選択されます。
                        </p>
                      </FormControl>

                      <EnemyTextField
                        label="アイテム名"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(item.id, "name", e.target.value)
                        }
                      />

                      <EnemyTextareaField
                        label="解説"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        minHeightClassName="min-h-[100px]"
                        className="sm:col-span-2"
                      />

                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className={smallButtonClassName}
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>

          <EnemySectionDivider />

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">能力値</h2>
            <button
              type="button"
              onClick={handleApplyCalculatedValues}
              className={smallButtonClassName}
            >
              推奨能力値を反映
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-neutral-700">
                基本能力値
              </h3>
              <EnemyFormGrid>
                <EnemyTextField
                  label="STR"
                  type="number"
                  min={0}
                  value={form.strength}
                  onChange={(e) =>
                    updateForm("strength", toNonNegativeNumber(e.target.value))
                  }
                />
                <EnemyTextField
                  label="DEX"
                  type="number"
                  min={0}
                  value={form.dexterity}
                  onChange={(e) =>
                    updateForm("dexterity", toNonNegativeNumber(e.target.value))
                  }
                />
                <EnemyTextField
                  label="POW"
                  type="number"
                  min={0}
                  value={form.power}
                  onChange={(e) =>
                    updateForm("power", toNonNegativeNumber(e.target.value))
                  }
                />
                <EnemyTextField
                  label="INT"
                  type="number"
                  min={0}
                  value={form.intelligence}
                  onChange={(e) =>
                    updateForm("intelligence", toNonNegativeNumber(e.target.value))
                  }
                />
              </EnemyFormGrid>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-neutral-700">
                判定値
              </h3>
              <div className="space-y-4">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
                  <div className="mb-3 text-sm font-semibold text-neutral-700">
                    回避
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <EnemyTextField
                      label="回避(固定値)"
                      type="number"
                      min={0}
                      value={form.avoid}
                      onChange={(e) =>
                        updateForm("avoid", toNonNegativeNumber(e.target.value))
                      }
                    />
                    <EnemyTextField
                      label="回避(ダイス)"
                      type="number"
                      min={0}
                      value={form.avoidDice}
                      onChange={(e) =>
                        updateForm(
                          "avoidDice",
                          toNonNegativeNumber(e.target.value),
                        )
                      }
                    />
                    <EnemyTextField
                      label="回避(判定)"
                      value={`${form.avoid} + ${form.avoidDice} D`}
                      readOnly
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
                  <div className="mb-3 text-sm font-semibold text-neutral-700">
                    抵抗
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <EnemyTextField
                      label="抵抗(固定値)"
                      type="number"
                      min={0}
                      value={form.resist}
                      onChange={(e) =>
                        updateForm("resist", toNonNegativeNumber(e.target.value))
                      }
                    />
                    <EnemyTextField
                      label="抵抗(ダイス)"
                      type="number"
                      min={0}
                      value={form.resistDice}
                      onChange={(e) =>
                        updateForm(
                          "resistDice",
                          toNonNegativeNumber(e.target.value),
                        )
                      }
                    />
                    <EnemyTextField
                      label="抵抗(判定)"
                      value={`${form.resist} + ${form.resistDice} D`}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-neutral-700">
                その他
              </h3>
              <EnemyFormGrid>
                <EnemyTextField
                  label="物理防御力"
                  type="number"
                  min={0}
                  value={form.physicalDefense}
                  onChange={(e) =>
                    updateForm(
                      "physicalDefense",
                      toNonNegativeNumber(e.target.value),
                    )
                  }
                />
                <EnemyTextField
                  label="魔法防御力"
                  type="number"
                  min={0}
                  value={form.magicDefense}
                  onChange={(e) =>
                    updateForm(
                      "magicDefense",
                      toNonNegativeNumber(e.target.value),
                    )
                  }
                />
                <EnemyTextField
                  label="最大HP"
                  type="number"
                  min={0}
                  value={form.hitPoint}
                  onChange={(e) =>
                    updateForm("hitPoint", toNonNegativeNumber(e.target.value))
                  }
                />
                <EnemyTextField
                  label="ヘイト倍率"
                  type="number"
                  min={0}
                  value={form.hate}
                  onChange={(e) =>
                    updateForm("hate", toNonNegativeNumber(e.target.value))
                  }
                />
                <EnemyTextField
                  label="行動力"
                  type="number"
                  min={0}
                  value={form.action}
                  onChange={(e) =>
                    updateForm("action", toNonNegativeNumber(e.target.value))
                  }
                />
                <EnemyTextField
                  label="移動力"
                  type="number"
                  min={0}
                  value={form.move}
                  onChange={(e) =>
                    updateForm("move", toNonNegativeNumber(e.target.value))
                  }
                />
                <EnemyTextField
                  label="因果力"
                  type="number"
                  min={0}
                  value={form.fate}
                  onChange={(e) =>
                    updateForm("fate", toNonNegativeNumber(e.target.value))
                  }
                />
              </EnemyFormGrid>
            </div>
          </div>
        </EnemyToolPanel>
      ) : null}

      {activeTab === "skills" ? (
        <EnemyToolPanel>
          <EnemySkillExamples
            exampleSkill={exampleSkill}
            gimmickSkill={gimmickSkill}
            showGimmickSkill={form.race === "ギミック"}
          />

          <div className="mb-6 flex flex-wrap items-end gap-4">
            <FormControl label="特技の数">
              <input
                type="number"
                min={1}
                max={99}
                value={skills.length}
                onChange={(e) => handleSkillCountChange(Number(e.target.value))}
                className={`${inputClassName} w-28`}
              />
            </FormControl>
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
                    <EnemyTextField
                      label="特技名"
                      value={skill.name}
                      onChange={(e) =>
                        updateSkill(skill.id, "name", e.target.value)
                      }
                      placeholder={exampleSkill.name}
                      className="sm:col-span-2"
                    />

                    <EnemyTextField
                      label="タグ"
                      value={skill.tags}
                      onChange={(e) =>
                        updateSkill(skill.id, "tags", e.target.value)
                      }
                      placeholder={exampleSkill.tags}
                    />

                    <EnemySelectField
                      label="タイミング"
                      value={skill.timing}
                      options={skillTimings as readonly string[]}
                      onChange={(e) =>
                        updateSkill(skill.id, "timing", e.target.value)
                      }
                    />

                    <EnemyTextField
                      label="命中値"
                      value={skill.roleAttack}
                      onChange={(e) =>
                        updateSkill(skill.id, "roleAttack", e.target.value)
                      }
                      placeholder={exampleSkill.roleAttack}
                    />

                    <EnemyTextField
                      label="判定"
                      value={skill.roleDefense}
                      onChange={(e) =>
                        updateSkill(skill.id, "roleDefense", e.target.value)
                      }
                      placeholder={exampleSkill.roleDefense}
                    />

                    <EnemyTextField
                      label="対象"
                      value={skill.target}
                      onChange={(e) =>
                        updateSkill(skill.id, "target", e.target.value)
                      }
                      placeholder={exampleSkill.target}
                    />

                    <EnemyTextField
                      label="射程"
                      value={skill.range}
                      onChange={(e) =>
                        updateSkill(skill.id, "range", e.target.value)
                      }
                      placeholder={exampleSkill.range}
                    />

                    <EnemyTextField
                      label="制限"
                      value={skill.limit}
                      onChange={(e) =>
                        updateSkill(skill.id, "limit", e.target.value)
                      }
                      className="sm:col-span-2 lg:col-span-3"
                    />

                    <EnemyTextareaField
                      label="効果"
                      value={skill.effect}
                      onChange={(e) =>
                        updateSkill(skill.id, "effect", e.target.value)
                      }
                      placeholder={exampleSkill.effect}
                      minHeightClassName="min-h-[120px]"
                      className="sm:col-span-2 lg:col-span-3"
                    />
                  </div>
                </details>
              );
            })}
          </div>
        </EnemyToolPanel>
      ) : null}

      {activeTab === "output" ? (
        <EnemyToolPanel>
          <div className="space-y-6">
            <EnemyOutputSummary
              form={form}
              items={items}
              outputSkills={outputSkills}
            />
            <EnemyOutputActions
              result={result}
              onGenerate={handleGenerate}
              onCopy={handleCopy}
              onDownloadXlsx={handleDownloadXlsx}
              onDownloadJson={handleDownloadJson}
            />
          </div>
        </EnemyToolPanel>
      ) : null}

      <EnemyNoticeSection />
    </PageShell>
  );
}
