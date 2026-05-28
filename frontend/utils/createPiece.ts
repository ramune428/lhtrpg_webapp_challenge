type AnyRecord = Record<string, unknown>;

type StatusEntry = {
  label: string;
  value: number;
  max: number;
};

type ParamEntry = {
  label: string;
  value: string;
};

type AbilityEntry = {
  label: string;
  value: string;
};

type EquipmentData = {
  effects: string[];
  hand1: AnyRecord | null;
  hand2: AnyRecord | null;
};

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
  includeSkillChecks: true,
  includeSkillDescriptions: true,
  includeBasicActions: true,
  includeEquipmentEffects: true,
  includeItemList: true,
  includeAbilityChecks: true,
  includeConsumeTables: true,
  includeTreasureTables: true,
};

type CrValues = {
  default: number;
  cr11?: number;
  cr16?: number;
  cr21?: number;
};

type CausalityCostSkillRule = {
  skillId: number;
  skillName: string;
  label: string;
  crValues: CrValues;
  maxCost: number;
};

const causalityCostSkillRules: CausalityCostSkillRule[] = [
  {
    skillId: 4601,
    skillName: "サーヴァントコンビネーション",
    label: "弱点強度",
    crValues: { default: 2, cr11: 4, cr21: 6 },
    maxCost: 3,
  },
  {
    skillId: 3801,
    skillName: "アサシネイト",
    label: "ダメージ増加",
    crValues: { default: 7, cr11: 12, cr21: 20 },
    maxCost: 3,
  },
  {
    skillId: 4401,
    skillName: "スペルマキシマイズ",
    label: "ダメージ増加",
    crValues: { default: 5, cr11: 10, cr21: 15 },
    maxCost: 3,
  },
  {
    skillId: 4003,
    skillName: "ダンスマカブル",
    label: "ダメージ増加",
    crValues: { default: 5, cr11: 10, cr21: 15 },
    maxCost: 3,
  },
  {
    skillId: 4201,
    skillName: "マエストロエコー",
    label: "ダメージ増加",
    crValues: { default: 5, cr11: 10, cr21: 15 },
    maxCost: 3,
  },
];

function asString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
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
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as AnyRecord;
}

function firstLine(value: unknown): string {
  return asString(value).split("\n")[0] ?? "";
}

function formatCharacterTags(values: unknown): string {
  const tags = asArray(values)
    .map((item) => asString(item))
    .filter(Boolean);

  if (tags.length === 0) {
    return "";
  }

  return `タグ：${tags.map((tag) => `[${tag}]`).join(" ")}`;
}

function convertCheckDiceToLH(value: string): string {
  return value
    .replace(/D/g, "LH")
    .replace(/^(\d+)\+(\d+LH.*)$/, "$2+$1");
}

function mergeChatPaletteOptions(
  options: Partial<ChatPaletteOptions> = {}
): ChatPaletteOptions {
  return {
    ...defaultChatPaletteOptions,
    ...options,
  };
}

export function normalizeCharacterId(input: string): string {
  const trimmed = input.trim();

  if (!trimmed) {
    return "";
  }

  try {
    const url = new URL(trimmed);
    const idFromQuery = url.searchParams.get("id");

    if (idFromQuery) {
      return idFromQuery;
    }

    const sheetMatch = url.pathname.match(/sheets\/(\d+)/);
    if (sheetMatch) {
      return sheetMatch[1];
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] ?? "";
    return lastSegment.replace(/\.html$/, "");
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
    memo:
      memo === null || memo === undefined
        ? characterTags
        : `${characterTags} \n ${asString(memo).replace(/\r\n/g, "\n")}`,
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
  const abilityParams = createAbilityData(jsonData).map((ability) => ({
    label: ability.label,
    value: ability.value,
  }));

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
    if (!item) {
      continue;
    }

    const tags = asArray(item.tags).map((tag) => asString(tag));
    if (!tags.some((tag) => tag.includes("M"))) {
      continue;
    }

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

    if (result[timing]) {
      result[timing].push(skill);
    } else {
      result[timing] = [skill];
    }
  }

  return result;
}

