import type { ChangeEvent } from "react";

type EnemyOutputPanelProps = {
  result: string;
  statusMessage: string;
  onGenerate: () => void;
  onCopy: () => void;
  onClear: () => void;
  onDownloadJson: () => void;
  onDownloadXlsx: () => void;
  onImportFile: (event: ChangeEvent<HTMLInputElement>) => void;
};

const BUTTON_CLASS =
  "rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50";

export default function EnemyOutputPanel({
  result,
  statusMessage,
  onGenerate,
  onCopy,
  onClear,
  onDownloadJson,
  onDownloadXlsx,
  onImportFile,
}: EnemyOutputPanelProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 p-5">
      <div>
        <h2 className="text-lg font-semibold">出力</h2>
        <p className="mt-1 text-sm leading-7 text-neutral-700">
          CCFOLIA用コマンド、JSON、XLSXの出力を行います。
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onGenerate} className={BUTTON_CLASS}>
          CCFOLIA用コマンド生成
        </button>
        <button type="button" onClick={onCopy} className={BUTTON_CLASS}>
          コピー
        </button>
        <button type="button" onClick={onDownloadJson} className={BUTTON_CLASS}>
          JSON出力
        </button>
        <button type="button" onClick={onDownloadXlsx} className={BUTTON_CLASS}>
          XLSX出力
        </button>
        <label className={`${BUTTON_CLASS} cursor-pointer`}>
          JSON/XLSX読込
          <input
            type="file"
            accept=".json,.xlsx,.xls,application/json"
            onChange={onImportFile}
            className="hidden"
          />
        </label>
        <button type="button" onClick={onClear} className={BUTTON_CLASS}>
          クリア
        </button>
      </div>

      {statusMessage ? (
        <p className="text-sm leading-7 text-neutral-700">{statusMessage}</p>
      ) : null}

      <textarea
        value={result}
        readOnly
        className="min-h-[360px] w-full rounded-xl border border-neutral-300 p-4 font-mono text-sm leading-6"
        placeholder="ここに生成結果が表示されます。"
      />
    </section>
  );
}
