"use client";

import Link from "next/link";
import { useState } from "react";
import AppNav from "@/components/app-nav";
import { createPiece } from "@/utils/createPiece";

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
      <div className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-8">
        <AppNav current="character" />

        <header className="mb-10">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            LHTRPG- キャラ駒作成ツール（CCFOLIA）
          </h1>

          <p className="text-sm leading-8 text-neutral-800">
            このキャラ駒作成ツールは
            「
            <a
              href="https://lhrpg.com/lhz/top"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              ログ・ホライズンTRPG冒険者窓口
            </a>
            」
            より提供されているJSONデータを利用しています。
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <h2 className="mb-3 text-lg font-semibold">💡【重要なお知らせ】</h2>
          <p className="text-sm leading-8 text-neutral-800">
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
          <p className="text-sm leading-8 text-neutral-800">
            GM・ディベロッパー向けのエネミーデータ/駒作成ツールはこちら
          </p>
          <div className="mt-3">
            <p className="text-sm leading-8 text-neutral-800">
              →{" "}
              <Link
                href="/enemy"
                className="text-sm font-medium text-neutral-700 underline underline-offset-4"
              >
                LHTRPG- エネミーデータ/駒作成ツール（CCFOLIA）
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
              許可されていない場合は、&lt;基本情報を変更する&gt;を開き、
              「外部ツールからの&lt;冒険者&gt;データ参照を許可する」にチェックを入れる。
            </p>
            <p>
              3. キャラクターページのURLまたはキャラクターIDを入力する。
              <br />
              （例： https://lhrpg.com/lhz/pc?id=xxxxxx または xxxxxx）
            </p>
            <p>4. 下記 [コマンドを生成する] をクリック。</p>
            <p>5. [コピー] をクリックしてコマンドをコピーする。</p>
            <p>6. CCFOLIAに貼り付ける。</p>
          </div>

          <div className="mt-5">
            <p className="text-sm leading-8 text-neutral-800">
              詳しい使い方についてはこちら →{" "}
              <Link
                href="/character/how-to"
                className="text-sm font-medium text-neutral-700 underline underline-offset-4"
              >
                使い方（詳細）
              </Link>
            </p>
          </div>
        </section>

        {/* <section className="mb-4">
          <h2 className="text-center text-2xl font-bold tracking-[0.2em]">
            アプリ
          </h2>
        </section> */}

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
              className="rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "生成中..." : "コマンドを生成する"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              クリア
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!result}
              className="rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
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
            <p>コマンド内訳やアップデート情報はこちら</p>
          </div>

          <div className="mt-3 flex flex-wrap gap-4">
            <Link
              href="/character/command-details"
              className="text-sm font-medium text-neutral-700 underline underline-offset-4"
            >
              コマンド内訳
            </Link>
            <Link
              href="/character/updates"
              className="text-sm font-medium text-neutral-700 underline underline-offset-4"
            >
              アップデート情報
            </Link>
          </div>

          <div className="mt-6 space-y-3 text-sm leading-8 text-neutral-800">
            <p>
              「コマンドが表示されない」、「CCFOLIAに貼り付けできない」などのエラーが発生した場合は、
              下記Googleフォームにてご連絡ください。
            </p>
            <p>
              Googleフォーム →
              <a
                href="https://forms.gle/76AvTAYyxM5DLQtL8"
                target="_blank"
                rel="noreferrer"
                className="ml-2 underline underline-offset-4"
              >
                https://forms.gle/76AvTAYyxM5DLQtL8
              </a>
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-sky-300 bg-sky-50 p-5">
          <h2 className="mb-3 text-lg font-semibold">💡参考情報</h2>
          <p className="text-sm leading-8 text-neutral-800">
            このツールは「LHTRPGのチャットパレットを作るやつ」を参考に作成しています。
          </p>
          <p className="mt-2 text-sm leading-8 text-neutral-800">
            「LHTRPGのチャットパレットを作るやつ」 →
            <a
              href="http://unonek.sakura.ne.jp/lh/chatpad.cgi?11111111"
              target="_blank"
              rel="noreferrer"
              className="ml-2 underline underline-offset-4"
            >
              http://unonek.sakura.ne.jp/lh/chatpad.cgi?11111111
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}