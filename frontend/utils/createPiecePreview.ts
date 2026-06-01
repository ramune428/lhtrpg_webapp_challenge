import {
  causalityCostSkillRules,
  directDamageSkillRules,
  pursuitSkillRules,
  reductionSkillRules,
  regenerationSkillRules,
  shieldSkillRules,
  weaknessSkillRules,
} from "./skillCommandRules";

type AnyRecord = Record<string, unknown>;
type StatusEntry = { label: string; value: number; max: number };
type ParamEntry = { label: string; value: string };
type AbilityEntry = { label: string; value: string };
type EquipmentData = { effects: string[]; hand1: AnyRecord | null; hand2: AnyRecord | null };
type SkillEntry = {
  timing: string;
  skillName: string;
  description: string;
  checkCommand: string | null;
  commands: string[];
  additionalConditionCommands: string[];
  supportCalculationCommands: string[];
};
type SkillData = { entries: SkillEntry[]; basicActions: string };

export type ChatPaletteOptions = {
  includeDamageCalculator: boolean;
  includeSkillChecks: boolean;
  includeSkillSupportCalculations: boolean;
  includeSkillDescriptions: boolean;
  includeBasicActions: boolean;
  includeEquipmentEffects: boolean;
  includeItemList: boolean;
  includeAbilityChecks: boolean;
  includeConsumeTables: boolean;
  includeTreasureTables: boolean;
};

export const defaultChatPaletteOptions: ChatPaletteOptions = {
  includeDamageCalculator: true,
  includeSkillChecks: true,
  includeSkillSupportCalculations: true,
  includeSkillDescriptions: true,
  includeBasicActions: true,
  includeEquipmentEffects: true,
  includeItemList: true,
  includeAbilityChecks: true,
  includeConsumeTables: true,
  includeTreasureTables: true,
};

const PARAM_LABELS = [
  "STR基本値",
  "DEX基本値",
  "POW基本値",
  "INT基本値",
  "攻撃力",
  "魔力",
  "回復力",
  "物防",
  "魔防",
  "STR",
  "DEX",
  "POW",
  "INT",
  "命中値",
  "回避値",
  "抵抗値",
  "運動値",
  "耐久値",
  "解除値",
  "操作値",
  "知覚値",
  "交渉値",
  "知識値",
  "解析値",
  "ヘイト",
  "因果力",
  "CR",
] as const;

function asString(value: unknown): string {
  return value === null || value === undefined ? "" : String(value);
}

function asNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asRecord(value: unknown): AnyRecord | null {
  return value !== null && value !== undefined && typeof value === "object" && !Array.isArray(value)
    ? (value as AnyRecord)
    : null;
}

function firstLine(value: unknown): string {
  return asString(value).split("\n")[0] ?? "";
}

function toHalfWidthDigits(value: string): string {
  return value.replace(/[０-９]/g, (char) => String(char.charCodeAt(0) - 0xff10));
}

function normalizeExpression(value: string, skillRank: number): string {
  let expression = toHalfWidthDigits(value)
    .replace(/[［【]/g, "")
    .replace(/[］】]/g, "")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/＋/g, "+")
    .replace(/－/g, "-")
    .replace(/[×ｘ]/g, "*")
    .replace(/Ｄ/g, "D")
    .replace(/ＳＲ/g, "SR")
    .replace(/ＣＲ/g, "CR")
    .replace(/\s+/g, "")
    .trim();

  while (expression.startsWith("(") && expression.endsWith(")")) {
    let depth = 0;
    let enclosesAll = true;
    for (let i = 0; i < expression.length; i += 1) {
      if (expression[i] === "(") depth += 1;
      if (expression[i] === ")") depth -= 1;
      if (depth === 0 && i < expression.length - 1) {
        enclosesAll = false;
        break;
      }
    }
    if (!enclosesAll) break;
    expression = expression.slice(1, -1);
  }

  expression = expression
    .replace(/SR/g, String(skillRank))
    .replace(/CR/g, "{CR}")
    .replace(/消費した因果力/g, "因果力")
    .replace(/あなたの/g, "")
    .replace(/対象の/g, "")
    .replace(/([+\-*\/])?0D/g, "")
    .replace(/^\+/, "");

  for (const label of PARAM_LABELS) {
    expression = expression.replaceAll(label, `{${label}}`);
  }

  return expression
    .replace(/\((\d+)\+(\d+)\)D/g, (_match, left: string, right: string) => `${Number(left) + Number(right)}D`)
    .replace(/\((\d+)\*(\d+)\)D/g, (_match, left: string, right: string) => `${Number(left) * Number(right)}D`)
    .replace(/\((\d+)\)D/g, "$1D");
}

