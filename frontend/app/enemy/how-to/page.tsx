import type { ReactNode } from "react";
import StaticPage from "@/components/static-page";
import { TOOL_CONFIG } from "@/components/tool-config";

type StepImage = {
  src: string;
  alt: string;
  caption?: string;
  narrow?: boolean;
  large?: boolean;
};

type Step = {
  number: string;
  title: string;
  text: ReactNode;
  images: StepImage[];
};

const HOW_TO_IMAGE_DIR = "/enemy/how-to";

const HOW_TO_IMAGES = {
  enemyOverview: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-01-Overview.png`,
  basicOperations: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-02-BasicOperations.png`,
  enemyInfoTabOverview: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-03-EnemyInfoTabOverview.png`,
  enemyInfoForm: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-04-EnemyInfoForm.png`,
  dropItemsForm: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-05-DropItemsForm.png`,
  abilityValuesForm: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-06-AbilityValuesForm.png`,
  skillOverview: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-07-SkillTabOverview.png`,
  skillExample: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-08-SkillExample.png`,
  skillInput: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-09-SkillInputForm.png`,
  outputOverview: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-10-DataOutputTabOverview.png`,
  enemyDataCheck: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-11-EnemyDataCheck.png`,
  ccfoliaOutput: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-12-CcfoliaOutput.png`,
  xlsxJsonOutputButtons: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-13-XlsxJsonOutputButtons.png`,
  xlsxOutput: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-14-XlsxOutput.png`,
  jsonOutput: `${HOW_TO_IMAGE_DIR}/EnemyHowTo-15-JsonOutput.png`,
} as const;

const STEP_IMAGE_CLASS =
  "h-auto w-full max-w-3xl rounded-xl border border-neutral-200";
const LARGE_STEP_FIGURE_CLASS =
  "relative left-1/2 flex w-[calc(100vw-2rem)] max-w-[1800px] -translate-x-1/2 flex-col items-center space-y-2";
const LARGE_STEP_IMAGE_CLASS =
  "h-auto w-full rounded-xl border border-neutral-200 shadow-sm";
const NARROW_STEP_IMAGE_CLASS =
  "h-auto w-full max-w-[520px] rounded-xl border border-neutral-200";