function formatSkillName(skill: AnyRecord): string {
  const tags = asArray(skill.tags)
    .map((tag) => `[${asString(tag)}]`)
    .join(" ");

  return [`《${asString(skill.name)}》`, tags]
    .filter(Boolean)
    .join(" ");
}

function formatSkillDescription(skill: AnyRecord): string {
  const tags = asArray(skill.tags)
    .map((tag) => `[${asString(tag)}]`)
    .join(" ");
  const baseText = [
    `SR:${asString(skill.skill_rank)}/${asString(skill.skill_max_rank)}`,
    `タイミング:${asString(skill.timing)}`,
    `判定:${asString(skill.roll)}`,
    `対象:${asString(skill.target)}`,
    `射程:${asString(skill.range)}`,
    `コスト:${asString(skill.cost)}`,
    `制限:${asString(skill.limit)}`,
    tags,
  ]
    .filter(Boolean)
    .join(" ");
  const effectText = asString(skill.function);

  return effectText ? `${baseText} 効果:${effectText}` : baseText;
}

function normalizeRollText(roll: string): string {
  return roll
    .replace(/^判定[:：]/, "")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/／/g, "/")
    .replace(/\s+/g, "")
    .trim();
}

function getRollLabel(roll: string): string | null {
  const normalizedRoll = normalizeRollText(roll);
  const matchedRoll = normalizedRoll.match(/^(?:対決|基本)\(([^)]+)\)$/);

  if (!matchedRoll) {
    return null;
  }

  return matchedRoll[1];
}

function toCheckDiceBonus(value: string): string {
  return value.replace(/D/g, "LH");
}

function getCheckExpressionByRollLabel(rollLabel: string): string | null {
  const checkText = rollLabel.split("/")[0]?.trim() ?? "";
  const matchedCheck = checkText.match(
    /^(命中|回避|抵抗|運動|耐久|解除|操作|知覚|交渉|知識|解析)(.*)$/
  );

  if (!matchedCheck) {
    return null;
  }

  const checkName = matchedCheck[1];
  const bonus = toCheckDiceBonus(matchedCheck[2] ?? "");

  if (checkName === "命中") return `{命中値}${bonus}`;
  if (checkName === "回避") return `{回避値}${bonus}`;
  if (checkName === "抵抗") return `{抵抗値}${bonus}`;
  if (checkName === "運動") return `{運動値}${bonus}`;
  if (checkName === "耐久") return `{耐久値}${bonus}`;
  if (checkName === "解除") return `{解除値}${bonus}`;
  if (checkName === "操作") return `{操作値}${bonus}`;
  if (checkName === "知覚") return `{知覚値}${bonus}`;
  if (checkName === "交渉") return `{交渉値}${bonus}`;
  if (checkName === "知識") return `{知識値}${bonus}`;
  if (checkName === "解析") return `{解析値}${bonus}`;

  return null;
}

function buildSkillCheckCommand(skill: AnyRecord): string | null {
  const skillName = asString(skill.name);
  const rollLabel = getRollLabel(asString(skill.roll));

  if (!rollLabel) {
    return null;
  }

  const checkExpression = getCheckExpressionByRollLabel(rollLabel);

  if (!checkExpression) {
    return null;
  }

  return `${checkExpression} ${skillName}(${rollLabel})`;
}

function getValueByCharacterRank(characterRank: number, values: CrValues): number {
  if (values.cr21 !== undefined && characterRank >= 21) {
    return values.cr21;
  }

  if (values.cr16 !== undefined && characterRank >= 16) {
    return values.cr16;
  }

  if (values.cr11 !== undefined && characterRank >= 11) {
    return values.cr11;
  }

  return values.default;
}

function findCausalityCostSkillRule(skillId: number): CausalityCostSkillRule | undefined {
  return causalityCostSkillRules.find((rule) => rule.skillId === skillId);
}

function buildCausalityCostCommandLines(
  skill: AnyRecord,
  characterRank: number,
  rule: CausalityCostSkillRule
): string[] {
  const skillRank = asNumber(skill.skill_rank);
  const multiplier = getValueByCharacterRank(characterRank, rule.crValues);
  const lines: string[] = [];

  for (let cost = 0; cost <= rule.maxCost; cost += 1) {
    lines.push(`C((${cost}+${skillRank})*${multiplier}) ${rule.skillName}_消費因果力${cost}`);
  }

  return lines;
}