function calcCommand(formula: string, skillRank: number): string {
  const expression = normalizeExpression(formula, skillRank);
  if (!expression) return "";
  return expression.includes("D") ? expression : `C(${expression})`;
}

function convertCheckDiceToLH(value: string): string {
  return value.replace(/D/g, "LH").replace(/^(\d+)\+(\d+LH.*)$/, "$2+$1");
}

function formatCharacterTags(values: unknown): string {
  const tags = asArray(values).map((item) => asString(item)).filter(Boolean);
  return tags.length === 0 ? "" : `タグ：${tags.map((tag) => `[${tag}]`).join(" ")}`;
}

function mergeChatPaletteOptions(options: Partial<ChatPaletteOptions> = {}): ChatPaletteOptions {
  return { ...defaultChatPaletteOptions, ...options };
}

export function normalizeCharacterId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    const idFromQuery = url.searchParams.get("id");
    if (idFromQuery) return idFromQuery;
    const sheetMatch = url.pathname.match(/sheets\/(\d+)/);
    if (sheetMatch) return sheetMatch[1];
    const segments = url.pathname.split("/").filter(Boolean);
    return (segments[segments.length - 1] ?? "").replace(/\.html$/, "");
  } catch {
    return trimmed;
  }
}

function validateCharacterId(characterId: string): string {
  const normalizedCharacterId = normalizeCharacterId(characterId);
  if (!/^\d+$/.test(normalizedCharacterId)) {
    throw new Error("キャラクターURLまたはキャラクターIDを入力してください。");
  }
  return normalizedCharacterId;
}

export async function fetchCharacterJson(characterId: string): Promise<unknown> {
  const normalizedCharacterId = validateCharacterId(characterId);
  const response = await fetch(`https://lhrpg.com/lhz/api/${normalizedCharacterId}.json`);
  if (!response.ok) throw new Error(`キャラクターJSONの取得に失敗しました。status=${response.status}`);
  return response.json();
}

function createCharacterData(jsonData: AnyRecord, characterId: string) {
  const characterTags = formatCharacterTags(jsonData.tags);
  const memo = jsonData.remarks;
  return {
    name: asString(jsonData.name),
    initiative: asNumber(jsonData.action),
    externalUrl: `https://lhrpg.com/lhz/pc_status?id=${characterId}`,
    memo: memo === null || memo === undefined ? characterTags : `${characterTags} \n ${asString(memo).replace(/\r\n/g, "\n")}`,
  };
}

function createStatusData(jsonData: AnyRecord): StatusEntry[] {
  const hp = asNumber(jsonData.max_hitpoint);
  const causality = asNumber(jsonData.effect);
  return [
    { label: "HP", value: hp, max: hp },
    { label: "再生", value: 0, max: 0 },
    { label: "障壁", value: 0, max: 0 },
    { label: "疲労", value: 0, max: 0 },
    { label: "ヘイト", value: 0, max: 0 },
    { label: "因果力", value: causality, max: causality },
  ];
}

function createAbilityData(jsonData: AnyRecord): AbilityEntry[] {
  const data: AbilityEntry[] = [
    { label: "運動値", value: asString(jsonData.abl_motion) },
    { label: "耐久値", value: asString(jsonData.abl_durability) },
    { label: "解除値", value: asString(jsonData.abl_dismantle) },
    { label: "操作値", value: asString(jsonData.abl_operate) },
    { label: "知覚値", value: asString(jsonData.abl_sense) },
    { label: "交渉値", value: asString(jsonData.abl_negotiate) },
    { label: "知識値", value: asString(jsonData.abl_knowledge) },
    { label: "解析値", value: asString(jsonData.abl_analyze) },
    { label: "回避値", value: asString(jsonData.abl_avoid) },
    { label: "抵抗値", value: asString(jsonData.abl_resist) },
    { label: "命中値", value: asString(jsonData.abl_hit) },
  ];
  return data.map((item) => ({ ...item, value: convertCheckDiceToLH(item.value.replace(/\s*>=0\s*$/, "")) }));
}

