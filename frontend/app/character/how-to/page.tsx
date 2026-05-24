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

const STEP_IMAGE_CLASS =
  "h-auto w-full max-w-3xl rounded-xl border border-neutral-200";
const NARROW_STEP_IMAGE_CLASS =
  "h-auto w-full max-w-[320px] rounded-xl border border-neutral-200";

const steps: Step[] = [
  {
    number: "1",
    title: "ログ･ホライズンTRPG冒険者窓口（キャラクターページ）",
    text: (
      <>
        <a
          href="https://lhrpg.com/lhz/top"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          ログ･ホライズンTRPG冒険者窓口
        </a>
        を開き、作成したいキャラクターのキャラクターページを開く。
      </>
    ),
    images: [
      {
        src: "/character/how-to/CharacterHowTo-01-CharacterPage.png",
        alt: "ログ・ホライズンTRPG冒険者窓口のキャラクターページ",
      },
    ],
  },
  {
    number: "2",
    title: "外部ツール参照の許可状態を確認",
    text: (
      <>
        外部ツールからの〈冒険者〉データ参照が許可されているか確認する。
        許可されている場合は、キャラクター情報の下部にその旨が表示される。
      </>
    ),
    images: [
      {
        src: "/character/how-to/CharacterHowTo-02-ExternalToolAllowed.png",
        alt: "外部ツールからの冒険者データ参照が許可されている状態",
      },
      {
        src: "/character/how-to/CharacterHowTo-03-ExternalToolNotAllowed.png",
        alt: "外部ツールからの冒険者データ参照が許可されていない状態",
      },
    ],
  },
  {
    number: "3",
    title: "基本情報変更画面を開く",
    text: (
      <>
        外部ツールからのデータ参照が許可されていない場合は、
        [基本情報を変更する] をクリックする。
      </>
    ),
    images: [
      {
        src: "/character/how-to/CharacterHowTo-04-BasicInfoButton.png",
        alt: "基本情報を変更するボタン",
      },
    ],
  },
  {
    number: "4",
    title: "外部ツール参照を許可する",
    text: (
      <>
        [外部ツールからの〈冒険者〉データ参照を許可する]
        にチェックを付けて、変更内容を確定する。
      </>
    ),
    images: [
      {
        src: "/character/how-to/CharacterHowTo-05-EnableExternalTool.png",
        alt: "外部ツールからの冒険者データ参照を許可する設定",
      },
    ],
  },
  {
    number: "5",
    title: "キャラクターURLまたはIDをコピーする",
    text: <>キャラクターページのURL、またはURL末尾のIDをコピーする。</>,
    images: [
      {
        src: "/character/how-to/CharacterHowTo-06-CopyCharacterUrl.png",
        alt: "キャラクターページのURLまたはキャラクターIDをコピーする画面",
      },
    ],
  },
  {
    number: "6",
    title: "ツールにURLまたはIDを入力する",
    text: (
      <>
        {TOOL_CONFIG.character.toolLabel}
        にキャラクターURLまたはキャラクターIDを入力する。
      </>
    ),
    images: [
      {
        src: "/character/how-to/CharacterHowTo-07-InputCharacterId.png",
        alt: `${TOOL_CONFIG.character.toolLabel}にキャラクターURLまたはキャラクターIDを入力する画面`,
      },
    ],
  },
  {
    number: "7",
    title: "コマンドを生成してコピーする",
    text: (
      <>
        [コマンドを生成する] をクリックする。
        コマンドの生成が完了したら、[コピー] をクリックして出力されたコマンドをコピーする。
      </>
    ),
    images: [
      {
        src: "/character/how-to/CharacterHowTo-08-CopyCommand.png",
        alt: "出力されたCCFOLIA用キャラクター駒作成コマンドをコピーする画面",
      },
    ],
  },
  {
    number: "8",
    title: "CCFOLIAにコマンドを貼り付ける",
    text: <>CCFOLIAの盤面に、コピーしたコマンドを貼り付ける。</>,
    images: [
      {
        src: "/character/how-to/CharacterHowTo-09-PasteToCcfolia.png",
        alt: "CCFOLIAにコピーしたコマンドを貼り付ける画面",
        narrow: true,
      },
    ],
  },
  {
    number: "9",
    title: "キャラクター駒の作成を確認する",
    text: <>キャラクター駒が作成されたことを確認する。</>,
    images: [
      {
        src: "/character/how-to/CharacterHowTo-10-CreatedPiece.png",
        alt: "CCFOLIAに作成されたキャラクター駒",
        narrow: true,
      },
    ],
  },
  {
    number: "10",
    title: "必要に応じて立ち絵を変更する",
    text: <>必要に応じて、作成された駒の立ち絵を変更する。</>,
    images: [
      {
        src: "/character/how-to/CharacterHowTo-11-ChangeStandee.png",
        alt: "立ち絵を変更したキャラクター駒",
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
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
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-2xl font-semibold">-{step.number}-</h2>
        <h3 className="text-lg font-semibold text-neutral-900">{step.title}</h3>
      </div>

      <p className="mb-6 text-sm leading-8 text-neutral-800">{step.text}</p>

      <div className="flex flex-wrap justify-center gap-8">
        {step.images.map((image, imageIndex) => (
          <StepImageFigure
            key={image.src}
            image={image}
            figureNumber={figureOffset + imageIndex + 1}
          />
        ))}
      </div>
    </section>
  );
}

export default function CharacterHowToPage() {
  return (
    <StaticPage
      current="character"
      title="使い方（詳細）"
      lead={`${TOOL_CONFIG.character.toolLabel}でコマンドを生成し、CCFOLIAに貼り付けるまでの流れを画像付きで説明します。`}
      backHref={TOOL_CONFIG.character.href}
    >
      <div className="space-y-12">
        {steps.map((step, stepIndex) => (
          <StepCard key={step.number} step={step} stepIndex={stepIndex} />
        ))}
      </div>
    </StaticPage>
  );
}
