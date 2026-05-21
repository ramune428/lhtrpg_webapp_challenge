import Link from "next/link";
import SectionCard from "@/components/ui/section-card";

const textClass = "text-sm leading-8 text-neutral-800";
const linkClass = "font-medium text-neutral-700 underline underline-offset-4";

export function EnemyPageHeader() {
  return (
    <header className="mb-10">
      <p className="mb-3 text-sm font-semibold text-neutral-500">
        Enemy Piece Generator
      </p>
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
        -LHTRPG- エネミーデータ/駒作成ツール（CCFOLIA）
      </h1>

      <p className={textClass}>
        このエネミーデータ/駒作成ツールは
        <Link
          href="https://lhrpg.com/data/enemy_data_guide2.html"
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          「ログ・ホライズンTRPGエネミーデータガイド（高CR対応拡張版）」
        </Link>
        より提供されている支援資料を基に作成しています。
      </p>
    </header>
  );
}

export function CharacterToolLinkSection() {
  return (
    <SectionCard className="mb-10">
      <p className={textClass}>PL向けのキャラ駒作成ツール（CCFOLIA）はこちら</p>
      <p className={`mt-3 ${textClass}`}>
        →{" "}
        <Link href="/" className={linkClass}>
          -LHTRPG- キャラ駒作成ツール（CCFOLIA）
        </Link>
      </p>
    </SectionCard>
  );
}

export function EnemyGuideSection() {
  return (
    <SectionCard title="エネミーデータ/駒作成ツールを使用する前に" className="mb-12">
      <div className={`space-y-5 ${textClass}`}>
        <p>
          このツールは「ログ・ホライズンTRPGエネミーデータガイド（高CR対応拡張版）」を参考に作成しており、各能力値、推奨ドロップ品、推奨特技ダメージを自動的に計算します。対応しているCRは
          <strong>1〜30</strong>です。
        </p>

        <p>
          作成したエネミーデータは「CCFOLIA」、「XLSX」、「JSON」の3種類の形式で出力できます。XLSXファイルおよびJSONファイルを読み込むことでエネミーデータを編集できます。
        </p>

        <p>
          また、
          <Link
            href="https://lhrpg.com/lhz/database"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            「ログ・ホライズンTRPG冒険者窓口 -データベース-」
          </Link>
          のエネミーデータも読み込むことができますが、読み込む前に一手間必要です。使用する前に、
          <Link href="/enemy/official-data" className={linkClass}>
            公式データについて
          </Link>
          をご確認ください。一部のエネミーに関してエラーの発生を確認しています。大抵の原因は文字コードの相違です。発見した場合は、お問い合わせフォームまでご一報ください。
        </p>

        <p>
          詳しいエネミーデータの自作方法については「ログ・ホライズンTRPGエネミーデータガイド（高CR対応拡張版）」やルールブックをご確認ください。
        </p>
      </div>
    </SectionCard>
  );
}

export function EnemyHowToSection() {
  return (
    <SectionCard title="使い方" className="mb-12">
      <div className={`space-y-6 ${textClass}`}>
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-neutral-950">
            1. エネミー情報入力欄について
          </h3>
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              「名称」「ランク」「CR」「タイプ」「大種族」「知名度」「タグ」「メモ」を入力してください。
              <br />
              ※「因果力」を除く能力値は自動的に計算されます。
            </li>
            <li>
              ドロップ品を入力してください。ドロップ品の数を決定し、推奨ドロップ品を参考に「ダイス」「アイテム名」を入力してください。
              <br />
              ※「解説」は入力しなくても問題ありません。
            </li>
            <li>各能力値について修正したい箇所があれば修正してください。</li>
          </ol>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-neutral-950">
            2. 特技情報入力欄について
          </h3>
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              「大種族」が「ギミック」の時は専用の特技《意志なき機構》が自動で追加されます。
            </li>
            <li>「特技の数」を決定してください。</li>
            <li>
              各特技の情報を入力してください。
              <br />
              ※「特技名」「効果」を記入していない場合は反映されません。
            </li>
          </ol>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-neutral-950">
            3. エネミーデータ出力欄について
          </h3>
          <p>
            エネミーデータの確認ページです。このページに表示されていない場合は反映されていません。
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              「コマンドを生成する」→
              CCFOLIA用のコマンドが表示されます。CCFOLIAに貼り付けると「キャラクター駒」が作成できます。
            </li>
            <li>
              「Download XLSX」→
              XLSXファイルで保存されます。出力したファイルは読み込むことができます。
            </li>
            <li>
              「Download JSON」→
              JSONファイルで保存されます。出力したファイルは読み込むことができます。
            </li>
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}

export function EnemyNoticeSection() {
  return (
    <SectionCard title="お知らせ" className="mt-12">
      <div className={`space-y-4 ${textClass}`}>
        <p>
          「コマンドが表示されない」「CCFOLIAに貼り付けできない」などのエラーが発生した場合は、
          下記Googleフォームにてご連絡ください。
          ご意見・ご要望をお送りいただけますと、今後の改善や機能追加の参考にさせていただきます。
        </p>
        <p>
          Googleフォーム →{" "}
          <Link
            href="https://forms.gle/76AvTAYyxM5DLQtL8"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            https://forms.gle/76AvTAYyxM5DLQtL8
          </Link>
        </p>
      </div>
    </SectionCard>
  );
}
