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
  /import \{ EnemyCalculatedValuesPanel, EnemyOutputPanel, EnemyPreviewSection, TabButton \} from "@\/components\/enemy";/,
  'import { EnemyCalculatedValuesPanel, EnemyDropItemSection, EnemyOutputPanel, EnemyPreviewSection, TabButton } from "@/components/enemy";',
  "add drop item section import",
);

replaceRequired(
  /import \{\n  calculateIdentification,[\s\S]*?type EnemyFormData,\n\} from "@\/utils\/enemy";/,
  `import {
  calculateIdentification,
  enemyRanks,
  enemyRaces,
  enemyTypes,
  getEnemyTypeExplanation,
  normalizeCr,
  popularityList,
  skillTimings,
  toNonNegativeNumber,
  type EnemyFormData,
} from "@/utils/enemy";`,
  "remove drop-item-only utility imports",
);

replaceRequired(
  /            <div className="mb-6">\n              <h2 className="mb-3 text-lg font-semibold">推奨ドロップ品<\/h2>[\s\S]*?            <hr className="my-8 border-neutral-300" \/>/,
  `            <EnemyDropItemSection
              calculated={calculated}
              rank={form.rank}
              items={items}
              onItemCountChange={handleItemCountChange}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />

            <hr className="my-8 border-neutral-300" />`,
  "replace drop item section",
);

writeFileSync(pagePath, source, "utf8");
console.log("Applied enemy page stage5 refactor.");
