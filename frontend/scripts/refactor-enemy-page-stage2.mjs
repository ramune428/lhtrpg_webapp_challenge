import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const pagePath = resolve(process.cwd(), "app/enemy/page.tsx");
let source = readFileSync(pagePath, "utf8").replace(/\r\n/g, "\n");

function replaceRequired(pattern, replacement, label) {
  const next = source.replace(pattern, replacement);
  if (next === source) {
    throw new Error(`Failed to apply replacement: ${label}`);
  }
  source = next;
}

if (!source.includes("EnemyCalculatedValuesPanel")) {
  replaceRequired(
    /import \{ TabButton \} from "@\/components\/enemy";/,
    'import { EnemyCalculatedValuesPanel, EnemyOutputPanel, TabButton } from "@/components/enemy";',
    "add enemy page component imports",
  );
}

replaceRequired(
  /            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">\n              <h2 className="text-lg font-semibold">能力値<\/h2>\n              <button\n                type="button"\n                onClick=\{handleApplyCalculatedValues\}\n                className="rounded-xl border border-neutral-300 px-4 py-2 text-sm transition hover:bg-neutral-50"\n              >\n                推奨能力値を反映\n              <\/button>\n            <\/div>\n\n            <div className="space-y-6">/,
  `            <EnemyCalculatedValuesPanel
              calculated={calculated}
              onApply={handleApplyCalculatedValues}
            />

            <div className="mt-8 space-y-6">`,
  "replace calculated values header",
);

replaceRequired(
  /              <div className="flex flex-wrap gap-3">\n                <button\n                  type="button"\n                  onClick=\{handleGenerate\}\n                  className="rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50"\n                >\n                  コマンドを生成する\n                <\/button>\n\n                <button\n                  type="button"\n                  onClick=\{handleCopy\}\n                  className="rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50"\n                >\n                  コピー\n                <\/button>\n              <\/div>\n\n              <textarea\n                value=\{result\}\n                readOnly\n                className="min-h-\[180px\] w-full resize-y rounded-xl border border-neutral-300 px-4 py-3 text-sm leading-6 outline-none"\n              \/>\n\n              <div className="flex flex-wrap justify-end gap-3">\n                <button\n                  type="button"\n                  onClick=\{handleDownloadXlsx\}\n                  className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:bg-neutral-50"\n                >\n                  Download XLSX\n                <\/button>\n\n                <button\n                  type="button"\n                  onClick=\{handleDownloadJson\}\n                  className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:bg-neutral-50"\n                >\n                  Download JSON\n                <\/button>\n              <\/div>/,
  `              <EnemyOutputPanel
                result={result}
                statusMessage={statusMessage}
                onGenerate={handleGenerate}
                onCopy={handleCopy}
                onClear={handleClear}
                onDownloadJson={handleDownloadJson}
                onDownloadXlsx={handleDownloadXlsx}
                onImportFile={handleImportFile}
              />`,
  "replace output action panel",
);

writeFileSync(pagePath, source, "utf8");
console.log("Applied enemy page stage2 refactor.");
