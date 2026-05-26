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
import { createPiece } from "@/utils/createPiece";

const BODY_TEXT_CLASS = "text-sm leading-8 text-neutral-800";
const BODY_LINK_CLASS =
  "text-sm font-medium text-neutral-700 underline underline-offset-4";
const FORM_BUTTON_CLASS =
  "rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60";

function extractCharacterId(input: string): string {
  const trimmed = input.trim();

  if (!trimmed) {
    return "";
  }

  try {
    const url = new URL(trimmed);
    const idFromQuery = url.searchParams.get("id");
    if (idFromQuery) {
      return idFromQuery;
    }

    const segments = url.pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] ?? "";
  } catch {
    return trimmed;
  }
}

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    const characterId = extractCharacterId(inputValue);

    if (!characterId) {
      setStatusMessage("キャラクターURLまたはIDを入力してください。");
      return;
    }

    setIsLoading(true);
    setStatusMessage("コマンドを生成中です...");

    try {
      const generated = await createPiece(characterId);
      setResult(String(generated ?? ""));
      setStatusMessage("コマンドの生成が完了しました。");
    } catch (error) {
      console.error(error);
      setResult("");
      setStatusMessage(
        "コマンドの生成に失敗しました。入力内容を確認してください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setResult("");
    setStatusMessage("");
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
            <br/>
            このツールは「
            <a
              href={EXTERNAL_LINKS.lhzTop}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              ログ・ホライズンTRPG冒険者窓口
            </a>
            」
            より提供されているJSONデータを利用し、
            登録されたキャラクターデータからCCFOLIA用のキャラクター駒を作成するためのコマンドを生成できます。
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <h2 className="mb-3 text-lg font-semibold">💡【重要なお知らせ】</h2>
          <p className={BODY_TEXT_CLASS}>
            「外部ツールからの&lt;冒険者&gt;データ参照を許可する」にチェックがついていても、
            JSONデータを取得できず、エラーが発生する場合があります。
            一度チェックを外して、「外部ツールからの&lt;冒険者&gt;データ参照を許可する」を更新してください。
            <br />
            ※ 古いキャラクターはエラーになる傾向があります。
          </p>
        </section>

        {/*
        <section className="mb-8">
          <p className="text-sm font-semibold leading-8 text-neutral-900">
            このページは検索エンジンに表示されない
            （または、現在一時的に表示されている）ので、
            ブックマークやショートカットを作成するなどしてください。
          </p>
        </section>
        */}

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
              ※ 許可されていない場合は、&lt;基本情報を変更する&gt;を開き、
              「外部ツールからの&lt;冒険者&gt;データ参照を許可する」にチェックを入れる。
            </p>
            <p>
              3. キャラクターページのURLまたはキャラクターIDを下部の「キャラクター駒作成ツール」に入力する。
              <br />
              （例： https://lhrpg.com/lhz/pc?id=xxxxxx または xxxxxx）
            </p>
            <p>4. [コマンドを生成する] をクリック。</p>
            <p>5. [コピー] をクリックしてコマンドをコピーする。</p>
            <p>6. CCFOLIAに貼り付ける。</p>
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
          <div className="mb-3">
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

          {/* <p className="mb-5 text-sm leading-7 text-neutral-600">
            キャラクターURLまたはキャラクターIDを入力してください。
          </p> */}

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
              CCFOLIA用 キャラクター駒作成コマンド
            </label>
          </div>

          <textarea
            id="result-area"
            value={result}
            readOnly
            placeholder="ここに生成されたコマンドが表示されます"
            className="min-h-[320px] w-full resize-y rounded-xl border border-neutral-300 px-4 py-3 text-sm leading-6 outline-none"
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
              「コマンドが表示されない」、「CCFOLIAに貼り付けできない」などのエラーが発生した場合は、
              下記お問い合わせフォームにてご連絡ください。
              ご意見・ご要望をお送りいただけますと、今後の改善や機能追加の参考にさせていただきます。
            </p>
            <p>
              お問い合わせフォーム →{" "}
              <Link href="/contact" className={BODY_LINK_CLASS}>
                こちら
              </Link>
            </p>
          </div>
        </section>

        {/*<section className="mb-8 rounded-2xl border border-sky-300 bg-sky-50 p-5">
          <h2 className="mb-3 text-lg font-semibold">💡参考情報</h2>
          <p className={BODY_TEXT_CLASS}>
            このツールは「LHTRPGのチャットパレットを作るやつ」を参考に作成しています。
          </p>
          <p className="mt-2 text-sm leading-8 text-neutral-800">
            「LHTRPGのチャットパレットを作るやつ」 →
            <a
              href={EXTERNAL_LINKS.referenceChatPalette}
              target="_blank"
              rel="noreferrer"
              className="ml-2 underline underline-offset-4"
            >
              {EXTERNAL_LINKS.referenceChatPalette}
            </a>
          </p>
        </section>*/}
      </div>
    </main>
  );
}
