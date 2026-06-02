"use client";

import Link from "next/link";
import AppNav from "@/components/app-nav";
import PageLinkCard from "@/components/page-link-card";
import { EnemyCalculatedValuesPanel, EnemyOutputPanel, TabButton } from "@/components/enemy";
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
  diceButtonValues,
  enemyRanks,
  enemyRaces,
  enemyTypes,
  formatDiceAboveSelection,
  getCombinedTagText,
  getDiceRangeBoundaryValues,
  getDropDiceAboveStartValue,
  getDropDicePreview,
  getEnemyTypeExplanation,
  getMaxDropDice,
  getSelectedDiceValues,
  isDiceButtonEnabled,
  isNumericDiceButton,
  normalizeCr,
  normalizeDiceRangeSelection,
  popularityList,
  skillTimings,
  toFullWidthNumber,
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
                  const maxDropDice = getMaxDropDice(form.rank);

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
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <label className="block text-sm font-medium">
                              ダイス
                            </label>

                            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600">
                              出力：{getDropDicePreview(item.dice, maxDropDice)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {diceButtonValues.map((diceValue) => {
                              const selected = getSelectedDiceValues(
                                item.dice,
                                maxDropDice,
                              );
                              const boundaryValues =
                                getDiceRangeBoundaryValues(
                                  selected,
                                  maxDropDice,
                                );
                              const isEnabled = isDiceButtonEnabled(
                                diceValue,
                                maxDropDice,
                              );
                              const isFixedActive = item.dice.trim() === "固定";
                              const isAboveButton = diceValue === "以上";
                              const isAboveActive =
                                getDropDiceAboveStartValue(
                                  item.dice,
                                  maxDropDice,
                                ) !== null;
                              const isAboveDisabled =
                                isAboveButton && isFixedActive;

                              const isActive =
                                diceValue === "固定"
                                  ? isFixedActive
                                  : isAboveButton
                                    ? isAboveActive
                                    : selected.has(diceValue);

                              const isAutoFilled =
                                isNumericDiceButton(diceValue) &&
                                !isAboveActive &&
                                isActive &&
                                !boundaryValues.has(diceValue);

                              return (
                                <button
                                  key={diceValue}
                                  type="button"
                                  disabled={
                                    !isEnabled || isAutoFilled || isAboveDisabled
                                  }
                                  title={
                                    !isEnabled
                                      ? "レイドの場合のみ選択できます"
                                      : isAboveDisabled
                                        ? "固定選択中は使用できません"
                                        : isAutoFilled
                                          ? "両端の値から自動で選択されています"
                                          : diceValue === "以上"
                                            ? "出力を「n～」の形式に切り替えます"
                                            : undefined
                                  }
                                  onClick={() => {
                                    if (
                                      !isEnabled ||
                                      isAutoFilled ||
                                      isAboveDisabled
                                    ) {
                                      return;
                                    }

                                    if (diceValue === "固定") {
                                      updateItem(item.id, "dice", "固定");
                                      return;
                                    }

                                    if (diceValue === "以上") {
                                      if (isAboveActive) {
                                        const selectedNumbers = Array.from(
                                          selected,
                                        )
                                          .map((value) => Number(value))
                                          .filter((value) =>
                                            Number.isInteger(value),
                                          )
                                          .sort((a, b) => a - b);
                                        const start = selectedNumbers[0] ?? 1;
                                        updateItem(
                                          item.id,
                                          "dice",
                                          toFullWidthNumber(start),
                                        );
                                        return;
                                      }

                                      const nextDice = formatDiceAboveSelection(
                                        selected,
                                        maxDropDice,
                                      );
                                      updateItem(item.id, "dice", nextDice);
                                      return;
                                    }

                                    if (isAboveActive) {
                                      updateItem(
                                        item.id,
                                        "dice",
                                        `${toFullWidthNumber(Number(diceValue))}～`,
                                      );
                                      return;
                                    }

                                    const nextSelected = getSelectedDiceValues(
                                      item.dice,
                                      maxDropDice,
                                    );
                                    if (nextSelected.has(diceValue)) {
                                      nextSelected.delete(diceValue);
                                    } else {
                                      nextSelected.add(diceValue);
                                    }

                                    const nextDice = normalizeDiceRangeSelection(
                                      nextSelected,
                                      maxDropDice,
                                    );
                                    updateItem(item.id, "dice", nextDice);
                                  }}
                                  className={[
                                    "min-w-12 rounded-xl border px-4 py-3 text-sm transition",
                                    !isEnabled || isAboveDisabled
                                      ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
                                      : isAutoFilled
                                        ? "cursor-default border-red-300 bg-red-100 text-red-700"
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
                          <p className="mt-2 text-xs leading-6 text-neutral-500">
                            ※
                            1〜6は常に選択できます。7〜10はランクが「レイド」の場合のみ選択できます。
                            「以上」は、選択中の最小値に「～」を付けた形式で出力します。
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

            <EnemyCalculatedValuesPanel
              calculated={calculated}
              onApply={handleApplyCalculatedValues}
            />

            <div className="mt-8 space-y-6">
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
