type AnyRecord = Record<string, unknown>;

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

export type CrValues = {
  default: number;
  cr11?: number;
  cr16?: number;
  cr21?: number;
};

export type CausalityCostSkillRule = {
  skillId: number;
  skillName: string;
  label: string;
  crValues: CrValues;
  maxCost: number;
};

export type RegenerationSkillRule = {
  skillId: number;
  skillName: string;
  command: string;
  label: string;
};

export type ShieldSkillRule = {
  skillId: number;
  skillName: string;
  label: string;
  buildCommand: (skill: AnyRecord) => string;
};

export type WeaknessCommand = {
  command: string;
  nameSuffix?: string;
};

export type WeaknessSkillRule = {
  skillId: number;
  skillName: string;
  condition: string;
  buildCommands: (skill: AnyRecord, characterRank: number) => WeaknessCommand[];
};

export type ReductionCommand = {
  command: string;
  nameSuffix?: string;
};

export type ReductionSkillRule = {
  skillId: number;
  skillName: string;
  condition: string;
  buildCommands: (
    skill: AnyRecord,
    characterRank: number,
    hand1: AnyRecord | null,
    hand2: AnyRecord | null
  ) => ReductionCommand[];
};

export type DirectDamageCommand = {
  command: string;
  nameSuffix?: string;
};

export type DirectDamageSkillRule = {
  skillId: number;
  skillName: string;
  labelSuffix?: string;
  buildCommands: (skill: AnyRecord, characterRank: number) => DirectDamageCommand[];
};

export const causalityCostSkillRules: CausalityCostSkillRule[] = [
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

export const regenerationSkillRules: RegenerationSkillRule[] = [
  {
    skillId: 3402,
    skillName: "ハートビートヒーリング",
    command: "C({魔力}+10)",
    label: "(再生)",
  },
  {
    skillId: 3426,
    skillName: "ハートビートヒーリングⅡ",
    command: "C({魔力}*2)",
    label: "(再生)",
  },
  {
    skillId: 3403,
    skillName: "ガイアビートヒーリング",
    command: "C({魔力})",
    label: "(再生)",
  },
  {
    skillId: 3421,
    skillName: "クラウンオブミスルトゥ",
    command: "C(0+{魔力})",
    label: "再生強度=現在再生+魔力",
  },
];

export const shieldSkillRules: ShieldSkillRule[] = [
  {
    skillId: 3602,
    skillName: "禊ぎの障壁",
    label: "(障壁)",
    buildCommand: () => "C({魔力}+{回復力}+15)",
  },
  {
    skillId: 3620,
    skillName: "禊ぎの障壁Ⅱ",
    label: "(障壁)",
    buildCommand: () => "C({魔力}*2+{回復力})",
  },
  {
    skillId: 3607,
    skillName: "四方拝",
    label: "(障壁)",
    buildCommand: () => "C({魔力}+{回復力}+4D)",
  },
  {
    skillId: 3614,
    skillName: "鈴音の障壁",
    label: "(障壁/加算)",
    buildCommand: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return `C({回復力}+${skillRank * 4})`;
    },
  },
];

export const weaknessSkillRules: WeaknessSkillRule[] = [
  {
    skillId: 2621,
    skillName: "アーマークラッシュⅡ",
    condition: "物理ダメージ",
    buildCommands: (_skill, characterRank) => {
      const baseValue = characterRank >= 21 ? 15 : 10;
      return [
        { command: `C(${baseValue})` },
        { command: `C(${baseValue * 2})`, nameSuffix: "_因果力1" },
      ];
    },
  },
  {
    skillId: 4022,
    skillName: "クレイズクラック",
    condition: "物理ダメージ",
    buildCommands: () => [{ command: "C({INT})" }],
  },
  {
    skillId: 3626,
    skillName: "翔鶴の凶祓い",
    condition: "白兵攻撃",
    buildCommands: () => [{ command: "C({STR})" }],
  },
  {
    skillId: 3431,
    skillName: "フィアースモールド",
    condition: "魔法ダメージ",
    buildCommands: (_skill, characterRank) => {
      const baseValue = characterRank >= 16 ? 15 : 10;
      return [
        { command: `C(${baseValue})` },
        { command: `C(${baseValue * 2})`, nameSuffix: "_因果力1" },
      ];
    },
  },
  {
    skillId: 2218,
    skillName: "レイザーエッジⅡ",
    condition: "物理ダメージ",
    buildCommands: () => [{ command: "C(10)" }],
  },
];

