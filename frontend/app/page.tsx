"use client";

import Link from "next/link";
import { useState } from "react";
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
  createPieceFromJson,
  defaultChatPaletteOptions,
  fetchCharacterJson,
  normalizeCharacterId,
  type ChatPaletteOptions,
} from "@/utils/createPieceUi";

const BODY_TEXT_CLASS = "text-sm leading-8 text-neutral-800";
const BODY_LINK_CLASS =
  "text-sm font-medium text-neutral-700 underline underline-offset-4";
const FORM_BUTTON_CLASS =
  "rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60";

type OutputOptionItem = {
  key: keyof ChatPaletteOptions | "combatBasics" | "skillNames" | "skillCommands";
  label: string;
  alwaysOn?: boolean;
};

const outputOptionItems: OutputOptionItem[] = [
  { key: "combatBasics", label: "戦闘の基本", alwaysOn: true },
  { key: "includeDamageCalculator", label: "被ダメージ計算用" },
  { key: "includeSkillChecks", label: "判定がある特技" },
  { key: "skillNames", label: "特技", alwaysOn: true },
  { key: "includeSkillDescriptions", label: "効果" },
  { key: "skillCommands", label: "特技コマンド", alwaysOn: true },
  { key: "includeBasicActions", label: "基本動作" },
  { key: "includeEquipmentEffects", label: "装備アイテム効果" },
  { key: "includeItemList", label: "所持アイテム一覧" },
  { key: "includeAbilityChecks", label: "各種判定" },
  { key: "includeConsumeTables", label: "消耗表" },
  { key: "includeTreasureTables", label: "財宝表" },
];

