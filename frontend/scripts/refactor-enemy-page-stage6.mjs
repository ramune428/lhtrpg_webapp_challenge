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
  /import \{ EnemyCalculatedValuesPanel, EnemyDropItemSection, EnemyOutputPanel, EnemyPreviewSection, TabButton \} from "@\/components\/enemy";/,
  'import { EnemyCalculatedValuesPanel, EnemyDropItemSection, EnemyOutputPanel, EnemyPreviewSection, EnemySkillSection, TabButton } from "@/components/enemy";',
  "add skill section import",
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
  toNonNegativeNumber,
  type EnemyFormData,
} from "@/utils/enemy";`,
  "remove skill-only utility imports",
);

replaceRequired(
  /        \{activeTab === "skills" \? \([\s\S]*?        \) : null\}\n\n        \{activeTab === "output" \? \(/,
  `        {activeTab === "skills" ? (
          <EnemySkillSection
            skills={skills}
            exampleSkill={exampleSkill}
            gimmickSkill={gimmickSkill}
            isGimmick={form.race === "ギミック"}
            onSkillCountChange={handleSkillCountChange}
            onUpdateSkill={updateSkill}
            onRemoveSkill={removeSkill}
          />
        ) : null}

        {activeTab === "output" ? (`,
  "replace skill section",
);

writeFileSync(pagePath, source, "utf8");
console.log("Applied enemy page stage6 refactor.");