export const reductionSkillRules: ReductionSkillRule[] = [
  {
    skillId: 2602,
    skillName: "アンカーハウル",
    condition: "",
    buildCommands: () => [{ command: "C({STR})" }],
  },
  {
    skillId: 2620,
    skillName: "アンカーハウルⅡ",
    condition: "",
    buildCommands: () => [{ command: "C({STR})" }],
  },
  {
    skillId: 3621,
    skillName: "石凝の鏡",
    condition: "",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C({POW}*${skillRank})` }];
    },
  },
  {
    skillId: 2821,
    skillName: "血戦の陣",
    condition: "",
    buildCommands: (skill, characterRank) => {
      const skillRank = asNumber(skill.skill_rank);
      const multiplier = characterRank >= 21 ? 15 : characterRank >= 11 ? 10 : 5;
      return [{ command: `C(${skillRank * multiplier})` }];
    },
  },
  {
    skillId: 3203,
    skillName: "シールドパクト",
    condition: "",
    buildCommands: (_skill, _characterRank, hand1, hand2) => [
      { command: `C(${getShieldDefenseValue(hand1, hand2)})` },
    ],
  },
  {
    skillId: 4622,
    skillName: "従者召喚：ゴーレム",
    condition: "物理ダメージ",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C({INT}*${skillRank})` }];
    },
  },
  {
    skillId: 4623,
    skillName: "従者召喚：スライム",
    condition: "魔法ダメージ",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C({INT}*${skillRank})` }];
    },
  },
  {
    skillId: 3624,
    skillName: "厄除けの護り",
    condition: "選択タグ",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C({POW}*${skillRank})` }];
    },
  },
  {
    skillId: 1701,
    skillName: "タトゥーパターン：エンプレス",
    condition: "",
    buildCommands: () => [{ command: "C(5)" }],
  },
  {
    skillId: 3027,
    skillName: "アイアンリノ・スタンス",
    condition: "",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C({INT}+${skillRank * 5})` }];
    },
  },
  {
    skillId: 2104,
    skillName: "ウォーターブリージング",
    condition: "水棲",
    buildCommands: () => [{ command: "C(10)" }],
  },
  {
    skillId: 2112,
    skillName: "ウォーターブリージングⅡ",
    condition: "水棲",
    buildCommands: (_skill, characterRank) => {
      const value = characterRank >= 21 ? 30 : 20;
      return [{ command: `C(${value})` }];
    },
  },
  {
    skillId: 2103,
    skillName: "エナジープロテクション",
    condition: "選択タグ",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C(${skillRank * 5})` }];
    },
  },
  {
    skillId: 2111,
    skillName: "エナジープロテクションⅡ",
    condition: "選択タグ",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C({INT}*${skillRank})` }];
    },
  },
  {
    skillId: 2505,
    skillName: "エレメンタルシェル",
    condition: "選択タグ",
    buildCommands: () => [{ command: "C(40)" }],
  },
  {
    skillId: 4223,
    skillName: "風纏う乙女のロンド",
    condition: "至近以外からの攻撃",
    buildCommands: (_skill, characterRank) => {
      const value =
        characterRank >= 29 ? 50 : characterRank >= 22 ? 40 : characterRank >= 15 ? 30 : characterRank >= 8 ? 20 : 10;
      return [{ command: `C(${value})` }];
    },
  },
 ];

export const directDamageSkillRules: DirectDamageSkillRule[] = [
  {
    skillId: 4603,
    skillName: "従者召喚：ウンディーネ",
    buildCommands: () => [{ command: "C(5)" }],
  },
  {
    skillId: 4625,
    skillName: "従者召喚：ウンディーネⅡ",
    buildCommands: () => [{ command: "C({INT})" }],
  },
  {
    skillId: 4602,
    skillName: "従者召喚：サラマンダー",
    buildCommands: () => [{ command: "C(5)" }],
  },
  {
    skillId: 4624,
    skillName: "従者召喚：サラマンダーⅡ",
    buildCommands: () => [{ command: "C({INT})" }],
  },
  {
    skillId: 3405,
    skillName: "従者召喚：ワイルドボア",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C(${skillRank * 4})` }];
    },
  },
  {
    skillId: 3429,
    skillName: "従者召喚：ワイルドボアⅡ",
    buildCommands: (skill, characterRank) => {
      const skillRank = asNumber(skill.skill_rank);
      const multiplier = characterRank >= 21 ? 10 : 7;
      return [{ command: `C(${skillRank * multiplier})` }];
    },
  },
  {
    skillId: 4616,
    skillName: "エレメンタルボルト",
    labelSuffix: "弱点起動",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C(${skillRank * 2 + 2})` }];
    },
  },
  {
    skillId: 4632,
    skillName: "エレメンタルボルトⅡ",
    labelSuffix: "弱点起動",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C({STR}*${skillRank})` }];
    },
  },
  {
    skillId: 4630,
    skillName: "トランプルコマンド",
    labelSuffix: "弱点起動",
    buildCommands: () => [{ command: "C({POW}+5)" }],
  },
  {
    skillId: 4026,
    skillName: "ヒルトブレイク",
    labelSuffix: "追撃起動",
    buildCommands: () => [{ command: "C({STR基本値})" }],
  },
  {
    skillId: 4815,
    skillName: "パルスブリット",
    labelSuffix: "追撃起動",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C(${skillRank + 2})` }];
    },
  },
  {
    skillId: 4829,
    skillName: "パルスブリットⅡ",
    labelSuffix: "追撃起動",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C({POW}+${skillRank})` }];
    },
  },
  {
    skillId: 17,
    skillName: "ラヴェージ",
    buildCommands: (_skill, characterRank) => {
      const value = characterRank >= 21 ? 30 : characterRank >= 11 ? 20 : 10;
      return [{ command: `C(${value})` }];
    },
  },
  {
    skillId: 2816,
    skillName: "木霊返し",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      const baseValue = skillRank * 4;
      return [
        { command: `C(${baseValue})` },
        { command: `C(${baseValue + 6})`, nameSuffix: "_因果力1" },
      ];
    },
  },
  {
    skillId: 2830,
    skillName: "木霊返しⅡ",
    buildCommands: (skill, characterRank) => {
      const skillRank = asNumber(skill.skill_rank);
      return [
        { command: `C({DEX}*${skillRank})` },
        { command: `C({DEX}*${skillRank}+${characterRank})`, nameSuffix: "_因果力1" },
      ];
    },
  },
  {
    skillId: 1818,
    skillName: "ディスタービングアタック",
    buildCommands: () => [{ command: "C({攻撃力})" }],
  },
  {
    skillId: 4029,
    skillName: "パラードリポスト",
    buildCommands: () => [{ command: "C({攻撃力})" }],
  },
  {
    skillId: 3019,
    skillName: "サイレントパーム",
    buildCommands: (skill) => {
      const skillRank = asNumber(skill.skill_rank);
      return [{ command: `C(${skillRank * 5})` }];
    },
  },
  {
    skillId: 3031,
    skillName: "ビートアップ",
    buildCommands: () => [{ command: "C(5)" }],
  },
];
