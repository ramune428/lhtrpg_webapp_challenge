import Link from "next/link";
import SectionCard from "@/components/ui/section-card";

const textClass = "text-sm leading-8 text-neutral-800";
const linkClass = "font-medium text-neutral-700 underline underline-offset-4";

export function CharacterPageHeader() {
  return (
    <header className="mb-10">
      <p className="mb-3 text-sm font-semibold text-neutral-500">
        Character Piece Generator
      </p>
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
        LHTRPG- キャラ駒作成ツール（CCFOLIA）
      </h1>

      <p className={textClass}>
        このキャラ駒作成ツールは「
        <a
          href="https://lhrpg.com/lhz/top"
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          ログ・ホライズンTRPG冒険者窓口
        </a>
        」より提供されているJSONデータを利用しています。
      </p>
    </header>
  );
}

export function CharacterNoticeSection() {
  return (
    <SectionCard title="重要なお知らせ" tone="notice" className="mb-8">
      <p className={textClass}>
        「外部ツールからの&lt;冒険者&gt;データ参照を許可する」にチェックがついていても、
        JSONデータを取得できず、エラーが発生する場合があります。
        一度チェックを外して、「外部ツールからの&lt;冒険者&gt;データ参照を許可する」を更新してください。
        <br />
        ※ 古いキャラクターはエラーになる傾向があります。
      </p>
    </SectionCard>
  );
}

export function EnemyToolLinkSection() {
  return (
    <SectionCard className="mb-10">
      <p className={textClass}>
        GM・ディベロッパー向けのエネミーデータ/駒作成ツールはこちら
      </p>
      <p className={`mt-3 ${textClass}`}>
        →{" "}
        <Link href="/enemy" className={linkClass}>
          LHTRPG- エネミーデータ/駒作成ツール（CCFOLIA）
        </Link>
      </p>
    </SectionCard>
  );
}

export function HowToSection() {
  return (
    <SectionCard title="使い方" className="mb-12">
      <div className={`space-y-3 ${textClass}`}>
        <p>1. ログ･ホライズンTRPG冒険者窓口でキャラクターページを開く。</p>
        <p>
          2. 外部ツールからの〈冒険者〉データ参照が許可されているか確認する。
          <br />
          許可されていない場合は、&lt;基本情報を変更する&gt;を開き、
          「外部ツールからの&lt;冒険者&gt;データ参照を許可する」にチェックを入れる。
        </p>
        <p>
          3. キャラクターページのURLまたはキャラクターIDを入力する。
          <br />
          （例： https://lhrpg.com/lhz/pc?id=xxxxxx または xxxxxx）
        </p>
        <p>4. 下記 [コマンドを生成する] をクリック。</p>
        <p>5. [コピー] をクリックしてコマンドをコピーする。</p>
        <p>6. CCFOLIAに貼り付ける。</p>
      </div>

      <p className={`mt-5 ${textClass}`}>
        詳しい使い方についてはこちら →{" "}
        <Link href="/character/how-to" className={linkClass}>
          使い方（詳細）
        </Link>
      </p>
    </SectionCard>
  );
}

export function InformationSection() {
  return (
    <SectionCard title="お知らせ" className="mb-12">
      <p className={textClass}>コマンド内訳やアップデート情報はこちら</p>

      <div className="mt-3 flex flex-wrap gap-4">
        <Link href="/character/command-details" className={linkClass}>
          コマンド内訳
        </Link>
        <Link href="/character/updates" className={linkClass}>
          アップデート情報
        </Link>
      </div>

      <div className={`mt-6 space-y-3 ${textClass}`}>
        <p>
          「コマンドが表示されない」、「CCFOLIAに貼り付けできない」などのエラーが発生した場合は、
          下記Googleフォームにてご連絡ください。
          ご意見・ご要望をお送りいただけますと、今後の改善や機能追加の参考にさせていただきます。
        </p>
        <p>
          Googleフォーム →
          <a
            href="https://forms.gle/76AvTAYyxM5DLQtL8"
            target="_blank"
            rel="noreferrer"
            className={`ml-2 ${linkClass}`}
          >
            https://forms.gle/76AvTAYyxM5DLQtL8
          </a>
        </p>
      </div>
    </SectionCard>
  );
}

export function ReferenceSection() {
  return (
    <SectionCard title="参考情報" tone="info" className="mb-8">
      <p className={textClass}>
        このツールは「LHTRPGのチャットパレットを作るやつ」を参考に作成しています。
      </p>
      <p className={`mt-2 ${textClass}`}>
        「LHTRPGのチャットパレットを作るやつ」 →
        <a
          href="http://unonek.sakura.ne.jp/lh/chatpad.cgi?11111111"
          target="_blank"
          rel="noreferrer"
          className={`ml-2 ${linkClass}`}
        >
          http://unonek.sakura.ne.jp/lh/chatpad.cgi?11111111
        </a>
      </p>
    </SectionCard>
  );
}
