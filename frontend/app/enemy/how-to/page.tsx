import StaticPage from "@/components/static-page";

export default function EnemyHowToPage() {
  return (
    <StaticPage
      current="enemy"
      title="使い方（詳細）"
      lead="このページはエネミー側ツールの使い方を掲載するための土台です。"
      backHref="/enemy/subpages"
      backLabel="エネミーデータ サブページ"
      sections={[
        {
          title: "現状",
          paragraphs: [
            "エネミーデータ/駒作成ツール本体はまだ準備中です。",
          ],
        },
        {
          title: "今後の掲載内容",
          paragraphs: [
            "入力方法",
            "読み込み対象データの形式",
            "出力結果の貼り付け方法",
            "注意事項や既知の制限",
          ],
        },
        {
          title: "画像の配置先",
          paragraphs: [
            "説明画像を追加する場合は public/enemy/how-to/ 配下に配置してください。",
          ],
        },
      ]}
    />
  );
}