function createParamsData(jsonData: AnyRecord): ParamEntry[] {
  return [
    { label: "CR", value: asString(jsonData.character_rank) },
    { label: "攻撃力", value: asString(jsonData.physical_attack) },
    { label: "魔力", value: asString(jsonData.magic_attack) },
    { label: "回復力", value: asString(jsonData.heal_power) },
    { label: "物防", value: asString(jsonData.physical_defense) },
    { label: "魔防", value: asString(jsonData.magic_defense) },
    { label: "STR基本値", value: asString(jsonData.str_basic_value) },
    { label: "DEX基本値", value: asString(jsonData.dex_basic_value) },
    { label: "POW基本値", value: asString(jsonData.pow_basic_value) },
    { label: "INT基本値", value: asString(jsonData.int_basic_value) },
    { label: "STR", value: asString(jsonData.str_value) },
    { label: "DEX", value: asString(jsonData.dex_value) },
    { label: "POW", value: asString(jsonData.pow_value) },
    { label: "INT", value: asString(jsonData.int_value) },
    ...createAbilityData(jsonData).map((ability) => ({ label: ability.label, value: ability.value })),
  ];
}

function createEquipmentData(jsonData: AnyRecord): EquipmentData {
  const hand1 = asRecord(jsonData.hand1);
  const hand2 = asRecord(jsonData.hand2);
  const equipment = [
    hand1,
    hand2,
    asRecord(jsonData.armor),
    asRecord(jsonData.support_item1),
    asRecord(jsonData.support_item2),
    asRecord(jsonData.support_item3),
    asRecord(jsonData.bag),
  ];
  const effects: string[] = [];
  for (const item of equipment) {
    if (!item) continue;
    const tags = asArray(item.tags).map((tag) => asString(tag));
    if (!tags.some((tag) => tag.includes("M"))) continue;
    const alias = asString(item.alias || item.name);
    effects.push(item.prefix_function ? `${alias} プレフィックスド効果: ${firstLine(item.prefix_function)}` : `${alias} ネームド効果: ${firstLine(item.function)}`);
  }
  return { effects, hand1, hand2 };
}

function getShieldDefenseValue(hand1: AnyRecord | null, hand2: AnyRecord | null): number {
  const values: number[] = [];
  for (const hand of [hand1, hand2]) {
    if (!hand) continue;
    const tags = asArray(hand.tags).map((tag) => asString(tag));
    if (tags.includes("盾")) values.push(asNumber(hand.physical_defense));
  }
  return values.length > 0 ? Math.max(...values) : 0;
}

function groupByTiming(skills: AnyRecord[]): Record<string, AnyRecord[]> {
  const result: Record<string, AnyRecord[]> = {};
  for (const skill of skills) {
    const timing = asString(skill.timing || "未分類");
    result[timing] = [...(result[timing] ?? []), skill];
  }
  return result;
}

function formatSkillName(skill: AnyRecord): string {
  const tags = asArray(skill.tags).map((tag) => `[${asString(tag)}]`).join(" ");
  return [`《${asString(skill.name)}》`, tags].filter(Boolean).join(" ");
}

function formatSkillDescription(skill: AnyRecord): string {
  const tags = asArray(skill.tags).map((tag) => `[${asString(tag)}]`).join(" ");
  const parts = [
    `SR:${asString(skill.skill_rank)}/${asString(skill.skill_max_rank)}`,
    `タイミング:${asString(skill.timing)}`,
    `判定:${asString(skill.roll)}`,
    `対象:${asString(skill.target)}`,
    `射程:${asString(skill.range)}`,
    `コスト:${asString(skill.cost)}`,
    `制限:${asString(skill.limit)}`,
    tags,
  ].filter(Boolean);
  const effect = asString(skill.function);
  return effect ? `${parts.join(" ")} 効果:${effect}` : parts.join(" ");
}

function normalizeRollText(roll: string): string {
  return roll.replace(/^判定[:：]/, "").replace(/（/g, "(").replace(/）/g, ")").replace(/／/g, "/").replace(/\s+/g, "").trim();
}

function rollLabel(roll: string): string | null {
  return normalizeRollText(roll).match(/^(?:対決|基本)\(([^)]+)\)$/)?.[1] ?? null;
}

function abilityLabelByCheckName(name: string): string | null {
  const map: Record<string, string> = {
    命中: "命中値",
    回避: "回避値",
    抵抗: "抵抗値",
    運動: "運動値",
    耐久: "耐久値",
    解除: "解除値",
    操作: "操作値",
    知覚: "知覚値",
    交渉: "交渉値",
    知識: "知識値",
    解析: "解析値",
  };
  return map[name] ?? null;
}

