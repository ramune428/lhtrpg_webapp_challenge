export type ToolKey = "character" | "enemy";

export type ToolConfig = {
  navLabel: string;
  toolLabel: string;
  href: string;
  backLabel: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type NavGroup = {
  key: ToolKey;
  label: string;
  items: NavItem[];
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

export const BACK_LABELS: Record<ToolKey, string> = {
  character: TOOL_CONFIG.character.backLabel,
  enemy: TOOL_CONFIG.enemy.backLabel,
} as const;

export const NAV_GROUPS: NavGroup[] = [
  {
    key: "character",
    label: TOOL_CONFIG.character.navLabel,
    items: [
      { label: TOOL_CONFIG.character.toolLabel, href: TOOL_CONFIG.character.href },
      { label: "使い方（詳細）", href: "/character/how-to" },
      { label: "コマンド内訳", href: "/character/command-details" },
      { label: "アップデート情報", href: "/character/updates" },
    ],
  },
  {
    key: "enemy",
    label: TOOL_CONFIG.enemy.navLabel,
    items: [
      { label: TOOL_CONFIG.enemy.toolLabel, href: TOOL_CONFIG.enemy.href },
      { label: "公式データについて", href: "/enemy/official-data" },
      { label: "使い方（詳細）", href: "/enemy/how-to" },
      { label: "計算式", href: "/enemy/formula" },
      { label: "アップデート情報", href: "/enemy/updates" },
    ],
  },
];
