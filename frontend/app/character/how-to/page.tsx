import type { ReactNode } from "react";
import StaticPage from "@/components/static-page";
import { EXTERNAL_LINKS, TOOL_CONFIG } from "@/components/tool-config";

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

const HOW_TO_IMAGES = {
  characterPage: {
    src: "/character/how-to/character-page.png",
    alt: "ログ・ホライズンTRPG冒険者窓口のキャラクターページ",
  },
  externalToolAllowed: {
    src: "/character/how-to/external-tool-allowed.png",
    alt: "外部ツールからの冒険者データ参照が許可されている状態",
  },
  externalToolNotAllowed: {
    src: "/character/how-to/external-tool-not-allowed.png",
    alt: "外部ツールからの冒険者データ参照が許可されていない状態",
  },
  basicInfoButton: {
    src: "/character/how-to/basic-info-button.png",
    alt: "基本情報を変更するボタン",
  },
  enableExternalTool: {
    src: "/character/how-to/enable-external-tool.png",
    alt: "外部ツールからの冒険者データ参照を許可する設定",
  },
  copyCharacterUrl: {
    src: "/character/how-to/copy-character-url.png",
    alt: "キャラクターページのURLまたはキャラクターIDをコピーする画面",
  },
  inputCharacterId: {
    src: "/character/how-to/input-character-id.png",
    alt: `${TOOL_CONFIG.character.toolLabel}にキャラクターURLまたはキャラクターIDを入力する画面`,
  },
  chatPaletteOptions: {
    src: "/character/how-to/chat-palette-options.png",
    alt: "チャットパレット出力オプションの画面",
  },
  copyCommand: {
    src: "/character/how-to/copy-command.png",
    alt: "出力されたCCFOLIA用キャラクター駒作成コマンドをコピーする画面",
  },
  pasteToCcfolia: {
    src: "/character/how-to/paste-to-ccfolia.png",
    alt: "CCFOLIAにコピーしたコマンドを貼り付ける画面",
    narrow: true,
  },
  createdPiece: {
    src: "/character/how-to/created-piece.png",
    alt: "CCFOLIAに作成されたキャラクター駒",
    narrow: true,
  },
  changeStandee: {
    src: "/character/how-to/change-standee.png",
    alt: "立ち絵を変更したキャラクター駒",
    narrow: true,
  },
} satisfies Record<string, StepImage>;

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
    images: [HOW_TO_IMAGES.characterPage],
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
    images: [HOW_TO_IMAGES.externalToolAllowed, HOW_TO_IMAGES.externalToolNotAllowed],
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
    images: [HOW_TO_IMAGES.basicInfoButton],
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
    images: [HOW_TO_IMAGES.enableExternalTool],
  },
  {
    number: "5",
    title: "キャラクターURLまたはIDをコピーする",
    text: <>キャラクターページのURL、またはURL末尾のIDをコピーする。</>,
    images: [HOW_TO_IMAGES.copyCharacterUrl],
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
    images: [HOW_TO_IMAGES.inputCharacterId],
  },
  {
    number: "6.5",
    title: "チャットパレット出力オプションを設定する（任意）",
    text: (
      <>
        この操作は任意です。設定が不要な場合は、「7. コマンドを生成してコピーする」へ進んでください。
        <br />
        ※ デフォルトでは、すべての内容が出力されます。
        <br />
        <br />
        [チャットパレット出力オプション] をクリックすると、メニューが展開されます。
        <br />
        一部の項目を除き、各項目のチェックをON/OFFすることで、出力する内容を設定できます。
        一括操作：[すべてON] [すべてOFF]をクリックで、チェックの一括操作をすることも可能です。
        <br />
        例：消耗表をOFFにすると、消耗表に関連する内容は出力されません。
        <br />
        <br />
        [レビューを更新] をクリックすると、チャットパレットに表示される内容を確認できます。
      </>
    ),
    images: [HOW_TO_IMAGES.chatPaletteOptions],
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
    images: [HOW_TO_IMAGES.copyCommand],
  },
  {
    number: "8",
    title: "CCFOLIAにコマンドを貼り付ける",
    text: <>CCFOLIAの盤面に、コピーしたコマンドを貼り付ける。</>,
    images: [HOW_TO_IMAGES.pasteToCcfolia],
  },
  {
    number: "9",
    title: "キャラクター駒の作成を確認する",
    text: <>キャラクター駒が作成されたことを確認する。</>,
    images: [HOW_TO_IMAGES.createdPiece],
  },
  {
    number: "10",
    title: "必要に応じて立ち絵を変更する",
    text: <>必要に応じて、作成された駒の立ち絵を変更する。</>,
    images: [HOW_TO_IMAGES.changeStandee],
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
      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-2xl font-semibold">-{step.number}-</span>
        <h2 className="text-2xl font-semibold">
          {step.title}
        </h2>
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

export default function CharacterHowToPage() {
  return (
    <StaticPage
      current="character"
      title="使い方（詳細）"
      /*lead={`${TOOL_CONFIG.character.toolLabel}でコマンドを生成し、CCFOLIAに貼り付けるまでの流れを画像付きで説明します。`}*/
      backHref={TOOL_CONFIG.character.href}
    >
      <section>
        <div className="mb-10 space-y-4">
          <p className="text-sm leading-8 text-neutral-800">
            「
              <a
                href={EXTERNAL_LINKS.lhzTop}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                ログ・ホライズンTRPG冒険者窓口
              </a>
            」
            に登録されたキャラクターデータを利用して、
            CCFOLIA用のキャラクター駒を作成するためのコマンドを生成する手順を画像付きで説明します。
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((step, stepIndex) => (
            <StepCard key={step.number} step={step} stepIndex={stepIndex} />
          ))}
        </div>
      </section>
    </StaticPage>
  );
}
