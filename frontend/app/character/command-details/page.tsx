import StaticPage from "@/components/static-page";

export default function CharacterCommandDetailsPage() {
  return (
    <StaticPage
      current="character"
      title="コマンド内訳"
      lead="元の説明文をもとに、駒作成コマンドの内容を整理するページの土台です。"
      backHref="/character/subpages"
      backLabel="キャラ駒作成ツール サブページ"
      sections={[
        {
          title: "基本情報",
          paragraphs: [
            "名前、行動値、外部URLなど、キャラクターの基本的な情報が含まれます。",
          ],
        },
        {
          title: "ステータス",
          paragraphs: [
            "HP、再生、障壁、疲労、ヘイト、因果力など、戦闘や管理に使う値を格納します。",
          ],
        },
        {
          title: "パラメータ",
          paragraphs: [
            "CR、攻撃力、魔力、回復力、物防、魔防、各能力値などが含まれます。",
          ],
        },
        {
          title: "チャットパレット",
          paragraphs: [
            "特技、装備アイテム効果、所持アイテム一覧、各種判定、消耗表、財宝表などをまとめる想定です。",
          ],
        },
        {
          title: "補足",
          paragraphs: [
            "このページはあとから main_app.py の説明文に合わせて加筆できます。",
            "必要であれば、生成される JSON の項目ごとに見出しを分けると読みやすくなります。",
          ],
        },
      ]}
    />
  );
}
