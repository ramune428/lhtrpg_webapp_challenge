import StaticPage from "@/components/static-page";
import type { ReactNode } from "react";
import { EXTERNAL_LINKS, TOOL_CONFIG } from "@/components/tool-config";

const IMAGE_BASE_PATH = "/enemy/official-data";

const officialDataImages = {
  officialJsonFile: `${IMAGE_BASE_PATH}/official-json-file.png`,
  jsonpText: `${IMAGE_BASE_PATH}/jsonp-text.png`,
  saveAsJsonFile: `${IMAGE_BASE_PATH}/save-as-json-file.png`,
  removeJsonpWrapper: `${IMAGE_BASE_PATH}/remove-jsonp-wrapper.png`,
  cleanJsonFile: `${IMAGE_BASE_PATH}/clean-json-file.png`,
  importButton: `${IMAGE_BASE_PATH}/import-button.png`,
  jsonImportResult: `${IMAGE_BASE_PATH}/json-import-result.png`,
} as const;

type StepImage = {
  src: string;
  alt: string;
  caption?: string;
};

type StepItem = {
  title: string;
  children: ReactNode;
  images?: StepImage[];
};

function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-neutral-900 underline underline-offset-4"
    >
      {children}
    </a>
  );
}

function KeyboardKey({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-neutral-300 bg-neutral-50 px-1.5 py-0.5 font-mono text-xs text-neutral-900">
      {children}
    </kbd>
  );
}

function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-md bg-neutral-900 px-4 py-3 text-sm leading-7 text-white">
      <code>{children}</code>
    </pre>
  );
}