function getShieldDefenseValue(hand1: AnyRecord | null, hand2: AnyRecord | null): number {
  const shieldsDefense: number[] = [];

  for (const hand of [hand1, hand2]) {
    if (!hand) {
      continue;
    }

    const tags = asArray(hand.tags).map((tag) => asString(tag));
    if (tags.includes("盾")) {
      shieldsDefense.push(asNumber(hand.physical_defense));
    }
  }

  return shieldsDefense.length > 0 ? Math.max(...shieldsDefense) : 0;
}

function createSkillCommandBuilder(skill: AnyRecord, hand1: AnyRecord | null, hand2: AnyRecord | null) {
  const diceType = {
    type0: ["０Ｄ", "１Ｄ", "２Ｄ", "３Ｄ", "４Ｄ", "５Ｄ", "６Ｄ", "７Ｄ", "８Ｄ"],
    type1: [
      "（ＳＲ）Ｄ",
      "（ＳＲ＋１）Ｄ",
      "（ＳＲ＋２）Ｄ",
      "（ＳＲ＋３）Ｄ",
      "（ＳＲ＋４）Ｄ",
      "（ＳＲ＋５）Ｄ",
      "（ＳＲ＋６）Ｄ",
    ],
    type2: [
      "（ＳＲ×０）Ｄ",
      "（ＳＲ×１）Ｄ",
      "（ＳＲ×２）Ｄ",
      "（ＳＲ×３）Ｄ",
      "（ＳＲ×４）Ｄ",
      "（ＳＲ×５）Ｄ",
      "（ＳＲ×６）Ｄ",
    ],
    type3: ["ＳＲ×０", "ＳＲ×１", "ＳＲ×２", "ＳＲ×３", "ＳＲ×４", "ＳＲ×５", "ＳＲ×６"],
    type4: ["×０", "×１", "×２", "×３", "×４", "×５", "×６"],
    type5: ["５", "７", "１０"],
  };
  const actionList = ["攻撃力", "魔力", "回復力"];
  const abilityList = [
    "STR基本値",
    "DEX基本値",
    "POW基本値",
    "INT基本値",
    "STR",
    "DEX",
    "POW",
    "INT",
  ];
  const shieldDefenseValue = getShieldDefenseValue(hand1, hand2);
  const skillId = asNumber(skill.id);
  const skillRank = asNumber(skill.skill_rank);

  function createDice(diceCheck: string): string {
    let diceValue = "";

    for (const [diceTypeKey, diceTypeList] of Object.entries(diceType)) {
      for (let index = 0; index < diceTypeList.length; index += 1) {
        const dice = diceTypeList[index];

        if (!diceCheck.includes(dice)) {
          continue;
        }

        if (diceTypeKey === "type0") {
          diceValue = `(${index})D`;
        } else if (diceTypeKey === "type1") {
          diceValue = `(${skillRank + index})D`;
        } else if (diceTypeKey === "type2") {
          diceValue = `(${skillRank * index})D`;
        } else if (diceTypeKey === "type3") {
          diceValue = `(${skillRank * index})`;
        }

        for (const actionValue of actionList) {
          if (diceCheck.includes(actionValue)) {
            diceValue += `+{${actionValue}}`;
          }
        }

        for (const abilityValue of abilityList) {
          if (diceCheck.includes(abilityValue)) {
            diceValue += `+{${abilityValue}}`;
          }
        }

        return diceValue;
      }
    }

    diceValue = "C(";
    for (const actionValue of actionList) {
      if (diceCheck.includes(actionValue)) {
        diceValue += `+{${actionValue}}`;
      }
    }
    for (const abilityValue of abilityList) {
      if (diceCheck.includes(abilityValue)) {
        diceValue += `+{${abilityValue}}`;
      }
    }
    for (let index = 0; index < diceType.type4.length; index += 1) {
      if (diceCheck.includes(diceType.type4[index])) {
        diceValue += `+${index}`;
      }
    }
    diceValue += ")";

    return diceValue;
  }

  function createIntensity(diceCheck: string): string {
    let intensity = createDice(diceCheck);

    if (intensity !== "C()") {
      return intensity;
    }

    intensity = "C(";
    for (const value of diceType.type5) {
      if (diceCheck.includes(value)) {
        intensity += `${Number(value)}`;
      }
    }
    for (const actionValue of actionList) {
      if (diceCheck.includes(actionValue)) {
        intensity += `+{${actionValue}}`;
      }
    }
    for (const abilityValue of abilityList) {
      if (diceCheck.includes(abilityValue)) {
        intensity += `+{${abilityValue}}`;
      }
    }
    for (let index = 0; index < diceType.type4.length; index += 1) {
      if (diceCheck.includes(diceType.type4[index])) {
        intensity += `*${index}`;
      }
    }
    if (diceCheck.includes("×SR")) {
      intensity += `*${skillRank}`;
    }
    intensity += ")";

    return intensity;
  }

  function damageRoll(functionText: string): string {
    if (functionText.includes("［") && functionText.includes("］の")) {
      const diceCheck = functionText.slice(functionText.indexOf("［") + 1, functionText.indexOf("］の"));
      return createDice(diceCheck);
    }

    if (functionText.includes("［") && functionText.includes("］点回")) {
      const diceCheck = functionText.slice(functionText.indexOf("［") + 1, functionText.indexOf("］点回"));
      return createDice(diceCheck);
    }

    if (functionText.includes("［") && functionText.includes("］点まで回")) {
      if (skillId === 1814) return "C({回復力}+{STR}*2)";
      if (skillId === 2105) return "C({回復力}*2+1)";
      if (skillId === 2006) return "C({魔力}+{回復力})";
      if (skillId === 2631) return `C(${shieldDefenseValue}*10)`;
    }

    return "";
  }

  function badCombatRoll(functionText: string): string {
    const statusNames = ["再生", "障壁", "衰弱", "追撃"];

    for (const statusName of statusNames) {
      const startText = `［${statusName}：`;
      if (functionText.includes(startText) && functionText.includes("］を与える")) {
        const diceCheck = functionText.slice(functionText.indexOf(startText) + 1, functionText.indexOf("］を与える"));
        return createIntensity(diceCheck);
      }
    }

    if (functionText.includes("［追撃：") && functionText.includes("個与える")) {
      const diceCheck = functionText.slice(functionText.indexOf("［追撃：") + 1, functionText.indexOf("］を"));
      let result = createIntensity(diceCheck);
      const pursuitNums = ["２", "３", "４", "５", "６", "７", "８", "(ＳＲ)"];

      for (let num of pursuitNums) {
        if (functionText.includes(`${num}個`)) {
          if (num === "(ＳＲ)") {
            num = `${skillRank}個`;
          }
          result += ` ×${num}`;
        }
      }

      return result;
    }

    return "";
  }

  return { damageRoll, badCombatRoll };
}

