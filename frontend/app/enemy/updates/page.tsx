import StaticPage from "@/components/static-page";
import { TOOL_CONFIG } from "@/components/tool-config";

type VersionItem = {
  version: string;
  date?: string;
  notes: string[];
};

const currentVersion: VersionItem = {
  version: "ver 2.0",
  date: "2026/05",
  notes: [
    "Webアプリ版として再構成",
    `「${TOOL_CONFIG.enemy.toolLabel}」を公開`,
    "「公式データについて」「使い方（詳細）」「計算式」「アップデート情報」ページを追加",
    "ページ構成と導線を整理",
    "UIを調整",
  ],
};

// ver2.1 リリース時の移動用メモ
// currentVersion を ver2.1 に更新したあと、
// 下の「現行Webアプリ版」セクションをコメントアウト解除し、
// item={currentVersionForHistory} を使う。

/*
const currentVersionForHistory: VersionItem = {
  version: "ver 2.0",
  date: "2026/06",
  notes: [
    "Webアプリ版として再構成",
    `${TOOL_CONFIG.enemy.toolLabel}をメインページとして公開`,
    "「公式データについて」「使い方（詳細）」「計算式」「アップデート情報」ページを追加",
    "ページ構成と導線を整理",
    "UIを調整",
  ],
};
*/

const notionVersionsForHistory: VersionItem[] = [
  {
    version: "ver 1.0",
    notes: [
      `「-LHTRPG- ${TOOL_CONFIG.enemy.toolLabel}（CCFOLIA）」（Notion）を正式リリース`,
    ],
  },
];

function VersionCard({ item }: { item: VersionItem }) {
  return (
    <section className="rounded-2xl border border-neutral-300 p-6">
      <h3 className="mb-1 text-2xl font-semibold">{item.version}</h3>

      {item.date ? (
        <p className="mb-4 text-sm text-neutral-500">{item.date}</p>
      ) : null}

      <ul className="space-y-2 text-sm leading-8 text-neutral-800">
        {item.notes.map((note) => (
          <li key={note}>・{note}</li>
        ))}
      </ul>
    </section>
  );
}

export default function EnemyUpdatesPage() {
  return (
    <StaticPage
      current="enemy"
      title="アップデート情報"
      /*lead={`${TOOL_CONFIG.enemy.toolLabel}の更新履歴をまとめています。`}*/
      backHref={TOOL_CONFIG.enemy.href}
    >
      <section>
          <div className="mb-10 space-y-4">
            <p className="text-sm leading-8 text-neutral-800">
              {TOOL_CONFIG.enemy.toolLabel}の更新内容をまとめています。
              機能追加、表示内容の調整、不具合修正など、これまでの変更履歴を確認できます。
            </p>
          </div>
      </section>
      
      <section>
        <h2 className="mb-4 text-2xl font-bold">最新バージョン</h2>
        <VersionCard item={currentVersion} />
      </section>

      <section className="space-y-10">
        <div>
          <h2 className="mb-4 text-2xl font-bold">過去バージョン</h2>
          <p className="text-sm leading-8 text-neutral-700">
            過去の更新履歴をまとめています。
          </p>
        </div>

        {/* <section className="space-y-6">
          <div>
            <h3 className="mb-2 text-xl font-semibold">現行Webアプリ版</h3>
            <p className="text-sm leading-8 text-neutral-700">
              現在のWebアプリ版として公開している更新履歴です。
            </p>
          </div>

          <div className="space-y-6">
            <VersionCard item={currentVersionForHistory} />
          </div>
        </section> */}

        <section className="space-y-6">
          <div>
            <h3 className="mb-2 text-xl font-semibold">Notion版</h3>
            <p className="text-sm leading-8 text-neutral-700">
              Notion版の更新履歴です。
            </p>
          </div>

          <div className="space-y-6">
            {notionVersionsForHistory.map((item) => (
              <VersionCard key={item.version} item={item} />
            ))}
          </div>
        </section>
      </section>
    </StaticPage>
  );
}
