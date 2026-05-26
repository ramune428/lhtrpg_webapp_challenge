import Link from "next/link";
import StaticPage from "@/components/static-page";
import { EXTERNAL_LINKS, TOOL_CONFIG, TOOL_TITLES } from "@/components/tool-config";

const BODY_TEXT_CLASS = "text-sm leading-8 text-neutral-800";
const BODY_LINK_CLASS =
  "font-medium text-neutral-900 underline underline-offset-4";
const BUTTON_LINK_CLASS =
  "inline-flex rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:bg-neutral-50";

const contactItems = [
  {
    title: "【項目①】お問い合わせ対象",
    description:
      "お問い合わせの対象となるツールを選択してください。",
    examples: [
      TOOL_CONFIG.character.toolLabel,
      TOOL_CONFIG.enemy.toolLabel,
      "その他",
    ],
  },
  {
    title: "【項目②】お問い合わせ種別",
    description: "お問い合わせの種類を選択してください。",
    examples: [
      "不具合報告",
      "使い方の質問",
      "機能要望",
      "表示・文言の誤り",
      "その他",
    ],
  },
  {
    title: "【項目③】キャラクターURL・入力したURL/ID",
    description:
      "エラーが発生した場合は、入力したキャラクターURL、エネミーID、または使用したURLを記載してください。",
    examples: ["確認に必要な場合があります。", "個人情報や非公開情報は記載しないでください。"],
  },
  {
    title: "【項目④】発生した内容",
    description: "発生した内容をできるだけ具体的に記載してください。",
    examples: [
      "駒作成ボタンを押したが、何も表示されない",
      "エラー文が表示された",
      "出力された内容が想定と違う",
      "特定のキャラクターURLだけ失敗する",
    ],
  },
  {
    title: "【項目⑤】エラー文・表示された内容",
    description:
      "エラー文、表示された内容、入力したコマンドなどがあれば、そのまま貼り付けてください。",
    examples: ["長文でも問題ありません。", "改行などはそのまま貼り付けてください。"],
  },
  {
    title: "【項目⑥】補足・その他",
    description: "その他、補足事項があれば記載してください。",
    examples: [
      "本来期待していた動作",
      "発生したタイミング",
      "使用しているブラウザ",
      "何度試しても同じ症状になるか",
    ],
  },
];

export default function ContactPage() {
  return (
    <StaticPage
      title="お問い合わせフォーム"
      backHref={TOOL_CONFIG.character.href}
      backLabel={TOOL_CONFIG.character.backLabel}
    >
      <section className="rounded-2xl border border-neutral-300 p-6">
        <div className="space-y-4">
          <p className={BODY_TEXT_CLASS}>
            このページは ramune428［
            <a
              href="https://x.com/ramune428"
              target="_blank"
              rel="noreferrer"
              className={BODY_LINK_CLASS}
            >
              X（旧Twitter）：@ramune428
            </a>
            ］が作成した「{TOOL_CONFIG.character.toolLabel}」
            「{TOOL_CONFIG.enemy.toolLabel}」のお問い合わせフォームです。
          </p>

          <p className={BODY_TEXT_CLASS}>
            いただいたご意見・ご要望は、さらなる性能向上のために有効に活用させていただきます。
          </p>

          <div className="space-y-2 text-sm leading-8 text-neutral-800">
            <p>
              {TOOL_TITLES.character} →{" "}
              <Link href={TOOL_CONFIG.character.href} className={BODY_LINK_CLASS}>
                こちら
              </Link>
            </p>
            <p>
              {TOOL_TITLES.enemy} →{" "}
              <Link href={TOOL_CONFIG.enemy.href} className={BODY_LINK_CLASS}>
                こちら
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-300 p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          お問い合わせをいただく前に
        </h2>

        <div className="space-y-4">
          <p className={BODY_TEXT_CLASS}>
            エラーが発生した場合は、確認のため「キャラクターURL」または「入力したURL/ID」をあわせて記載してください。
          </p>

          <p className={BODY_TEXT_CLASS}>
            また、具体的な症状のやり取り、修正・進捗の報告、一時的な対処方法のご案内などを行う場合があります。
            こちらから個別に回答を行うため、差し支えなければ X（旧Twitter）のアカウント名をご記入ください。
          </p>

          <ul className="list-disc space-y-2 pl-6 text-sm leading-8 text-neutral-800">
            <li>Xアカウント名の入力は任意です。</li>
            <li>未入力の場合、内容の確認は行いますが、個別の回答や追加確認ができない場合があります。</li>
            <li>個人情報、パスワード、非公開情報は記載しないでください。</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-300 p-6">
        <h2 className="mb-4 text-2xl font-semibold">お問い合わせフォーム</h2>

        <p className={`${BODY_TEXT_CLASS} mb-5`}>
          下記のフォームから、使い方の質問、不具合報告、機能要望などを送信できます。
        </p>

        <a
          href={EXTERNAL_LINKS.feedbackForm}
          target="_blank"
          rel="noreferrer"
          className={BUTTON_LINK_CLASS}
        >
          お問い合わせフォームを開く
        </a>
      </section>

      <section className="rounded-2xl border border-neutral-300 p-6">
        <h2 className="mb-4 text-2xl font-semibold">フォーム記入項目</h2>

        <div className="space-y-5">
          {contactItems.map((item) => (
            <section key={item.title} className="rounded-xl border border-neutral-200 p-4">
              <h3 className="mb-2 text-base font-semibold text-neutral-900">
                {item.title}
              </h3>
              <p className={BODY_TEXT_CLASS}>{item.description}</p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-sm leading-7 text-neutral-700">
                {item.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </StaticPage>
  );
}
