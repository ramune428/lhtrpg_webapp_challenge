import StaticPage from "@/components/static-page";

export default function CharacterUpdatesPage() {
  return (
    <StaticPage
      current="character"
      title="アップデート情報"
      lead="キャラ駒作成ツールの更新履歴を掲載するためのページです。"
      backHref="/character/subpages"
      backLabel="キャラ駒作成ツール サブページ"
      sections={[
        {
          title: "掲載方法の例",
          paragraphs: [
            "2026-04-20: Web 版のページ構成を追加。",
            "2026-04-20: キャラ側サブページの土台を追加。",
            "2026-04-20: 使い方ページとコマンド内訳ページの初期版を追加。",
          ],
        },
        {
          title: "メモ",
          paragraphs: [
            "このページはまず固定文で置いておき、あとから実際の更新履歴に差し替える運用で問題ありません。",
          ],
        },
      ]}
    />
  );
}
