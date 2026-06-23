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
  includeBasicActionInfo: boolean;
  includeBasicActionEffects: boolean;
};

export const defaultChatPaletteOptions: ChatPaletteOptions = {
  includeDamageCalculator: baseDefaultChatPaletteOptions.includeDamageCalculator,
  includeSkillChecks: baseDefaultChatPaletteOptions.includeSkillChecks,
  includeSkillSupportCalculations: baseDefaultChatPaletteOptions.includeSkillSupportCalculations,
  includeSkillInfo: true,
  includeSkillEffects: true,
  includeBasicActionInfo: true,
  includeBasicActionEffects: true,
  includeEquipmentEffects: baseDefaultChatPaletteOptions.includeEquipmentEffects,
  includeItemList: baseDefaultChatPaletteOptions.includeItemList,
  includeAbilityChecks: baseDefaultChatPaletteOptions.includeAbilityChecks,
  includeConsumeTables: baseDefaultChatPaletteOptions.includeConsumeTables,
  includeTreasureTables: baseDefaultChatPaletteOptions.includeTreasureTables,
};

type AnyRecord = Record<string, unknown>;
type SkillDisplayOptions = Pick<ChatPaletteOptions, "includeSkillInfo" | "includeSkillEffects">;
type BasicActionDisplayOptions = Pick<ChatPaletteOptions, "includeBasicActionInfo" | "includeBasicActionEffects">;

const BASIC_ACTION_COMMANDS: Record<string, string> = {
  ラン: "なし",
  ダッシュ: "なし",
  シフト: "なし",
  敵情を探る: "{運動値} 運動値",
  基本武器攻撃: "{攻撃力}+1D 基本武器攻撃",
  基本魔法攻撃: "{魔力}+1D 基本魔法攻撃",
  異常探知: "{知覚値} 知覚値",
  エネミー識別: "{知識値} 知識値",
  プロップ解析: "{解析値} 解析値",
  プロップ解除: "{解除値} 解除値",
  とどめの一撃: "なし",
  かばう: "なし",
  装備の変更: "なし",
  受け渡し: "なし",
  隠れる: "なし",
  アイテム鑑定: "なし",
};

function asString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
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

  if (!line.startsWith("《") || infoStartIndex < 0) {
    return line;
  }

  const name = line.slice(0, infoStartIndex).trim();
  const actionName = extractBasicActionName(line);
  const command = BASIC_ACTION_COMMANDS[actionName] ?? "なし";
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

      return [
        sectionTitle,
        ...actionLines.flatMap((line) => formatBasicActionLine(line, options).split("\n")),
      ].join("\n");
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
    includeBasicActionInfo,
    includeBasicActionEffects,
    ...baseOptionsWithoutSkillDetails
  } = mergedOptions;
  const baseOptions: Partial<BaseChatPaletteOptions> = {
    ...baseOptionsWithoutSkillDetails,
    includeSkillDescriptions: includeSkillInfo || includeSkillEffects,
    includeBasicActions: true,
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
  const commands = rewriteBasicActionDisplayText(skillRewrittenCommands, {
    includeBasicActionInfo,
    includeBasicActionEffects,
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
