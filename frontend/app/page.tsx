import AppNav from "@/components/app-nav";
import PageLinkCard from "@/components/page-link-card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <AppNav current="character" />

        <h1 className="mb-4 text-3xl font-bold tracking-tight">
          LHTRPG- キャラ駒作成ツール（CCFOLIA）
        </h1>

        <p className="mb-4 text-base leading-8 text-neutral-700">
          このページを初期表示ページとして使う想定です。
          既存のキャラ駒作成フォームをここへ組み込めば、そのままメインページになります。
        </p>

        <p className="mb-10 text-sm leading-8 text-neutral-700">
          今回の zip は「各ページの土台」を先に作る目的でまとめています。
          そのため、メイン処理はまだ埋め込まず、ページ構成と導線を先に準備しています。
        </p>

        <section className="mb-10 rounded-2xl border border-neutral-300 p-6">
          <h2 className="mb-3 text-xl font-semibold">メインツール領域</h2>
          <p className="text-sm leading-8 text-neutral-700">
            ここに現在の character 用フォーム UI を移植してください。
            既存の app/page.tsx の処理をこの領域に統合する想定です。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">関連ページ</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <PageLinkCard
              href="/character/subpages"
              title="キャラ駒作成ツール サブページ"
              description="使い方（詳細）、コマンド内訳、アップデート情報への入口です。"
            />
            <PageLinkCard
              href="/enemy"
              title="エネミーデータ/駒作成ツール"
              description="エネミー側のトップページです。現時点では準備中表示にしています。"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold">使い方</h2>
            <p className="text-sm leading-8 text-neutral-700">
              1. ログ･ホライズンTRPG冒険窓口でキャラクターページを開く。
              2. 外部ツールからの〈冒険者〉データ参照が許可されているか確認する。
              3. キャラクターURLまたはIDを入力する。
              4. コマンドを生成し、結果をコピーしてCCFOLIAへ貼り付ける。
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">補足</h2>
            <p className="text-sm leading-8 text-neutral-700">
              詳細な手順や補足説明はサブページ側に分離しています。
              Notion の構成を崩さず、そのまま Web 化しやすいように整理しています。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