function createAllOptionalOptions(checked: boolean): ChatPaletteOptions {
  return {
    includeDamageCalculator: checked,
    includeSkillChecks: checked,
    includeSkillDescriptions: checked,
    includeBasicActions: checked,
    includeEquipmentEffects: checked,
    includeItemList: checked,
    includeAbilityChecks: checked,
    includeConsumeTables: checked,
    includeTreasureTables: checked,
  };
}

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ChatPaletteOptions>(defaultChatPaletteOptions);
  const [lastJsonData, setLastJsonData] = useState<unknown | null>(null);
  const [lastCharacterId, setLastCharacterId] = useState("");

  const refreshPreview = (
    nextOptions: ChatPaletteOptions,
    jsonData: unknown | null = lastJsonData,
    characterId: string = lastCharacterId
  ) => {
    if (!jsonData || !characterId) {
      return;
    }

    try {
      const nextResult = createPieceFromJson(jsonData, characterId, nextOptions);
      setResult(nextResult);
      setStatusMessage("プレビューを更新しました。");
    } catch (error) {
      console.error(error);
      setStatusMessage("プレビューの更新に失敗しました。");
    }
  };

  const updateOption = (key: keyof ChatPaletteOptions, checked: boolean) => {
    const nextOptions = {
      ...options,
      [key]: checked,
    };

    setOptions(nextOptions);
    refreshPreview(nextOptions);
  };

  const handleSetAllOptionalOptions = (checked: boolean) => {
    const nextOptions = createAllOptionalOptions(checked);
    setOptions(nextOptions);
    refreshPreview(nextOptions);
  };

  const handleGenerate = async () => {
    const characterId = normalizeCharacterId(inputValue);

    if (!characterId) {
      setStatusMessage("キャラクターURLまたはIDを入力してください。");
      return;
    }

    setIsLoading(true);
    setStatusMessage("コマンドを生成中です...");

    try {
      const jsonData = await fetchCharacterJson(characterId);
      const generated = createPieceFromJson(jsonData, characterId, options);

      setResult(String(generated ?? ""));
      setLastJsonData(jsonData);
      setLastCharacterId(characterId);
      setStatusMessage("コマンドの生成が完了しました。");
    } catch (error) {
      console.error(error);
      setResult("");
      setLastJsonData(null);
      setLastCharacterId("");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "コマンドの生成に失敗しました。入力内容を確認してください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setResult("");
    setStatusMessage("");
    setLastJsonData(null);
    setLastCharacterId("");
  };

  const handleCopy = async () => {
    if (!result) {
      setStatusMessage("コピーする内容がありません。");
      return;
    }

    try {
      await navigator.clipboard.writeText(result);
      setStatusMessage("コマンドをコピーしました。");
    } catch (error) {
      console.error(error);
      setStatusMessage("コマンドのコピーに失敗しました。");
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await handleGenerate();
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <AppNav current="character" />

        <header className="mb-10">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {TOOL_TITLES.character}
          </h1>

          <p className={`${BODY_TEXT_CLASS} mb-4`}>
            {TOOL_TITLES.character} は、ログ・ホライズンTRPG（LHTRPG）向けの支援ツールです。
            <br />
            このツールは「
            <a
              href={EXTERNAL_LINKS.lhzTop}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              ログ・ホライズンTRPG冒険者窓口
            </a>
            」より提供されているJSONデータを利用し、登録されたキャラクターデータからCCFOLIA用のキャラクター駒を作成するためのコマンドを生成できます。
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <h2 className="mb-3 text-lg font-semibold">💡【重要なお知らせ】</h2>
          <p className={BODY_TEXT_CLASS}>
            「外部ツールからの&lt;冒険者&gt;データ参照を許可する」にチェックがついていても、JSONデータを取得できず、エラーが発生する場合があります。
            一度チェックを外して、「外部ツールからの&lt;冒険者&gt;データ参照を許可する」を更新してください。
            <br />
            ※ 古いキャラクターはエラーになる傾向があります。
          </p>
        </section>

        <section className="mb-10 rounded-2xl border border-neutral-300 p-5">
          <p className={BODY_TEXT_CLASS}>
            GM・ディベロッパー向けの{TOOL_CONFIG.enemy.toolLabel}はこちら
          </p>
          <div className="mt-3">
            <p className={BODY_TEXT_CLASS}>
              →{" "}
              <Link href={ENEMY_PAGE_LINKS.home.href} className={BODY_LINK_CLASS}>
                {TOOL_TITLES.enemy}
              </Link>
            </p>
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-neutral-300 p-6">
          <h2 className="mb-4 text-2xl font-semibold">使い方</h2>

          <div className="space-y-3 text-sm leading-8 text-neutral-800">
            <p>1. ログ･ホライズンTRPG冒険者窓口でキャラクターページを開く。</p>
            <p>
              2. 外部ツールからの〈冒険者〉データ参照が許可されているか確認する。
              <br />
              ※ 許可されていない場合は、&lt;基本情報を変更する&gt;を開き、「外部ツールからの&lt;冒険者&gt;データ参照を許可する」にチェックを入れる。
            </p>
            <p>
              3. キャラクターページのURLまたはキャラクターIDを下部の「キャラクター駒作成ツール」に入力する。
              <br />
              （例： https://lhrpg.com/lhz/pc?id=xxxxxx または xxxxxx）
            </p>
            <p>4. 必要に応じて出力オプションを変更する。</p>
            <p>5. [コマンドを生成する] をクリックし、プレビューを確認する。</p>
            <p>6. [コピー] をクリックしてコマンドをコピーし、CCFOLIAに貼り付ける。</p>
          </div>

          <div className="mt-5">
            <p className={BODY_TEXT_CLASS}>
              詳しい使い方についてはこちら →{" "}
              <Link
                href={CHARACTER_PAGE_LINKS.howTo.href}
                className={BODY_LINK_CLASS}
              >
                {CHARACTER_PAGE_LINKS.howTo.label}
              </Link>
            </p>
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold">
            {TOOL_CONFIG.character.toolLabel}
          </h2>
        </section>

        <section className="mb-12 rounded-2xl border border-neutral-300 p-6">
          <div className="mb-6">
            <label
              htmlFor="character-input"
              className="mb-2 block text-lg font-semibold"
            >
              キャラクターURL/キャラクターID
            </label>

            <input
              id="character-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://lhrpg.com/lhz/pc?id=123456 / 123456"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base outline-none transition focus:border-neutral-500"
            />
          </div>

          <section className="mb-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">チャットパレット出力オプション</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSetAllOptionalOptions(true)}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-white"
                >
                  任意項目をすべてON
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAllOptionalOptions(false)}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-white"
                >
                  任意項目をすべてOFF
                </button>
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              {outputOptionItems.map((item) => {
                const checked = item.alwaysOn
                  ? true
                  : options[item.key as keyof ChatPaletteOptions];

                return (
                  <label
                    key={item.key}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                      item.alwaysOn
                        ? "border-neutral-200 bg-neutral-100 text-neutral-500"
                        : "border-neutral-300 bg-white text-neutral-800"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={item.alwaysOn}
                        onChange={(event) => {
                          if (!item.alwaysOn) {
                            updateOption(
                              item.key as keyof ChatPaletteOptions,
                              event.target.checked
                            );
                          }
                        }}
                      />
                      {item.label}
                    </span>
                    {item.alwaysOn && <span className="text-xs">常に出力</span>}
                  </label>
                );
              })}
            </div>
          </section>

          <div className="mb-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className={FORM_BUTTON_CLASS}
            >
              {isLoading ? "生成中..." : "コマンドを生成する"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className={FORM_BUTTON_CLASS}
            >
              クリア
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!result}
              className={FORM_BUTTON_CLASS}
            >
              コピー
            </button>
          </div>

          <p className="mb-4 min-h-[1.5rem] text-sm text-neutral-600">
            {statusMessage}
          </p>

          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="result-area" className="block text-lg font-semibold">
              CCFOLIA用 キャラクター駒作成コマンド / プレビュー
            </label>
          </div>

          <textarea
            id="result-area"
            value={result}
            readOnly
            placeholder="ここに生成されたコマンドが表示されます"
            className="min-h-[360px] w-full resize-y rounded-xl border border-neutral-300 px-4 py-3 text-sm leading-6 outline-none"
          />
        </section>

        <section className="mb-12 rounded-2xl border border-neutral-300 p-6">
          <h2 className="mb-4 text-2xl font-semibold">お知らせ</h2>

          <div className="space-y-3 text-sm leading-8 text-neutral-800">
            <p>使い方、コマンド内訳、アップデート情報はこちら</p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PageLinkCard
              href={CHARACTER_PAGE_LINKS.howTo.href}
              title={CHARACTER_PAGE_LINKS.howTo.label}
              description="キャラクター駒を作成するまでの手順の詳細（画像付き）を確認できます。"
            />
            <PageLinkCard
              href={CHARACTER_PAGE_LINKS.commandDetails.href}
              title={CHARACTER_PAGE_LINKS.commandDetails.label}
              description="生成されるコマンドの内容を確認できます。"
            />
            <PageLinkCard
              href={CHARACTER_PAGE_LINKS.updates.href}
              title={CHARACTER_PAGE_LINKS.updates.label}
              description="公開後の変更内容や過去バージョンの履歴を確認できます。"
            />
          </div>

          <div className="mt-6 space-y-3 text-sm leading-8 text-neutral-800">
            <p>
              「コマンドが表示されない」、「CCFOLIAに貼り付けできない」などのエラーが発生した場合は、下記Googleフォームにてご連絡ください。
              ご意見・ご要望をお送りいただけますと、今後の改善や機能追加の参考にさせていただきます。
            </p>
            <p>
              Googleフォーム →
              <a
                href={EXTERNAL_LINKS.feedbackForm}
                target="_blank"
                rel="noreferrer"
                className="ml-2 underline underline-offset-4"
              >
                {EXTERNAL_LINKS.feedbackForm}
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
