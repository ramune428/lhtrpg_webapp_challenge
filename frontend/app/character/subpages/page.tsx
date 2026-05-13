import AppNav from "@/components/app-nav";
import PageLinkCard from "@/components/page-link-card";

export default function CharacterSubpagesPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <AppNav current="character" />

        <h1 className="mb-4 text-3xl font-bold tracking-tight">
          キャラ駒作成ツール サブページ
        </h1>

        <p className="mb-10 text-base leading-8 text-neutral-700">
          キャラ駒作成ツールに関する補助ページです。
          使い方の詳細、コマンドの内訳、アップデート情報をこちらにまとめます。
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <PageLinkCard
            href="/character/how-to"
            title="使い方（詳細）"
            description="キャラクターURLまたはIDを使って駒作成コマンドを生成する流れを確認します。"
          />
          <PageLinkCard
            href="/character/command-details"
            title="コマンド内訳"
            description="生成される駒データの中身や、どの項目がどこへ反映されるかを整理します。"
          />
          <PageLinkCard
            href="/character/updates"
            title="アップデート情報"
            description="キャラ駒作成ツールの更新履歴や変更点を掲載するページです。"
          />
        </div>
      </div>
    </main>
  );
}
