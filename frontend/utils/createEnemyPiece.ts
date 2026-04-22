export type EnemySkillInput = {
  name: string;
  tags: string;
  timing: string;
  roleAttack: string;
  roleDefense: string;
  target: string;
  range: string;
  limit: string;
  effect: string;
};

export type EnemyDropItemInput = {
  dice: string;
  name: string;
  description: string;
};

export type EnemyFormData = {
  name: string;
  rank: string;
  cr: number;
  enemyType: string;
  race: string;
  tags: string;
  memo: string;
  hitPoint: number;
  hate: number;
  fate: number;
  physicalDefense: number;
  magicDefense: number;
  action: number;
  skills: EnemySkillInput[];
  items: EnemyDropItemInput[];
};

function normalizeText(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

function splitTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function buildSkillCommand(skills: EnemySkillInput[]): string {
  return skills
    .filter((skill) => skill.name.trim() || skill.effect.trim())
    .map((skill) => {
      const lines: string[] = [];
      if (skill.name.trim()) {
        lines.push(skill.name.trim());
      }
      if (skill.effect.trim()) {
        lines.push(normalizeText(skill.effect));
      }
      return lines.join("\n");
    })
    .filter(Boolean)
    .join("\n");
}

function buildSkillMemo(skills: EnemySkillInput[]): string {
  return skills
    .filter((skill) => skill.name.trim())
    .map((skill) => {
      let text = skill.name.trim();

      if (skill.tags.trim()) {
        text += `_[${skill.tags.trim()}]`;
      }
      if (skill.timing.trim()) {
        text += `_${skill.timing.trim()}`;
      }
      if (skill.roleAttack.trim() && skill.roleDefense.trim()) {
        text += `_対決（${skill.roleAttack.trim()}／${skill.roleDefense.trim()}）`;
      }
      if (skill.target.trim()) {
        text += `_${skill.target.trim()}`;
      }
      if (skill.range.trim()) {
        text += `_${skill.range.trim()}`;
      }
      if (skill.limit.trim()) {
        text += `_${skill.limit.trim()}`;
      }
      if (skill.effect.trim()) {
        text += `_${normalizeText(skill.effect)}`;
      }

      return text;
    })
    .join("\n\n");
}

function buildItemMemo(items: EnemyDropItemInput[]): string {
  return items
    .filter((item) => item.name.trim())
    .map((item) => {
      const lines: string[] = [];
      if (item.dice.trim()) {
        lines.push(`[ダイス: ${item.dice.trim()}]`);
      }
      lines.push(`[アイテム名: ${item.name.trim()}]`);
      if (item.description.trim()) {
        lines.push(`[解説: ${normalizeText(item.description)}]`);
      }
      return lines.join("\n");
    })
    .join("\n\n");
}

function buildMemo(data: EnemyFormData): string {
  const tagList = splitTags(data.tags);
  const sections: string[] = [];

  sections.push("<タグ>");
  sections.push(tagList.length > 0 ? `[${tagList.join(", ")}]` : "[]");

  sections.push("");
  sections.push("<解説>");
  sections.push(data.memo.trim() ? normalizeText(data.memo) : "なし");

  sections.push("");
  sections.push("<ドロップ品>");
  sections.push(buildItemMemo(data.items) || "なし");

  sections.push("");
  sections.push("<特技>");
  sections.push(buildSkillMemo(data.skills) || "なし");

  return sections.join("\n");
}

export function createEnemyPiece(data: EnemyFormData): string {
  const piece = {
    kind: "character",
    data: {
      name: data.name.trim(),
      initiative: data.action,
      memo: buildMemo(data),
      status: [
        {
          label: "HP",
          value: data.hitPoint,
          max: data.hitPoint,
        },
        {
          label: "ヘイト倍率",
          value: data.hate,
          max: data.hate,
        },
        {
          label: "因果力",
          value: data.fate,
          max: data.fate,
        },
      ],
      params: [
        {
          label: "CR",
          value: String(data.cr),
        },
        {
          label: "物防",
          value: String(data.physicalDefense),
        },
        {
          label: "魔防",
          value: String(data.magicDefense),
        },
      ],
      commands: buildSkillCommand(data.skills),
    },
  };

  return JSON.stringify(piece);
}