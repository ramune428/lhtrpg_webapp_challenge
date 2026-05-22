import type { ReactNode } from "react";
import StaticPage from "@/components/static-page";
import { TOOL_CONFIG } from "@/components/tool-config";

type StepImage = {
  src: string;
  alt: string;
  caption?: string;
  narrow?: boolean;
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

const STEP_IMAGE_CLASS =
  "h-auto w-full max-w-3xl rounded-xl border border-neutral-200";
const NARROW_STEP_IMAGE_CLASS =
  "h-auto w-full max-w-[520px] rounded-xl border border-neutral-200";

const steps: Step[] = [
  {
    number: "1",
    title: "画面全体を確認する",
    text: (
      <>
        {TOOL_CONFIG.enemy.toolLabel}
        の画面全体です。上部のタブを切り替えながら、
        エネミー情報、特技情報、データ出力の順に入力・確認します。
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.enemyOverview,
        alt: `${TOOL_CONFIG.enemy.toolLabel}のエネミー情報タブ全体`,
      },
    ],
  },
  {
    number: "2",
    title: "基本操作の位置を確認する",
    text: (
      <>
        タブ切り替え、入力ファイル読込、入力内容クリアの位置を確認します。
        XLSXファイルまたはJSONファイルを読み込む場合は、[入力ファイル読込]
        からファイルを選択します。
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.basicOperations,
        alt: "タブ切り替え、入力ファイル読込、入力内容クリアの位置",
      },
    ],
  },
  {
    number: "3",
    title: "エネミー情報を入力する",
    text: (
      <>
        「名称」「ランク」「CR」「タイプ」「大種族」「知名度」「タグ」「メモ」を入力してください。
        「識別難易度」は「CR」と「知名度」から自動計算されます。
        「初期タグ」は「ランク」と「大種族」に基づいて自動設定され、入力した「タグ」と合わせて出力されます。
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
    number: "4",
    title: "ドロップ品を入力する",
    text: (
      <>
        「ドロップ品の数」を設定すると入力欄が増減します。
        推奨ドロップ品を参考にしながら、「ダイス」、「アイテム名」、「解説」を入力してください。
        解説は必要な場合のみ入力してください。
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
    number: "5",
    title: "能力値を確認・調整する",
    text: (
      <>
        [推奨能力値を反映] をクリックすると、「ランク」「CR」「タイプ」に基づいて各能力値の推奨値が反映されます。
        各能力値は、必要に応じて手動で調整できます。
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
    number: "6",
    title: "特技情報タブを確認する",
    text: (
      <>
        [特技情報] タブを開き、特技例、特技の数、特技入力欄の位置を確認します。
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
    number: "7",
    title: "特技の例を確認する",
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
    number: "8",
    title: "特技を入力する",
    text: (
      <>
        「特技の数」を指定し、各特技の内容を入力します。
        「特技名」と「効果」が空欄の場合は、データ出力に反映されません。
        空欄ではなく「-」を表示したい場合は、「-」を入力してください。
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
    number: "9",
    title: "データ出力タブを確認する",
    text: (
      <>
        [データ出力] タブを開き、入力したエネミーデータの確認欄、
        CCFOLIA用コマンドの出力欄、ファイル出力ボタンの位置を確認します。
        ここに表示されていない内容は出力されません。
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
    number: "10",
    title: "CCFOLIA用コマンドを生成する",
    text: (
      <>
        [コマンドを生成する] をクリックすると、CCFOLIA用のコマンドが表示されます。
        コピーした内容をCCFOLIAに貼り付けると「マイキャラクター」として駒を作成できます。
      </>
    ),
    images: [
      {
        src: HOW_TO_IMAGES.outputOverview,
        alt: "CCFOLIA用コマンドの出力欄",
      },
    ],
  },
  {
    number: "11",
    title: "必要に応じてデータファイルを出力する",
    text: (
      <>
        エネミーデータはXLSXファイルまたはJSONファイルとして出力できます。
        出力したファイルは、後から読み込んで再編集できます。
        ファイル名は「エネミー名_CR」の形式になります。
      </>
    ),
    images: [
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
  return (
    <figure className="flex flex-col items-center space-y-2">
      <img
        src={image.src}
        alt={image.alt}
        className={image.narrow ? NARROW_STEP_IMAGE_CLASS : STEP_IMAGE_CLASS}
      />
      <figcaption className="max-w-3xl text-center text-sm leading-6 text-neutral-600">
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
      <h2 className="mb-3 text-2xl font-semibold">-{step.number}-</h2>

      <h3 className="mb-4 text-lg font-semibold text-neutral-900">
        {step.title}
      </h3>

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
