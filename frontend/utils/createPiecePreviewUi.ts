import {
  createPieceFromJson as createBasePieceFromJson,
  defaultChatPaletteOptions as baseDefaultChatPaletteOptions,
  fetchCharacterJson,
  normalizeCharacterId,
  type ChatPaletteOptions as BaseChatPaletteOptions,
} from "./createPiecePreview";

export { fetchCharacterJson, normalizeCharacterId };

export type ChatPaletteOptions = Omit<BaseChatPaletteOptions, "includeSkillDescriptions"> & {
  includeSkillInfo: boolean;
  includeSkillEffects: boolean;
};

const {
  includeSkillDescriptions: _includeSkillDescriptions,
  ...baseDefaultOptionsWithoutSkillDescriptions
} = baseDefaultChatPaletteOptions;

export const defaultChatPaletteOptions: ChatPaletteOptions = {
  ...baseDefaultOptionsWithoutSkillDescriptions,
  includeSkillInfo: true,
  includeSkillEffects: true,
};

type AnyRecord = Record<string, unknown>;
type SkillDisplayOptions = Pick<ChatPaletteOptions, "includeSkillInfo" | "includeSkillEffects">;

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
  return `《${asString(skill.name)}》`;
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
    formatTags(skill),
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

export function createPieceFromJson(
  jsonDataValue: unknown,
  characterId: string,
  options: Partial<ChatPaletteOptions> = {}
): string {
  const mergedOptions: ChatPaletteOptions = {
    ...defaultChatPaletteOptions,
    ...options,
  };
  const { includeSkillInfo, includeSkillEffects, ...baseOptionsWithoutSkillDetails } = mergedOptions;
  const baseOptions: Partial<BaseChatPaletteOptions> = {
    ...baseOptionsWithoutSkillDetails,
    includeSkillDescriptions: includeSkillInfo || includeSkillEffects,
  };
  const pieceText = createBasePieceFromJson(jsonDataValue, characterId, baseOptions);
  const piece = JSON.parse(pieceText) as AnyRecord;
  const data = asRecord(piece.data);

  if (!data) {
    return pieceText;
  }

  return JSON.stringify({
    ...piece,
    data: {
      ...data,
      commands: rewriteSkillDisplayText(asString(data.commands), jsonDataValue, {
        includeSkillInfo,
        includeSkillEffects,
      }),
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
