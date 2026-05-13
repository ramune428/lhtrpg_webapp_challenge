import Link from "next/link";

type AppNavProps = {
  current?: "character" | "enemy";
};

type NavItem = {
  label: string;
  href: string;
};

type NavGroup = {
  key: "character" | "enemy";
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    key: "character",
    label: "キャラクター駒作成",
    items: [
      { label: "ツール本体", href: "/" },
      { label: "使い方（詳細）", href: "/character/how-to" },
      { label: "コマンド内訳", href: "/character/command-details" },
      { label: "アップデート情報", href: "/character/updates" },
      // { label: "関連ページ一覧", href: "/character/subpages" },
    ],
  },
  {
    key: "enemy",
    label: "エネミーデータ作成",
    items: [
      { label: "ツール本体", href: "/enemy" },
      { label: "JSON（読み込み）について", href: "/enemy/json" },
      { label: "使い方（詳細）", href: "/enemy/how-to" },
      { label: "計算式", href: "/enemy/formula" },
      { label: "アップデート情報", href: "/enemy/updates" },
      // { label: "関連ページ一覧", href: "/enemy/subpages" },
    ],
  },
];

export default function AppNav({ current }: AppNavProps) {
  const summaryBaseClass =
    "cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-neutral-50";
  const activeSummaryClass = "border-black bg-black text-white hover:bg-black";
  const normalSummaryClass = "border-neutral-300 text-black";
  const itemClass =
    "block rounded-lg px-3 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100";

  return (
    <nav className="mb-8 flex flex-wrap gap-3">
      {navGroups.map((group) => {
        const isActive = current === group.key;

        return (
          <details key={group.key} className="group relative">
            <summary
              className={`${summaryBaseClass} ${
                isActive ? activeSummaryClass : normalSummaryClass
              }`}
            >
              {group.label}
            </summary>

            <div className="absolute left-0 z-20 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
              {group.items.map((item) => (
                <Link key={item.href} href={item.href} className={itemClass}>
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        );
      })}
    </nav>
  );
}
