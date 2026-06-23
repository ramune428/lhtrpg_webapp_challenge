import {
  createPieceFromJson as createBasePieceFromJson,
  defaultChatPaletteOptions as baseDefaultChatPaletteOptions,
  fetchCharacterJson,
  normalizeCharacterId,
  type ChatPaletteOptions as BaseChatPaletteOptions,
} from "./createPiecePreview";

export { fetchCharacterJson, normalizeCharacterId };

export type ChatPaletteOptions = Omit<BaseChatPaletteOptions, "includeSkillDescriptions" | "includeBasicActions"> & {
  includeSkillInfo: boolean;
  includeSkillEffects: boolean;
  includeBasicActions: boolean;
  includeBasicActionNames: boolean;
  includeBasicActionInfo: boolean;
  includeBasicActionEffects: boolean;
  includeBasicActionCommands: boolean;
};

export const defaultChatPaletteOptions: ChatPaletteOptions = {
  includeDamageCalculator: baseDefaultChatPaletteOptions.includeDamageCalculator,
  includeSkillChecks: baseDefaultChatPaletteOptions.includeSkillChecks,
  includeSkillSupportCalculations: baseDefaultChatPaletteOptions.includeSkillSupportCalculations,
  includeSkillInfo: true,
  includeSkillEffects: true,
  includeBasicActions: true,
  includeBasicActionNames: true,
  includeBasicActionInfo: true,
  includeBasicActionEffects: true,
  includeBasicActionCommands: true,
  includeEquipmentEffects: baseDefaultChatPaletteOptions.includeEquipmentEffects,
  includeItemList: baseDefaultChatPaletteOptions.includeItemList,
  includeAbilityChecks: baseDefaultChatPaletteOptions.includeAbilityChecks,
  includeConsumeTables: baseDefaultChatPaletteOptions.includeConsumeTables,
  includeTreasureTables: baseDefaultChatPaletteOptions.includeTreasureTables,
};

type AnyRecord = Record<string, unknown>;
type SkillDisplayOptions = Pick<ChatPaletteOptions, "includeSkillInfo" | "includeSkillEffects">;
type BasicActionDisplayOptions = Pick<
  ChatPaletteOptions,
  "includeBasicActionNames" | "includeBasicActionInfo" | "includeBasicActionEffects" | "includeBasicActionCommands"
>;

const BASIC_ACTION_COMMANDS: Record<string, string> = {
  敵情を探る: "{運動値} 運動値",
  基本武器攻撃: "{攻撃力}+1D 基本武器攻撃",
  基本魔法攻撃: "{魔力}+1D 基本魔法攻撃",
  異常探知: "{知覚値} 知覚値",
  エネミー識別: "{知識値} 知識値",
  プロップ解析: "{解析値} 解析値",
  プロップ解除: "{解除値} 解除値",
};

