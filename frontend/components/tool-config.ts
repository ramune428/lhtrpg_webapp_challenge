export type ToolKey = "character" | "enemy";

export type ToolConfig = {
  navLabel: string;
  toolLabel: string;
  href: string;
  backLabel: string;
};

export type PageLinkConfig = {
  label: string;
  href: string;
};

export type NavGroup = {
  key: ToolKey;
  label: string;
  items: PageLinkConfig[];
};

export const TOOL_CONFIG: Record<ToolKey, ToolConfig> = {
  character: {
    navLabel: "キャラクター駒作成",
    toolLabel: "キャラクター駒作成ツール",
    href: "/",
    backLabel: "キャラクター駒作成ツールに戻る",
  },
  enemy: {
    navLabel: "エネミーデータ/駒作成",
    toolLabel: "エネミーデータ/駒作成ツール",
    href: "/enemy",
    backLabel: "エネミーデータ/駒作成ツールに戻る",
  },
} as const;

export const TOOL_TITLES: Record<ToolKey, string> = {
  character: `-LHTRPG- ${TOOL_CONFIG.character.toolLabel}（CCFOLIA）`,
  enemy: `-LHTRPG- ${TOOL_CONFIG.enemy.toolLabel}（CCFOLIA）`,
} as const;

export const BACK_LABELS: Record<ToolKey, string> = {
  character: TOOL_CONFIG.character.backLabel,
  enemy: TOOL_CONFIG.enemy.backLabel,
} as const;

export const CHARACTER_PAGE_LINKS = {
  home: {
    label: TOOL_CONFIG.character.toolLabel,
    href: TOOL_CONFIG.character.href,
  },
  howTo: {
    label: "使い方（詳細）",
    href: "/character/how-to",
  },
  commandDetails: {
    label: "コマンド内訳",
    href: "/character/command-details",
  },
  updates: {
    label: "アップデート情報",
    href: "/character/updates",
  },
} as const satisfies Record<string, PageLinkConfig>;

export const ENEMY_PAGE_LINKS = {
  home: {
    label: TOOL_CONFIG.enemy.toolLabel,
    href: TOOL_CONFIG.enemy.href,
  },
  officialData: {
    label: "公式データについて",
    href: "/enemy/official-data",
  },
  howTo: {
    label: "使い方（詳細）",
    href: "/enemy/how-to",
  },
  formula: {
    label: "計算式",
    href: "/enemy/formula",
  },
  updates: {
    label: "アップデート情報",
    href: "/enemy/updates",
  },
} as const satisfies Record<string, PageLinkConfig>;

export const NAV_GROUPS: NavGroup[] = [
  {
    key: "character",
    label: TOOL_CONFIG.character.navLabel,
    items: [
      CHARACTER_PAGE_LINKS.home,
      CHARACTER_PAGE_LINKS.howTo,
      CHARACTER_PAGE_LINKS.commandDetails,
      CHARACTER_PAGE_LINKS.updates,
    ],
  },
  {
    key: "enemy",
    label: TOOL_CONFIG.enemy.navLabel,
    items: [
      ENEMY_PAGE_LINKS.home,
      ENEMY_PAGE_LINKS.officialData,
      ENEMY_PAGE_LINKS.howTo,
      ENEMY_PAGE_LINKS.formula,
      ENEMY_PAGE_LINKS.updates,
    ],
  },
];

export const EXTERNAL_LINKS = {
  lhzTop: "https://lhrpg.com/lhz/top",
  lhzDatabase: "https://lhrpg.com/lhz/database",
  enemyDataGuide: "https://lhrpg.com/data/enemy_data_guide2.html",
  referenceChatPalette: "http://unonek.sakura.ne.jp/lh/chatpad.cgi?11111111",
  feedbackForm: "https://forms.gle/96dgnY3rsvDxAKbM9",
  
} as const;
