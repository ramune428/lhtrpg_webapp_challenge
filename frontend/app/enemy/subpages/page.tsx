import AppNav from "@/components/app-nav";
import PageLinkCard from "@/components/page-link-card";

export default function EnemySubpagesPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <AppNav current="enemy" />

        <h1 className="mb-4 text-3xl font-bold tracking-tight">
          エネミーデータ サブページ
        </h1>

        <p className="mb-10 text-base leading-8 text-neutral-700">
          エネミーデータ/駒作成ツールに関する補助ページです。
          まずはページ構成を先に用意し、本文は後から移植できるようにしています。
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <PageLinkCard
            href="/enemy/json"
            title="JSON（読み込み）について"
            description="エネミーデータの読み込みや参照元に関する説明を掲載するページです。"
          />
          <PageLinkCard
            href="/enemy/how-to"
            title="使い方（詳細）"
            description="エネミー側ツールの利用手順を掲載するページです。"
          />
          <PageLinkCard
            href="/enemy/formula"
            title="計算式"
            description="エネミーデータの計算式や反映ルールを掲載するページです。"
          />
          <PageLinkCard
            href="/enemy/updates"
            title="アップデート情報"
            description="エネミー側の更新履歴を掲載するページです。"
          />
        </div>
      </div>
    </main>
  );
}
