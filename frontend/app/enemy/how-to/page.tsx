import StaticPage from "@/components/static-page";

export default function EnemyHowToPage() {
  return (
    <StaticPage
      current="enemy"
      title="使い方（詳細）"
      lead="エネミーデータ/駒作成ツール（CCFOLIA）の詳しい使い方を説明します。"
      backHref="/enemy"
      backLabel="エネミーデータ作成ツールに戻る"
      sections={[
        {
          title: "1. [エネミー情報入力]欄について",
          collapsible: true,
          defaultOpen: true,
          blocks: [
            {
              type: "details",
              title: "画面全体",
              defaultOpen: true,
              blocks: [
                {
                  type: "image",
                  label: "エネミー情報入力タブ 全体",
                  src: "/enemy/how-to/EnemyHowTo-01-Overview.png",
                  alt: "エネミー情報入力タブの全体説明画像",
                  caption:
                    "エネミー情報入力タブでは、タブ切り替え、入力ファイルの読み込み、入力内容のクリア、エネミー情報、ドロップ品、能力値を操作します。",
                },
              ],
            },
            {
              type: "details",
              title: "基本操作",
              defaultOpen: true,
              blocks: [
                {
                  type: "image",
                  label: "基本操作",
                  src: "/enemy/how-to/EnemyHowTo-02-BasicOperations.png",
                  alt: "タブの切り替え、入力ファイルの読み込み、入力内容のクリアの説明画像",
                  caption:
                    "タブの切り替え、入力ファイルの読み込み、入力内容のクリアに関する操作です。",
                },
              ],
            },
            { type: "heading", text: "① タブの切り替え" },
            {
              type: "text",
              text: "「エネミー情報」「特技情報」「データ出力」を切り替えます。",
            },
            { type: "heading", text: "② 入力ファイルの読み込み" },
            {
              type: "text",
              text: "入力ファイル読込ボタンから、作業再開用のJSONファイルを読み込みます。読み込みが完了すると、画面上部に読み込み結果のメッセージが表示されます。",
            },
            { type: "heading", text: "③ 入力内容をクリア" },
            {
              type: "text",
              text: "入力内容を初期状態に戻します。現在の入力内容を残したい場合は、先にJSONファイルやXLSXファイルを出力してください。",
            },
            {
              type: "details",
              title: "④ エネミー情報入力欄",
              defaultOpen: true,
              blocks: [
                {
                  type: "image",
                  label: "エネミー情報入力欄",
                  src: "/enemy/how-to/EnemyHowTo-03-EnemyInfoForm.png",
                  alt: "エネミー情報入力欄の説明画像",
                  caption:
                    "名称、ランク、CR、タイプ、大種族、知名度、識別難易度、タグ、メモなどを入力します。",
                },
              ],
            },
            { type: "heading", text: "④ エネミー情報入力欄" },
            {
              type: "bullets",
              items: [
                "名称：エネミーの名称を入力。",
                "ランク：「モブ」「ノーマル」「ボス」「レイド」から選択。",
                "CR：1～30まで対応。＋－で選択 or 数字を入力。",
                "タイプ：9つのタイプから選択。「不明」はJSONファイル読み込み用。",
                "大種族：8つの種族から選択。「ギミック」を作成する場合は必ず選択。",
                "知名度：8つの知名度から選択。",
                "識別難易度：CRと知名度から自動で計算。調整可能。",
                "初期タグ：ランク（ノーマルを除く）と大種族が自動で反映される。",
                "タグ：任意のタグを入力。",
                "メモ：自由記述欄。CCFOLIAでは「キャラクターメモ」に反映される。",
              ],
            },
            {
              type: "details",
              title: "⑤ ドロップ入力欄",
              defaultOpen: true,
              blocks: [
                {
                  type: "image",
                  label: "ドロップ入力欄",
                  src: "/enemy/how-to/EnemyHowTo-04-DropItemsForm.png",
                  alt: "ドロップ入力欄の説明画像",
                  caption:
                    "CRとランク、またはギミック設定に応じて推奨ドロップ品が表示されます。必要に応じてドロップ品の内容を調整します。",
                },
              ],
            },
            { type: "heading", text: "⑤ ドロップ入力欄" },
            {
              type: "bullets",
              items: [
                "推奨ドロップ品：CRとランク、またはギミック設定に応じて表示される。",
                "ドロップ品の数：数字に合わせて入力欄（ドロップ品〇）が反映される。",
                "ダイス：「固定」「1～6」（レイドの場合「1～9」）から選択。",
                "アイテム名：ドロップ品の名称を入力。",
                "解説：必要に応じてドロップ品の説明を入力。",
              ],
            },
            {
              type: "details",
              title: "⑥ エネミー能力値欄",
              defaultOpen: true,
              blocks: [
                {
                  type: "image",
                  label: "エネミー能力値欄",
                  src: "/enemy/how-to/EnemyHowTo-05-AbilityValuesForm.png",
                  alt: "エネミー能力値欄の説明画像",
                  caption:
                    "ランク、CR、タイプから各能力値を算出します。必要に応じて値を調整できます。",
                },
              ],
            },
            { type: "heading", text: "⑥ エネミー能力値欄" },
            {
              type: "bullets",
              items: [
                "基本能力値：STR、DEX、POW、INTを入力。",
                "判定値：回避、抵抗の固定値とダイス数を入力。判定表記は自動で表示される。",
                "その他：物理防御力、魔法防御力、最大HP、ヘイト倍率、行動力、移動力、因果力を入力。",
                "推奨能力値を反映：ランク、CR、タイプに基づく推奨能力値を反映する。",
              ],
            },
          ],
        },
        {
          title: "2. [特技情報入力]欄について",
          collapsible: true,
          defaultOpen: true,
          blocks: [
            {
              type: "details",
              title: "GUI",
              defaultOpen: true,
              blocks: [
                {
                  type: "image",
                  label: "特技情報入力 GUI",
                  src: "/enemy/how-to/skill-info-gui.svg",
                  alt: "特技情報入力タブ全体のGUI",
                  caption:
                    "特技情報入力タブ全体の画像です。実際の画面キャプチャに差し替えてください。",
                },
              ],
            },
            {
              type: "details",
              title: "入力例",
              defaultOpen: true,
              blocks: [
                {
                  type: "image",
                  label: "特技情報入力 入力例",
                  src: "/enemy/how-to/skill-info-example.svg",
                  alt: "特技情報入力タブ全体の入力例",
                  caption:
                    "入力済みの特技情報入力タブ全体の画像です。実際の入力例画像に差し替えてください。",
                },
              ],
            },
            { type: "heading", text: "① タブの切り替え" },
            {
              type: "text",
              text: "「エネミー情報入力」「特技情報入力」「エネミーデータ出力」を切り替える。",
            },
            { type: "heading", text: "② 特技例" },
            {
              type: "text",
              text: "CRとタイプから特技例が反映される。",
            },
            { type: "heading", text: "③ 特技入力欄" },
            {
              type: "text",
              text: "空欄部分は反映されないので、「-」を表示したい場合は「-」を入力する。",
            },
            {
              type: "bullets",
              items: [
                "特技の数：数字に合わせて入力欄（特技〇）が反映される。",
                "特技名：特技の名称を入力。空欄の場合、[エネミーデータ出力]に反映されない。",
                "タグ：複数記述する場合は「,」で区切る。空欄可。",
                "タイミング：任意のタイミングを選択。",
                "命中値：ダイスも含めて入力。空欄可。",
                "判定：回避、抵抗を入力。空欄可。",
                "対象：対象を入力。空欄可。",
                "射程：射程を入力。空欄可。",
                "制限：制限を入力。空欄可。",
                "効果：自由記述欄。空欄不可。",
              ],
            },
          ],
        },
        {
          title: "3. [エネミーデータ出力]欄について",
          collapsible: true,
          defaultOpen: true,
          blocks: [
            {
              type: "details",
              title: "GUI",
              defaultOpen: true,
              blocks: [
                {
                  type: "image",
                  label: "エネミーデータ出力 GUI",
                  src: "/enemy/how-to/enemy-output-gui.svg",
                  alt: "エネミーデータ出力タブ全体のGUI",
                  caption:
                    "エネミーデータ出力タブ全体の画像です。実際の画面キャプチャに差し替えてください。",
                },
              ],
            },
            {
              type: "details",
              title: "入力例",
              defaultOpen: true,
              blocks: [
                {
                  type: "image",
                  label: "エネミーデータ出力 入力例",
                  src: "/enemy/how-to/enemy-output-example.svg",
                  alt: "エネミーデータ出力タブ全体の入力例",
                  caption:
                    "入力済みのエネミーデータ出力タブ全体の画像です。実際の入力例画像に差し替えてください。",
                },
              ],
            },
            { type: "heading", text: "① タブの切り替え" },
            {
              type: "text",
              text: "[エネミー情報入力]、[特技情報入力]、[エネミーデータ出力] を切り替える。",
            },
            { type: "heading", text: "② エネミーデータ確認" },
            {
              type: "text",
              text: "[エネミー情報入力]と[特技情報入力]で入力された値が反映される。ここに反映されていない場合、出力されない。",
            },
            { type: "heading", text: "③ CCFOLIA出力ボタン" },
            {
              type: "text",
              text: "[CCFOLIAコマンド出力欄]にコマンドが出力される。",
            },
            { type: "heading", text: "④ CCFOLIAコマンド出力欄" },
            {
              type: "text",
              text: "CCFOLIA用のコマンドが出力される。全て選択してCCFOLIA内に貼り付ければキャラクター駒が生成できる。",
            },
            { type: "heading", text: "⑤ XLSXファイル出力ボタン" },
            {
              type: "text",
              text: "エネミーデータがXLSX出力される。ファイル名は「《エネミーの名称》_《CR》.xlsx」",
            },
            {
              type: "details",
              title: "XLSX出力",
              defaultOpen: true,
              blocks: [
                {
                  type: "image",
                  label: "XLSX出力",
                  src: "/enemy/how-to/xlsx-output.svg",
                  alt: "XLSX出力サンプル",
                  caption:
                    "XLSX出力結果の画像です。実際のXLSX出力画像に差し替えてください。",
                },
              ],
            },
            { type: "heading", text: "⑥ JSONファイル出力ボタン" },
            {
              type: "text",
              text: "エネミーデータがJSON出力される。ファイル名は「《エネミーの名称》_《CR》.json」",
            },
            {
              type: "text",
              text: "※ 読み込むことで作業が再開できる。→ JSON（読み込み）について",
            },
            {
              type: "details",
              title: "JSON出力",
              defaultOpen: true,
              blocks: [
                {
                  type: "image",
                  label: "JSON出力",
                  src: "/enemy/how-to/json-output.svg",
                  alt: "JSON出力サンプル",
                  caption:
                    "JSON出力結果の画像です。実際のJSON出力画像に差し替えてください。",
                },
              ],
            },
          ],
        },
      ]}
    />
  );
}
