import StaticPage from "@/components/static-page";

export default function CharacterHowToPage() {
  return (
    <StaticPage
      current="character"
      title="使い方（詳細）"
      lead="元の Streamlit 版の説明ページをもとに、まずは文章ベースで移植した土台です。画像はあとから public フォルダへ追加できます。"
      backHref="/character/subpages"
      backLabel="キャラ駒作成ツール サブページ"
      sections={[
        {
          title: "1. キャラクターページを開く",
          paragraphs: [
            "ログ･ホライズンTRPG冒険窓口を開き、作成したいキャラクターのページを表示します。",
          ],
        },
        {
          title: "2. 外部ツール参照の許可を確認する",
          paragraphs: [
            "外部ツールからの〈冒険者〉データ参照が許可されているか確認します。",
            "許可されていない場合は、基本情報の設定画面から参照を許可してください。",
          ],
        },
        {
          title: "3. URLまたはIDを入力する",
          paragraphs: [
            "キャラクターページのURL全体、または末尾のIDを入力します。",
            "Web 版では URL / ID のどちらでも受け付ける構成にすると使いやすいです。",
          ],
        },
        {
          title: "4. コマンドを生成する",
          paragraphs: [
            "入力後に実行すると、CCFOLIAに貼り付けるための駒作成コマンドが生成されます。",
          ],
        },
        {
          title: "5. CCFOLIAへ貼り付ける",
          paragraphs: [
            "生成結果をコピーし、CCFOLIA上で貼り付けて駒を作成します。",
          ],
        },
        {
          title: "画像の配置先",
          paragraphs: [
            "手順画像を使う場合は public/character/how-to/ 配下へ配置してください。",
            "元ファイル名をそのまま使うなら、1.キャラクターページ.png のように並べると管理しやすいです。",
          ],
        },
      ]}
    />
  );
}
