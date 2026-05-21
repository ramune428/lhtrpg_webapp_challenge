import StaticPage from "@/components/static-page";
import type { ReactNode } from "react";

const ENEMY_TOOL_URL =
  "https://www.notion.so/LHTRPG-CCFOLIA-cbfb65dea1b247dd95fc37f0ba3c5660?pvs=21";

const DETAIL_HOW_TO_URL =
  "https://www.notion.so/3f33033ffc2b48d19ec40bcef1883735?pvs=21";

const LHTRPG_DATABASE_URL = "https://lhrpg.com/lhz/database";

type StepItem = {
  title: string;
  children: ReactNode;
  imageLabel?: string;
  imageCaption?: string;
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

function NoticeBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
      <p className="mb-1 font-semibold text-neutral-900">{title}</p>
      <div className="space-y-2 text-sm leading-8 text-neutral-800">{children}</div>
    </div>
  );
}

function ImagePlaceholder({
  label,
  caption,
}: {
  label: string;
  caption?: string;
}) {
  return (
    <figure className="mt-4 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4">
      <div className="flex min-h-[180px] items-center justify-center rounded-md border border-neutral-200 bg-white px-4 text-center">
        <p className="text-sm font-semibold text-neutral-800">{label}</p>
      </div>
      {caption ? (
        <figcaption className="mt-2 text-xs leading-6 text-neutral-600">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function StepList({ steps }: { steps: StepItem[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="rounded-lg border border-neutral-200 bg-white px-4 py-4"
        >
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <h3 className="text-base font-semibold leading-7 text-neutral-900">
                {step.title}
              </h3>
              <div className="space-y-2 text-sm leading-8 text-neutral-800">
                {step.children}
              </div>
              {step.imageLabel ? (
                <ImagePlaceholder
                  label={step.imageLabel}
                  caption={step.imageCaption}
                />
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function LinkArea() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Tool
        </p>
        <p className="mt-1 text-sm leading-7">
          エネミーデータ作成ツールに戻る →{" "}
          <TextLink href={ENEMY_TOOL_URL}>
            -LHTRPG- エネミーデータ/駒作成ツール（CCFOLIA）
          </TextLink>
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Guide
        </p>
        <p className="mt-1 text-sm leading-7">
          使い方の詳細はこちら →{" "}
          <TextLink href={DETAIL_HOW_TO_URL}>使い方（詳細）</TextLink>
        </p>
      </div>
    </div>
  );
}

function DownloadJsonSteps() {
  return (
    <StepList
      steps={[
        {
          title: "ダウンロードしたいエネミーのページを開く",
          imageLabel: "画像：公式データベースでエネミーページを開いた画面",
          imageCaption:
            "画像を配置する場合は、この枠を公式データベースのエネミーページ画面に差し替えてください。",
          children: (
            <p>
              <TextLink href={LHTRPG_DATABASE_URL}>
                ログ・ホライズンTRPG冒険者窓口 -データベース-
              </TextLink>
              から、読み込みたいエネミーのページを開きます。
            </p>
          ),
        },
        {
          title: "左下の［JSON］をクリックする",
          imageLabel: "画像：エネミーページ左下の JSON リンク",
          imageCaption:
            "［JSON］をクリックすると、新しいページでJSONP形式のテキストが開きます。",
          children: <p>クリック後、新しいページが開かれます。</p>,
        },
        {
          title: "JSONファイルとして保存する",
          imageLabel: "画像：名前を付けて保存で拡張子を .json に変更する画面",
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
                うまく保存できない場合は、テキストをすべて選択して
                <KeyboardKey>Ctrl</KeyboardKey> + <KeyboardKey>A</KeyboardKey>
                、メモ帳へ貼り付けてから <code>.json</code> 形式で保存しても問題ありません。
              </p>
            </div>
          ),
        },
        {
          title: "保存したファイルをメモ帳で開く",
          imageLabel: "画像：保存した JSON ファイルをメモ帳で開く画面",
          children: <p>保存したファイルを右クリックし、メモ帳で開きます。</p>,
        },
        {
          title: "先頭の jsonp( と末尾の ); を削除する",
          imageLabel: "画像：jsonp( と ); を削除する前後の画面",
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
});`}</CodeBlock>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-neutral-900">変更後</p>
                <CodeBlock>{`{
  "name": "エネミー名",
  "rank": "ノーマル"
}`}</CodeBlock>
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
          title: "Upload JSON からJSONファイルを開く",
          imageLabel: "画像：エネミー情報入力欄の Upload JSON ボタン",
          children: (
            <p>
              ツールの［エネミー情報入力］欄の一番上にある
              ［Upload JSON］から、編集済みのJSONファイルを開きます。
            </p>
          ),
        },
        {
          title: "Download CSV / Download JSON が表示されることを確認する",
          imageLabel: "画像：エネミーデータ出力欄に Download CSV / Download JSON が表示された画面",
          children: (
            <p>
              ［エネミーデータ出力］欄の最後に［Download CSV］［Download JSON］が表示されていれば、読み込み完了です。
            </p>
          ),
        },
      ]}
    />
  );
}

export default function EnemyJsonPage() {
  return (
    <StaticPage
      current="enemy"
      title="JSON（読み込み）について"
      lead="公式データベースから取得したエネミーデータを、エネミーデータ作成ツールで読み込むための手順をまとめています。"
      backHref="/enemy/subpages"
      backLabel="エネミーデータ サブページ"
      sections={[
        {
          title: "関連リンク",
          paragraphs: [<LinkArea key="link-area" />],
        },
        {
          title: "はじめに",
          paragraphs: [
            "このツールでは、JSONファイルのダウンロードおよびアップロードにより、疑似的なセーブ機能を実現しています。",
            <p key="intro-database">
              それに伴い、
              <TextLink href={LHTRPG_DATABASE_URL}>
                ログ・ホライズンTRPG冒険者窓口 -データベース-
              </TextLink>
              のエネミーデータも読み込むことができます。ただし、公式データベースから取得したファイルは、そのままでは読み込めない場合があるため、読み込む前にJSON形式へ整える必要があります。
            </p>,
            <NoticeBlock key="intro-notice" title="このページで扱うこと">
              <p>
                公式データベースからJSONファイルを保存し、先頭と末尾の不要な文字を削除してから、エネミーデータ作成ツールへアップロードするまでの流れを説明します。
              </p>
            </NoticeBlock>,
          ],
        },
        {
          title: "データベースからJSONファイルをダウンロード",
          paragraphs: [<DownloadJsonSteps key="download-json-steps" />],
        },
        {
          title: "JSONファイルの読み込み",
          paragraphs: [
            <UploadJsonSteps key="upload-json-steps" />,
            <NoticeBlock key="upload-notice" title="CSV出力時の注意">
              <p>
                公式のエネミーデータでは全角記号が使用されているため、CSVの文字コードでは表示できない場合があります。
                その場合、読み込み時にエラーが発生し、［Download CSV］［Download JSON］が表示されないことがあります。
              </p>
              <p>
                ただし、CCFOLIAコマンド自体は生成できる場合があるため、CSVやJSONのダウンロードが不要であれば、そのまま使用しても問題ありません。
              </p>
            </NoticeBlock>,
          ],
        },
        {
          title: "画像の差し替えについて",
          paragraphs: [
            "このページ内の画像枠は、Notionの画像をそのまま参照せず、Webアプリ側で画像を管理する前提のプレースホルダーにしています。",
            "実画像を入れる場合は、public 配下に画像を配置し、ImagePlaceholder を通常の img 表示に差し替えるか、StaticPage 側の image block を使って表示してください。",
          ],
        },
      ]}
    />
  );
}
