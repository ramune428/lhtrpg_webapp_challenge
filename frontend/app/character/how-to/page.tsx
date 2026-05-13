import Link from "next/link";
import AppNav from "@/components/app-nav";

type StepImage = {
  src: string;
  alt: string;
  caption?: string;
  narrow?: boolean;
};

type Step = {
  number: string;
  text: React.ReactNode;
  images: StepImage[];
};

const steps: Step[] = [
  {
    number: "1",
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
    text: <>キャラ駒作成ツールにキャラクターURLまたはキャラクターIDを入力する。</>,
    images: [
      {
        src: "/character/how-to/CharacterHowTo-07-InputCharacterId.png",
        alt: "キャラ駒作成ツールにキャラクターURLまたはキャラクターIDを入力する画面",
      },
    ],
  },
  {
    number: "7",
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

export default function CharacterHowToPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <AppNav current="character" />

        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-neutral-600 underline underline-offset-4"
          >
            ← キャラ駒作成ツールに戻る
          </Link>
        </div>

        <header className="mb-10">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            使い方（詳細）
          </h1>
          <p className="text-sm leading-8 text-neutral-700">
            キャラ駒作成ツールでコマンドを生成し、CCFOLIAに貼り付けるまでの流れを画像付きで説明します。
          </p>
        </header>

        <div className="space-y-12">
          {steps.map((step, stepIndex) => {
            const figureOffset = steps
              .slice(0, stepIndex)
              .reduce((total, currentStep) => total + currentStep.images.length, 0);

            return (
              <section
                key={step.number}
                className="rounded-2xl border border-neutral-300 p-6"
              >
                <h2 className="mb-4 text-2xl font-semibold">-{step.number}-</h2>

                <p className="mb-6 text-sm leading-8 text-neutral-800">
                  {step.text}
                </p>

                <div className="flex flex-wrap justify-center gap-8">
                  {step.images.map((image, imageIndex) => {
                    const figureNumber = figureOffset + imageIndex + 1;

                    return (
                      <figure
                        key={image.src}
                        className="flex flex-col items-center space-y-2"
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className={
                            image.narrow
                              ? "h-auto w-full max-w-[320px] rounded-xl border border-neutral-200"
                              : "h-auto w-full max-w-3xl rounded-xl border border-neutral-200"
                          }
                        />
                        <figcaption className="max-w-3xl text-center text-sm leading-6 text-neutral-600">
                          図{figureNumber}：{image.caption ?? image.alt}
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}