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
    setStatusMessage("生成中です...");

    try {
      const generated = await createPiece(characterId);
      setResult(String(generated ?? ""));
      setStatusMessage("生成が完了しました。");
    } catch (error) {
      console.error(error);
      setResult("");
      setStatusMessage("生成に失敗しました。入力内容を確認してください。");
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
      setStatusMessage("生成結果をコピーしました。");
    } catch (error) {
      console.error(error);
      setStatusMessage("コピーに失敗しました。");
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

          <p className="mb-3 text-sm leading-7 text-neutral-700">
            ログ･ホライズンTRPG冒険窓口より提供されているJSONデータを利用し、
            CCFOLIAへ貼り付けるための駒作成コマンドを生成するツールです。
          </p>

          <p className="text-sm leading-7 text-neutral-700">
            現在はキャラ駒作成ツールをメインに公開しています。エネミーデータ側は
            別ページから確認できます。
          </p>
        </header>

        <section className="mb-10 grid gap-4 sm:grid-cols-2">
          <Link
            href="/character/subpages"
            className="rounded-2xl border border-neutral-300 p-5 transition hover:bg-neutral-50"
          >
            <h2 className="mb-2 text-lg font-semibold">
              キャラ駒作成ツール サブページ
            </h2>
            <p className="text-sm leading-7 text-neutral-700">
              使い方（詳細）、コマンド内訳、アップデート情報をまとめています。
            </p>
          </Link>

          <Link
            href="/enemy"
            className="rounded-2xl border border-neutral-300 p-5 transition hover:bg-neutral-50"
          >
            <h2 className="mb-2 text-lg font-semibold">
              LHTRPG- エネミーデータ/駒作成ツール（CCFOLIA）
            </h2>
            <p className="text-sm leading-7 text-neutral-700">
              エネミー側のページです。現時点では準備中として案内する想定です。
            </p>
          </Link>
        </section>

        <section className="mb-12 rounded-2xl border border-neutral-300 p-6">
          <h2 className="mb-4 text-2xl font-semibold">使い方</h2>
          <div className="space-y-3 text-sm leading-8 text-neutral-800">
            <p>
              1. ログ･ホライズンTRPG冒険窓口でキャラクターページを開きます。
            </p>
            <p>
              2. 外部ツールからの〈冒険者〉データ参照が許可されているか確認します。
            </p>
            <p>
              3. キャラクターページのURL、またはIDを入力します。
            </p>
            <p>
              4. 「コマンドを生成する」を押します。
            </p>
            <p>
              5. 生成結果をすべてコピーして、CCFOLIAへ貼り付けます。
            </p>
          </div>

          <div className="mt-5">
            <Link
              href="/character/how-to"
              className="text-sm font-medium text-neutral-700 underline underline-offset-4"
            >
              使い方（詳細）を見る
            </Link>
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-neutral-300 p-6">
          <div className="mb-3">
            <label
              htmlFor="character-input"
              className="mb-2 block text-lg font-semibold"
            >
              キャラクターURL / ID
            </label>

            <input
              id="character-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://lhrpg.com/lhz/pc?id=123456 または 123456"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base outline-none transition focus:border-neutral-500"
            />
          </div>

          <p className="mb-5 text-sm leading-7 text-neutral-600">
            URL全体でも、末尾のIDだけでも入力できます。Enterキーでも実行できます。
          </p>

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

          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="result-area" className="block text-lg font-semibold">
              生成結果
            </label>
          </div>

          <textarea
            id="result-area"
            value={result}
            readOnly
            placeholder="ここに生成結果が表示されます"
            className="min-h-[320px] w-full resize-y rounded-xl border border-neutral-300 px-4 py-3 text-sm leading-6 outline-none"
          />

          <p className="mt-3 min-h-[1.5rem] text-sm text-neutral-600">
            {statusMessage}
          </p>
        </section>

        <section className="mb-12 rounded-2xl border border-neutral-300 p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            作成される駒の内訳について
          </h2>

          <div className="space-y-3 text-sm leading-8 text-neutral-800">
            <p>
              名前、行動値などの基本情報、体力関係、特技に使用するステータスは
              パラメータ欄・ステータス欄へ反映されます。
            </p>
            <p>
              チャットパレットは、タイミングごとに分類してまとめる想定です。
            </p>
            <p>
              詳しい内容は、コマンド内訳ページで整理して確認できるようにします。
            </p>
          </div>

          <div className="mt-5">
            <Link
              href="/character/command-details"
              className="text-sm font-medium text-neutral-700 underline underline-offset-4"
            >
              コマンド内訳を見る
            </Link>
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-neutral-300 p-6">
          <h2 className="mb-4 text-2xl font-semibold">お知らせ</h2>

          <div className="space-y-3 text-sm leading-8 text-neutral-800">
            <p>
              このツールは今後も調整・更新を行う予定です。表示や内容が変更される場合があります。
            </p>
            <p>
              エネミーデータ/駒作成ツールは現在準備中です。先にキャラ側ページを中心に公開しています。
            </p>
            <p>
              更新履歴はアップデート情報ページにまとめていく想定です。
            </p>
          </div>

          <div className="mt-5">
            <Link
              href="/character/updates"
              className="text-sm font-medium text-neutral-700 underline underline-offset-4"
            >
              アップデート情報を見る
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}