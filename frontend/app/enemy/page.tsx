"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import AppNav from "@/components/app-nav";
import PageLinkCard from "@/components/page-link-card";
import {
  CHARACTER_PAGE_LINKS,
  ENEMY_PAGE_LINKS,
  EXTERNAL_LINKS,
  TOOL_CONFIG,
  TOOL_TITLES,
} from "@/components/tool-config";
import {
  calculateEnemyValues,
  calculateIdentification,
  createEmptyDropItemInput,
  createEmptySkillInput,
  createEnemyXlsx,
  createEnemyJson,
  createEnemyPiece,
  parseEnemyXlsx,
  enemyRanks,
  enemyRaces,
  enemyTypes,
  getCombinedTagText,
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

const BODY_TEXT_CLASS = "text-sm leading-8 text-neutral-800";
const BODY_LINK_CLASS =
  "text-sm font-medium text-neutral-700 underline underline-offset-4";

const diceButtonValues = ["固定", "1", "2", "3", "4", "5", "6"] as const;
// type DiceButtonValue = (typeof diceButtonValues)[number];

function normalizeDropDiceText(dice: string): string {
  return dice
    .replace(/[０-９]/g, (value) =>
      String.fromCharCode(value.charCodeAt(0) - 0xfee0),
    )
    .replace(/[，、]/g, ",")
    .replace(/[～〜－―ー−]/g, "~");
}

function getSelectedDiceValues(dice: string): Set<string> {
  const selected = new Set<string>();
  const normalized = normalizeDropDiceText(dice);

  for (const match of normalized.matchAll(/([1-6])\s*[~-]\s*([1-6])/g)) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    const min = Math.min(start, end);
    const max = Math.max(start, end);

    for (let value = min; value <= max; value += 1) {
      selected.add(String(value));
    }
  }

  for (const match of normalized.matchAll(/[1-6]/g)) {
    selected.add(match[0]);
  }

  return selected;
}

function getDiceRangeBoundaryValues(selected: Set<string>): Set<string> {
  const sortedValues = Array.from(selected)
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= 6)
    .sort((a, b) => a - b);

  const boundaries = new Set<string>();

  if (sortedValues.length === 0) {
    return boundaries;
  }

  boundaries.add(String(sortedValues[0]));

  if (sortedValues.length >= 2) {
    boundaries.add(String(sortedValues[sortedValues.length - 1]));
  }

  return boundaries;
}

function toFullWidthDiceValue(value: number): string {
  return String.fromCharCode("０".charCodeAt(0) + value);
}

function normalizeDiceRangeSelection(selected: Set<string>): string {
  const sortedValues = Array.from(selected)
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= 6)
    .sort((a, b) => a - b);

  if (sortedValues.length === 0) {
    return "";
  }

  if (sortedValues.length === 1) {
    return toFullWidthDiceValue(sortedValues[0]);
  }

  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];

  return `${toFullWidthDiceValue(min)}～${toFullWidthDiceValue(max)}`;
}

function formatDropDiceForOutput(dice: string): string {
  const trimmedDice = dice.trim();

  if (trimmedDice === "固定") {
    return "固定";
  }

  const selected = getSelectedDiceValues(trimmedDice);
  const formattedDice = normalizeDiceRangeSelection(selected);

  return formattedDice || trimmedDice;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toNonNegativeNumber(value: string) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? Math.max(0, numberValue) : 0;
}

function clampInteger(
  value: number,
  min: number,
  max: number,
  fallback: number,
) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, Math.floor(value)));
}

function normalizeCr(value: number) {
  return clampInteger(value, 1, 30, 1);
}