function buildSkillCheckCommand(skill: AnyRecord, abilityData: AbilityEntry[]): string | null {
  const label = rollLabel(asString(skill.roll));
  if (!label) return null;
  const match = (label.split("/")[0] ?? "").match(/^(命中|回避|抵抗|運動|耐久|解除|操作|知覚|交渉|知識|解析)(.*)$/);
  if (!match) return null;
  const abilityLabel = abilityLabelByCheckName(match[1]);
  if (!abilityLabel) return null;
  const bonus = toHalfWidthDigits(match[2] ?? "").replace(/ＳＲ|SR/g, String(asNumber(skill.skill_rank))).replace(/Ｄ/g, "D");
  const base = abilityData.find((ability) => ability.label === abilityLabel)?.value.replace(/LH/g, "D") ?? `{${abilityLabel}}`;
  return `${bonus.includes("D") ? `${base}${bonus}` : `{${abilityLabel}}${bonus}`} ${asString(skill.name)}(${label})`;
}

function pushUnique(lines: string[], line: string): void {
  const trimmed = line.trim();
  if (trimmed && !lines.includes(trimmed)) lines.push(trimmed);
}

function getRankValue(characterRank: number, values: { default: number; cr11?: number; cr16?: number; cr21?: number }): number {
  if (values.cr21 !== undefined && characterRank >= 21) return values.cr21;
  if (values.cr16 !== undefined && characterRank >= 16) return values.cr16;
  if (values.cr11 !== undefined && characterRank >= 11) return values.cr11;
  return values.default;
}

function buildCausalityCostCommand(skill: AnyRecord, characterRank: number, includeDamageIncrease: boolean): string[] {
  const id = asNumber(skill.id);
  const rank = asNumber(skill.skill_rank);
  const rule = causalityCostSkillRules.find((item) => item.skillId === id);
  const lines: string[] = [];
  if (!rule) return lines;

  const isDamageIncrease = asString(rule.label).includes("ダメージ増加");
  if (isDamageIncrease !== includeDamageIncrease) return lines;

  const multiplier = getRankValue(characterRank, rule.crValues);
  for (let cost = 0; cost <= rule.maxCost; cost += 1) {
    const label = isDamageIncrease ? rule.label : rule.skillId === 4601 ? "弱点" : rule.label;
    pushUnique(lines, `C((${cost}+${rank})*${multiplier}) ${rule.skillName}_消費因果力${cost} ${label}`);
  }
  return lines;
}

function buildRuleCommands(skill: AnyRecord, characterRank: number, hand1: AnyRecord | null, hand2: AnyRecord | null): string[] {
  const id = asNumber(skill.id);
  const rank = asNumber(skill.skill_rank);
  const lines: string[] = [];

  for (const line of buildCausalityCostCommand(skill, characterRank, false)) pushUnique(lines, line);

  const regenerationRule = regenerationSkillRules.find((rule) => rule.skillId === id);
  if (regenerationRule) pushUnique(lines, `${regenerationRule.command} ${regenerationRule.skillName} ${regenerationRule.label}`);

  const shieldRule = shieldSkillRules.find((rule) => rule.skillId === id);
  if (shieldRule) pushUnique(lines, `${shieldRule.buildCommand(skill)} ${shieldRule.skillName} ${shieldRule.label}`);

  const reductionRule = reductionSkillRules.find((rule) => rule.skillId === id);
  if (reductionRule) {
    for (const command of reductionRule.buildCommands(skill, characterRank, hand1, hand2)) {
      pushUnique(lines, `${command.command} ${reductionRule.skillName}${command.nameSuffix ?? ""} ${reductionRule.condition ? `軽減[${reductionRule.condition}]` : "軽減"}`);
    }
  }

  const directRule = directDamageSkillRules.find((rule) => rule.skillId === id);
  if (directRule) {
    for (const command of directRule.buildCommands(skill, characterRank)) {
      pushUnique(lines, `${command.command} ${directRule.skillName}${command.nameSuffix ?? ""} ${directRule.labelSuffix ? `直接ダメージ/${directRule.labelSuffix}` : "直接ダメージ"}`);
    }
  }

  const pursuitRule = pursuitSkillRules.find((rule) => rule.skillId === id);
  if (pursuitRule) {
    for (const command of pursuitRule.buildCommands(skill, characterRank)) {
      pushUnique(lines, `${command.command} ${pursuitRule.skillName}${command.nameSuffix ?? ""} ${command.label ?? (pursuitRule.condition ? `追撃[${pursuitRule.condition}]` : "追撃")}`);
    }
  }

  const weaknessRule = weaknessSkillRules.find((rule) => rule.skillId === id);
  if (weaknessRule) {
    for (const command of weaknessRule.buildCommands(skill, characterRank)) {
      pushUnique(lines, `${command.command} ${weaknessRule.skillName}${command.nameSuffix ?? ""} ${weaknessRule.condition ? `弱点[${weaknessRule.condition}]` : "弱点"}`);
    }
  }

  if (id === 2624) pushUnique(lines, `(${rank})D+${getShieldDefenseValue(hand1, hand2)} ${asString(skill.name)} 貫通ダメージ`);
  if (id === 701) pushUnique(lines, `C({STR基本値}*2) ${asString(skill.name)} 回復`);
  return lines;
}

