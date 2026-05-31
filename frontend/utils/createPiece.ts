import {
  causalityCostSkillRules,
  directDamageSkillRules,
  pursuitSkillRules,
  reductionSkillRules,
  regenerationSkillRules,
  shieldSkillRules,
  weaknessSkillRules,
} from "./skillCommandRules";
import type {
  CausalityCostSkillRule,
  CrValues,
  DirectDamageSkillRule,
  PursuitSkillRule,
  ReductionSkillRule,
  RegenerationSkillRule,
  ShieldSkillRule,
  WeaknessSkillRule,
} from "./skillCommandRules";

type AnyRecord = Record<string, unknown>;

type StatusEntry = { label: string; value: number; max: number };
type ParamEntry = { label: string; value: string };
type AbilityEntry = { label: string; value: string };
type EquipmentData = { effects: string[]; hand1: AnyRecord | null; hand2: AnyRecord | null };

type SkillChatPaletteEntry = {
  timing: string;
  skillName: string;
  description: string;
  checkCommand: string | null;
  commands: string[];
};

type SkillChatPaletteData = {
  entries: SkillChatPaletteEntry[];
  basicActions: string;
};

export type ChatPaletteOptions = {
  includeDamageCalculator: boolean;
  includeSkillChecks: boolean;
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
  includeSkillChecks: false,
  includeSkillDescriptions: true,
  includeBasicActions: true,
  includeEquipmentEffects: true,
  includeItemList: true,
  includeAbilityChecks: true,
  includeConsumeTables: true,
  includeTreasureTables: true,
};

const PARAM_LABELS = [
  "攻撃力",
  "魔力",
  "回復力",
  "物防",
  "魔防",
  "STR基本値",
  "DEX基本値",
  "POW基本値",
  "INT基本値",
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
  if (value === null || value === undefined) return "";
  return String(value);
}

function asNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asRecord(value: unknown): AnyRecord | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "object" || Array.isArray(value)) return null;
  return value as AnyRecord;
}

function firstLine(value: unknown): string {
  return asString(value).split("\n")[0] ?? "";
}

function fullWidthDigitsToHalfWidth(value: string): string {
  return value.replace(/[０-９]/g, (char) => String(char.charCodeAt(0) - 0xff10));
}

function normalizeMathText(value: string): string {
  return fullWidthDigitsToHalfWidth(value)
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
}

function stripOuterParentheses(value: string): string {
  let result = value;
  while (result.startsWith("(") && result.endsWith(")")) {
    let depth = 0;
    let enclosesAll = true;
    for (let i = 0; i < result.length; i += 1) {
      const char = result[i];
      if (char === "(") depth += 1;
      if (char === ")") depth -= 1;
      if (depth === 0 && i < result.length - 1) {
        enclosesAll = false;
        break;
      }
    }
    if (!enclosesAll) break;
    result = result.slice(1, -1);
  }
  return result;
}

function normalizeFormula(rawFormula: string, skillRank: number): string {
  let expression = stripOuterParentheses(normalizeMathText(rawFormula));

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

  return expression;
}

function formatCalcCommand(rawFormula: string, skillRank: number): string {
  let expression = normalizeFormula(rawFormula, skillRank);
  if (!expression) return "";
  expression = expression
    .replace(/\((\d+)\+(\d+)\)D/g, (_match, left: string, right: string) => `${Number(left) + Number(right)}D`)
    .replace(/\((\d+)\*(\d+)\)D/g, (_match, left: string, right: string) => `${Number(left) * Number(right)}D`)
    .replace(/\((\d+)\)D/g, "$1D")
    .replace(/^({[^}]+})\+(\d+D)$/, "$2+$1");

  if (expression.includes("D")) {
    return expression;
  }
  return `C(${expression})`;
}

function formatCharacterTags(values: unknown): string {
  const tags = asArray(values).map((item) => asString(item)).filter(Boolean);
  return tags.length === 0 ? "" : `タグ：${tags.map((tag) => `[${tag}]`).join(" ")}`;
}

