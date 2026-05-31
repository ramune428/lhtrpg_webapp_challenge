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
  fetchCharacterJson,
  normalizeCharacterId,
  type ChatPaletteOptions,
} from "@/utils/createPieceUi";

const BODY_TEXT_CLASS = "text-sm leading-8 text-neutral-800";
const BODY_LINK_CLASS = "text-sm font-medium text-neutral-700 underline underline-offset-4";
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
  { key: "includeSkillSupportCalculations", label: "補助計算の特技" },
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
    includeSkillSupportCalculations: checked,
    includeSkillDescriptions: checked,
    includeBasicActions: checked,
    includeEquipmentEffects: checked,
    includeItemList: checked,
    includeAbilityChecks: checked,
    includeConsumeTables: checked,
    includeTreasureTables: checked,
  };
}

const initialChatPaletteOptions = createAllOptionalOptions(true);

function createChatPaletteReview(options: ChatPaletteOptions): string {
  const sections: string[] = [];

  sections.push([
    "○戦闘の基本",
    "{命中値} 命中値",
    "{回避値} 回避値(ヘイトトップ時)",
    "{回避値}+2 回避値(ヘイトアンダー時)",
    "{抵抗値} 抵抗値(ヘイトトップ時)",
    "{抵抗値}+2 抵抗値(ヘイトアンダー時)",
  ].join("\n"));

  if (options.includeDamageCalculator) {
    sections.push([
      "○被ダメージ計算用",
      "C(0-{物防}-0) 被ダメージ=物理ダメージ-物防-軽減",
      "C(0-{魔防}-0) 被ダメージ=魔法ダメージ-魔防-軽減",
      "C(({HP}+{障壁})-0-{ヘイト}*0-0) 残HP=(HP+障壁)-ダメージ-ヘイトダメージ-その他",
    ].join("\n"));
  }

  if (options.includeSkillChecks) {
    sections.push([
      "○判定がある特技",
      "● メジャー",
      "{命中値} ブラッディピアッシング(命中/回避)",
      "3D+2+1D ブラッドレター(命中+1D/回避)",
    ].join("\n"));
  }

  if (options.includeSkillSupportCalculations) {
    sections.push([
      "○補助計算の特技",
      "● ダメージロール",
      "C((0+2)*5) ダンスマカブル_消費因果力0 ダメージ増加",
      "C((1+2)*5) ダンスマカブル_消費因果力1 ダメージ増加",
      "C((2+2)*5) ダンスマカブル_消費因果力2 ダメージ増加",
      "C((3+2)*5) ダンスマカブル_消費因果力3 ダメージ増加",
    ].join("\n"));
  }

  const skillLines = ["○特技", "● メジャー", "《ステルスブレイド》 [武器攻撃]"];
  if (options.includeSkillDescriptions) {
    skillLines.push("SR:3/5 タイミング:メジャー 判定:対決(命中/回避) 対象:単体 射程:武器 コスト:本文 制限:- 効果:対象に［【攻撃力】＋３Ｄ］の物理ダメージを与える。ヘイトアンダー時、ダメージロールに＋［ＳＲ×４］する。");
  }
  skillLines.push("{攻撃力}+3D ステルスブレイド 物理ダメージ");
  skillLines.push("{攻撃力}+3D+C(3*4) ステルスブレイド_ヘイトアンダー 物理ダメージ");
  sections.push(skillLines.join("\n"));

  if (options.includeBasicActions) {
    sections.push([
      "○基本動作",
      "《基本武器攻撃》 [基本動作] [武器攻撃] ...",
      "{攻撃力}+1D 基本武器攻撃",
    ].join("\n"));
  }

  if (options.includeEquipmentEffects) {
    sections.push([
      "○装備アイテム効果",
      "装備名 ネームド効果: 効果文の1行目を表示",
    ].join("\n"));
  }

  if (options.includeItemList) {
    sections.push([
      "○所持アイテム一覧",
      "アイテム名 [タグ] 効果:効果文の1行目を表示",
    ].join("\n"));
  }

  if (options.includeAbilityChecks) {
    sections.push([
      "○各種判定",
      "{運動値} 運動値",
      "{耐久値} 耐久値",
      "{解析値} 解析値",
    ].join("\n"));
  }

  if (options.includeConsumeTables) {
    sections.push([
      "○消耗表",
      "PCT{CR}+0 体力消耗表",
      "ECT{CR}+0 気力消耗表",
      "GCT{CR}+0 物品消耗表",
      "CCT{CR}+0 金銭消耗表",
    ].join("\n"));
  }

  if (options.includeTreasureTables) {
    sections.push([
      "○財宝表",
      "CTRS{CR}+0 金銭財宝表",
      "MTRS{CR}+0 魔法素材財宝表",
      "ITRS{CR}+0 換金アイテム財宝表",
    ].join("\n"));
  }

  return sections.join("\n\n");
}

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ChatPaletteOptions>(initialChatPaletteOptions);
  const [lastJsonData, setLastJsonData] = useState<unknown | null>(null);
  const [lastCharacterId, setLastCharacterId] = useState("");

  const refreshPreview = (
    nextOptions: ChatPaletteOptions,
    jsonData: unknown | null = lastJsonData,
    characterId: string = lastCharacterId
  ) => {
    if (!jsonData || !characterId) return;

    try {
      setResult(createPieceFromJson(jsonData, characterId, nextOptions));
      setStatusMessage("プレビューを更新しました。");
    } catch (error) {
      console.error(error);
      setStatusMessage("プレビューの更新に失敗しました。");
    }
  };

  const updateOption = (key: keyof ChatPaletteOptions, checked: boolean) => {
    const nextOptions = { ...options, [key]: checked };
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

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
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
              <Link href={CHARACTER_PAGE_LINKS.howTo.href} className={BODY_LINK_CLASS}>
                {CHARACTER_PAGE_LINKS.howTo.label}
              </Link>
            </p>
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold">{TOOL_CONFIG.character.toolLabel}</h2>
        </section>

        <section className="mb-12 rounded-2xl border border-neutral-300 p-6">
          <div className="mb-6">
            <label htmlFor="character-input" className="mb-2 block text-lg font-semibold">
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

            <div className="grid gap-4 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.05fr)]">
              <div className="grid content-start gap-2">
                {outputOptionItems.map((item) => {
                  const checked = item.alwaysOn ? true : options[item.key as keyof ChatPaletteOptions];

                  return (
                    <label
                      key={item.key}
                      className={`flex min-h-12 items-center justify-between rounded-xl border px-3 text-sm ${
                        item.alwaysOn
                          ? "border-neutral-200 bg-neutral-100 text-neutral-500"
                          : "border-neutral-300 bg-white text-neutral-800"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={item.alwaysOn}
                          className="h-4 w-4 shrink-0 rounded border-neutral-300 accent-violet-500 disabled:cursor-not-allowed"
                          onChange={(event) => {
                            if (!item.alwaysOn) {
                              updateOption(item.key as keyof ChatPaletteOptions, event.target.checked);
                            }
                          }}
                        />
                        <span className="truncate leading-none">{item.label}</span>
                      </span>
                      {item.alwaysOn && <span className="ml-3 shrink-0 text-xs leading-none">常に出力</span>}
                    </label>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-neutral-300 bg-white p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-neutral-800">チャットパレットのレビュー</h4>
                  <span className="text-xs text-neutral-500">出力イメージ</span>
                </div>
                <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl bg-neutral-50 p-3 text-xs leading-5 text-neutral-800">
                  {createChatPaletteReview(options)}
                </pre>
              </div>
            </div>
          </section>

          <div className="mb-6 flex flex-wrap gap-3">
            <button type="button" onClick={handleGenerate} disabled={isLoading} className={FORM_BUTTON_CLASS}>
              {isLoading ? "生成中..." : "コマンドを生成する"}
            </button>

            <button type="button" onClick={handleClear} disabled={isLoading} className={FORM_BUTTON_CLASS}>
              クリア
            </button>

            <button type="button" onClick={handleCopy} disabled={!result} className={FORM_BUTTON_CLASS}>
              コピー
            </button>
          </div>

          <p className="mb-4 min-h-[1.5rem] text-sm text-neutral-600">{statusMessage}</p>

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