function buildAdditionalConditionDamageCommands(
  baseCommands: string[],
  skillName: string,
  condition: string,
  additionExpression: string,
  damageLabel: string
): string[] {
  const suffix = ` ${skillName} ${damageLabel}`;
  const lines: string[] = [];
  for (const command of baseCommands) {
    if (!command.endsWith(suffix)) continue;
    const baseExpression = command.slice(0, -suffix.length);
    pushUnique(lines, `${baseExpression}+${additionExpression} ${skillName}_${condition} ${damageLabel}`);
  }
  return lines;
}

function buildAdditionalConditionCommands(skill: AnyRecord, baseCommands: string[]): string[] {
  const id = asNumber(skill.id);
  const rank = asNumber(skill.skill_rank);
  const name = asString(skill.name);
  const lines: string[] = [];

  if (id === 2) {
    for (const line of buildAdditionalConditionDamageCommands(baseCommands, name, "クリティカル", "2D", "物理ダメージ")) pushUnique(lines, line);
  }

  if (id === 2413) {
    for (const line of buildAdditionalConditionDamageCommands(baseCommands, name, "クリティカル", "2D", "魔法ダメージ")) pushUnique(lines, line);
  }

  if (id === 2213) {
    for (const line of buildAdditionalConditionDamageCommands(baseCommands, name, "ヘイトアンダー", `C(${rank}*4)`, "物理ダメージ")) pushUnique(lines, line);
  }

  return lines;
}

function buildSupportCalculationCommands(skill: AnyRecord, characterRank: number): string[] {
  return buildCausalityCostCommand(skill, characterRank, true);
}

function buildGenericCommands(skill: AnyRecord): string[] {
  const name = asString(skill.name);
  const text = asString(skill.function);
  const rank = asNumber(skill.skill_rank);
  const lines: string[] = [];

  const damageMatch = text.match(/［([^］]+)］の(物理|魔法|貫通)(?:または魔法)?ダメージ/);
  if (damageMatch) pushUnique(lines, `${calcCommand(damageMatch[1], rank)} ${name} ${damageMatch[2]}ダメージ`);

  for (const suffix of ["］点回復", "］点まで回復"]) {
    const end = text.indexOf(suffix);
    if (end >= 0) {
      const before = text.slice(0, end);
      const start = Math.max(before.lastIndexOf("［"), before.lastIndexOf("【"));
      if (start >= 0) pushUnique(lines, `${calcCommand(text.slice(start + 1, end), rank)} ${name} 回復`);
    }
  }

  const simpleHeal = text.match(/【([^】]+)】点回復/);
  if (simpleHeal) pushUnique(lines, `${calcCommand(`【${simpleHeal[1]}】`, rank)} ${name} 回復`);

  for (const pattern of [/［([^］]+)］点の直接ダメージ/g, /【([^】]+)】点の直接ダメージ/g, /([0-9０-９]+)点の直接ダメージ/g]) {
    for (const match of text.matchAll(pattern)) {
      const formula = pattern.source.startsWith("【") ? `【${match[1]}】` : match[1];
      pushUnique(lines, `${calcCommand(formula, rank)} ${name} 直接ダメージ`);
    }
  }

  for (const status of ["追撃", "衰弱", "再生", "障壁", "軽減", "弱点"]) {
    for (const match of text.matchAll(new RegExp(`［${status}：([^］]+)］`, "g"))) {
      pushUnique(lines, `${calcCommand(match[1], rank)} ${name} ${status}`);
    }
    for (const match of text.matchAll(new RegExp(`［${status}］[^。]*。[^。]*強度は［([^］]+)］`, "g"))) {
      pushUnique(lines, `${calcCommand(match[1], rank)} ${name} ${status}`);
    }
    for (const match of text.matchAll(new RegExp(`［${status}］[^。]*。[^。]*強度は【([^】]+)】`, "g"))) {
      pushUnique(lines, `${calcCommand(`【${match[1]}】`, rank)} ${name} ${status}`);
    }
  }

  return lines;
}