function convertCheckDiceToLH(value: string): string {
  return value.replace(/D/g, "LH").replace(/^(\d+)\+(\d+LH.*)$/, "$2+$1");
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
  if (!response.ok) {
    throw new Error(`キャラクターJSONの取得に失敗しました。status=${response.status}`);
  }
  return response.json();
}

function createCharacterData(jsonData: AnyRecord, characterId: string) {
  const characterName = asString(jsonData.name);
  const initiative = asNumber(jsonData.action);
  const url = `https://lhrpg.com/lhz/pc_status?id=${characterId}`;
  const memo = jsonData.remarks;
  const characterTags = formatCharacterTags(jsonData.tags);

  return {
    name: characterName,
    initiative,
    externalUrl: url,
    memo: memo === null || memo === undefined ? characterTags : `${characterTags} \n ${asString(memo).replace(/\r\n/g, "\n")}`,
  };
}

function createStatusData(jsonData: AnyRecord): StatusEntry[] {
  const statusHp = asNumber(jsonData.max_hitpoint);
  const statusEffect = asNumber(jsonData.effect);

  return [
    { label: "HP", value: statusHp, max: statusHp },
    { label: "再生", value: 0, max: 0 },
    { label: "障壁", value: 0, max: 0 },
    { label: "疲労", value: 0, max: 0 },
    { label: "ヘイト", value: 0, max: 0 },
    { label: "因果力", value: statusEffect, max: statusEffect },
  ];
}

function createParamsData(jsonData: AnyRecord): ParamEntry[] {
  const abilityParams = createAbilityData(jsonData).map((ability) => ({ label: ability.label, value: ability.value }));

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
    ...abilityParams,
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
    if (item.prefix_function) {
      effects.push(`${alias} プレフィックスド効果: ${firstLine(item.prefix_function)}`);
    } else {
      effects.push(`${alias} ネームド効果: ${firstLine(item.function)}`);
    }
  }

  return { effects, hand1, hand2 };
}

function groupTiming(skillsArray: AnyRecord[]): Record<string, AnyRecord[]> {
  const result: Record<string, AnyRecord[]> = {};
  for (const skill of skillsArray) {
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
  const baseText = [
    `SR:${asString(skill.skill_rank)}/${asString(skill.skill_max_rank)}`,
    `タイミング:${asString(skill.timing)}`,
    `判定:${asString(skill.roll)}`,
    `対象:${asString(skill.target)}`,
    `射程:${asString(skill.range)}`,
    `コスト:${asString(skill.cost)}`,
    `制限:${asString(skill.limit)}`,
    tags,
  ].filter(Boolean).join(" ");
  const effectText = asString(skill.function);
  return effectText ? `${baseText} 効果:${effectText}` : baseText;
}

function normalizeRollText(roll: string): string {
  return roll.replace(/^判定[:：]/, "").replace(/（/g, "(").replace(/）/g, ")").replace(/／/g, "/").replace(/\s+/g, "").trim();
}

function getRollLabel(roll: string): string | null {
  const matchedRoll = normalizeRollText(roll).match(/^(?:対決|基本)\(([^)]+)\)$/);
  return matchedRoll ? matchedRoll[1] : null;
}

function normalizeCheckBonus(value: string, skillRank: number): string {
  return fullWidthDigitsToHalfWidth(value).replace(/SR/g, String(skillRank)).replace(/ＳＲ/g, String(skillRank)).replace(/Ｄ/g, "D");
}

function getAbilityLabelByCheckName(checkName: string): string | null {
  if (checkName === "命中") return "命中値";
  if (checkName === "回避") return "回避値";
  if (checkName === "抵抗") return "抵抗値";
  if (checkName === "運動") return "運動値";
  if (checkName === "耐久") return "耐久値";
  if (checkName === "解除") return "解除値";
  if (checkName === "操作") return "操作値";
  if (checkName === "知覚") return "知覚値";
  if (checkName === "交渉") return "交渉値";
  if (checkName === "知識") return "知識値";
  if (checkName === "解析") return "解析値";
  return null;
}

