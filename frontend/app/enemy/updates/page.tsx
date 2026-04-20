import StaticPage from "@/components/static-page";

export default function EnemyUpdatesPage() {
  return (
    <StaticPage
      current="enemy"
      title="アップデート情報"
      lead="エネミー側の更新履歴を掲載するためのページです。"
      backHref="/enemy/subpages"
      backLabel="エネミーデータ サブページ"
      sections={[
        {
          title: "掲載方法の例",
          paragraphs: [
            "2026-04-20: エネミー側ページの土台を追加。",
            "2026-04-20: 準備中ページとサブページ導線を追加。",
          ],
        },
        {
          title: "メモ",
          paragraphs: [
            "最初は仮の履歴で置いておき、あとから本当の更新履歴へ差し替える形で十分です。",
          ],
        },
      ]}
    />
  );
}
