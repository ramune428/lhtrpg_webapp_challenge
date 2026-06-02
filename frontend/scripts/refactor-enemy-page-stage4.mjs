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

replaceRequired(
  /import \{ EnemyCalculatedValuesPanel, EnemyOutputPanel, TabButton \} from "@\/components\/enemy";/,
  'import { EnemyCalculatedValuesPanel, EnemyOutputPanel, EnemyPreviewSection, TabButton } from "@/components/enemy";',
  "add preview section import",
);

replaceRequired(
  /import \{\n  calculateIdentification,[\s\S]*?type EnemyFormData,\n\} from "@\/utils\/enemy";/,
  `import {
  calculateIdentification,
  diceButtonValues,
  enemyRanks,
  enemyRaces,
  enemyTypes,
  formatDiceAboveSelection,
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
} from "@/utils/enemy";`,
  "remove preview-only utility imports",
);

replaceRequired(
  /            <div className="space-y-6 text-sm leading-8 text-neutral-800">\n              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">[\s\S]*?              <EnemyOutputPanel/,
  `            <div className="space-y-6">
              <EnemyPreviewSection
                form={form}
                items={items}
                outputSkills={outputSkills}
              />

              <EnemyOutputPanel`,
  "replace output preview block",
);

writeFileSync(pagePath, source, "utf8");
console.log("Applied enemy page stage4 refactor.");
