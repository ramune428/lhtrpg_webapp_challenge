import Link from "next/link";
import AppNav from "@/components/app-nav";

type UpdateItem = {
  version: string;
  date?: string;
  notes: string[];
};

const plannedFeatures = [
  "特技による弱点、軽減の反映",
  "追加効果の反映",
  "マスタリー、スタイルなどの常時特技の反映",
];

const updates: UpdateItem[] = [
  {
    version: "ver 3.0",
    date: "2026/04",
    notes: [
      "Webアプリ版として再構成",
      "キャラ駒作成ツールをメインページとして公開",
      "「使い方（詳細）」「コマンド内訳」「アップデート情報」ページを追加",
      "ページ構成と導線を整理",
      "UIを調整",
    ],
  },
  {
    version: "ver 2.1.2",
    date: "2023/12",
    notes: ["一部特技のエラーを修正"],
  },
  {
    version: "ver 2.1",
    date: "2023/11",
    notes: ["キャラクタータグを「キャラクターメモ」に追加"],
  },
  {
    version: "ver 2.0",
    date: "2023/10",
    notes: ["「LHTRPG- キャラ駒作成ツール（CCFOLIA）」の正式リリース"],
  },
  {
    version: "ver 1.4",
    date: "2023/09",
    notes: [
      "ダメージロールの追加（[追撃] [衰弱] [再生] [障壁]）",
      "WebページをNotionに変更",
      "「コマンド内訳」「アップデート情報」ページを追加",
      "[クリア] ボタンを追加",
    ],
  },
  {
    version: "ver 1.3",
    date: "2023/08",
    notes: [
      "ネームドアイテム / 魔具を所持品に入れていた時にエラーが発生する状態を改善",
      "一部特技のダメージロールを追加（[直接ダメージを除くダメージ系] [回復]）",
      "ページ内文章を変更",
      "使い方ページを追加",
    ],
  },
  {
    version: "ver 1.2",
    date: "2023/08",
    notes: ["キャラクターID参照からキャラクターURL参照に変更"],
  },
  {
    version: "ver 1.1",
    date: "2023/07",
    notes: [
      ".exe から Webアプリ化（限定公開）",
      "基本データ [説明欄] を駒メモ欄に反映",
    ],
  },
  {
    version: "ver 1.0",
    date: "2023/07",
    notes: [".exe を作成（限定配布）"],
  },
];

export default function CharacterUpdatesPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-8">
        <AppNav current="character" />

        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-neutral-600 underline underline-offset-4"
          >
            ← キャラ作成ツールに戻る
          </Link>
        </div>

        <header className="mb-10">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            アップデート情報
          </h1>
          <p className="text-sm leading-8 text-neutral-700">
            キャラ駒作成ツールの更新履歴をまとめています。
          </p>
        </header>

        {/* 
        <section className="mb-12 rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <h2 className="mb-4 text-2xl font-semibold">アップデート予定（仮）</h2>
          <p className="mb-4 text-sm leading-8 text-neutral-800">
            作者が追加したいと考えている機能です。いつ実装できるか、また実装できるかどうかも未定です。
          </p>

          <ul className="space-y-2 text-sm leading-8 text-neutral-800">
            {plannedFeatures.map((feature) => (
              <li key={feature}>・{feature}</li>
            ))}
          </ul>
        </section> 
        */}

        <section className="space-y-8">
          {updates.map((update) => (
            <section
              key={update.version}
              className="rounded-2xl border border-neutral-300 p-6"
            >
              <h2 className="mb-1 text-2xl font-semibold">{update.version}</h2>

              {update.date ? (
                <p className="mb-4 text-sm text-neutral-500">{update.date}</p>
              ) : null}

              <ul className="space-y-2 text-sm leading-8 text-neutral-800">
                {update.notes.map((note) => (
                  <li key={note}>・{note}</li>
                ))}
              </ul>
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}