"use client";

import { useState, type KeyboardEvent } from "react";
import SectionCard from "@/components/ui/section-card";
import { createPiece } from "@/utils/createPiece";
import { extractCharacterId } from "@/utils/extractCharacterId";

const buttonClass =
  "rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60";

export default function CharacterGeneratorForm() {
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
      // createPiece の戻り値をそのまま表示し、出力形式は変更しない。
      const generated = await createPiece(characterId);
      setResult(String(generated ?? ""));
      setStatusMessage("コマンドの生成が完了しました。");
    } catch (error) {
      console.error(error);
      setResult("");
      setStatusMessage(
        "コマンドの生成に失敗しました。入力内容を確認してください。",
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

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await handleGenerate();
    }
  };

  return (
    <>
      <section className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
          キャラ駒作成ツール
        </h2>
      </section>

      <SectionCard className="mb-12">
        <div className="mb-4">
          <label
            htmlFor="character-input"
            className="mb-2 block text-base font-semibold text-neutral-950"
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

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className={buttonClass}
          >
            {isLoading ? "生成中..." : "コマンドを生成する"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className={buttonClass}
          >
            クリア
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!result}
            className={buttonClass}
          >
            コピー
          </button>
        </div>

        <p className="mb-4 min-h-[1.5rem] text-sm text-neutral-600">
          {statusMessage}
        </p>

        <label
          htmlFor="result-area"
          className="mb-2 block text-base font-semibold text-neutral-950"
        >
          CCFOLIA用 キャラクター駒作成コマンド
        </label>

        <textarea
          id="result-area"
          value={result}
          readOnly
          placeholder="ここに生成されたコマンドが表示されます"
          className="min-h-[320px] w-full resize-y rounded-xl border border-neutral-300 px-4 py-3 text-sm leading-6 outline-none"
        />
      </SectionCard>
    </>
  );
}