function getAbilityDiceExpression(abilityData: AbilityEntry[], abilityLabel: string): string | null {
  return abilityData.find((ability) => ability.label === abilityLabel)?.value.replace(/LH/g, "D") ?? null;
}

function getCheckExpressionByRollLabel(rollLabel: string, skillRank: number, abilityData: AbilityEntry[]): string | null {
  const checkText = rollLabel.split("/")[0]?.trim() ?? "";
  const matchedCheck = checkText.match(/^(命中|回避|抵抗|運動|耐久|解除|操作|知覚|交渉|知識|解析)(.*)$/);
  if (!matchedCheck) return null;

  const abilityLabel = getAbilityLabelByCheckName(matchedCheck[1]);
  if (!abilityLabel) return null;

  const bonus = normalizeCheckBonus(matchedCheck[2] ?? "", skillRank);
  if (bonus.includes("D")) {
    return `${getAbilityDiceExpression(abilityData, abilityLabel) ?? `{${abilityLabel}}`}${bonus}`;
  }
  return `{${abilityLabel}}${bonus}`;
}

function buildSkillCheckCommand(skill: AnyRecord, abilityData: AbilityEntry[]): string | null {
  const rollLabel = getRollLabel(asString(skill.roll));
  if (!rollLabel) return null;

  const checkExpression = getCheckExpressionByRollLabel(rollLabel, asNumber(skill.skill_rank), abilityData);
  return checkExpression ? `${checkExpression} ${asString(skill.name)}(${rollLabel})` : null;
}

function getValueByCharacterRank(characterRank: number, values: CrValues): number {
  if (values.cr21 !== undefined && characterRank >= 21) return values.cr21;
  if (values.cr16 !== undefined && characterRank >= 16) return values.cr16;
  if (values.cr11 !== undefined && characterRank >= 11) return values.cr11;
  return values.default;
}

function findCausalityCostSkillRule(skillId: number): CausalityCostSkillRule | undefined {
  return causalityCostSkillRules.find((rule) => rule.skillId === skillId);
}

function findRegenerationSkillRule(skillId: number): RegenerationSkillRule | undefined {
  return regenerationSkillRules.find((rule) => rule.skillId === skillId);
}

function findShieldSkillRule(skillId: number): ShieldSkillRule | undefined {
  return shieldSkillRules.find((rule) => rule.skillId === skillId);
}

function findWeaknessSkillRule(skillId: number): WeaknessSkillRule | undefined {
  return weaknessSkillRules.find((rule) => rule.skillId === skillId);
}

function findReductionSkillRule(skillId: number): ReductionSkillRule | undefined {
  return reductionSkillRules.find((rule) => rule.skillId === skillId);
}

function findDirectDamageSkillRule(skillId: number): DirectDamageSkillRule | undefined {
  return directDamageSkillRules.find((rule) => rule.skillId === skillId);
}

function findPursuitSkillRule(skillId: number): PursuitSkillRule | undefined {
  return pursuitSkillRules.find((rule) => rule.skillId === skillId);
}

function getShieldDefenseValue(hand1: AnyRecord | null, hand2: AnyRecord | null): number {
  const shieldsDefense: number[] = [];
  for (const hand of [hand1, hand2]) {
    if (!hand) continue;
    const tags = asArray(hand.tags).map((tag) => asString(tag));
    if (tags.includes("盾")) shieldsDefense.push(asNumber(hand.physical_defense));
  }
  return shieldsDefense.length > 0 ? Math.max(...shieldsDefense) : 0;
}

function pushUnique(lines: string[], line: string): void {
  const trimmed = line.trim();
  if (trimmed && !lines.includes(trimmed)) lines.push(trimmed);
}