function StepImageFigure({ image }: { image: StepImage }) {
  return (
    <figure className="mx-auto my-4 overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="w-full object-contain"
        loading="lazy"
      />
      {image.caption ? (
        <figcaption className="border-t border-neutral-200 px-4 py-2 text-xs leading-6 text-neutral-600">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function StepList({ steps }: { steps: StepItem[] }) {
  return (
    <ol className="space-y-12">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="rounded-2xl border border-neutral-300 p-6"
        >
          <h2 className="mb-4 text-2xl font-semibold">
            -{index + 1}- {step.title}
          </h2>

          <div className="mb-6 space-y-2 text-sm leading-8 text-neutral-800">
            {step.children}
          </div>

          {step.images?.map((image) => (
            <StepImageFigure key={image.src} image={image} />
          ))}
        </li>
      ))}
    </ol>
  );
}

function DownloadJsonSteps() {
  return (
    <StepList
      steps={[
        {
          title: "公式データベースでエネミーページを開く",
          images: [
            {
              src: officialDataImages.officialJsonFile,
              alt: "公式データベースのエネミーページでJSONボタンを確認する画面",
              caption: "エネミーページ左下の［JSON］ボタンを確認します。",
            },
          ],
          children: (
            <p>
              <TextLink href={EXTERNAL_LINKS.lhzDatabase}>
                ログ・ホライズンTRPG冒険者窓口 -データベース-
              </TextLink>
              から、読み込みたいエネミーのページを開きます。
            </p>
          ),
        },
        {
          title: "左下の［JSON］をクリックする",
          images: [
            {
              src: officialDataImages.jsonpText,
              alt: "JSONボタンをクリックしてJSONP形式のテキストが表示された画面",
              caption: "クリック後、新しいページでJSONP形式のテキストが表示されます。",
            },
          ],
          children: (
            <p>
              ［JSON］をクリックすると、新しいページに <code>jsonp(...)</code>
              の形式でテキストが表示されます。
            </p>
          ),
        },
        {
          title: "JSONファイルとして保存する",
          images: [
            {
              src: officialDataImages.saveAsJsonFile,
              alt: "名前を付けて保存で拡張子をjsonに変更する画面",
              caption: "ファイル名の拡張子を .json にして保存します。",
            },
          ],
          children: (
            <div className="space-y-2">
              <p>
                <KeyboardKey>Ctrl</KeyboardKey> + <KeyboardKey>S</KeyboardKey>
                で名前を付けて保存します。
              </p>
              <p>
                デフォルトでは拡張子が <code>.js</code> になる場合があるため、
                <code>.json</code> に変更して保存してください。
              </p>
              <p>
                うまく保存できない場合は、すべてのテキストをメモ帳にコピペしてから <code>.json</code> 形式で保存しても問題ありません。
              </p>
            </div>
          ),
        },
        {
          title: "保存したファイルをテキストエディタで開く",
          images: [
            {
              src: officialDataImages.removeJsonpWrapper,
              alt: "メモ帳で開いたJSONP形式のファイルの先頭と末尾を確認する画面",
              caption: "先頭の jsonp( と末尾の ); が残っている状態です。",
            },
          ],
          children: (
            <p>
              保存したファイルをテキストエディタで開きます。メモ帳、VSCode、サクラエディタなど、普段使用しているエディタで問題ありません。
              先頭の <code>jsonp(</code> と末尾の <code>);</code>
              が残っていることを確認します。
            </p>
          ),
        },
        {
          title: "先頭の jsonp( と末尾の ); を削除する",
          images: [
            {
              src: officialDataImages.cleanJsonFile,
              alt: "不要なJSONPの文字を削除してJSON形式に整えた画面",
              caption:
                "先頭の jsonp( と末尾の ); を削除し、JSONとして読み込める形に整えます。",
            },
          ],
          children: (
            <div className="space-y-3">
              <p>
                公式データベースから取得した内容は、そのままだとJSONではなくJSONP形式になっています。
                ツールで読み込むために、先頭の <code>jsonp(</code> と末尾の
                <code>);</code> を削除します。
              </p>

              <div className="space-y-2">
                <p className="font-semibold text-neutral-900">変更前</p>
                <CodeBlock>{`jsonp({
  "name": "エネミー名",
  "rank": "ノーマル"
});`}
                </CodeBlock>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-neutral-900">変更後</p>
                <CodeBlock>{`{
  "name": "エネミー名",
  "rank": "ノーマル"
}`}
                </CodeBlock>
              </div>
            </div>
          ),
        },
        {
          title: "上書き保存する",
          children: <p>編集後、ファイルを上書き保存します。</p>,
        },
      ]}
    />
  );
}

function UploadJsonSteps() {
  return (
    <StepList
      steps={[
        {
          title: "［入力ファイル読込］からJSONファイルを開く",
          images: [
            {
              src: officialDataImages.importButton,
              alt: `${TOOL_CONFIG.enemy.toolLabel}の入力ファイル読込ボタン`,
              caption: "エネミー情報入力欄の上部にある［入力ファイル読込］をクリックします。",
            },
          ],
          children: (
            <p>
              {TOOL_CONFIG.enemy.toolLabel}の［エネミー情報］欄で
              [入力ファイル読込]をクリックし、編集済みのJSONファイルを開きます。
            </p>
          ),
        },
        {
          title: "読み込み結果を確認する",
          images: [
            {
              src: officialDataImages.jsonImportResult,
              alt: "JSONファイルを読み込んだ後にエネミーデータが反映された画面",
              caption: "「JSONを読み込みました。」と表示され、名称やCRなどが反映されていれば読み込み完了です。",
            },
          ],
          children: (
            <p>
              画面上に「JSONを読み込みました。」と表示され、名称、CR、大種族、タグなどの内容が反映されていることを確認します。
            </p>
          ),
        },
      ]}
    />
  );
}

export default function EnemyOfficialDataPage() {
  return (
    <StaticPage
      current="enemy"
      title="公式データについて"
      backHref={TOOL_CONFIG.enemy.href}
      sections={[
        {
          title: "概要",
          hideTitle: true,
          paragraphs: [
            <p
              key="official-data-lead"
              className="text-sm leading-8 text-neutral-800"
            >
              公式データベースである「
              <TextLink href={EXTERNAL_LINKS.lhzDatabase}>
                ログ・ホライズンTRPG冒険者窓口 -データベース-
              </TextLink>
              」から取得したエネミーデータを、
              {TOOL_CONFIG.enemy.toolLabel}
              で読み込むための手順をまとめています。ただし、公式データベースから取得したファイルは、そのままでは読み込めない場合があるため、読み込む前にJSON形式へ整える必要があります。
            </p>,
          ],
        },
        {
          title: "データベースからJSONファイルを保存",
          paragraphs: [<DownloadJsonSteps key="download-json-steps" />],
        },
        {
          title: "JSONファイルの読み込み",
          paragraphs: [<UploadJsonSteps key="upload-json-steps" />],
        },
      ]}
    />
  );
}
