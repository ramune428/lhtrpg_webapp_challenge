"use client";

import Link from "next/link";
import AppNav from "@/components/app-nav";
import PageLinkCard from "@/components/page-link-card";
import { EnemyCalculatedValuesPanel, EnemyDropItemSection, EnemyHitPointMultiplierPreview, EnemyHitPointRecommendationPreview, EnemyOutputPanel, EnemyPreviewSection, EnemySkillSection, TabButton } from "@/components/enemy";
import {
  CHARACTER_PAGE_LINKS,
  ENEMY_PAGE_LINKS,
  EXTERNAL_LINKS,
  TOOL_CONFIG,
  TOOL_TITLES,
} from "@/components/tool-config";
import { useEnemyForm } from "@/hooks/useEnemyForm";
import {
  calculateIdentification,
  enemyRanks,
  enemyRaces,
  selectableEnemyTypes,
  getEnemyTypeExplanation,
  normalizeCr,
  popularityList,
  toNonNegativeNumber,
  type EnemyFormData,
} from "@/utils/enemy";


const BODY_TEXT_CLASS = "text-sm leading-8 text-neutral-800";
const BODY_LINK_CLASS =
  "text-sm font-medium text-neutral-700 underline underline-offset-4";


export default function EnemyPage() {
  const {
    activeTab,
    calculated,
    exampleSkill,
    form,
    gimmickSkill,
    handleApplyCalculatedValues,
    handleClear,
    handleCopy,
    handleDownloadJson,
    handleDownloadXlsx,
    handleGenerate,
    handleImportFile,
    handleItemCountChange,
    handleSkillCountChange,
    initialTags,
    isEnemyTypeLocked,
    items,
    outputSkills,
    removeItem,
    removeSkill,
    result,
    setActiveTab,
    setForm,
    skills,
    statusMessage,
    updateForm,
    updateItem,
    updateSkill,
  } = useEnemyForm();

  const recommendedValue = (value: number) =>
    form.enemyType === "不明" ? "-" : value;
  const enemyTypeOptions = isEnemyTypeLocked
    ? [form.enemyType]
    : selectableEnemyTypes;


  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <AppNav current="enemy" />

        <header className="mb-10">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {TOOL_TITLES.enemy}
          </h1>

          <p className={BODY_TEXT_CLASS}>
            {TOOL_TITLES.enemy}はログ・ホライズンTRPG（LHTRPG）のGM向けに、
            エネミーデータの作成やCCFOLIA用のキャラクター駒を作成するための生成を行うツールです。
            <br/>
            このツールは
            <Link
              href={EXTERNAL_LINKS.enemyDataGuide}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              「ログ・ホライズンTRPGエネミーデータガイド（高CR対応拡張版）」
            </Link>
            を基に作成しています。
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
                ※ 識別難易度は推奨値が自動で反映されます。
              </li>
              <li>
                ドロップ品を入力してください。ドロップ品の数を決定し、推奨ドロップ品を参考に「ダイス」「アイテム名」を入力してください。
                [削除]をクリックすると、その項目を削除することができます（繰り上がり）。
                <br />
                ※ 「解説」は入力しなくても問題ありません。
              </li>
              <li>[推奨入力を反映]をクリックしてください。「因果力」を除く能力値を自動的に計算します。
                <br />
                ※ 各能力値について修正したい箇所があれば修正してください。
              </li>
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
                [削除]をクリックすると、その項目を削除することができます（繰り上がり）。
                <br />
                ※ 「特技名」「効果」を記入していない場合は反映されません。
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
                CCFOLIA用のコマンドが表示されます。CCFOLIAに貼り付けると「マイキャラクター」として駒を作成できます。
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
                <div className="mb-2 flex min-h-5 items-center justify-between gap-2">
                  <label className="block text-sm font-medium">ランク</label>

                  {form.race === "ギミック" ? (
                    <span className="whitespace-nowrap text-xs font-medium text-amber-700">
                      ギミックはノーマルとして計算
                    </span>
                  ) : null}
                </div>

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

              <EnemyHitPointMultiplierPreview rank={form.rank} />

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
                  disabled={isEnemyTypeLocked}
                  onChange={(e) =>
                    updateForm(
                      "enemyType",
                      e.target.value as EnemyFormData["enemyType"],
                    )
                  }
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-600"
                >
                  {enemyTypeOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                {isEnemyTypeLocked ? (
                  <p className="mt-2 text-xs leading-6 text-neutral-500">
                    読み込んだエネミーデータのタイプは変更できません。
                  </p>
                ) : null}
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

            <EnemyDropItemSection
              calculated={calculated}
              rank={form.rank}
              items={items}
              onItemCountChange={handleItemCountChange}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />

            <hr className="my-8 border-neutral-300" />

            <EnemyCalculatedValuesPanel
              calculated={calculated}
              onApply={handleApplyCalculatedValues}
            />

            <EnemyHitPointRecommendationPreview
              rank={form.rank}
              hitPoint={calculated.hitPoint}
            />

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700">
                  基本能力値
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                      <label>STR</label>
                      <span>推奨値 {recommendedValue(calculated.strength)}</span>
                    </div>
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
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                      <label>DEX</label>
                      <span>推奨値 {recommendedValue(calculated.dexterity)}</span>
                    </div>
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
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                      <label>POW</label>
                      <span>推奨値 {recommendedValue(calculated.power)}</span>
                    </div>
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
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                      <label>INT</label>
                      <span>推奨値 {recommendedValue(calculated.intelligence)}</span>
                    </div>
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
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                        <label>回避(固定値)</label>
                        <span>推奨値 {recommendedValue(calculated.avoid)}</span>
                      </div>
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
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                        <label>回避(ダイス)</label>
                        <span>推奨値 {recommendedValue(calculated.avoidDice)}</span>
                      </div>
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
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                        <label>回避(判定)</label>
                        <span>推奨値 -</span>
                      </div>
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
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                        <label>抵抗(固定値)</label>
                        <span>推奨値 {recommendedValue(calculated.resist)}</span>
                      </div>
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
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                        <label>抵抗(ダイス)</label>
                        <span>推奨値 {recommendedValue(calculated.resistDice)}</span>
                      </div>
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
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                        <label>抵抗(判定)</label>
                        <span>推奨値 -</span>
                      </div>
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
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                      <label>物理防御力</label>
                      <span>推奨値 {recommendedValue(calculated.physicalDefense)}</span>
                    </div>
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
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                      <label>魔法防御力</label>
                      <span>推奨値 {recommendedValue(calculated.magicDefense)}</span>
                    </div>
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
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                      <label>最大HP</label>
                      <span>推奨値 {recommendedValue(calculated.hitPoint)}</span>
                    </div>
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
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                      <label>ヘイト倍率</label>
                      <span>推奨値 {recommendedValue(calculated.hate)}</span>
                    </div>
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
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                      <label>行動力</label>
                      <span>推奨値 {recommendedValue(calculated.action)}</span>
                    </div>
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
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                      <label>移動力</label>
                      <span>推奨値 {recommendedValue(calculated.move)}</span>
                    </div>
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
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                      <label>因果力</label>
                      <span>推奨値 -</span>
                    </div>
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
          <EnemySkillSection
            skills={skills}
            exampleSkill={exampleSkill}
            gimmickSkill={gimmickSkill}
            isGimmick={form.race === "ギミック"}
            onSkillCountChange={handleSkillCountChange}
            onUpdateSkill={updateSkill}
            onRemoveSkill={removeSkill}
          />
        ) : null}

        {activeTab === "output" ? (
          <section className="rounded-2xl border border-neutral-300 p-6">
            <div className="space-y-6">
              <EnemyPreviewSection
                form={form}
                items={items}
                outputSkills={outputSkills}
              />

              <EnemyOutputPanel
                result={result}
                statusMessage={statusMessage}
                onGenerate={handleGenerate}
                onCopy={handleCopy}
                onClear={handleClear}
                onDownloadJson={handleDownloadJson}
                onDownloadXlsx={handleDownloadXlsx}
                onImportFile={handleImportFile}
              />
            </div>
          </section>
        ) : null}

        <section className="mt-12 mb-12 rounded-2xl border border-neutral-300 p-6">
            <h2 className="mb-4 text-2xl font-semibold">最新のアップデート情報</h2>

            <div className="rounded-2xl border border-neutral-300 p-6">
                <h3 className="mb-1 text-2xl font-semibold">ver 2.1</h3>
                <p className="mb-4 text-sm text-neutral-500">2026/05</p>

                <ul className="space-y-2 text-sm leading-8 text-neutral-800">
                    <li>・一部のエネミーデータの計算式を修正</li>
                    <li>・大種族が「ギミック」の場合、エネミーランクを「ノーマル」に固定</li>
                    <li>・計算式ページの説明内容を更新</li>
                    <li>・推奨値を常に表示するようにUIを変更</li>
                    <li>・最大HPプレビューのUIを追加</li>
                </ul>
            </div>

            <div className="mt-4 text-sm leading-8 text-neutral-800">
                <p>
                    過去のアップデート情報はこちら
                    <br />
                    →{" "}
                    <Link
                    href={ENEMY_PAGE_LINKS.updates.href}
                    className="font-medium underline underline-offset-4"
                    >
                    アップデート情報
                    </Link>
                </p>
            </div>
        </section>

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