function buildCausalityCostCommandLines(skill: AnyRecord, characterRank: number, rule: CausalityCostSkillRule): string[] {
  if (rule.label.includes("ダメージ増加")) {
    return [];
  }

  const skillRank = asNumber(skill.skill_rank);
  const multiplier = getValueByCharacterRank(characterRank, rule.crValues);
  const suffix = rule.skillId === 4601 ? " 弱点" : ` ${rule.label}`;
  const lines: string[] = [];
  for (let cost = 0; cost <= rule.maxCost; cost += 1) {
    lines.push(`C((${cost}+${skillRank})*${multiplier}) ${rule.skillName}_消費因果力${cost}${suffix}`);
  }
  return lines;
}

function buildRegenerationSkillCommandLines(rule: RegenerationSkillRule): string[] {
  return [`${rule.command} ${rule.skillName} ${rule.label}`.trim()];
}

function buildShieldSkillCommandLines(skill: AnyRecord, rule: ShieldSkillRule): string[] {
  return [`${rule.buildCommand(skill)} ${rule.skillName} ${rule.label}`.trim()];
}

function buildWeaknessSkillCommandLines(skill: AnyRecord, characterRank: number, rule: WeaknessSkillRule): string[] {
  const label = rule.condition ? `弱点[${rule.condition}]` : "弱点";
  return rule.buildCommands(skill, characterRank).map((command) => `${command.command} ${rule.skillName}${command.nameSuffix ?? ""} ${label}`);
}

function buildReductionSkillCommandLines(
  skill: AnyRecord,
  characterRank: number,
  hand1: AnyRecord | null,
  hand2: AnyRecord | null,
  rule: ReductionSkillRule
): string[] {
  const label = rule.condition ? `軽減[${rule.condition}]` : "軽減";
  return rule.buildCommands(skill, characterRank, hand1, hand2).map((command) => `${command.command} ${rule.skillName}${command.nameSuffix ?? ""} ${label}`);
}

function buildDirectDamageSkillCommandLines(skill: AnyRecord, characterRank: number, rule: DirectDamageSkillRule): string[] {
  const label = rule.labelSuffix ? `直接ダメージ/${rule.labelSuffix}` : "直接ダメージ";
  return rule.buildCommands(skill, characterRank).map((command) => `${command.command} ${rule.skillName}${command.nameSuffix ?? ""} ${label}`);
}

function buildPursuitSkillCommandLines(skill: AnyRecord, characterRank: number, rule: PursuitSkillRule): string[] {
  const defaultLabel = rule.condition ? `追撃[${rule.condition}]` : "追撃";
  return rule.buildCommands(skill, characterRank).map((command) => `${command.command} ${rule.skillName}${command.nameSuffix ?? ""} ${command.label ?? defaultLabel}`);
}

function extractFirstBracketFormulaBefore(text: string, suffix: string): string | null {
  const endIndex = text.indexOf(suffix);
  if (endIndex < 0) return null;

  const beforeSuffix = text.slice(0, endIndex);
  const startIndex = Math.max(beforeSuffix.lastIndexOf("［"), beforeSuffix.lastIndexOf("【"));
  if (startIndex < 0) return null;

  return text.slice(startIndex + 1, endIndex);
}

