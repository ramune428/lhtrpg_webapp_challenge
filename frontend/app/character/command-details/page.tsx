import type { ReactNode } from "react";
import StaticPage from "@/components/static-page";
import { TOOL_CONFIG } from "@/components/tool-config";

type CommandSummary = {
  title: string;
  items: string[];
  image: {
    src: string;
    alt: string;
  };
};

const IMAGE_BASE_PATH = "/character/command-details";

const commandDetailsImages = {
  basicInfo: `${IMAGE_BASE_PATH}/basic-info.png`,
  status: `${IMAGE_BASE_PATH}/status.png`,
  parameters: `${IMAGE_BASE_PATH}/parameters.png`,
  chatPalette: `${IMAGE_BASE_PATH}/chat-palette.png`,
} as const;

const IMAGE_CLASS =
  "h-auto w-full rounded-xl border border-neutral-200 shadow-sm";
const BODY_TEXT_CLASS = "text-sm leading-8 text-neutral-800";
const ORDERED_LIST_CLASS =
  "list-decimal space-y-2 pl-8 text-sm leading-8 text-neutral-900";
const DETAIL_CARD_CLASS =
  "rounded-xl border border-neutral-200 px-5 py-4";
const DETAIL_SUMMARY_CLASS = "cursor-pointer select-none font-medium";

const commandSummaries: CommandSummary[] = [
  {
    title: "基本情報",
    items: [
      "名前",
      "イニシアチブ（行動力）",
      "キャラクターメモ（説明欄）",
      "参考URL（キャラクター情報）",
    ],
    image: {
      src: commandDetailsImages.basicInfo,
      alt: "CCFOLIAのキャラクター編集画面の基本情報",
    },
  },
  {
    title: "ステータス",
    items: ["HP", "再生", "障壁", "疲労", "ヘイト", "因果力"],
    image: {
      src: commandDetailsImages.status,
      alt: "CCFOLIAのキャラクター編集画面のステータス",
    },
  },
  {
    title: "パラメータ",
    items: [
      "CR",
      "攻撃力",
      "魔力",
      "回復力",
      "物防",
      "魔防",
      "各能力基本値",
      "各能力値",
    ],
    image: {
      src: commandDetailsImages.parameters,
      alt: "CCFOLIAのキャラクター編集画面のパラメータ",
    },
  },
];

const skillTimingOrder = [
  "常時",
  "セットアップ",
  "イニシアチブ",
  "ムーブ",
  "マイナー",
  "メジャー",
  "行動",
  "インスタント",
  "ダメージロール",
  "判定直前",
  "判定直後",
  "クリンナップ",
  "プリプレイ",
  "ブリーフィング",
  "本文",
  "基本動作",
];

function CommandImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mt-6 flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={`${IMAGE_CLASS} max-w-[720px]`} />
    </div>
  );
}

