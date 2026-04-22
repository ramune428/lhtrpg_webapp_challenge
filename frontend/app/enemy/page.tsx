"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import AppNav from "@/components/app-nav";
import {
  calculateEnemyValues,
  calculateIdentification,
  createEmptyDropItemInput,
  createEmptySkillInput,
  createEnemyCsv,
  createEnemyJson,
  createEnemyPiece,
  enemyRanks,
  enemyRaces,
  enemyTypes,
  getDefaultEnemyForm,
  getDefaultTags,
  getEnemyTypeExplanation,
  getGimmickSkill,
  getSkillExample,
  parseEnemyJson,
  popularityList,
  skillTimings,
  type EnemyDropItemInput,
  type EnemyFormData,
  type EnemySkillInput,
} from "@/utils/createEnemyPiece";

type EnemySkillRow = EnemySkillInput & { id: string };
type EnemyDropItemRow = EnemyDropItemInput & { id: string };

type TabKey = "basic" | "skills" | "output";

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function withSkillRowId(skill: EnemySkillInput): EnemySkillRow {
  return { id: makeId(), ...skill };
}

function withDropRowId(item: EnemyDropItemInput): EnemyDropItemRow {
  return { id: makeId(), ...item };
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

function buildCurrentFormData(
  form: EnemyFormData,
  skills: EnemySkillRow[],
  items: EnemyDropItemRow[]
): EnemyFormData {
  return {
    ...form,
    skills: skills.map(({ id, ...skill }) => skill),
    items: items.map(({ id, ...item }) => item),
  };
}

function TabButton(props: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const { active, onClick, children } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "border-b-2 px-3 py-2 text-sm transition",
        active
          ? "border-red-500 text-red-500"
          : "border-transparent text-neutral-700 hover:text-neutral-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function EnemyPage() {
  const initialForm = useMemo(() => getDefaultEnemyForm(), []);
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [form, setForm] = useState<EnemyFormData>(initialForm);
  const [skills, setSkills] = useState<EnemySkillRow[]>(
    initialForm.skills.map(withSkillRowId)
  );
  const [items, setItems] = useState<EnemyDropItemRow[]>(
    initialForm.items.map(withDropRowId)
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
    [form.enemyType, form.race, form.rank, form.cr]
  );

  const exampleSkill = useMemo(() => getSkillExample(calculated), [calculated]);
  const gimmickSkill = useMemo(() => getGimmickSkill(), []);
  const outputSkills = useMemo<EnemySkillRow[]>(() => {
    if (form.race === "ギミック") {
      return [{ id: "gimmick-auto-skill", ...gimmickSkill }, ...skills];
    }
    return skills;
  }, [form.race, gimmickSkill, skills]);

  const currentData = useMemo(
    () => buildCurrentFormData(form, skills, items),
    [form, skills, items]
  );

  const updateForm = <K extends keyof EnemyFormData>(
    key: K,
    value: EnemyFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateSkill = <K extends keyof Omit<EnemySkillRow, "id">>(
    id: string,
    key: K,
    value: EnemySkillRow[K]
  ) => {
    setSkills((prev) =>
      prev.map((skill) => (skill.id === id ? { ...skill, [key]: value } : skill))
    );
  };

  const updateItem = <K extends keyof Omit<EnemyDropItemRow, "id">>(
    id: string,
    key: K,
    value: EnemyDropItemRow[K]
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
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
    setStatusMessage("推奨値を入力欄へ反映しました。");
  };

  const handleApplyDefaultTags = () => {
    updateForm("tags", getDefaultTags(form.rank, form.race));
    setStatusMessage("タグ初期値を反映しました。");
  };

  const handleGenerate = () => {
    if (!form.name.trim()) {
      setStatusMessage("名称を入力してください。");
      setActiveTab("basic");
      return;
    }

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
    const next = getDefaultEnemyForm();
    setForm(next);
    setSkills(next.skills.map(withSkillRowId));
    setItems(next.items.map(withDropRowId));
    setResult("");
    setStatusMessage("");
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
      "application/json;charset=utf-8"
    );
    setStatusMessage("JSONをダウンロードしました。");
  };

  const handleDownloadCsv = () => {
    if (!form.name.trim()) {
      setStatusMessage("名称を入力してください。");
      return;
    }

    downloadTextFile(
      `${form.name || "enemy"}_CR${form.cr}.csv`,
      `\uFEFF${createEnemyCsv(currentData)}`,
      "text/csv;charset=utf-8"
    );
    setStatusMessage("CSVをダウンロードしました。");
  };

  const handleJsonImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const imported = parseEnemyJson(text);
      setForm(imported);
      setSkills(imported.skills.map(withSkillRowId));
      setItems(imported.items.map(withDropRowId));
      setResult("");
      setStatusMessage("JSONを読み込みました。");
    } catch (error) {
      console.error(error);
      setStatusMessage(
        error instanceof Error ? error.message : "JSONの読み込みに失敗しました。"
      );
    } finally {
      event.target.value = "";
    }
  };

  const addSkill = () => {
    setSkills((prev) => [...prev, withSkillRowId(createEmptySkillInput())]);
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => {
      const next = prev.filter((skill) => skill.id !== id);
      return next.length > 0 ? next : [withSkillRowId(createEmptySkillInput())];
    });
  };

  const addItem = () => {
    setItems((prev) => [...prev, withDropRowId(createEmptyDropItemInput())]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      return next.length > 0 ? next : [withDropRowId(createEmptyDropItemInput())];
    });
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <AppNav current="enemy" />

        <header className="mb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            LHTRPG- エネミーデータ/駒作成ツール（CCFOLIA）
          </h1>

          <p className="text-sm leading-8 text-neutral-800">
            Notion版の
            「エネミー情報入力」
            「特技情報入力」
            「エネミーデータ出力」
            を、1ページ内のタブ切り替えで再構成しています。
          </p>

          <div className="mt-4 text-sm text-neutral-600">
            <Link href="/enemy/subpages" className="underline underline-offset-4">
              ← エネミー側サブページへ戻る
            </Link>
          </div>
        </header>

        <section className="mb-6 border-b border-neutral-300">
          <div className="flex flex-wrap gap-2">
            <TabButton
              active={activeTab === "basic"}
              onClick={() => setActiveTab("basic")}
            >
              エネミー情報入力
            </TabButton>
            <TabButton
              active={activeTab === "skills"}
              onClick={() => setActiveTab("skills")}
            >
              特技情報入力
            </TabButton>
            <TabButton
              active={activeTab === "output"}
              onClick={() => setActiveTab("output")}
            >
              エネミーデータ出力
            </TabButton>
          </div>
        </section>

        <p className="mb-6 min-h-[1.5rem] text-sm text-neutral-600">{statusMessage}</p>

        {activeTab === "basic" ? (
          <section className="rounded-2xl border border-neutral-300 p-6">
            <div className="mb-8">
              <label className="inline-block cursor-pointer rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium transition hover:bg-neutral-50">
                Upload JSON
                <input
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={handleJsonImport}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium">名称</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">ランク</label>
                <select
                  value={form.rank}
                  onChange={(e) =>
                    updateForm("rank", e.target.value as EnemyFormData["rank"])
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                >
                  {enemyRanks.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">CR</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={form.cr}
                  onChange={(e) => {
                    const nextCr = Number(e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      cr: nextCr,
                      identification: calculateIdentification(prev.popularity, nextCr),
                    }));
                  }}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">タイプ</label>
                <select
                  value={form.enemyType}
                  onChange={(e) =>
                    updateForm("enemyType", e.target.value as EnemyFormData["enemyType"])
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                >
                  {enemyTypes.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">大種族</label>
                <select
                  value={form.race}
                  onChange={(e) =>
                    updateForm("race", e.target.value as EnemyFormData["race"])
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                >
                  {enemyRaces.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">知名度</label>
                <select
                  value={form.popularity}
                  onChange={(e) => {
                    const popularity = e.target.value as EnemyFormData["popularity"];
                    setForm((prev) => ({
                      ...prev,
                      popularity,
                      identification: calculateIdentification(popularity, prev.cr),
                    }));
                  }}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                >
                  {popularityList.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">識別難易度</label>
                <input
                  type="text"
                  value={form.identification}
                  onChange={(e) => updateForm("identification", e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="mb-2 block text-sm font-medium">タグ</label>
                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => updateForm("tags", e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDefaultTags}
                    className="rounded-xl border border-neutral-300 px-4 py-3 text-sm transition hover:bg-neutral-50"
                  >
                    タグ初期値を反映
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="mb-2 block text-sm font-medium">メモ</label>
                <textarea
                  value={form.memo}
                  onChange={(e) => updateForm("memo", e.target.value)}
                  className="min-h-[160px] w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            {getEnemyTypeExplanation(form.enemyType) ? (
              <div className="mt-6 text-sm leading-8 text-neutral-800">
                {form.enemyType}：{getEnemyTypeExplanation(form.enemyType)}
              </div>
            ) : null}

            <hr className="my-8 border-neutral-300" />

            <div className="mb-6">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold">推奨ドロップ品</h2>
                <button
                  type="button"
                  onClick={handleApplyCalculatedValues}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-sm transition hover:bg-neutral-50"
                >
                  推奨値を入力欄へ反映
                </button>
              </div>

              <div className="grid gap-3 text-sm leading-8 text-neutral-800 sm:grid-cols-3">
                <p>{calculated.gold}</p>
                <p>{calculated.dropCore}</p>
                <p>{calculated.dropCatalyst}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">ドロップ品の数</label>
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-xl border border-neutral-300 px-4 py-3 text-sm">
                  {items.length}
                </span>
                <button
                  type="button"
                  onClick={addItem}
                  className="rounded-xl border border-neutral-300 px-4 py-3 text-sm transition hover:bg-neutral-50"
                >
                  追加
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <details
                    key={item.id}
                    className="rounded-2xl border border-neutral-300 p-4"
                  >
                    <summary className="cursor-pointer text-sm font-medium">
                      ドロップ品{index + 1}
                    </summary>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          ダイス
                        </label>
                        <input
                          type="text"
                          value={item.dice}
                          onChange={(e) => updateItem(item.id, "dice", e.target.value)}
                          placeholder="固定 / 1,2,3 / 1～6"
                          className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          アイテム名
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, "name", e.target.value)}
                          className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-medium">
                          解説
                        </label>
                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          className="min-h-[100px] w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="rounded-xl border border-neutral-300 px-4 py-2 text-sm transition hover:bg-neutral-50"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <hr className="my-8 border-neutral-300" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium">STR</label>
                <input
                  type="number"
                  value={form.strength}
                  onChange={(e) => updateForm("strength", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">DEX</label>
                <input
                  type="number"
                  value={form.dexterity}
                  onChange={(e) => updateForm("dexterity", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">POW</label>
                <input
                  type="number"
                  value={form.power}
                  onChange={(e) => updateForm("power", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">INT</label>
                <input
                  type="number"
                  value={form.intelligence}
                  onChange={(e) => updateForm("intelligence", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">回避(固定値)</label>
                <input
                  type="number"
                  value={form.avoid}
                  onChange={(e) => updateForm("avoid", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">回避(Dice)</label>
                <input
                  type="number"
                  value={form.avoidDice}
                  onChange={(e) => updateForm("avoidDice", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">抵抗(固定値)</label>
                <input
                  type="number"
                  value={form.resist}
                  onChange={(e) => updateForm("resist", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">抵抗(Dice)</label>
                <input
                  type="number"
                  value={form.resistDice}
                  onChange={(e) => updateForm("resistDice", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">物理防御力</label>
                <input
                  type="number"
                  value={form.physicalDefense}
                  onChange={(e) =>
                    updateForm("physicalDefense", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">魔法防御力</label>
                <input
                  type="number"
                  value={form.magicDefense}
                  onChange={(e) => updateForm("magicDefense", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">最大HP</label>
                <input
                  type="number"
                  value={form.hitPoint}
                  onChange={(e) => updateForm("hitPoint", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">ヘイト倍率</label>
                <input
                  type="number"
                  value={form.hate}
                  onChange={(e) => updateForm("hate", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">行動力</label>
                <input
                  type="number"
                  value={form.action}
                  onChange={(e) => updateForm("action", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">移動力</label>
                <input
                  type="number"
                  value={form.move}
                  onChange={(e) => updateForm("move", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">因果力</label>
                <input
                  type="number"
                  value={form.fate}
                  onChange={(e) => updateForm("fate", Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "skills" ? (
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

            {form.race === "ギミック" ? (
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

            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-xl border border-neutral-300 px-4 py-3 text-sm">
                特技の数: {skills.length}
              </span>
              <button
                type="button"
                onClick={addSkill}
                className="rounded-xl border border-neutral-300 px-4 py-3 text-sm transition hover:bg-neutral-50"
              >
                追加
              </button>
            </div>

            <div className="space-y-4">
              {skills.map((skill, index) => (
                <details
                  key={skill.id}
                  className="rounded-2xl border border-neutral-300 p-4"
                  open={index === 0}
                >
                  <summary className="cursor-pointer text-sm font-medium">
                    特技{index + 1}
                  </summary>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium">
                        特技名
                      </label>
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                        placeholder={exampleSkill.name}
                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">タグ</label>
                      <input
                        type="text"
                        value={skill.tags}
                        onChange={(e) => updateSkill(skill.id, "tags", e.target.value)}
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
                        onChange={(e) =>
                          updateSkill(skill.id, "timing", e.target.value)
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
                      <label className="mb-2 block text-sm font-medium">
                        命中値
                      </label>
                      <input
                        type="text"
                        value={skill.roleAttack}
                        onChange={(e) =>
                          updateSkill(skill.id, "roleAttack", e.target.value)
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
                        onChange={(e) =>
                          updateSkill(skill.id, "roleDefense", e.target.value)
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
                        onChange={(e) => updateSkill(skill.id, "target", e.target.value)}
                        placeholder={exampleSkill.target}
                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">射程</label>
                      <input
                        type="text"
                        value={skill.range}
                        onChange={(e) => updateSkill(skill.id, "range", e.target.value)}
                        placeholder={exampleSkill.range}
                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="mb-2 block text-sm font-medium">制限</label>
                      <input
                        type="text"
                        value={skill.limit}
                        onChange={(e) => updateSkill(skill.id, "limit", e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="mb-2 block text-sm font-medium">効果</label>
                      <textarea
                        value={skill.effect}
                        onChange={(e) => updateSkill(skill.id, "effect", e.target.value)}
                        placeholder={exampleSkill.effect}
                        className="min-h-[120px] w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.id)}
                        className="rounded-xl border border-neutral-300 px-4 py-2 text-sm transition hover:bg-neutral-50"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "output" ? (
          <section className="rounded-2xl border border-neutral-300 p-6">
            <div className="space-y-6 text-sm leading-8 text-neutral-800">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <p>名称: {form.name || "-"}</p>
                <p>ランク: {form.rank}</p>
                <p>CR: {form.cr}</p>
                <p>タイプ: {form.enemyType}</p>
                <p>大種族: {form.race}</p>
                <p>知名度: {form.popularity}</p>
                <p>識別難易度: {form.identification}</p>
                <p>タグ: [{form.tags}]</p>
              </div>

              <div>
                <p className="mb-1 font-medium">メモ:</p>
                <p className="whitespace-pre-wrap">{form.memo || "-"}</p>
              </div>

              <hr className="border-neutral-300" />

              <div>
                <p className="mb-2 font-medium">ドロップ品:</p>
                <div className="space-y-2">
                  {items.filter((item) => item.name.trim() || item.dice.trim()).length ===
                  0 ? (
                    <p>-</p>
                  ) : (
                    items
                      .filter((item) => item.name.trim() || item.dice.trim())
                      .map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-neutral-200 p-3"
                        >
                          <p>ダイス: {item.dice || "-"}</p>
                          <p>アイテム名: {item.name || "-"}</p>
                          <p>解説: {item.description || "-"}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <hr className="border-neutral-300" />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <p>STR: {form.strength}</p>
                <p>DEX: {form.dexterity}</p>
                <p>POW: {form.power}</p>
                <p>INT: {form.intelligence}</p>
                <p>回避: {form.avoid} + {form.avoidDice} D</p>
                <p>抵抗: {form.resist} + {form.resistDice} D</p>
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
                  {outputSkills
                    .filter((skill) => skill.name.trim() || skill.effect.trim())
                    .map((skill) => (
                      <div
                        key={skill.id}
                        className="rounded-xl border border-neutral-200 p-3"
                      >
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
                        <p className="whitespace-pre-wrap">効果: {skill.effect || "-"}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50"
                >
                  コマンドを生成する
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50"
                >
                  コピー
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50"
                >
                  クリア
                </button>
              </div>

              <textarea
                value={result}
                readOnly
                className="min-h-[180px] w-full resize-y rounded-xl border border-neutral-300 px-4 py-3 text-sm leading-6 outline-none"
              />

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:bg-neutral-50"
                >
                  Download CSV
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:bg-neutral-50"
                >
                  Download JSON
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}