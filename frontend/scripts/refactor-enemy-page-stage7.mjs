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

function recommendedLabel(label, valueExpression) {
  return `<div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                        <label>${label}</label>
                        <span>推奨値 ${valueExpression}</span>
                      </div>`;
}

function recommendedLabelShort(label, valueExpression) {
  return `<div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                      <label>${label}</label>
                      <span>推奨値 ${valueExpression}</span>
                    </div>`;
}

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">STR<\/label>/,
  recommendedLabelShort("STR", "{calculated.strength}"),
  "STR recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">DEX<\/label>/,
  recommendedLabelShort("DEX", "{calculated.dexterity}"),
  "DEX recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">POW<\/label>/,
  recommendedLabelShort("POW", "{calculated.power}"),
  "POW recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">INT<\/label>/,
  recommendedLabelShort("INT", "{calculated.intelligence}"),
  "INT recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">\n                          回避\(固定値\)\n                        <\/label>/,
  recommendedLabel("回避(固定値)", "{calculated.avoid}"),
  "avoid recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">\n                          回避\(ダイス\)\n                        <\/label>/,
  recommendedLabel("回避(ダイス)", "{calculated.avoidDice}"),
  "avoid dice recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">\n                          回避\(判定\)\n                        <\/label>/,
  recommendedLabel("回避(判定)", "-"),
  "avoid total recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">\n                          抵抗\(固定値\)\n                        <\/label>/,
  recommendedLabel("抵抗(固定値)", "{calculated.resist}"),
  "resist recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">\n                          抵抗\(ダイス\)\n                        <\/label>/,
  recommendedLabel("抵抗(ダイス)", "{calculated.resistDice}"),
  "resist dice recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">\n                          抵抗\(判定\)\n                        <\/label>/,
  recommendedLabel("抵抗(判定)", "-"),
  "resist total recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">\n                      物理防御力\n                    <\/label>/,
  recommendedLabelShort("物理防御力", "{calculated.physicalDefense}"),
  "physical defense recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">\n                      魔法防御力\n                    <\/label>/,
  recommendedLabelShort("魔法防御力", "{calculated.magicDefense}"),
  "magic defense recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">最大HP<\/label>/,
  recommendedLabelShort("最大HP", "{calculated.hitPoint}"),
  "hit point recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">\n                      ヘイト倍率\n                    <\/label>/,
  recommendedLabelShort("ヘイト倍率", "{calculated.hate}"),
  "hate recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">行動力<\/label>/,
  recommendedLabelShort("行動力", "{calculated.action}"),
  "action recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">移動力<\/label>/,
  recommendedLabelShort("移動力", "{calculated.move}"),
  "move recommended value label",
);

replaceRequired(
  /<label className="mb-2 block text-sm font-medium">因果力<\/label>/,
  recommendedLabelShort("因果力", "-"),
  "fate recommended value label",
);

writeFileSync(pagePath, source, "utf8");
console.log("Applied enemy page stage7 recommended value labels.");