function CommandSummarySection({ summary }: { summary: CommandSummary }) {
  return (
    <section>
      <h3 className="mb-4 text-2xl font-bold">{summary.title}</h3>

      <ol className={ORDERED_LIST_CLASS}>
        {summary.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>

      <CommandImage src={summary.image.src} alt={summary.image.alt} />
    </section>
  );
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className={DETAIL_CARD_CLASS}>
      <summary className={DETAIL_SUMMARY_CLASS}>{title}</summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function NestedDetail({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details>
      <summary className={DETAIL_SUMMARY_CLASS}>{title}</summary>
      <div className="mt-3 pl-6">{children}</div>
    </details>
  );
}

function DamageFormulaDetails() {
  return (
    <ol className="list-decimal space-y-6 pl-8">
      <li>
        <div className="font-medium">被ダメージ（物理）計算</div>

        <p className="mt-1">
          ※ 赤字の部分に、その場の数値を入力して使用してください。
        </p>

        <p className="mt-1">
          コマンド： C(
          <span className="font-bold text-red-500">
            エネミーのダメージ
          </span>
          {" "}- {"{物防}"} -{" "}
          <span className="font-bold text-red-500">軽減</span>)
        </p>

        <ul className="mt-2 list-disc space-y-1 pl-6">
          <li>エネミーのダメージ：エネミーの物理ダメージの値</li>
          <li>軽減：軽減値</li>
        </ul>

        <p className="mt-2">
          例：60点の物理ダメージを受け、軽減が15ある場合
          <br />
          C(<span className="font-bold text-red-500">60</span>
          {" "}- {"{物防}"} -{" "}
          <span className="font-bold text-red-500">15</span>)
          と入力する。
        </p>
      </li>

      <li>
        <div className="font-medium">被ダメージ（魔法）計算</div>

        <p className="mt-1">
          ※ 赤字の部分に、その場の数値を入力して使用してください。
        </p>

        <p className="mt-1">
          コマンド： C(
          <span className="font-bold text-red-500">
            エネミーのダメージ
          </span>
          {" "}- {"{魔防}"} -{" "}
          <span className="font-bold text-red-500">軽減</span>)
        </p>

        <ul className="mt-2 list-disc space-y-1 pl-6">
          <li>エネミーのダメージ：エネミーの魔法ダメージの値</li>
          <li>軽減：軽減値</li>
        </ul>

        <p className="mt-2">
          例：40点の魔法ダメージを受け、軽減が10ある場合
          <br />
          C(<span className="font-bold text-red-500">40</span>
          {" "}- {"{魔防}"} -{" "}
          <span className="font-bold text-red-500">10</span>)
          と入力する。
        </p>
      </li>

      <li>
        <div className="font-medium">残HP計算</div>

        <p className="mt-1">
          ※ 赤字の部分に、その場の数値を入力して使用してください。
        </p>

        <p className="mt-1">
          コマンド： C(({"{HP}"} + {"{障壁}"}) -{" "}
          <span className="font-bold text-red-500">ダメージ</span>
          {" "}- {"{ヘイト}"} *{" "}
          <span className="font-bold text-red-500">ヘイト倍率</span>
          {" "}- <span className="font-bold text-red-500">その他</span>)
        </p>

        <ul className="mt-2 list-disc space-y-1 pl-6">
          <li>ダメージ：実際に受けたダメージ量</li>
          <li>ヘイト倍率：エネミーのヘイト倍率（ヘイトアンダーの場合は0）</li>
          <li>その他：追撃や弱点などの強度</li>
        </ul>

        <p className="mt-2">
          ヘイトアンダーの時にはヘイトダメージは発生しないので、
          <span className="font-bold text-red-500"> ヘイト倍率 = 0</span>
          でOK。
        </p>

        <div className="mt-2">
          <p>例：30点のダメージを受け、ヘイトアンダーで、追加の補正がない場合</p>
          <p className="mt-1">
            コマンド： C(({"{HP}"} + {"{障壁}"}) -{" "}
            <span className="font-bold text-red-500">30</span>
            {" "}- {"{ヘイト}"} *{" "}
            <span className="font-bold text-red-500">0</span>
            {" "}- <span className="font-bold text-red-500">0</span>)
          </p>
          <p className="mt-1">と入力する。</p>
        </div>
      </li>
    </ol>
  );
}

function SkillDetails() {
  return (
    <div className="space-y-4">
      <p className="mb-3 text-neutral-800">
        特技のチャットパレットは「特技名」、「特技情報」、「特技効果」、「特技コマンド」の４つから構成されています。
        <br/>
        特技名：習得している特技名と特技タグを出力します。
        <br/>
        特技情報：SRやタイミング、射程など特技毎の情報を出力します。
        <br/>
        特技効果：特技の効果を出力します。
        <br/>
        特技コマンド：判定とダイスロールをCCFOLIA用のコマンドとして出力します。
      </p>
      <NestedDetail title="記述順">
        <p className="mb-3 text-neutral-800">
          特技は、以下の順番でチャットパレットに出力されます。
        </p>

        <ol className="list-decimal columns-1 gap-x-12 space-y-2 pl-6 sm:columns-2">
          {skillTimingOrder.map((timing) => (
            <li key={timing} className="break-inside-avoid">
              {timing}
            </li>
          ))}
        </ol>
      </NestedDetail>

      <NestedDetail title="ダメージロール">
        <div className="space-y-3">
          <p>
            ダメージロールには、その特技単独のダイスや計算式のみを反映しています。
            マスタリー系やスタイルなどによる補正は、必要に応じて修正してください。
          </p>

          <div>
            <p>現在表示できるダメージロールは、以下の内容です。</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>直接攻撃を除くダメージ</li>
              <li>HP回復</li>
              <li>弱点、軽減を除く強度が存在するBS・CS</li>
            </ul>
          </div>

          <p>
            追加効果（〔因果力〕、〔CR11〕、〔マイナー〕など）は条件毎に出力します。
          </p>
        </div>
      </NestedDetail>
    </div>
  );
}

function ChatPaletteDetails() {
  return (
    <section>
      <h3 className="mb-4 text-2xl font-bold">チャットパレット</h3>

      <div className="mb-8 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={commandDetailsImages.chatPalette}
          alt="CCFOLIAのキャラクター編集画面のチャットパレット"
          className={`${IMAGE_CLASS} max-w-[720px]`}
        />
      </div>

      <div className="space-y-4 text-sm leading-8 text-neutral-900">
        <DetailCard title="戦闘の基本">
          <ol className="list-decimal space-y-2 pl-8">
            <li>命中値</li>
            <li>回避（ヘイトトップ / ヘイトアンダー）</li>
            <li>抵抗（ヘイトトップ / ヘイトアンダー）</li>
          </ol>
        </DetailCard>

        <DetailCard title="被ダメージ計算用">
          <DamageFormulaDetails />
        </DetailCard>

        <DetailCard title="判定がある特技">
          <p>
            命中判定や、特技ごとに指定された判定値を使うコマンドを出力します。
            判定が[本文]、[判定なし]、[自動成功]、[-]は、この項目には出力されません。
            [特技名]と[特技コマンド（判定、ダイスロール）]
            特技の効果や状況によって修正が入る場合は、必要に応じて出力されたコマンドを調整してください。
            
          </p>
        </DetailCard>

        <DetailCard title="補助計算の特技">
          <p>
            ダメージ、HP回復、BS・CSの強度など、数値計算が必要な特技は補助計算用のコマンドとして出力されます。
            特技単体で確認できるダイスや計算式をもとに、チャットパレットへ計算用コマンドを出力します。
            実際に使用する前に、必要に応じて数値や式を修正してください。
          </p>
        </DetailCard>

        <DetailCard title="特技">
          <SkillDetails />
        </DetailCard>

        <DetailCard title="基本動作">
          <p>
            特技のチャットパレットと同様に「特技名」、「特技情報」、「特技効果」、「特技コマンド」の４つから構成されています。
            <br/>
            出力される内容は[基本動作]タグを持つ16の特技が出力されます。
          </p>
        </DetailCard>

        <DetailCard title="装備アイテム効果">
          <p>装備中のアイテム名、タグ、効果が出力されます。</p>
        </DetailCard>

        <DetailCard title="所持アイテム一覧">
          <p>
            所持品スロットに登録されているアイテム名、タグが出力されます。
            <br/>
            食料や水薬などの「タイミング」、「効果」がある場合には一緒に出力されます。
          </p>
        </DetailCard>

        <DetailCard title="各種判定">
          <p>運動値、耐久値など能力値に関係する判定が出力されます。</p>
        </DetailCard>

        <DetailCard title="消耗品">
          <p>消耗品ロールのコマンドが出力されます。</p>
        </DetailCard>

        <DetailCard title="財宝表">
          <p>財宝表ロールのコマンドが出力されます。</p>
        </DetailCard>
      </div>
    </section>
  );
}

export default function CharacterCommandDetailsPage() {
  return (
    <StaticPage
      current="character"
      title="コマンド内訳"
      backHref={TOOL_CONFIG.character.href}
    >
      <section>
        <div className="mb-10 space-y-4">
          <p className={BODY_TEXT_CLASS}>
            キャラクター駒作成時に出力されるCCFOLIA用コマンドの内訳を確認できます。
            ステータス、パラメータ、チャットパレットなど、項目ごとの内容を説明します。
          </p>
        </div>

        <div className="space-y-12">
          {commandSummaries.map((summary) => (
            <CommandSummarySection key={summary.title} summary={summary} />
          ))}

          <ChatPaletteDetails />
        </div>
      </section>
    </StaticPage>
  );
}