function buildSkillCommands(skill: AnyRecord, characterRank: number, hand1: AnyRecord | null, hand2: AnyRecord | null): string[] {
  const lines: string[] = [];
  for (const line of buildGenericCommands(skill)) pushUnique(lines, line);
  for (const line of buildRuleCommands(skill, characterRank, hand1, hand2)) pushUnique(lines, line);
  return lines;
}

function createSkillData(jsonData: AnyRecord, hand1: AnyRecord | null, hand2: AnyRecord | null, abilityData: AbilityEntry[]): SkillData {
  const skills = asArray(jsonData.skills).map((skill) => asRecord(skill)).filter((skill): skill is AnyRecord => skill !== null);
  const characterRank = asNumber(jsonData.character_rank);
  const entries: SkillEntry[] = [];
  for (const [timing, timingSkills] of Object.entries(groupByTiming(skills))) {
    for (const skill of timingSkills) {
      const commands = buildSkillCommands(skill, characterRank, hand1, hand2);
      entries.push({
        timing,
        skillName: formatSkillName(skill),
        description: formatSkillDescription(skill),
        checkCommand: buildSkillCheckCommand(skill, abilityData),
        commands,
        additionalConditionCommands: buildAdditionalConditionCommands(skill, commands),
        supportCalculationCommands: buildSupportCalculationCommands(skill, characterRank),
      });
    }
  }
  return { entries, basicActions: createBasicActions() };
}

function createBasicActions(): string {
  return [
    "《ラン》 [基本動作] [移動] SR:-/- タイミング:ムーブ 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは【移動力】Ｓｑまで［通常移動］をしてもよい。",
    "《ダッシュ》 [基本動作] [移動] SR:-/- タイミング:ムーブ 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは［【移動力】＋２］Ｓｑまで［通常移動］をしてもよい。あなたは直後のマイナーアクションを１回失う。マイナーアクションを失えない場合は使用できない。",
    "《シフト》 [基本動作] [移動] SR:-/- タイミング:ムーブ 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは１Ｓｑまで［即時移動］をしてもよい。あなたは直後のマイナーアクションを１回失う。マイナーアクションを失えない場合は使用できない。",
    "《敵情を探る》 [基本動作] [偵察] SR:-/- タイミング:ブリーフィング 判定：基本（運動） 対象:本文 射程：本文 コスト:- 制限：- 効果：次のシーンの戦闘における敵の情報を得ようと試みる。",
    "《基本武器攻撃》 [基本動作] [武器攻撃] SR:-/- タイミング:メジャー 判定：対決(命中/回避) 対象:単体 射程：武器 コスト:- 制限：- 効果：対象に［【攻撃力】＋１Ｄ］の物理ダメージを与える。",
    "{攻撃力}+1D 基本武器攻撃",
    "《基本魔法攻撃》 [基本動作] [魔法攻撃] [杖] [魔石] SR:-/- タイミング: メジャー 判定：対決(命中/抵抗) 対象:単体 射程:4Sq コスト:- 制限：- 効果：対象に［【魔力】＋１Ｄ］の魔法ダメージを与える。",
    "{魔力}+1D 基本魔法攻撃",
    "《異常探知》 [基本動作] SR:-/- タイミング:セットアップ 判定：基本（知覚／探知難易度） 対象:広範囲20（無差別） 射程：至近 コスト:- 制限：- 効果：【探知難易度】を持つ範囲内すべての存在を対象とする。",
    "《エネミー識別》 [基本動作] SR:-/- タイミング:セットアップ 判定：基本（知識／識別難易度） 対象:単体 射程:20Sq コスト:- 制限：- 効果：【識別難易度】を持つキャラクターを対象とする。対象は［識別済］状態となる。",
    "《プロップ解析》 [基本動作] SR:-/- タイミング:メジャー 判定：基本（解析／解析難易度） 対象:本文 射程:1Sq コスト:- 制限：- 効果：【解析難易度】を持つプロップ１つを対象とする。対象は［解析済］状態になる。",
    "《プロップ解除》 [基本動作] SR:-/- タイミング:メジャー 判定：基本（解除／解除難易度） 対象:本文 射程:1Sq コスト:- 制限：- 効果：【解除難易度】を持ち、かつ［解析済］状態のプロップ１つを対象とする。対象は効果を停止する。",
    "《とどめの一撃》 [基本動作] SR:-/- タイミング:インスタント 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：このメインプロセスであなたが攻撃を行ない、その攻撃により対象に含まれる［戦闘不能］状態のキャラクターにＨＰダメージを１点でも与えられる状況となった場合、そのキャラクターを［死亡］状態にする。",
    "《かばう》 [基本動作] SR:-/- タイミング:ダメージ適用直前 判定：判定なし 対象:単体 射程：至近 コスト:- 制限：- 効果：あなたは［ダメージ適用ステップ］であなた以外の対象が受ける予定のダメージをかわりに受ける。",
    "《装備の変更》 [基本動作] [準備] SR:-/- タイミング:マイナー 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：［装備品スロット］のアイテムを［所持品スロット］に移してもよい。また、［所持品スロット］のアイテムを［装備品スロット］に装備してもよい。",
    "《受け渡し》 [基本動作] [準備] SR:-/- タイミング:マイナー 判定：判定なし 対象:単体 射程：至近 コスト:- 制限：- 効果：あなたの［所持品スロット］のアイテム１つを、同意した対象の［所持品スロット］に移動する。",
    "《隠れる》 [基本動作] SR:-/- タイミング:メジャー 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは［隠密］状態になる。",
    "《アイテム鑑定》 [基本動作] SR:-/- タイミング:メジャー 判定：基本（解析／解析難易度） 対象:本文 射程：至近 コスト:- 制限：- 効果：【解析難易度】を持つアイテム１つを対象とする。対象は［解析済］状態になる。",
  ].join("\n");
}

