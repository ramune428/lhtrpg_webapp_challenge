import StaticPage from "@/components/static-page";

const HOW_TO_IMAGE_DIR = "/enemy/how-to";

const HOW_TO_IMAGES = {
  enemyOverview: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-01-Overview.png`,
  basicOperations: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-02-BasicOperations.png`,
  enemyInfoForm: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-03-EnemyInfoForm.png`,
  dropItemsForm: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-04-DropItemsForm.png`,
  abilityValuesForm: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-05-AbilityValuesForm.png`,
  skillOverview: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-06-SkillOverview.png`,
  skillExample: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-07-SkillExample.png`,
  skillInput: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-08-SkillInput.png`,
  outputOverview: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-09-OutPut.png`,
  xlsxOutput: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-10-XlsxOutput.png`,
  jsonOutput: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-11-JsonOutput.png`,
} as const;

type TextBlock = {
  type: "text";
  text: string;
};

type ImageBlock = {
  type: "image";
  label: string;
  src: string;
  alt: string;
  caption: string;
  maxWidth?: string;
};

const textBlock = (text: string): TextBlock => ({
  type: "text",
  text,
});

const imageBlock = (
  label: string,
  src: string,
  alt: string,
  maxWidth?: string,
): ImageBlock => ({
  type: "image",
  label,
  src,
  alt,
  caption: "",
  maxWidth,
});

const imageWithDescription = (
  label: string,
  src: string,
  alt: string,
  description: string,
): [ImageBlock, TextBlock] => [
  imageBlock(label, src, alt),
  textBlock(description),
];

const overviewImageDetails = (
  title: string,
  label: string,
  src: string,
  alt: string,
  description: string,
) => ({
  type: "details" as const,
  title,
  defaultOpen: false,
  blocks: imageWithDescription(label, src, alt, description),
});

export default function EnemyHowToPage() {
  return (
    <StaticPage
      current="enemy"
      title="使い方（詳細）"
      lead="エネミーデータ／駒作成ツール（CCFOLIA）の詳しい使い方を説明します。"
      backHref="/enemy"
      backLabel="エネミーデータ作成ツールに戻る"
      sections={[
        {
          title: "1. [エネミー情報]欄について",
          collapsible: true,
          defaultOpen: true,
          blocks: [
            overviewImageDetails(
              "画面全体を確認する",
              "エネミー情報タブ 全体",
              HOW_TO_IMAGES.enemyOverview,
              "エネミー情報タブ全体の説明画像",
              "エネミー情報タブ全体の画面です。各入力欄の位置を確認できます。",
            ),
            ...imageWithDescription(
              "基本操作の位置",
              HOW_TO_IMAGES.basicOperations,
              "タブ切り替え、入力ファイル読込、入力内容クリアの位置を示した画像",
              "タブ切り替え、入力ファイル読込、入力内容クリアの位置です。",
            ),
            { type: "heading", text: "① タブの切り替え" },
            {
              type: "text",
              text: "「エネミー情報」「特技情報」「データ出力」のタブを切り替えます。",
            },
            { type: "heading", text: "② 入力ファイルの読み込み" },
            {
              type: "text",
              text: "XLSXファイルまたはJSONファイルを読み込みます。公式データを読み込む場合は、「JSON（読み込み）について」を確認してください。",
            },
            { type: "heading", text: "③ 入力内容をクリア" },
            {
              type: "text",
              text: "入力内容を初期状態に戻します。特技情報も含めて、すべての入力内容が初期状態に戻ります。",
            },
            { type: "heading", text: "④ エネミー情報入力欄" },
            ...imageWithDescription(
              "入力欄の位置",
              HOW_TO_IMAGES.enemyInfoForm,
              "エネミー情報入力欄の説明画像",
              "エネミーの基本情報を入力する欄です。",
            ),
            {
              type: "bullets",
              items: [
                "名称：エネミーの名称を入力します。",
                "ランク：「モブ」「ノーマル」「ボス」「レイド」から選択します。",
                "CR：1～30に対応しています。",
                "タイプ：9つのタイプから選択します。「不明」は公式データの読み込み用です。",
                "大種族：8つの種族から選択します。「ギミック」を作成する場合は必ず選択してください。",
                "知名度：8つの知名度から選択します。",
                "識別難易度：CRと知名度から自動で計算されます。必要に応じて調整できます。",
                "初期タグ：ランク（ノーマルを除く）と大種族が自動で反映されます。",
                "タグ：任意のタグを入力します。",
                "メモ：自由記述欄です。CCFOLIAでは「キャラクターメモ」に反映されます。",
              ],
            },
            { type: "heading", text: "⑤ ドロップ入力欄" },
            ...imageWithDescription(
              "ドロップ品入力の位置",
              HOW_TO_IMAGES.dropItemsForm,
              "ドロップ入力欄の説明画像",
              "推奨ドロップ品を確認し、必要に応じて内容を調整する欄です。",
            ),
            {
              type: "bullets",
              items: [
                "推奨ドロップ品：CRとランク、または大種族「ギミック」の設定に基づいて表示されます。",
                "ドロップ品の数：入力した数に合わせて、入力欄（ドロップ品1、ドロップ品2…）が反映されます。",
                "ダイス：「固定」「1～6」（レイドの場合は「1～9」）から選択します。",
                "アイテム名：ドロップ品の名称を入力します。",
                "解説：必要に応じてドロップ品の説明を入力します。",
              ],
            },
            { type: "heading", text: "⑥ エネミー能力値欄" },
            ...imageWithDescription(
              "能力値入力の位置",
              HOW_TO_IMAGES.abilityValuesForm,
              "エネミー能力値欄の説明画像",
              "能力値や判定値を入力・調整する欄です。",
            ),
            {
              type: "bullets",
              items: [
                "基本能力値：STR、DEX、POW、INTを入力します。",
                "判定値：回避、抵抗の固定値とダイス数を入力します。判定表記は自動で表示されます。",
                "その他：物理防御力、魔法防御力、最大HP、ヘイト倍率、行動力、移動力、因果力を入力します。",
                "推奨能力値を反映：ランク、CR、タイプに基づく推奨能力値を反映します。",
              ],
            },
          ],
        },
        {
          title: "2. [特技情報]欄について",
          collapsible: true,
          defaultOpen: true,
          blocks: [
            overviewImageDetails(
              "画面全体を確認する",
              "特技情報タブ 全体",
              HOW_TO_IMAGES.skillOverview,
              "特技情報タブ全体の説明画像",
              "特技情報タブ全体の画面です。特技例、特技数、特技入力欄の位置を確認できます。",
            ),
            { type: "heading", text: "① タブの切り替え" },
            {
              type: "text",
              text: "「エネミー情報」「特技情報」「データ出力」のタブを切り替えます。",
            },
            { type: "heading", text: "② 特技の例" },
            ...imageWithDescription(
              "特技例の位置",
              HOW_TO_IMAGES.skillExample,
              "特技の例の説明画像",
              "CRとタイプに応じた特技例が表示されます。",
            ),
            {
              type: "text",
              text: "ダメージや命中値の目安として参考にしてください。",
            },
            { type: "heading", text: "③ 特技の入力" },
            ...imageWithDescription(
              "特技入力欄の位置",
              HOW_TO_IMAGES.skillInput,
              "特技入力欄の説明画像",
              "各特技の見出しを開いて、特技の内容を入力します。",
            ),
            {
              type: "text",
              text: "空欄部分は反映されないため、「-」を表示したい場合は「-」を入力してください。",
            },
            {
              type: "bullets",
              items: [
                "特技の数：数字に合わせて入力欄（特技1、特技2…）が反映されます。",
                "特技名：特技の名称を入力します。空欄の場合は、［データ出力］に反映されません。",
                "タグ：複数記述する場合は「,」で区切ります。空欄のままでも問題ありません。",
                "タイミング：任意のタイミングを選択します。",
                "命中値：ダイスも含めて入力します。空欄のままでも問題ありません。",
                "判定：回避、抵抗などを入力します。空欄のままでも問題ありません。",
                "対象：対象を入力します。空欄のままでも問題ありません。",
                "射程：射程を入力します。空欄のままでも問題ありません。",
                "制限：制限を入力します。空欄のままでも問題ありません。",
                "効果：自由記述欄です。空欄の場合は反映されません。",
              ],
            },
          ],
        },
        {
          title: "3. [データ出力]欄について",
          collapsible: true,
          defaultOpen: true,
          blocks: [
            ...imageWithDescription(
              "データ出力タブ 全体",
              HOW_TO_IMAGES.outputOverview,
              "データ出力タブ全体の説明画像",
              "データ出力タブ全体の画面です。エネミーデータ確認欄、コマンド出力欄、ファイル出力ボタンの位置を確認できます。",
            ),
            { type: "heading", text: "① タブの切り替え" },
            {
              type: "text",
              text: "「エネミー情報」「特技情報」「データ出力」のタブを切り替えます。",
            },
            { type: "heading", text: "② エネミーデータ確認" },
            {
              type: "text",
              text: "「エネミー情報」と「特技情報」で入力した内容が表示されます。ここに反映されていない内容は出力されません。",
            },
            { type: "heading", text: "③ CCFOLIA用コマンドの出力" },
            {
              type: "text",
              text: "CCFOLIA用のコマンドを生成し、コマンド出力欄に反映します。コピーした内容をCCFOLIAに貼り付けることで、キャラクター駒を作成できます。",
            },
            { type: "heading", text: "④ データファイル出力" },
            {
              type: "text",
              text: "エネミーデータをXLSXファイルまたはJSONファイルで出力します。ファイル名は「《エネミーの名称》_《CR》」です。",
            },
            imageBlock(
              "XLSXファイル出力",
              HOW_TO_IMAGES.xlsxOutput,
              "XLSXファイル出力例の画像",
              "760px",
            ),
            imageBlock(
              "JSONファイル出力",
              HOW_TO_IMAGES.jsonOutput,
              "JSONファイル出力例の画像",
              "760px",
            ),
          ],
        },
      ]}
    />
  );
}
