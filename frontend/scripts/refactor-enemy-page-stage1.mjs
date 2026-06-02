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
  /import \{ useMemo, useState, type ChangeEvent, type ReactNode \} from "react";/,
  'import { useMemo, useState, type ChangeEvent } from "react";',
  "remove unused ReactNode import",
);

if (!source.includes('from "@/components/enemy";')) {
  replaceRequired(
    /import PageLinkCard from "@\/components\/page-link-card";\n/,
    'import PageLinkCard from "@/components/page-link-card";\nimport { TabButton } from "@/components/enemy";\n',
    "add enemy component imports",
  );
}

if (!source.includes('from "@/utils/downloadFile";')) {
  replaceRequired(
    /\} from "@\/components\/tool-config";\n/,
    '} from "@/components/tool-config";\nimport { downloadBlobFile, downloadTextFile } from "@/utils/downloadFile";\n',
    "add download helper imports",
  );
}

replaceRequired(
  /import \{\n  calculateEnemyValues,[\s\S]*?type EnemySkillInput,\n\} from "@\/utils\/createEnemyPiece";/,
  `import {
  buildCurrentFormData,
  calculateEnemyValues,
  calculateIdentification,
  createEmptyDropItemInput,
  createEmptySkillInput,
  createEnemyXlsx,
  createEnemyJson,
  createEnemyPiece,
  diceButtonValues,
  enemyRanks,
  enemyRaces,
  enemyTypes,
  formatDiceAboveSelection,
  formatDropDiceForOutput,
  getCombinedTagText,
  getDefaultEnemyForm,
  getDefaultTags,
  getDiceRangeBoundaryValues,
  getDropDiceAboveStartValue,
  getDropDicePreview,
  getEnemyTypeExplanation,
  getGimmickSkill,
  getMaxDropDice,
  getSelectedDiceValues,
  getSkillExample,
  isDiceButtonEnabled,
  isNumericDiceButton,
  normalizeCount,
  normalizeCr,
  parseEnemyJson,
  parseEnemyXlsx,
  popularityList,
  skillTimings,
  toNonNegativeNumber,
  withDropRowId,
  withSkillRowId,
  type DiceButtonValue,
  type EnemyDropItemInput,
  type EnemyDropItemRow,
  type EnemyFormData,
  type EnemySkillInput,
  type EnemySkillRow,
} from "@/utils/enemy";`,
  "replace enemy utility import",
);

source = source.replace(
  /\ntype EnemySkillRow = EnemySkillInput & \{ id: string \};\ntype EnemyDropItemRow = EnemyDropItemInput & \{ id: string \};\n/,
  "\n",
);

replaceRequired(
  /\nconst diceButtonValues = \[[\s\S]*?\nfunction makeId\(\) \{\n  return `\$\{Date\.now\(\)\}-\$\{Math\.random\(\)\.toString\(16\)\.slice\(2\)\}`;\n\}\n/,
  "\n",
  "remove local dice utilities and makeId",
);

replaceRequired(
  /\nfunction toNonNegativeNumber\(value: string\) \{[\s\S]*?\nfunction buildCurrentFormData\([\s\S]*?\n\}\n\nfunction TabButton/,
  "\nfunction TabButton",
  "remove local form and download helpers",
);

replaceRequired(
  /\nfunction TabButton\(props: \{[\s\S]*?\n\}\n\nexport default function EnemyPage\(\) \{/,
  "\nexport default function EnemyPage() {",
  "remove local TabButton component",
);

writeFileSync(pagePath, source, "utf8");
console.log("Applied enemy page stage1 refactor.");