function createItemData(jsonData: AnyRecord): string {
  const lines: string[] = [];
  for (const rawItem of asArray(jsonData.items)) {
    const item = asRecord(rawItem);
    if (!item) continue;
    const tags = asArray(item.tags).map((tag) => `[${asString(tag)}]`).join(" ");
    const parts = [asString(item.alias || item.name), tags].filter(Boolean);
    if (asString(item.timing) !== "－") parts.push(`タイミング:${asString(item.timing)} 判定:${asString(item.roll)} 対象:${asString(item.target)} 射程:${asString(item.range)}`);
    parts.push(`効果:${firstLine(item.function)}`);
    lines.push(parts.join(" "));
  }
  return lines.join("\n");
}

function section(title: string, body: string): string {
  const trimmed = body.trim();
  return trimmed ? `${title}\n${trimmed}` : "";
}

function createCombatBasics(): string {
  return ["○戦闘の基本", "{命中値} 命中値", "{回避値} 回避値(ヘイトトップ時)", "{回避値}+2 回避値(ヘイトアンダー時)", "{抵抗値} 抵抗値(ヘイトトップ時)", "{抵抗値}+2 抵抗値(ヘイトアンダー時)"].join("\n");
}

function createDamageCalculator(): string {
  return ["○被ダメージ計算用", "C(0-{物防}-0) 被ダメージ=物理ダメージ-物防-軽減", "C(0-{魔防}-0) 被ダメージ=魔法ダメージ-魔防-軽減", "C(({HP}+{障壁})-0-{ヘイト}*0-0) 残HP=(HP+障壁)-ダメージ-ヘイト値*倍率-その他"].join("\n");
}

function createSkillCheckSection(skillData: SkillData): string {
  const lines: string[] = [];
  let currentTiming = "";
  for (const entry of skillData.entries) {
    if (!entry.checkCommand) continue;
    if (entry.timing !== currentTiming) {
      if (lines.length > 0) lines.push("");
      lines.push(`● ${entry.timing}`);
      currentTiming = entry.timing;
    }
    lines.push(entry.checkCommand);
  }
  return section("○判定がある特技", lines.join("\n"));
}