function buildDamageOrHealCommands(skill: AnyRecord): string[] {
  const skillName = asString(skill.name);
  const functionText = asString(skill.function);
  const skillRank = asNumber(skill.skill_rank);
  const lines: string[] = [];

  const damageMatch = functionText.match(/［([^］]+)］の(物理|魔法|貫通)(?:または魔法)?ダメージ/);
  if (damageMatch) {
    pushUnique(lines, `${formatCalcCommand(damageMatch[1], skillRank)} ${skillName} ${damageMatch[2]}ダメージ`);
  }

  const healBracketFormula = extractFirstBracketFormulaBefore(functionText, "］点回復");
  if (healBracketFormula) {
    pushUnique(lines, `${formatCalcCommand(healBracketFormula, skillRank)} ${skillName} 回復`);
  }

  const healUntilFormula = extractFirstBracketFormulaBefore(functionText, "］点まで回復");
  if (healUntilFormula) {
    pushUnique(lines, `${formatCalcCommand(healUntilFormula, skillRank)} ${skillName} 回復`);
  }

  const simpleHealMatch = functionText.match(/【([^】]+)】点回復/);
  if (simpleHealMatch) {
    pushUnique(lines, `${formatCalcCommand(`【${simpleHealMatch[1]}】`, skillRank)} ${skillName} 回復`);
  }

  const directPatterns = [
    /［([^］]+)］点の直接ダメージ/g,
    /【([^】]+)】点の直接ダメージ/g,
    /([0-9０-９]+)点の直接ダメージ/g,
  ];

  for (const pattern of directPatterns) {
    for (const match of functionText.matchAll(pattern)) {
      const formula = pattern.source.startsWith("【") ? `【${match[1]}】` : match[1];
      pushUnique(lines, `${formatCalcCommand(formula, skillRank)} ${skillName} 直接ダメージ`);
    }
  }

  return lines;
}

function buildGenericStatusCommands(skill: AnyRecord): string[] {
  const skillName = asString(skill.name);
  const functionText = asString(skill.function);
  const skillRank = asNumber(skill.skill_rank);
  const lines: string[] = [];

  const statusLabelMap: Record<string, string> = {
    追撃: "追撃",
    衰弱: "衰弱",
    再生: "再生",
    障壁: "障壁",
    軽減: "軽減",
    弱点: "弱点",
  };

  for (const [statusName, label] of Object.entries(statusLabelMap)) {
    const colonPattern = new RegExp(`［${statusName}：([^］]+)］`, "g");
    for (const match of functionText.matchAll(colonPattern)) {
      pushUnique(lines, `${formatCalcCommand(match[1], skillRank)} ${skillName} ${label}`);
    }

    const strengthPattern = new RegExp(`［${statusName}］[^。]*。[^。]*強度は［([^］]+)］`, "g");
    for (const match of functionText.matchAll(strengthPattern)) {
      pushUnique(lines, `${formatCalcCommand(match[1], skillRank)} ${skillName} ${label}`);
    }

    const strengthParamPattern = new RegExp(`［${statusName}］[^。]*。[^。]*強度は【([^】]+)】`, "g");
    for (const match of functionText.matchAll(strengthParamPattern)) {
      pushUnique(lines, `${formatCalcCommand(`【${match[1]}】`, skillRank)} ${skillName} ${label}`);
    }
  }

  return lines;
}

function buildSkillCommandLines(
  skill: AnyRecord,
  hand1: AnyRecord | null,
  hand2: AnyRecord | null,
  characterRank: number
): string[] {
  const skillId = asNumber(skill.id);
  const lines: string[] = [];

  for (const line of buildDamageOrHealCommands(skill)) pushUnique(lines, line);
  for (const line of buildGenericStatusCommands(skill)) pushUnique(lines, line);

  const causalityCostRule = findCausalityCostSkillRule(skillId);
  if (causalityCostRule) {
    for (const line of buildCausalityCostCommandLines(skill, characterRank, causalityCostRule)) pushUnique(lines, line);
  }

  const regenerationRule = findRegenerationSkillRule(skillId);
  if (regenerationRule) {
    for (const line of buildRegenerationSkillCommandLines(regenerationRule)) pushUnique(lines, line);
  }

  const shieldRule = findShieldSkillRule(skillId);
  if (shieldRule) {
    for (const line of buildShieldSkillCommandLines(skill, shieldRule)) pushUnique(lines, line);
  }

  const reductionRule = findReductionSkillRule(skillId);
  if (reductionRule) {
    for (const line of buildReductionSkillCommandLines(skill, characterRank, hand1, hand2, reductionRule)) pushUnique(lines, line);
  }

  const directDamageRule = findDirectDamageSkillRule(skillId);
  if (directDamageRule) {
    for (const line of buildDirectDamageSkillCommandLines(skill, characterRank, directDamageRule)) pushUnique(lines, line);
  }

  const pursuitRule = findPursuitSkillRule(skillId);
  if (pursuitRule) {
    for (const line of buildPursuitSkillCommandLines(skill, characterRank, pursuitRule)) pushUnique(lines, line);
  }

  const weaknessRule = findWeaknessSkillRule(skillId);
  if (weaknessRule) {
    for (const line of buildWeaknessSkillCommandLines(skill, characterRank, weaknessRule)) pushUnique(lines, line);
  }

  if (skillId === 2624) {
    pushUnique(lines, `(${asNumber(skill.skill_rank)})D+${getShieldDefenseValue(hand1, hand2)} ${asString(skill.name)} 貫通ダメージ`);
  }

  if (skillId === 701) {
    pushUnique(lines, `C({STR基本値}*2) ${asString(skill.name)} 回復`);
  }

  return lines;
}

