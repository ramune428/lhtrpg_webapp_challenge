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
        src: "/character/how-to/1.キャラクターページ.png",
        alt: "キャラクターページ",
      },
    ],
  },
  {
    number: "2",
    text: (
      <>
        外部ツールからの〈冒険者〉データ参照が許可されているか確認する。
        許可されている場合、キャラクター情報の下部に記載されている。
      </>
    ),
    images: [
      {
        src: "/character/how-to/2.外部ツール許可.png",
        alt: "外部ツールからデータ参照が許可されている場合",
      },
      {
        src: "/character/how-to/3.外部ツール未許可.png",
        alt: "外部ツールからデータ参照が許可されていない場合",
      },
    ],
  },
  {
    number: "3",
    text: (
      <>
        外部ツールからデータ参照が許可されていない場合は
        [基本情報を変更する] を開いて変更する。
        [外部ツールからの〈冒険者〉データ参照を許可する] にチェックをつける。
      </>
    ),
    images: [
      {
        src: "/character/how-to/4.基本情報変更.png",
        alt: "基本情報変更",
      },
    ],
  },
  {
    number: "4",
    text: <>URLの末尾のID（id=○○○○）をコピーする。</>,
    images: [
      {
        src: "/character/how-to/5.ID.png",
        alt: "IDをコピー",
      },
    ],
  },
  {
    number: "5",
    text: <>キャラクターIDを入力し、[コマンドを生成する] をクリックする。</>,
    images: [
      {
        src: "/character/how-to/6.ID入力&実行.png",
        alt: "IDの入力と実行",
      },
    ],
  },
  {
    number: "6",
    text: <>出力されたコマンドをすべてコピーする。</>,
    images: [
      {
        src: "/character/how-to/7.出力.png",
        alt: "出力されたコマンドをコピー",
      },
    ],
  },
  {
    number: "7",
    text: (
      <>
        CCFOLIAを開き、オブジェクトがない場所で右クリックし、
        [貼り付け] を選択する。
      </>
    ),
    images: [
      {
        src: "/character/how-to/8.貼り付け.png",
        alt: "コマンドの貼り付け",
        narrow: true,
      },
    ],
  },
  {
    number: "8",
    text: <>駒生成完了。立ち絵を変更して完成。</>,
    images: [
      {
        src: "/character/how-to/9.出力.png",
        alt: "完成イメージ1",
        narrow: true,
      },
      {
        src: "/character/how-to/10.立ち絵変更.png",
        alt: "完成イメージ2",
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
            href="/character/subpages"
            className="text-sm text-neutral-600 underline underline-offset-4"
          >
            ← キャラ駒作成ツール サブページへ戻る
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
          {steps.map((step) => (
            <section
              key={step.number}
              className="rounded-2xl border border-neutral-300 p-6"
            >
              <h2 className="mb-4 text-2xl font-semibold">-{step.number}-</h2>

              <p className="mb-6 text-sm leading-8 text-neutral-800">
                {step.text}
              </p>

              <div className="flex flex-wrap justify-center gap-8">
                {step.images.map((image) => (
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
                    {image.caption ? (
                      <figcaption className="text-center text-sm text-neutral-600">
                        {image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}