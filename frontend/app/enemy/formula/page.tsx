import StaticPage from "@/components/static-page";

export default function EnemyFormulaPage() {
  return (
    <StaticPage
      current="enemy"
      title="計算式"
      lead="このページはエネミーデータ側の計算式や変換ルールを掲載するための土台です。"
      backHref="/enemy/subpages"
      backLabel="エネミーデータ サブページ"
      sections={[
        {
          title: "掲載候補",
          paragraphs: [
            "能力値の反映式",
            "HP や各種ステータスの算出ルール",
            "チャットパレット化するときの変換規則",
          ],
        },
        {
          title: "メモ",
          paragraphs: [
            "実際の式が固まってから本文を追記してください。",
          ],
        },
      ]}
    />
  );
}