function createSkillData(
  jsonData: AnyRecord,
  hand1: AnyRecord | null,
  hand2: AnyRecord | null,
  abilityData: AbilityEntry[]
): SkillChatPaletteData {
  const skills = asArray(jsonData.skills).map((skill) => asRecord(skill)).filter((skill): skill is AnyRecord => skill !== null);
  const skillTimingData = groupTiming(skills);
  const characterRank = asNumber(jsonData.character_rank);
  const entries: SkillChatPaletteEntry[] = [];

  for (const timing of Object.keys(skillTimingData)) {
    for (const skill of skillTimingData[timing]) {
      entries.push({
        timing,
        skillName: formatSkillName(skill),
        description: formatSkillDescription(skill),
        checkCommand: buildSkillCheckCommand(skill, abilityData),
        commands: buildSkillCommandLines(skill, hand1, hand2, characterRank),
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
  const itemLines: string[] = [];
  for (const itemValue of asArray(jsonData.items)) {
    const item = asRecord(itemValue);
    if (!item) continue;

    const tags = asArray(item.tags).map((tag) => `[${asString(tag)}]`).join(" ");
    const parts = [asString(item.alias || item.name), tags].filter(Boolean);
    if (asString(item.timing) !== "－") {
      parts.push(`タイミング:${asString(item.timing)} 判定:${asString(item.roll)} 対象:${asString(item.target)} 射程:${asString(item.range)}`);
    }
    parts.push(`効果:${firstLine(item.function)}`);
    itemLines.push(parts.join(" "));
  }
  return itemLines.join("\n");
}

function createAbilityData(jsonData: AnyRecord): AbilityEntry[] {
  const abilityData: AbilityEntry[] = [
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

  return abilityData.map((ability) => ({
    ...ability,
    value: convertCheckDiceToLH(ability.value.replace(/\s*>=0\s*$/, "")),
  }));
}

function buildSection(title: string, body: string): string {
  const trimmedBody = body.trim();
  return trimmedBody ? `${title}\n${trimmedBody}` : "";
}

function createCombatBasics(): string {
  return [
    "○戦闘の基本",
    "{命中値} 命中値",
    "{回避値} 回避値(ヘイトトップ時)",
    "{回避値}+2 回避値(ヘイトアンダー時)",
    "{抵抗値} 抵抗値(ヘイトトップ時)",
    "{抵抗値}+2 抵抗値(ヘイトアンダー時)",
  ].join("\n");
}

function createDamageCalculator(): string {
  return [
    "○被ダメージ計算用",
    "C(0-{物防}-0) 被ダメージ=物理ダメージ-物防-軽減",
    "C(0-{魔防}-0) 被ダメージ=魔法ダメージ-魔防-軽減",
    "C(({HP}+{障壁})-0-{ヘイト}*0-0) 残HP=(HP+障壁)-ダメージ-ヘイトダメージ-その他",
  ].join("\n");
}

function createSkillCheckSection(skillData: SkillChatPaletteData): string {
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
  return buildSection("○判定がある特技", lines.join("\n"));
}

function createSkillSection(skillData: SkillChatPaletteData, options: ChatPaletteOptions): string {
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
    lines.push("");
  }

  return buildSection("○特技", lines.join("\n"));
}

function createEquipmentEffects(equipmentData: string[]): string {
  return buildSection("○装備アイテム効果", equipmentData.join("\n"));
}

function createAbilityChecks(abilityData: AbilityEntry[]): string {
  return buildSection("○各種判定", abilityData.map((ability) => `{${ability.label}} ${ability.label}`).join("\n"));
}

function createConsumeTables(): string {
  return ["○消耗表", "PCT{CR}+0 体力消耗表", "ECT{CR}+0 気力消耗表", "GCT{CR}+0 物品消耗表", "CCT{CR}+0 金銭消耗表"].join("\n");
}

function createTreasureTables(): string {
  return ["○財宝表", "CTRS{CR}+0 金銭財宝表", "MTRS{CR}+0 魔法素材財宝表", "ITRS{CR}+0 換金アイテム財宝表"].join("\n");
}\n
function createChatPalette(
  skillData: SkillChatPaletteData,
  equipmentData: string[],
  itemData: string,
  abilityData: AbilityEntry[],
  options: Partial<ChatPaletteOptions> = {}
): string {
  const outputOptions = mergeChatPaletteOptions(options);
  const sections: string[] = [];

  sections.push(createCombatBasics());
  if (outputOptions.includeDamageCalculator) sections.push(createDamageCalculator());
  if (outputOptions.includeSkillChecks) sections.push(createSkillCheckSection(skillData));
  sections.push(createSkillSection(skillData, outputOptions));
  if (outputOptions.includeBasicActions) sections.push(buildSection("○基本動作", skillData.basicActions));
  if (outputOptions.includeEquipmentEffects) sections.push(createEquipmentEffects(equipmentData));
  if (outputOptions.includeItemList) sections.push(buildSection("○所持アイテム一覧", itemData));
  if (outputOptions.includeAbilityChecks) sections.push(createAbilityChecks(abilityData));
  if (outputOptions.includeConsumeTables) sections.push(createConsumeTables());
  if (outputOptions.includeTreasureTables) sections.push(createTreasureTables());

  return sections.filter((section) => section.trim() !== "").join("\n\n");
}

export function createPieceFromJson(
  jsonDataValue: unknown,
  characterId: string,
  options: Partial<ChatPaletteOptions> = {}
): string {
  const jsonData = asRecord(jsonDataValue);
  if (!jsonData) {
    throw new Error("キャラクターJSONの形式が正しくありません。");
  }

  const normalizedCharacterId = validateCharacterId(characterId);
  const characterData = createCharacterData(jsonData, normalizedCharacterId);
  const statusData = createStatusData(jsonData);
  const paramsData = createParamsData(jsonData);
  const equipmentData = createEquipmentData(jsonData);
  const abilityData = createAbilityData(jsonData);
  const skillData = createSkillData(jsonData, equipmentData.hand1, equipmentData.hand2, abilityData);
  const itemData = createItemData(jsonData);
  const commands = createChatPalette(skillData, equipmentData.effects, itemData, abilityData, options);

  return JSON.stringify({
    kind: "character",
    data: {
      ...characterData,
      status: statusData,
      params: paramsData,
      commands,
    },
  });
}

export async function createPiece(
  characterId: string,
  options: Partial<ChatPaletteOptions> = {}
): Promise<string> {
  const normalizedCharacterId = validateCharacterId(characterId);

  try {
    const jsonData = await fetchCharacterJson(normalizedCharacterId);
    return createPieceFromJson(jsonData, normalizedCharacterId, options);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(`キャラクター駒データの生成に失敗しました。${error.message}`);
    }
    throw new Error("キャラクター駒データの生成に失敗しました。");
  }
}