function createSupportSkillSection(skillData: SkillData): string {
  const lines: string[] = [];
  let currentTiming = "";
  for (const entry of skillData.entries) {
    if (entry.supportCalculationCommands.length === 0) continue;
    if (entry.timing !== currentTiming) {
      if (lines.length > 0) lines.push("");
      lines.push(`● ${entry.timing}`);
      currentTiming = entry.timing;
    }
    for (const command of entry.supportCalculationCommands) lines.push(command);
  }
  return section("○補助計算の特技", lines.join("\n"));
}

function createSkillSection(skillData: SkillData, options: ChatPaletteOptions): string {
  const lines: string[] = [];
  let currentTiming = "";
  for (const entry of skillData.entries) {
    if (entry.timing !== currentTiming) {
      if (lines.length > 0) lines.push("");
      lines.push(`● ${entry.timing}`);
      currentTiming = entry.timing;
    }
    lines.push(entry.skillName);
    if (options.includeSkillDescriptions && entry.description) lines.push(entry.description);
    for (const command of entry.commands) lines.push(command);
    for (const command of entry.additionalConditionCommands) lines.push(command);
    for (const command of entry.supportCalculationCommands) lines.push(command);
    lines.push("");
  }
  return section("○特技", lines.join("\n"));
}

function createAbilityChecks(abilityData: AbilityEntry[]): string {
  return section("○各種判定", abilityData.map((ability) => `{${ability.label}} ${ability.label}`).join("\n"));
}

function createChatPalette(skillData: SkillData, equipmentData: string[], itemData: string, abilityData: AbilityEntry[], options: Partial<ChatPaletteOptions> = {}): string {
  const outputOptions = mergeChatPaletteOptions(options);
  const sections: string[] = [createCombatBasics()];
  if (outputOptions.includeDamageCalculator) sections.push(createDamageCalculator());
  if (outputOptions.includeSkillChecks) sections.push(createSkillCheckSection(skillData));
  if (outputOptions.includeSkillSupportCalculations) sections.push(createSupportSkillSection(skillData));
  sections.push(createSkillSection(skillData, outputOptions));
  if (outputOptions.includeBasicActions) sections.push(section("○基本動作", skillData.basicActions));
  if (outputOptions.includeEquipmentEffects) sections.push(section("○装備アイテム効果", equipmentData.join("\n")));
  if (outputOptions.includeItemList) sections.push(section("○所持アイテム一覧", itemData));
  if (outputOptions.includeAbilityChecks) sections.push(createAbilityChecks(abilityData));
  if (outputOptions.includeConsumeTables) sections.push(["○消耗表", "PCT{CR}+0 体力消耗表", "ECT{CR}+0 気力消耗表", "GCT{CR}+0 物品消耗表", "CCT{CR}+0 金銭消耗表"].join("\n"));
  if (outputOptions.includeTreasureTables) sections.push(["○財宝表", "CTRS{CR}+0 金銭財宝表", "MTRS{CR}+0 魔法素材財宝表", "ITRS{CR}+0 換金アイテム財宝表"].join("\n"));
  return sections.filter((item) => item.trim() !== "").join("\n\n");
}

export function createPieceFromJson(jsonDataValue: unknown, characterId: string, options: Partial<ChatPaletteOptions> = {}): string {
  const jsonData = asRecord(jsonDataValue);
  if (!jsonData) throw new Error("キャラクターJSONの形式が正しくありません。");
  const normalizedCharacterId = validateCharacterId(characterId);
  const characterData = createCharacterData(jsonData, normalizedCharacterId);
  const statusData = createStatusData(jsonData);
  const paramsData = createParamsData(jsonData);
  const equipmentData = createEquipmentData(jsonData);
  const abilityData = createAbilityData(jsonData);
  const skillData = createSkillData(jsonData, equipmentData.hand1, equipmentData.hand2, abilityData);
  const itemData = createItemData(jsonData);
  const commands = createChatPalette(skillData, equipmentData.effects, itemData, abilityData, options);
  return JSON.stringify({ kind: "character", data: { ...characterData, status: statusData, params: paramsData, commands } });
}

export async function createPiece(characterId: string, options: Partial<ChatPaletteOptions> = {}): Promise<string> {
  const normalizedCharacterId = validateCharacterId(characterId);
  try {
    const jsonData = await fetchCharacterJson(normalizedCharacterId);
    return createPieceFromJson(jsonData, normalizedCharacterId, options);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) throw new Error(`キャラクター駒データの生成に失敗しました。${error.message}`);
    throw new Error("キャラクター駒データの生成に失敗しました。");
  }
}
