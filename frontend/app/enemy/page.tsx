import AppNav from "@/components/app-nav";
import PageLinkCard from "@/components/page-link-card";

export default function EnemyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <AppNav current="enemy" />

        <h1 className="mb-4 text-3xl font-bold tracking-tight">
          LHTRPG- エネミーデータ/駒作成ツール（CCFOLIA）
        </h1>

        <div className="mb-10 rounded-2xl border border-dashed border-neutral-400 p-6">
          <h2 className="mb-3 text-xl font-semibold">準備中</h2>
          <p className="text-sm leading-8 text-neutral-700">
            このページは今後、エネミーデータ処理を実装する想定です。
            現時点では、Notion 構成を先に Web 化するため、ページと導線のみ準備しています。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PageLinkCard
            href="/enemy/subpages"
            title="エネミーデータ サブページ"
            description="JSON（読み込み）について、使い方（詳細）、計算式、アップデート情報への入口です。"
          />
        </div>
      </div>
    </main>
  );
}
