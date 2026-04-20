import StaticPage from "@/components/static-page";

export default function EnemyJsonPage() {
  return (
    <StaticPage
      current="enemy"
      title="JSON（読み込み）について"
      lead="このページはエネミーデータの読み込み仕様を掲載するための土台です。"
      backHref="/enemy/subpages"
      backLabel="エネミーデータ サブページ"
      sections={[
        {
          title: "このページの用途",
          paragraphs: [
            "読み込み元の JSON の仕様や、どの項目をどのように参照するかを整理するページです。",
          ],
        },
        {
          title: "今後の追加候補",
          paragraphs: [
            "参照URLの形式",
            "必要なキー名",
            "存在しない値があった場合の扱い",
            "CCFOLIA 用データへの変換ルール",
          ],
        },
        {
          title: "メモ",
          paragraphs: [
            "本文はあとから Notion 側の記載を転記してください。",
          ],
        },
      ]}
    />
  );
}
