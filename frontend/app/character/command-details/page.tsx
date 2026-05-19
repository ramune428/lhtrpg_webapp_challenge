import Link from "next/link";
import AppNav from "@/components/app-nav";

export default function CharacterCommandDetailsPage() {
  const imageClass =
    "h-auto w-full rounded-xl border border-neutral-200 shadow-sm";

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <AppNav current="character" />

        <div className="mb-6 text-sm leading-8 text-neutral-800">
          <span>← </span>
          <Link href="/" className="underline underline-offset-4">
            キャラ作成ツールに戻る
          </Link>
        </div>

        <header className="mb-10">
          <h1 className="mb-6 text-4xl font-bold tracking-tight">
            コマンド内訳
          </h1>
          <div className="border-b border-neutral-300" />
        </header>

        <section className="space-y-12">
          <section>
            <div className="mb-10 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                生成されるコマンドの内容について
              </h2>

              <p className="text-sm leading-8 text-neutral-800">
                ログ・ホライズンTRPG冒険者窓口に登録されたキャラクターデータをもとに、
                CCFOLIAに貼り付けるためのコマンドを作成します。
                <br />
                ※ パーソナルファクターと画像は、コマンド作成の参照対象に含まれません。
              </p>
            </div>

            <div className="space-y-12">
              <section>
                <h3 className="mb-4 text-2xl font-bold">基本情報</h3>

                <ol className="list-decimal space-y-2 pl-8 text-sm leading-8 text-neutral-900">
                  <li>名前</li>
                  <li>イニシアチブ（行動力）</li>
                  <li>キャラクターメモ（説明欄）</li>
                  <li>参考URL（キャラクター情報）</li>
                </ol>

                <div className="mt-6 flex justify-center">
                  <img
                    src="/character/command-details/CharacterCommandDetails-01-CharacterData.png"
                    alt="CCFOLIAのキャラクター編集画面の基本情報"
                    className={`${imageClass} max-w-[720px]`}
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-2xl font-bold">ステータス</h3>

                <ol className="list-decimal space-y-2 pl-8 text-sm leading-8 text-neutral-900">
                  <li>HP</li>
                  <li>再生</li>
                  <li>障壁</li>
                  <li>疲労</li>
                  <li>ヘイト</li>
                  <li>因果力</li>
                </ol>

                <div className="mt-6 flex justify-center">
                  <img
                    src="/character/command-details/CharacterCommandDetails-02-Status.png"
                    alt="CCFOLIAのキャラクター編集画面のステータス"
                    className={`${imageClass} max-w-[720px]`}
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-2xl font-bold">パラメータ</h3>

                <ol className="list-decimal space-y-2 pl-8 text-sm leading-8 text-neutral-900">
                  <li>CR</li>
                  <li>攻撃力</li>
                  <li>魔力</li>
                  <li>回復力</li>
                  <li>物防</li>
                  <li>魔防</li>
                  <li>各能力基本値</li>
                  <li>各能力値</li>
                </ol>

                <div className="mt-6 flex justify-center">
                  <img
                    src="/character/command-details/CharacterCommandDetails-03-Parameters.png"
                    alt="CCFOLIAのキャラクター編集画面のパラメータ"
                    className={`${imageClass} max-w-[720px]`}
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-2xl font-bold">チャットパレット</h3>

                <div className="mb-8 flex justify-center">
                  <img
                    src="/character/command-details/CharacterCommandDetails-04-ChatPalette.png"
                    alt="CCFOLIAのキャラクター編集画面のチャットパレット"
                    className={`${imageClass} max-w-[720px]`}
                  />
                </div>

                <ul className="list-disc space-y-8 pl-8 text-sm leading-8 text-neutral-900">
                  <li>
                    <div className="font-medium">戦闘の基本</div>
                    <ol className="mt-2 list-decimal space-y-2 pl-8">
                      <li>命中値</li>
                      <li>回避（ヘイトトップ / ヘイトアンダー）</li>
                      <li>抵抗（ヘイトトップ / ヘイトアンダー）</li>
                      <li>基本武器攻撃</li>
                      <li>基本魔法攻撃</li>
                    </ol>
                  </li>

                  <li>
                    <div className="font-medium">被ダメージ計算用</div>

                    <ol className="mt-2 list-decimal space-y-6 pl-8">
                      <li>
                        <div>被ダメージ（物理）計算</div>

                        <p className="mt-1">
                          ※ 赤字の部分に、その時の数値を入力して使用してください。
                        </p>

                        <p className="mt-1">
                          コマンド： C(
                          <span className="font-bold text-red-500">
                            エネミーのダメージ
                          </span>
                          {" "}- {"{物防}"} -{" "}
                          <span className="font-bold text-red-500">
                            軽減
                          </span>
                          )
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-6">
                          <li>
                            エネミーのダメージ：エネミー（GM）の攻撃で発生した物理ダメージの値
                          </li>
                          <li>軽減：CSなどの軽減値</li>
                        </ul>

                        <p className="mt-2">
                          例：60点の物理ダメージを受け、軽減が15ある場合
                          <br />
                          C(
                          <span className="font-bold text-red-500">60</span>
                          {" "}- {"{物防}"} -{" "}
                          <span className="font-bold text-red-500">15</span>)
                          と入力する。
                        </p>
                      </li>

                      <li>
                        <div>被ダメージ（魔法）計算</div>

                        <p className="mt-1">
                          ※ 赤字の部分に、その時の数値を入力して使用してください。
                        </p>

                        <p className="mt-1">
                          コマンド： C(
                          <span className="font-bold text-red-500">
                            エネミーのダメージ
                          </span>
                          {" "}- {"{魔防}"} -{" "}
                          <span className="font-bold text-red-500">
                            軽減
                          </span>
                          )
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-6">
                          <li>
                            エネミーのダメージ：エネミー（GM）の攻撃で発生した魔法ダメージの値
                          </li>
                          <li>軽減：CSなどの軽減値</li>
                        </ul>

                        <p className="mt-2">
                          例：40点の魔法ダメージを受け、軽減が10ある場合
                          <br />
                          C(
                          <span className="font-bold text-red-500">40</span>
                          {" "}- {"{魔防}"} -{" "}
                          <span className="font-bold text-red-500">10</span>)
                          と入力する。
                        </p>
                      </li>

                      <li>
                        <div>残りHP計算</div>

                        <p className="mt-1">
                          ※ 赤字の部分に、その時の数値を入力して使用してください。
                        </p>

                        <p className="mt-1">
                          コマンド： C(({"{HP}"} + {"{障壁}"}) -{" "}
                          <span className="font-bold text-red-500">
                            ダメージ
                          </span>
                          {" "}- {"{ヘイト}"} *{" "}
                          <span className="font-bold text-red-500">
                            ヘイト倍率
                          </span>
                          {" "}-{" "}
                          <span className="font-bold text-red-500">その他</span>)
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-6">
                          <li>ダメージ：実際に受けるダメージ量</li>
                          <li>
                            ヘイト倍率：エネミーのヘイト倍率（ヘイトアンダーの場合は 0）
                          </li>
                          <li>その他：追撃や弱点などの強度</li>
                        </ul>

                        <p className="mt-2">
                          ヘイトアンダーの時にはヘイトダメージは発生しないので、
                          <span className="font-bold text-red-500">
                            {" "}ヘイト倍率 = 0
                          </span>
                          でOK。
                        </p>

                        <div className="mt-2">
                          <p>
                            例：30点のダメージを受け、ヘイトアンダーで、追加の補正がない場合
                          </p>
                          <p className="mt-1">
                            コマンド： C(({"{HP}"} + {"{障壁}"}) -{" "}
                            <span className="font-bold text-red-500">30</span>
                            {" "}- {"{ヘイト}"} *{" "}
                            <span className="font-bold text-red-500">0</span>
                            {" "}-{" "}
                            <span className="font-bold text-red-500">0</span>)
                          </p>
                          <p className="mt-1">と入力する。</p>
                        </div>

                                                <div className="mt-2">
                          <p>
                            例：28点のダメージを受け、ヘイトトップ（ヘイト倍率2倍）で、弱点が10ある場合
                          </p>
                          <p className="mt-1">
                            コマンド： C(({"{HP}"} + {"{障壁}"}) -{" "}
                            <span className="font-bold text-red-500">28</span>
                            {" "}- {"{ヘイト}"} *{" "}
                            <span className="font-bold text-red-500">2</span>
                            {" "}-{" "}
                            <span className="font-bold text-red-500">10</span>)
                          </p>
                          <p className="mt-1">と入力する。</p>
                        </div>
                      </li>
                    </ol>
                  </li>

                  <li>
                    <div className="font-medium">特技</div>

                    <details className="mt-2">
                      <summary className="cursor-pointer select-none font-medium">
                        記述順
                      </summary>
                      <div className="mt-3 space-y-2 pl-6">
                        <p>常時</p>
                        <p>セットアップ</p>
                        <p>イニシアチブ</p>
                        <p>ムーブ</p>
                        <p>マイナー</p>
                        <p>メジャー</p>
                        <p>行動</p>
                        <p>インスタント</p>
                        <p>ダメージロール</p>
                        <p>判定直前</p>
                        <p>判定直後</p>
                        <p>クリンナップ</p>
                        <p>プリプレイ</p>
                        <p>ブリーフィング</p>
                        <p>本文</p>
                        <p>基本動作</p>
                      </div>
                    </details>

                    <details className="mt-4">
                      <summary className="cursor-pointer select-none font-medium">
                        ダメージロール
                      </summary>

                      <div className="mt-3 space-y-3 pl-6">
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
                          ただし、追加効果（〔因果力〕、〔CR11〕、〔マイナー〕など）は反映されません。
                        </p>
                      </div>
                    </details>
                  </li>

                  <li>
                    <div className="font-medium">
                      装備中のプレフィックスド / ネームドアイテム
                    </div>
                    <p className="mt-1 pl-1">
                      アイテム名、タグ、効果が記載されます。
                    </p>
                  </li>

                  <li>
                    <div className="font-medium">所持品内アイテム</div>
                    <p className="mt-1 pl-1">
                      アイテム名、タグが記載されます。食料や水薬などの
                      「タイミング」、「効果」がある場合には一緒に記載されます。
                    </p>
                  </li>
                </ul>
              </section>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