const steps: Step[] = [
  {
    number: "1",
    title: "画面全体",
    text: (
      <>
        {TOOL_CONFIG.enemy.toolLabel}
        の画面全体です。
        [エネミー情報]タブ、[特技情報]タブ、[データ出力]タブを切り替えながら作業を進めてください。
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.enemyOverview,
        alt: `${TOOL_CONFIG.enemy.toolLabel}の画面全体`,
        caption: `${TOOL_CONFIG.enemy.toolLabel}の画面全体`,
        large: true,
      },
    ],
  },
  {
    number: "2",
    title: "基本操作",
    text: (
      <>
        「タブの切り替え」「入力内容クリア」の位置を確認します。
        <br />
        この２つの項目はすべてのタブで表示されています。
        <br />
        <span className="mt-2 block pl-4">
          ・<strong>「タブの切り替え」</strong>：
          [エネミー情報]タブ、[特技情報]タブ、[データ出力]タブを切り替える
        </span>
        <span className="block pl-4">
          ・<strong>「入力内容クリア」</strong>：
          すべての入力内容をクリアする
        </span>
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.basicOperations,
        alt: "タブ切り替え、入力内容クリア",
      },
    ],
  },
  {
    number: "3",
    title: "[エネミー情報]タブ",
    text: (
      <>
        [エネミー情報]タブでは、エネミーの基本情報、ドロップ品、能力値を入力・確認します。
        <br />
        画面内の入力欄は、「エネミー情報欄」「ドロップ品欄」「エネミー能力値欄」に分かれています。
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.enemyInfoTabOverview,
        alt: "エネミー情報タブ全体",
      },
    ],
  },

  {
    number: "4",
    title: "エネミー情報の入力",
    text: (
      <>
        エネミー情報（
        「名称」「ランク」「CR」「タイプ」「大種族」「知名度」「タグ」「メモ」）を入力してください。
        <br />
        「識別難易度」は、「CR」と「知名度」から自動で計算されます。
        「初期タグ」は、「ランク」と「大種族」に基づいて自動設定され、最終的に「タグ」と合わせて出力されます。
        <br />
        「入力ファイル読込」から、XLSXファイルまたはJSONファイルを読み込むことができます。
        <br />
        公式データベース「ログ・ホライズンTRPG冒険者窓口 -データベース-」から取得したエネミーデータ（JSON）を読み込む場合は、
        データの一部を編集する必要があるため、事前に「公式データの読み込みについて」をご確認ください。
        
        <span className="mt-2 block pl-4">
          ・<strong>名称</strong>：エネミーの名称を入力する
        </span>
        <span className="block pl-4">
          ・<strong>ランク</strong>：「モブ」「ノーマル」「ボス」「レイド」から選択する
        </span>
        <span className="block pl-4">
          ・<strong>CR</strong>：1〜30の範囲で入力する
        </span>
        <span className="block pl-4">
          ・<strong>タイプ</strong>：9つのタイプから選択する　　※ 「不明」は公式データ（JSONファイル）読み込み用
        </span>
        <span className="block pl-4">
          ・<strong>大種族</strong>：8つの種族から選択する
        </span>
        <span className="block pl-4">
          ・<strong>知名度</strong>：8つの知名度から選択する
        </span>
        <span className="block pl-4">
          ・<strong>識別難易度</strong>：CRと知名度から自動で計算される（調整可能）
        </span>
        <span className="block pl-4">
          ・<strong>初期タグ</strong>：「ランク（ノーマルを除く）」と「大種族」が自動で設定される
        </span>
        <span className="block pl-4">
          ・<strong>タグ</strong>：複数のタグを入力する場合は「、」または「,」で区切る必要がある
        </span>
        <span className="block pl-4">
          ・<strong>メモ</strong>：自由記述欄　　※ CCFOLIAでは「キャラクターメモ」に反映される
        </span>
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.enemyInfoForm,
        alt: "エネミー情報入力欄",
      },
    ],
  },
  {
    number: "5",
    title: "ドロップ品の入力",
    text: (
      <>
        「ドロップ品の数」の設定でドロップ品入力欄が増減します。
        推奨ドロップ品（「CR」と「ランク」から自動で計算）を参考にしながら、「ダイス」「アイテム名」「解説」を入力してください。
        <span className="block pl-4">
          ・<strong>ダイス</strong>：「固定」「数字（1～10）」「以上」から選択する　　※ 7〜10は「レイド」エネミー専用
        </span>
        <span className="block pl-4">
          ・<strong>アイテム名</strong>：複数のタグを入力する場合は「、」または「,」で区切る必要がある
        </span>
        <span className="block pl-4">
          ・<strong>解説</strong>：自由記述欄
        </span>
        <span className="block pl-4">
          ・<strong>削除</strong>：ドロップ品の項目を削除する　　※ 繰り上がり
        </span>
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.dropItemsForm,
        alt: "ドロップ品入力欄",
      },
    ],
  },
  {
    number: "6",
    title: "能力値の確認・調整",
    text: (
      <>
        [推奨能力値を反映] をクリックすると、「ランク」「CR」「タイプ」に基づいて各能力値の推奨値が反映されます。
        各能力値は、必要に応じて手動で調整できます。詳細は＜計算式＞参照
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.abilityValuesForm,
        alt: "エネミー能力値欄",
      },
    ],
  },
  {
    number: "7",
    title: "[特技情報]タブ",
    text: (
      <>
        [特技情報] タブでは、特技の数、特技入力欄を設定します。
        大種族が「ギミック」の場合は、専用の特技《意志なき機構》が自動で追加されます。
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.skillOverview,
        alt: "特技情報タブ全体",
      },
    ],
  },
  {
    number: "8",
    title: "特技の例",
    text: (
      <>
        「CR」と「タイプ」に応じた特技例が表示されます。
        ダメージや命中値の目安として参考にしてください。
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.skillExample,
        alt: "特技の例",
      },
    ],
  },
  {
    number: "9",
    title: "特技を入力する",
    text: (
      <>
        「特技の数」を指定し、各特技の内容を入力します。
        「特技名」と「効果」が空欄の場合は、データ出力に反映されません。
        「-」を表示したい場合は、「-」を入力してください。
        <span className="block pl-4">
          ・<strong>特技名</strong>：特技の名称　　※ 空欄不可能
        </span>
        <span className="block pl-4">
          ・<strong>タグ</strong>：複数のタグを入力する場合は「、」または「,」で区切る必要がある
        </span>
        <span className="block pl-4">
          ・<strong>タイミング</strong>：任意のタイミングを選択する
        </span>
        <span className="block pl-4">
          ・<strong>命中値</strong>：ダイスも含めて入力する
        </span>
        <span className="block pl-4">
          ・<strong>判定</strong>：「回避」または「抵抗」を入力する
        </span>
        <span className="block pl-4">
          ・<strong>対象</strong>：対象を入力する
        </span>
        <span className="block pl-4">
          ・<strong>射程</strong>：射程を入力する
        </span>
        <span className="block pl-4">
          ・<strong>制限</strong>：制限を入力する
        </span>
        <span className="block pl-4">
          ・<strong>効果</strong>：自由記述欄　　※ 空欄不可能
        </span>
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.skillInput,
        alt: "特技入力欄",
      },
    ],
  },
  {
    number: "10",
    title: "[データ出力] タブ",
    text: (
      <>
        [データ出力] タブでは、入力したエネミーデータの確認、CCFOLIA用コマンドの生成、データファイルの出力ができます。
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.outputOverview,
        alt: "データ出力タブ全体",
      },
    ],
  },
  {
    number: "11",
    title: "入力したエネミーデータの確認",
    text: (
      <>
        [エネミー情報]タブと[特技情報]タブで入力したエネミーデータの確認ができます。
        <br />
        ここに表示されていない内容は出力されません。
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.enemyDataCheck,
        alt: "入力したエネミーデータの確認欄",
      },
    ],
  },
  {
    number: "12",
    title: "CCFOLIA用コマンドを生成",
    text: (
      <>
        [コマンドを生成する] をクリックすると、CCFOLIA用のコマンドが表示されます。
        コピーした内容をCCFOLIAに貼り付けると「マイキャラクター」として駒を作成できます。
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.ccfoliaOutput,
        alt: "CCFOLIA用コマンドの出力欄",
      },
    ],
  },
  {
    number: "13",
    title: "データファイルを出力",
    text: (
      <>
        エネミーデータはXLSXファイルまたはJSONファイルとして出力できます。
        出力したファイルは、後から読み込んで再編集できます。
        ファイル名は「エネミー名_CR」の形式になります。
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.xlsxJsonOutputButtons,
        alt: "XLSXファイル・JSONファイル出力ボタン",
      },
      {
        src: HOW_TO_IMAGES.xlsxOutput,
        alt: "XLSXファイル出力例",
        narrow: true,
      },
      {
        src: HOW_TO_IMAGES.jsonOutput,
        alt: "JSONファイル出力例",
        narrow: true,
      },
    ],
  },
];