function normalizeCount(value: number, fallback: number) {
  return clampInteger(value, 1, 99, fallback);
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
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <AppNav current="enemy" />

        <header className="mb-10">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {TOOL_TITLES.enemy}
          </h1>

          <p className={BODY_TEXT_CLASS}>
            この{TOOL_CONFIG.enemy.toolLabel}は
            <Link
              href={EXTERNAL_LINKS.enemyDataGuide}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              「ログ・ホライズンTRPGエネミーデータガイド（高CR対応拡張版）」
            </Link>
            より提供されている支援資料を基に作成しています。
          </p>
        </header>

        <section className="mb-10 rounded-2xl border border-neutral-300 p-5">
          <p className="text-sm leading-8 text-neutral-800">
            PL向けの{TOOL_CONFIG.character.toolLabel}はこちら
          </p>
          <div className="mt-3">
            <p className="text-sm leading-8 text-neutral-800">
              →{" "}
              <Link
                href={CHARACTER_PAGE_LINKS.home.href}
                className={BODY_LINK_CLASS}
              >
                {TOOL_TITLES.character}
              </Link>
            </p>
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-neutral-300 p-6 space-y-5 text-sm leading-8 text-neutral-800">
          <h2 className="text-2xl font-semibold text-neutral-950">
            {TOOL_CONFIG.enemy.toolLabel}を使用する前に
          </h2>

          <p>
            このツールは「ログ・ホライズンTRPGエネミーデータガイド（高CR対応拡張版）」を参考に作成しており、各能力値、推奨ドロップ品、推奨特技ダメージを自動的に計算します。対応しているCRは
            <strong>1〜30</strong>です。
          </p>

          <p>
            作成したエネミーデータは「CCFOLIA」、「XLSX」、「JSON」の3種類の形式で出力できます。XLSXファイルおよびJSONファイルを読み込むことでエネミーデータを編集できます。
          </p>

          <p>
            また、
            <Link
              href={EXTERNAL_LINKS.lhzDatabase}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              「ログ・ホライズンTRPG冒険者窓口 -データベース-」
            </Link>
            のエネミーデータも読み込むことができますが、読み込む前に一手間必要です。使用する前に、
            <Link
              href={ENEMY_PAGE_LINKS.officialData.href}
              className="underline underline-offset-4"
            >
              {ENEMY_PAGE_LINKS.officialData.label}
            </Link>
            をご確認ください。一部のエネミーに関してエラーの発生を確認しています。大抵の原因は文字コードの相違です。発見した場合は、お問い合わせフォームまでご一報ください。
          </p>

          <p>
            詳しいエネミーデータの自作方法については「ログ・ホライズンTRPGエネミーデータガイド（高CR対応拡張版）」やルールブックをご確認ください。
          </p>
        </section>

        <section className="mb-12 rounded-2xl border border-neutral-300 p-6 space-y-6 text-sm leading-8 text-neutral-800">
          <h2 className="text-2xl font-semibold text-neutral-950">使い方</h2>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-neutral-950">
              1. エネミー情報入力欄について
            </h3>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                「名称」「ランク」「CR」「タイプ」「大種族」「知名度」「タグ」「メモ」を入力してください。
                <br />
                ※「因果力」を除く能力値は自動的に計算されます。
              </li>
              <li>
                ドロップ品を入力してください。ドロップ品の数を決定し、推奨ドロップ品を参考に「ダイス」「アイテム名」を入力してください。
                <br />
                ※「解説」は入力しなくても問題ありません。
              </li>
              <li>各能力値について修正したい箇所があれば修正してください。</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-neutral-950">
              2. 特技情報入力欄について
            </h3>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                「大種族」が「ギミック」の時は専用の特技《意志なき機構》が自動で追加されます。
              </li>
              <li>「特技の数」を決定してください。</li>
              <li>
                各特技の情報を入力してください。
                <br />
                ※「特技名」「効果」を記入していない場合は反映されません。
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-neutral-950">
              3. エネミーデータ出力欄について
            </h3>
            <p>
              エネミーデータの確認ページです。このページに表示されていない場合は反映されていません。
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                「コマンドを生成する」→
                CCFOLIA用のコマンドが表示されます。CCFOLIAに貼り付けると「キャラクター駒」が作成できます。
              </li>
              <li>
                「Download XLSX」→
                XLSXファイルで保存されます。出力したファイルは読み込むことができます。
              </li>
              <li>
                「Download JSON」→
                JSONファイルで保存されます。出力したファイルは読み込むことができます。
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold">
            エネミーデータ/駒作成ツール
          </h2>
        </section>

        <section className="mb-6 border-b border-neutral-300">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <TabButton
                active={activeTab === "basic"}
                onClick={() => setActiveTab("basic")}
              >
                エネミー情報
              </TabButton>
              <TabButton
                active={activeTab === "skills"}
                onClick={() => setActiveTab("skills")}
              >
                特技情報
              </TabButton>
              <TabButton
                active={activeTab === "output"}
                onClick={() => setActiveTab("output")}
              >
                データ出力
              </TabButton>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="mb-1 rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              入力内容をクリア
            </button>
          </div>
        </section>

        <p className="mb-6 min-h-[1.5rem] text-sm text-neutral-600">
          {statusMessage}
        </p>

        {activeTab === "basic" ? (
          <section className="rounded-2xl border border-neutral-300 p-6">
            <div className="mb-8">
              <label className="inline-block cursor-pointer rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium transition hover:bg-neutral-50">
                入力ファイル読込
                <input
                  type="file"
                  accept="application/json,.json,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  className="hidden"
                  onChange={handleImportFile}
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
                  onChange={(e) => {
                    const nextRank = e.target.value as EnemyFormData["rank"];
                    updateForm("rank", nextRank);
                  }}
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
                    const nextCr = normalizeCr(Number(e.target.value));
                    setForm((prev) => ({
                      ...prev,
                      cr: nextCr,
                      identification: calculateIdentification(
                        prev.popularity,
                        nextCr,
                      ),
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
                    updateForm(
                      "enemyType",
                      e.target.value as EnemyFormData["enemyType"],
                    )
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
                  onChange={(e) => {
                    const nextRace = e.target.value as EnemyFormData["race"];
                    updateForm("race", nextRace);
                  }}
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
                    const popularity = e.target
                      .value as EnemyFormData["popularity"];
                    setForm((prev) => ({
                      ...prev,
                      popularity,
                      identification: calculateIdentification(
                        popularity,
                        prev.cr,
                      ),
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
                <label className="mb-2 block text-sm font-medium">
                  識別難易度
                </label>
                <input
                  type="text"
                  value={form.identification}
                  onChange={(e) => updateForm("identification", e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  初期タグ
                </label>
                <input
                  type="text"
                  value={initialTags}
                  readOnly
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 outline-none"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-2">
                <label className="mb-2 block text-sm font-medium">タグ</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => updateForm("tags", e.target.value)}
                  placeholder="追加タグを入力（、 と , のどちらでも可）"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                />
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
              <h2 className="mb-3 text-lg font-semibold">推奨ドロップ品</h2>

              <div className="grid gap-3 text-sm leading-8 text-neutral-800 sm:grid-cols-3">
                <p>{calculated.gold}</p>
                <p>{calculated.dropCore}</p>
                <p>{calculated.dropCatalyst}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                ドロップ品の数
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={items.length}
                onChange={(e) => handleItemCountChange(e.target.valueAsNumber)}
                className="mb-4 w-24 rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-500"
              />

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
                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            ダイス
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {diceButtonValues.map((diceValue) => {
                              const selected = getSelectedDiceValues(item.dice);
                              const boundaryValues =
                                getDiceRangeBoundaryValues(selected);
                              const isFixedActive = item.dice.trim() === "固定";
                              const isActive =
                                diceValue === "固定"
                                  ? isFixedActive
                                  : selected.has(diceValue);
                              const isAutoFilled =
                                diceValue !== "固定" &&
                                isActive &&
                                !boundaryValues.has(diceValue);

                              return (
                                <button
                                  key={diceValue}
                                  type="button"
                                  disabled={isAutoFilled}
                                  title={
                                    isAutoFilled
                                      ? "両端の値から自動で選択されています"
                                      : undefined
                                  }
                                  onClick={() => {
                                    if (isAutoFilled) {
                                      return;
                                    }

                                    if (diceValue === "固定") {
                                      updateItem(item.id, "dice", "固定");
                                      return;
                                    }

                                    const nextSelected = getSelectedDiceValues(
                                      item.dice,
                                    );
                                    if (nextSelected.has(diceValue)) {
                                      nextSelected.delete(diceValue);
                                    } else {
                                      nextSelected.add(diceValue);
                                    }

                                    const nextDice =
                                      normalizeDiceRangeSelection(nextSelected);
                                    updateItem(item.id, "dice", nextDice);
                                  }}
                                  className={[
                                    "min-w-12 rounded-xl border px-4 py-3 text-sm transition",
                                    isAutoFilled
                                      ? "border-red-300 bg-red-100 text-red-700 cursor-default"
                                      : isActive
                                        ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
                                        : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50",
                                  ].join(" ")}
                                >
                                  {diceValue}
                                </button>
                              );
                            })}
                          </div>
                          <p className="mt-2 text-xs text-neutral-500">
                            ※
                            1〜6は複数選択が可能です。2つの数字を選択すると、間の数字は自動で選択されます。
                          </p>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            アイテム名
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              updateItem(item.id, "name", e.target.value)
                            }
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
                  );
                })}
              </div>
            </div>

            <hr className="my-8 border-neutral-300" />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">能力値</h2>
              <button
                type="button"
                onClick={handleApplyCalculatedValues}
                className="rounded-xl border border-neutral-300 px-4 py-2 text-sm transition hover:bg-neutral-50"
              >
                推奨能力値を反映
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">
                  基本能力値
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">STR</label>
                    <input
                      type="number"
                      min={0}
                      value={form.strength}
                      onChange={(e) =>
                        updateForm(
                          "strength",
                          toNonNegativeNumber(e.target.value),
                        )
                      }
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">DEX</label>
                    <input
                      type="number"
                      min={0}
                      value={form.dexterity}
                      onChange={(e) =>
                        updateForm(
                          "dexterity",
                          toNonNegativeNumber(e.target.value),
                        )
                      }
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">POW</label>
                    <input
                      type="number"
                      min={0}
                      value={form.power}
                      onChange={(e) =>
                        updateForm("power", toNonNegativeNumber(e.target.value))
                      }
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">INT</label>
                    <input
                      type="number"
                      min={0}
                      value={form.intelligence}
                      onChange={(e) =>
                        updateForm(
                          "intelligence",
                          toNonNegativeNumber(e.target.value),
                        )
                      }
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                </div>
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
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          回避(固定値)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={form.avoid}
                          onChange={(e) =>
                            updateForm(
                              "avoid",
                              toNonNegativeNumber(e.target.value),
                            )
                          }
                          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          回避(ダイス)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={form.avoidDice}
                          onChange={(e) =>
                            updateForm(
                              "avoidDice",
                              toNonNegativeNumber(e.target.value),
                            )
                          }
                          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          回避(判定)
                        </label>
                        <input
                          type="text"
                          value={`${form.avoid} + ${form.avoidDice} D`}
                          readOnly
                          className="w-full cursor-default rounded-xl border border-neutral-300 bg-neutral-100 px-4 py-3 font-medium text-neutral-700 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
                    <div className="mb-3 text-sm font-semibold text-neutral-700">
                      抵抗
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          抵抗(固定値)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={form.resist}
                          onChange={(e) =>
                            updateForm(
                              "resist",
                              toNonNegativeNumber(e.target.value),
                            )
                          }
                          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          抵抗(ダイス)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={form.resistDice}
                          onChange={(e) =>
                            updateForm(
                              "resistDice",
                              toNonNegativeNumber(e.target.value),
                            )
                          }
                          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          抵抗(判定)
                        </label>
                        <input
                          type="text"
                          value={`${form.resist} + ${form.resistDice} D`}
                          readOnly
                          className="w-full cursor-default rounded-xl border border-neutral-300 bg-neutral-100 px-4 py-3 font-medium text-neutral-700 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">
                  その他
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      物理防御力
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.physicalDefense}
                      onChange={(e) =>
                        updateForm(
                          "physicalDefense",
                          toNonNegativeNumber(e.target.value),
                        )
                      }
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      魔法防御力
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.magicDefense}
                      onChange={(e) =>
                        updateForm(
                          "magicDefense",
                          toNonNegativeNumber(e.target.value),
                        )
                      }
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">最大HP</label>
                    <input
                      type="number"
                      min={0}
                      value={form.hitPoint}
                      onChange={(e) =>
                        updateForm(
                          "hitPoint",
                          toNonNegativeNumber(e.target.value),
                        )
                      }
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      ヘイト倍率
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.hate}
                      onChange={(e) =>
                        updateForm("hate", toNonNegativeNumber(e.target.value))
                      }
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">行動力</label>
                    <input
                      type="number"
                      min={0}
                      value={form.action}
                      onChange={(e) =>
                        updateForm(
                          "action",
                          toNonNegativeNumber(e.target.value),
                        )
                      }
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">移動力</label>
                    <input
                      type="number"
                      min={0}
                      value={form.move}
                      onChange={(e) =>
                        updateForm("move", toNonNegativeNumber(e.target.value))
                      }
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">因果力</label>
                    <input
                      type="number"
                      min={0}
                      value={form.fate}
                      onChange={(e) =>
                        updateForm("fate", toNonNegativeNumber(e.target.value))
                      }
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "skills" ? (
          <section className="rounded-2xl border border-neutral-300 p-6">
            <details
              className="mb-6 rounded-2xl border border-neutral-300 p-4"
              open
            >
              <summary className="cursor-pointer text-sm font-medium">
                例
              </summary>
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
              <details
                className="mb-6 rounded-2xl border border-neutral-300 p-4"
                open
              >
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
                <label className="mb-2 block text-sm font-medium">
                  特技の数
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={skills.length}
                  onChange={(e) =>
                    handleSkillCountChange(Number(e.target.value))
                  }
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
                        <label className="mb-2 block text-sm font-medium">
                          特技名
                        </label>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) =>
                            updateSkill(skill.id, "name", e.target.value)
                          }
                          placeholder={exampleSkill.name}
                          className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          タグ
                        </label>
                        <input
                          type="text"
                          value={skill.tags}
                          onChange={(e) =>
                            updateSkill(skill.id, "tags", e.target.value)
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
                        <label className="mb-2 block text-sm font-medium">
                          判定
                        </label>
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
                        <label className="mb-2 block text-sm font-medium">
                          対象
                        </label>
                        <input
                          type="text"
                          value={skill.target}
                          onChange={(e) =>
                            updateSkill(skill.id, "target", e.target.value)
                          }
                          placeholder={exampleSkill.target}
                          className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          射程
                        </label>
                        <input
                          type="text"
                          value={skill.range}
                          onChange={(e) =>
                            updateSkill(skill.id, "range", e.target.value)
                          }
                          placeholder={exampleSkill.range}
                          className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="mb-2 block text-sm font-medium">
                          制限
                        </label>
                        <input
                          type="text"
                          value={skill.limit}
                          onChange={(e) =>
                            updateSkill(skill.id, "limit", e.target.value)
                          }
                          className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="mb-2 block text-sm font-medium">
                          効果
                        </label>
                        <textarea
                          value={skill.effect}
                          onChange={(e) =>
                            updateSkill(skill.id, "effect", e.target.value)
                          }
                          placeholder={exampleSkill.effect}
                          className="min-h-[120px] w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                        />
                      </div>
                    </div>
                  </details>
                );
              })}
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
                  {items.filter((item) => item.name.trim() || item.dice.trim())
                    .length === 0 ? (
                    <p>-</p>
                  ) : (
                    items
                      .filter((item) => item.name.trim() || item.dice.trim())
                      .map((item, index) => {
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
                              <span>
                                ドロップ品{index + 1}：{summaryName}
                              </span>
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
                  {outputSkills.filter(
                    (skill) => skill.name.trim() || skill.effect.trim(),
                  ).length === 0 ? (
                    <p>-</p>
                  ) : (
                    outputSkills
                      .filter((skill) => skill.name.trim() || skill.effect.trim())
                      .map((skill, index) => {
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
                              <span>
                                特技{index + 1}：{summaryName}
                              </span>
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
              </div>

              <textarea
                value={result}
                readOnly
                className="min-h-[180px] w-full resize-y rounded-xl border border-neutral-300 px-4 py-3 text-sm leading-6 outline-none"
              />

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={handleDownloadXlsx}
                  className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:bg-neutral-50"
                >
                  Download XLSX
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

        <section className="mt-12 rounded-2xl border border-neutral-300 p-6 space-y-4 text-sm leading-8 text-neutral-800">
          <h2 className="text-2xl font-semibold text-neutral-950">お知らせ</h2>

          <div className="space-y-3">
            <p>関連ページはこちら</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <PageLinkCard
                href={ENEMY_PAGE_LINKS.officialData.href}
                title={ENEMY_PAGE_LINKS.officialData.label}
                description="公式データベースから取得したJSONファイルの読み込み手順を確認できます。"
              />
              <PageLinkCard
                href={ENEMY_PAGE_LINKS.howTo.href}
                title={ENEMY_PAGE_LINKS.howTo.label}
                description="各入力欄と出力手順を画像付きで確認できます。"
              />
              <PageLinkCard
                href={ENEMY_PAGE_LINKS.formula.href}
                title={ENEMY_PAGE_LINKS.formula.label}
                description="能力値や推奨値の計算式を確認できます。"
              />
              <PageLinkCard
                href={ENEMY_PAGE_LINKS.updates.href}
                title={ENEMY_PAGE_LINKS.updates.label}
                description="公開後の変更内容や過去バージョンの履歴を確認できます。"
              />
            </div>
          </div>

          <p>
            「コマンドが表示されない」「CCFOLIAに貼り付けできない」などのエラーが発生した場合は、
            下記Googleフォームにてご連絡ください。
            ご意見・ご要望をお送りいただけますと、今後の改善や機能追加の参考にさせていただきます。
          </p>
          <p>
            Googleフォーム →{" "}
            <Link
              href={EXTERNAL_LINKS.feedbackForm}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              {EXTERNAL_LINKS.feedbackForm}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
