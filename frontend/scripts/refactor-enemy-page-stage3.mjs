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
  /import \{ useMemo, useState, type ChangeEvent \} from "react";/,
  'import { useMemo } from "react";',
  "replace React imports",
);

if (!source.includes('from "@/hooks/useEnemyForm";')) {
  replaceRequired(
    /import \{ downloadBlobFile, downloadTextFile \} from "@\/utils\/downloadFile";\n/,
    'import { useEnemyForm } from "@/hooks/useEnemyForm";\n',
    "replace download helper import with hook import",
  );
}

replaceRequired(
  /import \{\n  buildCurrentFormData,[\s\S]*?type EnemySkillRow,\n\} from "@\/utils\/enemy";/,
  `import {
  calculateIdentification,
  diceButtonValues,
  enemyRanks,
  enemyRaces,
  enemyTypes,
  getCombinedTagText,
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
  "trim enemy utility imports",
);

replaceRequired(
  /  const initialForm = useMemo\(\(\) => getDefaultEnemyForm\(\), \[\]\);[\s\S]*?  const handleSkillCountChange = \(nextCountRaw: number\) => \{[\s\S]*?  \};\n\n  return \(/,
  `  const {
    activeTab,
    calculated,
    exampleSkill,
    form,
    gimmickSkill,
    handleApplyCalculatedValues,
    handleClear,
    handleCopy,
    handleDownloadJson,
    handleDownloadXlsx,
    handleGenerate,
    handleImportFile,
    handleItemCountChange,
    handleSkillCountChange,
    initialTags,
    items,
    outputSkills,
    removeItem,
    removeSkill,
    result,
    setActiveTab,
    setForm,
    skills,
    statusMessage,
    updateForm,
    updateItem,
    updateSkill,
  } = useEnemyForm();

  return (`,
  "replace local enemy state and handlers with hook",
);

writeFileSync(pagePath, source, "utf8");
console.log("Applied enemy page stage3 refactor.");