function StepImageFigure({
  image,
  figureNumber,
}: {
  image: StepImage;
  figureNumber: number;
}) {
  const figureClassName = image.large
    ? LARGE_STEP_FIGURE_CLASS
    : "flex flex-col items-center space-y-2";

  const imageClassName = image.large
    ? LARGE_STEP_IMAGE_CLASS
    : image.narrow
      ? NARROW_STEP_IMAGE_CLASS
      : STEP_IMAGE_CLASS;

  const captionClassName = image.large
    ? "max-w-[1800px] text-center text-sm leading-6 text-neutral-600"
    : "max-w-3xl text-center text-sm leading-6 text-neutral-600";

  return (
    <figure className={figureClassName}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} className={imageClassName} />
      <figcaption className={captionClassName}>
        図{figureNumber}：{image.caption ?? image.alt}
      </figcaption>
    </figure>
  );
}

function StepCard({
  step,
  stepIndex,
}: {
  step: Step;
  stepIndex: number;
}) {
  const figureOffset = steps
    .slice(0, stepIndex)
    .reduce((total, currentStep) => total + currentStep.images.length, 0);

  return (
    <section className="rounded-2xl border border-neutral-300 p-6">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="mb-3 text-2xl font-semibold">-{step.number}-</h2>
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">{step.title}</h3>
      </div>

      <p className="mb-6 text-sm leading-8 text-neutral-800">{step.text}</p>

      <div className="flex flex-wrap justify-center gap-8">
        {step.images.map((image, imageIndex) => (
          <StepImageFigure
            key={`${step.number}-${image.src}-${imageIndex}`}
            image={image}
            figureNumber={figureOffset + imageIndex + 1}
          />
        ))}
      </div>
    </section>
  );
}

export default function EnemyHowToPage() {
  return (
    <StaticPage
      current="enemy"
      title="使い方（詳細）"
      lead={`${TOOL_CONFIG.enemy.toolLabel}でエネミーデータを作成し、CCFOLIAに貼り付けるまでの流れを画像付きで説明します。`}
      backHref={TOOL_CONFIG.enemy.href}
    >
      <div className="space-y-12">
        {steps.map((step, stepIndex) => (
          <StepCard key={step.number} step={step} stepIndex={stepIndex} />
        ))}
      </div>
    </StaticPage>
  );
}