function buildSkillCommandLines(
  skill: AnyRecord,
  hand1: AnyRecord | null,
  hand2: AnyRecord | null,
  characterRank: number
): string[] {
  const skillId = asNumber(skill.id);
  const skillName = asString(skill.name);
  const functionText = asString(skill.function);
  const causalityCostRule = findCausalityCostSkillRule(skillId);

  if (causalityCostRule) {
    return buildCausalityCostCommandLines(skill, characterRank, causalityCostRule);
  }

  if (skillId === 4029 || functionText.includes("【攻撃力】点の直接ダメージ")) {
    return [`C({攻撃力}) ${skillName} (直接ダメージ)`];
  }

  const rollKeywords = ["の物理", "の魔法", "の貫通", "点回復", "点まで回復"];
  const badCombatStatus = ["追撃", "衰弱", "再生", "障壁"];
  const builder = createSkillCommandBuilder(skill, hand1, hand2);
  let diceRoll = "";
  let label = "";

  if (skillId === 2624) {
    diceRoll = `(${asNumber(skill.skill_rank)})D+${getShieldDefenseValue(hand1, hand2)}`;
    label = "(貫通ダメージ)";
  } else if (skillId === 701) {
    diceRoll = "C({STR基本値}*2)";
    label = "(回復)";
  } else if (rollKeywords.some((keyword) => functionText.includes(keyword))) {
    diceRoll = builder.damageRoll(functionText);
    if (functionText.includes("の物理ダメージ")) label = "(物理ダメージ)";
    else if (functionText.includes("の魔法ダメージ")) label = "(魔法ダメージ)";
    else if (functionText.includes("の貫通ダメージ")) label = "(貫通ダメージ)";
    else if (functionText.includes("点回復") || functionText.includes("点まで回復")) label = "(回復)";
  } else if (badCombatStatus.some((keyword) => functionText.includes(keyword))) {
    diceRoll = builder.badCombatRoll(functionText);
    if (functionText.includes("追撃")) label = "(追撃)";
    else if (functionText.includes("衰弱")) label = "(衰弱)";
    else if (functionText.includes("再生")) label = "(再生)";
    else if (functionText.includes("障壁")) label = "(障壁)";
  }

  if (!diceRoll) {
    return [];
  }

  return [`${diceRoll} ${skillName} ${label}`.trim()];
}