const ABILITY_FIELDS: Array<[label: string, fieldName: string]> = [
  ["運動値", "abl_motion"],
  ["耐久値", "abl_durability"],
  ["解除値", "abl_dismantle"],
  ["操作値", "abl_operate"],
  ["知覚値", "abl_sense"],
  ["交渉値", "abl_negotiate"],
  ["知識値", "abl_knowledge"],
  ["解析値", "abl_analyze"],
  ["回避値", "abl_avoid"],
  ["抵抗値", "abl_resist"],
  ["命中値", "abl_hit"],
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

function toHalfWidthDigits(value: string): string {
  return value.replace(/[０-９]/g, (char) => String(char.charCodeAt(0) - 0xff10));
}

function createSkillList(jsonDataValue: unknown): AnyRecord[] {
  const jsonData = asRecord(jsonDataValue);

  if (!jsonData) {
    return [];
  }

  return asArray(jsonData.skills)
    .map((skill) => asRecord(skill))
    .filter((skill): skill is AnyRecord => skill !== null);
}

function formatTags(skill: AnyRecord): string {
  return asArray(skill.tags)
    .map((tag) => `[${asString(tag)}]`)
    .join(" ");
}

function formatCurrentSkillName(skill: AnyRecord): string {
  return [`《${asString(skill.name)}》`, formatTags(skill)]
    .filter(Boolean)
    .join(" ");
}

function formatSkillName(skill: AnyRecord): string {
  return [`《${asString(skill.name)}》`, formatTags(skill)]
    .filter(Boolean)
    .join(" ");
}

function formatSkillInfo(skill: AnyRecord): string {
  return [
    `SR:${asString(skill.skill_rank)}/${asString(skill.skill_max_rank)}`,
    `タイミング:${asString(skill.timing)}`,
    `判定:${asString(skill.roll)}`,
    `対象:${asString(skill.target)}`,
    `射程:${asString(skill.range)}`,
    `コスト:${asString(skill.cost)}`,
    `制限:${asString(skill.limit)}`,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatCurrentSkillDescription(skill: AnyRecord): string {
  const baseText = [
    `SR:${asString(skill.skill_rank)}/${asString(skill.skill_max_rank)}`,
    `タイミング:${asString(skill.timing)}`,
    `判定:${asString(skill.roll)}`,
    `対象:${asString(skill.target)}`,
    `射程:${asString(skill.range)}`,
    `コスト:${asString(skill.cost)}`,
    `制限:${asString(skill.limit)}`,
    formatTags(skill),
  ]
    .filter(Boolean)
    .join(" ");
  const effectText = asString(skill.function);

  return effectText ? `${baseText} 効果:${effectText}` : baseText;
}

function formatSkillEffect(skill: AnyRecord): string {
  const effectText = asString(skill.function);

  return effectText ? `効果:${effectText}` : "";
}

function formatSkillDetails(skill: AnyRecord, options: SkillDisplayOptions): string {
  return [
    options.includeSkillInfo ? formatSkillInfo(skill) : "",
    options.includeSkillEffects ? formatSkillEffect(skill) : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizeAbilityCheckValue(value: string): string {
  return toHalfWidthDigits(value)
    .replace(/\s*>=0\s*$/, "")
    .replace(/Ｄ/g, "D")
    .replace(/^([0-9]+)\+([0-9]+D.*)$/, "$2+$1");
}

function createAbilityValueMap(jsonDataValue: unknown): Map<string, string> {
  const jsonData = asRecord(jsonDataValue);
  const result = new Map<string, string>();

  if (!jsonData) {
    return result;
  }

  for (const [label, fieldName] of ABILITY_FIELDS) {
    const value = normalizeAbilityCheckValue(asString(jsonData[fieldName]));
    result.set(label, value || `{${label}}`);
  }

  return result;
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

function buildSkillCheckCommand(skill: AnyRecord, abilityValues: Map<string, string>): string | null {
  const label = rollLabel(asString(skill.roll));

  if (!label) {
    return null;
  }

  const match = (label.split("/")[0] ?? "").match(/^(命中|回避|抵抗|運動|耐久|解除|操作|知覚|交渉|知識|解析)(.*)$/);

  if (!match) {
    return null;
  }

  const abilityLabel = abilityLabelByCheckName(match[1]);

  if (!abilityLabel) {
    return null;
  }

  const bonus = toHalfWidthDigits(match[2] ?? "")
    .replace(/ＳＲ|SR/g, String(asNumber(skill.skill_rank)))
    .replace(/Ｄ/g, "D");
  const base = abilityValues.get(abilityLabel) ?? `{${abilityLabel}}`;
  const command = bonus.includes("D") ? `${base}${bonus}` : `{${abilityLabel}}${bonus}`;

  return `${command} ${asString(skill.name)}(${label})`;
}

function createSkillCheckCommandMap(jsonDataValue: unknown): Map<string, string> {
  const abilityValues = createAbilityValueMap(jsonDataValue);
  const result = new Map<string, string>();

  for (const skill of createSkillList(jsonDataValue)) {
    const command = buildSkillCheckCommand(skill, abilityValues);

    if (command) {
      result.set(formatSkillName(skill), command);
    }
  }

  return result;
}

function replaceChatPaletteSection(
  commands: string,
  sectionTitle: string,
  replacer: (sectionBody: string) => string
): string {
  const sectionHeader = `${sectionTitle}\n`;
  const sectionStart = commands.indexOf(sectionHeader);

  if (sectionStart < 0) {
    return commands;
  }

  const bodyStart = sectionStart + sectionHeader.length;
  const nextSectionMatch = commands.slice(bodyStart).match(/\n\n○/);
  const bodyEnd = nextSectionMatch?.index === undefined ? commands.length : bodyStart + nextSectionMatch.index;

  return `${commands.slice(0, bodyStart)}${replacer(commands.slice(bodyStart, bodyEnd))}${commands.slice(bodyEnd)}`;
}

function isSkillDetailLine(line: string): boolean {
  const trimmed = line.trim();

  return trimmed.startsWith("SR:") || trimmed.startsWith("効果:");
}

function addSkillCheckCommandsToSkillSection(commands: string, jsonDataValue: unknown): string {
  const skillCheckCommands = createSkillCheckCommandMap(jsonDataValue);

  if (skillCheckCommands.size === 0) {
    return commands;
  }

  return replaceChatPaletteSection(commands, "○特技", (sectionBody) => {
    const existingLines = sectionBody.split("\n");
    const existingLineSet = new Set(existingLines.map((line) => line.trim()).filter(Boolean));
    const insertedCommands = new Set<string>();
    const result: string[] = [];

    for (let index = 0; index < existingLines.length; index += 1) {
      const line = existingLines[index];
      result.push(line);

      const checkCommand = skillCheckCommands.get(line.trim());
      if (!checkCommand || existingLineSet.has(checkCommand) || insertedCommands.has(checkCommand)) {
        continue;
      }

      while (index + 1 < existingLines.length && isSkillDetailLine(existingLines[index + 1])) {
        index += 1;
        result.push(existingLines[index]);
      }

      result.push(checkCommand);
      insertedCommands.add(checkCommand);
    }

    return result.join("\n");
  });
}

function replaceAllText(text: string, searchValue: string, replaceValue: string): string {
  if (!searchValue || searchValue === replaceValue) {
    return text;
  }

  return text.split(searchValue).join(replaceValue);
}

function rewriteSkillDisplayText(
  commands: string,
  jsonDataValue: unknown,
  options: SkillDisplayOptions
): string {
  const skills = createSkillList(jsonDataValue);
  let rewrittenCommands = commands;

  for (const skill of skills) {
    rewrittenCommands = replaceAllText(
      rewrittenCommands,
      formatCurrentSkillDescription(skill),
      formatSkillDetails(skill, options)
    );
  }

  const skillNameMap = new Map(
    skills.map((skill) => [formatCurrentSkillName(skill), formatSkillName(skill)])
  );

  return rewrittenCommands
    .split("\n")
    .map((line) => skillNameMap.get(line) ?? line)
    .join("\n");
}

function splitBasicActionInfoAndEffect(text: string): { info: string; effect: string } {
  const effectIndex = text.search(/\s効果[:：]/);

  if (effectIndex < 0) {
    return { info: text.trim(), effect: "" };
  }

  return {
    info: text.slice(0, effectIndex).trim(),
    effect: text.slice(effectIndex).trim(),
  };
}

function extractBasicActionName(line: string): string {
  return line.match(/^《([^》]+)》/)?.[1] ?? "";
}

function formatBasicActionLine(line: string, options: BasicActionDisplayOptions): string {
  const infoStartIndex = line.indexOf(" SR:");

  if (!options.includeBasicActionNames || !line.startsWith("《") || infoStartIndex < 0) {
    return "";
  }

  const name = line.slice(0, infoStartIndex).trim();
  const actionName = extractBasicActionName(line);
  const command = options.includeBasicActionCommands ? BASIC_ACTION_COMMANDS[actionName] ?? "" : "";
  const { info, effect } = splitBasicActionInfoAndEffect(line.slice(infoStartIndex + 1));

  return [
    name,
    options.includeBasicActionInfo ? info : "",
    options.includeBasicActionEffects ? effect : "",
    command,
  ]
    .filter(Boolean)
    .join("\n");
}

function rewriteBasicActionDisplayText(commands: string, options: BasicActionDisplayOptions): string {
  return commands
    .split("\n\n")
    .map((paletteSection) => {
      if (!paletteSection.startsWith("○基本動作\n")) {
        return paletteSection;
      }

      const [sectionTitle = "○基本動作", ...lines] = paletteSection.split("\n");
      const actionLines = lines.filter((line) => line.startsWith("《"));
      const formattedActionLines = actionLines.reduce<string[]>((result, line) => {
        const formattedLine = formatBasicActionLine(line, options);

        if (!formattedLine) {
          return result;
        }

        if (result.length > 0) {
          result.push("");
        }

        result.push(...formattedLine.split("\n"));
        return result;
      }, []);

      return [sectionTitle, ...formattedActionLines].join("\n");
    })
    .join("\n\n");
}

export function createPieceFromJson(
  jsonDataValue: unknown,
  characterId: string,
  options: Partial<ChatPaletteOptions> = {}
): string {
  const mergedOptions: ChatPaletteOptions = {
    ...defaultChatPaletteOptions,
    ...options,
  };
  const {
    includeSkillInfo,
    includeSkillEffects,
    includeBasicActions,
    includeBasicActionNames,
    includeBasicActionInfo,
    includeBasicActionEffects,
    includeBasicActionCommands,
    ...baseOptionsWithoutSkillDetails
  } = mergedOptions;
  const hasBasicActionOutput = includeBasicActions && includeBasicActionNames;
  const baseOptions: Partial<BaseChatPaletteOptions> = {
    ...baseOptionsWithoutSkillDetails,
    includeSkillDescriptions: includeSkillInfo || includeSkillEffects,
    includeBasicActions: hasBasicActionOutput,
  };
  const pieceText = createBasePieceFromJson(jsonDataValue, characterId, baseOptions);
  const piece = JSON.parse(pieceText) as AnyRecord;
  const data = asRecord(piece.data);

  if (!data) {
    return pieceText;
  }

  const skillRewrittenCommands = rewriteSkillDisplayText(asString(data.commands), jsonDataValue, {
    includeSkillInfo,
    includeSkillEffects,
  });
  const skillCommandsWithChecks = addSkillCheckCommandsToSkillSection(skillRewrittenCommands, jsonDataValue);
  const commands = rewriteBasicActionDisplayText(skillCommandsWithChecks, {
    includeBasicActionNames,
    includeBasicActionInfo,
    includeBasicActionEffects,
    includeBasicActionCommands,
  });

  return JSON.stringify({
    ...piece,
    data: {
      ...data,
      commands,
    },
  });
}

export async function createPiece(
  characterId: string,
  options: Partial<ChatPaletteOptions> = {}
): Promise<string> {
  const normalizedCharacterId = normalizeCharacterId(characterId);
  const jsonData = await fetchCharacterJson(normalizedCharacterId);

  return createPieceFromJson(jsonData, normalizedCharacterId, options);
}