function createSkillData(jsonData: AnyRecord, hand1: AnyRecord | null, hand2: AnyRecord | null): SkillChatPaletteData {
  const skills = asArray(jsonData.skills)
    .map((skill) => asRecord(skill))
    .filter((skill): skill is AnyRecord => skill !== null);
  const skillTimingData = groupTiming(skills);
  const characterRank = asNumber(jsonData.character_rank);
  const entries: SkillChatPaletteEntry[] = [];

  for (const timing of Object.keys(skillTimingData)) {
    for (const skill of skillTimingData[timing]) {
      entries.push({
        timing,
        skillName: formatSkillName(skill),
        description: formatSkillDescription(skill),
        checkCommand: buildSkillCheckCommand(skill),
        commands: buildSkillCommandLines(skill, hand1, hand2, characterRank),
      });
    }
  }

  return {
    entries,
    basicActions: createBasicActions(),
  };
}

function createBasicActions(): string {
  return [
    "《ラン》 [基本動作] [移動] SR:-/- タイミング:ムーブ 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは【移動力】Ｓｑまで［通常移動］をしてもよい。",
    "《ダッシュ》 [基本動作] [移動] SR:-/- タイミング:ムーブ 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは［【移動力】＋２］Ｓｑまで［通常移動］をしてもよい。あなたは直後のマイナーアクションを１回失う。マイナーアクションを失えない場合は使用できない。",
    "《シフト》 [基本動作] [移動] SR:-/- タイミング:ムーブ 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは１Ｓｑまで［即時移動］をしてもよい。あなたは直後のマイナーアクションを１回失う。マイナーアクションを失えない場合は使用できない。",
    "《敵情を探る》 [基本動作] [偵察] SR:-/- タイミング:ブリーフィング 判定：基本（運動） 対象:本文 射程：本文 コスト:- 制限：- 効果：次のシーンの戦闘における敵の情報を得ようと試みる。",
    "《基本武器攻撃》 [基本動作] [武器攻撃] SR:-/- タイミング:メジャー 判定：対決(命中/回避) 対象:単体 射程：武器 コスト:- 制限：- 効果：対象に［【攻撃力】＋１Ｄ］の物理ダメージを与える。",
    "《基本魔法攻撃》 [基本動作] [魔法攻撃] [杖] [魔石] SR:-/- タイミング: メジャー 判定：対決(命中/抵抗) 対象:単体 射程:4Sq コスト:- 制限：- 効果：対象に［【魔力】＋１Ｄ］の魔法ダメージを与える。",
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
  const items = asArray(jsonData.items);
  const itemLines: string[] = [];

  for (const itemValue of items) {
    const item = asRecord(itemValue);

    if (!item) {
      continue;
    }

    const tags = asArray(item.tags).map((tag) => `[${asString(tag)}]`).join(" ");
    const parts = [asString(item.alias || item.name), tags].filter(Boolean);

    if (asString(item.timing) !== "－") {
      parts.push(
        `タイミング:${asString(item.timing)} 判定:${asString(item.roll)} 対象:${asString(item.target)} 射程:${asString(item.range)}`
      );
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

  if (!trimmedBody) {
    return "";
  }

  return `${title}\n${trimmedBody}`;
}

function createCombatBasics(): string {
  return [
    "○戦闘の基本",
    "{命中値} 命中値",
    "{回避値} 回避値(ヘイトトップ時)",
    "{回避値}+2 回避値(ヘイトアンダー時)",
    "{抵抗値} 抵抗値(ヘイトトップ時)",
    "{抵抗値}+2 抵抗値(ヘイトアンダー時)",
    "1D+{攻撃力} 基本武器攻撃、物理ダメージ",
    "1D+{魔力} 基本魔法攻撃、魔法ダメージ",
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
    if (!entry.checkCommand) {
      continue;
    }

    if (entry.timing !== currentTiming) {
      if (lines.length > 0) {
        lines.push("");
      }
      lines.push(`● ${entry.timing}`);
      currentTiming = entry.timing;
    }

    lines.push(entry.checkCommand);
  }

  return buildSection("○判定がある特技", lines.join("\n"));
}

function createSkillSection(
  skillData: SkillChatPaletteData,
  options: ChatPaletteOptions
): string {
  const lines: string[] = [];
  let currentTiming = "";

  for (const entry of skillData.entries) {
    if (entry.timing !== currentTiming) {
      if (lines.length > 0) {
        lines.push("");
      }
      lines.push(`● ${entry.timing}`);
      currentTiming = entry.timing;
    }

    lines.push(entry.skillName);

    if (options.includeSkillDescriptions && entry.description) {
      lines.push(entry.description);
    }

    if (entry.checkCommand) {
      lines.push(entry.checkCommand);
    }

    for (const command of entry.commands) {
      lines.push(command);
    }

    lines.push("");
  }

  return buildSection("○特技", lines.join("\n"));
}

function createEquipmentEffects(equipmentData: string[]): string {
  return buildSection("○装備アイテム効果", equipmentData.join("\n"));
}

function createAbilityChecks(abilityData: AbilityEntry[]): string {
  return buildSection(
    "○各種判定",
    abilityData.map((ability) => `{${ability.label}} ${ability.label}`).join("\n")
  );
}

function createConsumeTables(): string {
  return [
    "○消耗表",
    "PCT{CR}+0 体力消耗表",
    "ECT{CR}+0 気力消耗表",
    "GCT{CR}+0 物品消耗表",
    "CCT{CR}+0 金銭消耗表",
  ].join("\n");
}

function createTreasureTables(): string {
  return [
    "○財宝表",
    "CTRS{CR}+0 金銭財宝表",
    "MTRS{CR}+0 魔法素材財宝表",
    "ITRS{CR}+0 換金アイテム財宝表",
  ].join("\n");
}

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

  if (outputOptions.includeDamageCalculator) {
    sections.push(createDamageCalculator());
  }

  if (outputOptions.includeSkillChecks) {
    sections.push(createSkillCheckSection(skillData));
  }

  sections.push(createSkillSection(skillData, outputOptions));

  if (outputOptions.includeBasicActions) {
    sections.push(buildSection("○基本動作", skillData.basicActions));
  }

  if (outputOptions.includeEquipmentEffects) {
    sections.push(createEquipmentEffects(equipmentData));
  }

  if (outputOptions.includeItemList) {
    sections.push(buildSection("○所持アイテム一覧", itemData));
  }

  if (outputOptions.includeAbilityChecks) {
    sections.push(createAbilityChecks(abilityData));
  }

  if (outputOptions.includeConsumeTables) {
    sections.push(createConsumeTables());
  }

  if (outputOptions.includeTreasureTables) {
    sections.push(createTreasureTables());
  }

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
  const skillData = createSkillData(jsonData, equipmentData.hand1, equipmentData.hand2);
  const itemData = createItemData(jsonData);
  const abilityData = createAbilityData(jsonData);
  const commands = createChatPalette(
    skillData,
    equipmentData.effects,
    itemData,
    abilityData,
    options
  );

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
