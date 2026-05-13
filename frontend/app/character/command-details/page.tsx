import Link from "next/link";
import AppNav from "@/components/app-nav";

export default function CharacterCommandDetailsPage() {
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
            <h2 className="mb-8 text-3xl font-bold tracking-tight">
              生成されるコマンドの内容について
            </h2>

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
                  <div className="w-full max-w-6xl rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center text-sm text-neutral-500">
                    基本情報の画像を後で追加
                  </div>
                </div>

                {/*
                <div className="mt-6 flex justify-center">
                  <img
                    src="/character/command-details/basic-info.png"
                    alt="基本情報"
                    className="h-auto w-full max-w-6xl rounded-xl border border-neutral-200"
                  />
                </div>
                */}
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
                  <div className="w-full max-w-6xl rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center text-sm text-neutral-500">
                    ステータスの画像を後で追加
                  </div>
                </div>

                {/*
                <div className="mt-6 flex justify-center">
                  <img
                    src="/character/command-details/status.png"
                    alt="ステータス"
                    className="h-auto w-full max-w-6xl rounded-xl border border-neutral-200"
                  />
                </div>
                */}
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

                <div className="mt-6 flex flex-wrap justify-center gap-8">
                  <div className="w-full max-w-[420px] rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center text-sm text-neutral-500">
                    パラメータ画像①を後で追加
                  </div>
                  <div className="w-full max-w-[420px] rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center text-sm text-neutral-500">
                    パラメータ画像②を後で追加
                  </div>
                </div>

                {/*
                <div className="mt-6 flex flex-wrap justify-center gap-8">
                  <img
                    src="/character/command-details/params-1.png"
                    alt="パラメータ1"
                    className="h-auto w-full max-w-[420px] rounded-xl border border-neutral-200"
                  />
                  <img
                    src="/character/command-details/params-2.png"
                    alt="パラメータ2"
                    className="h-auto w-full max-w-[420px] rounded-xl border border-neutral-200"
                  />
                </div>
                */}
              </section>

              <section>
                <h3 className="mb-4 text-2xl font-bold">チャットパレット</h3>

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
                    <div className="font-medium">被ダメ計算用</div>

                    <ol className="mt-2 list-decimal space-y-6 pl-8">
                      <li>
                        <div>被物理ダメージ計算</div>

                        <p className="mt-1">
                            ※ 赤字の部分に、その場の数値を入力して使用してください。
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
                            エネミーのダメージ：エネミーの物理ダメージの値
                          </li>
                          <li>
                            軽減：軽減値
                          </li>
                        </ul>

                        <p className="mt-2">
                          例：60点の物理ダメージを受け、軽減が15ある場合
                          <br/>
                          C(
                          <span className="font-bold text-red-500">
                            60
                          </span>
                          {" "}- {"{物防}"} -{" "}
                          <span className="font-bold text-red-500">
                            15
                          </span>
                          )
                          と入力する。
                        </p>
                      </li>

                      <li>
                        <div>被魔法ダメージ計算</div>

                        <p className="mt-1">
                            ※ 赤字の部分に、その場の数値を入力して使用してください。
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
                            エネミーのダメージ：エネミーの魔法ダメージの値
                          </li>
                          <li>
                            軽減：軽減値
                          </li>
                        </ul>

                        <p className="mt-2">
                          例：40点の魔法ダメージを受け、軽減が10ある場合
                          <br/>
                          C(
                          <span className="font-bold text-red-500">
                            40
                          </span>
                          {" "}- {"{物防}"} -{" "}
                          <span className="font-bold text-red-500">
                            10
                          </span>
                          )
                          と入力する。
                        </p>
                      </li>

                      <li>
                        <div>残HP計算</div>

                        <p className="mt-1">
                            ※ 赤字の部分に、その場の数値を入力して使用してください。
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
                          <span className="font-bold text-red-500">
                            その他
                          </span>
                          )
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-6">
                          <li>
                            ダメージ：実際に受けたダメージ量
                          </li>
                          <li>
                            ヘイト倍率：エネミーのヘイト倍率（ヘイトアンダーの場合は 0）
                          </li>
                          <li>
                            その他：追撃や弱点などの強度
                          </li>
                        </ul>

                        <p className="mt-2">
                          ヘイトアンダーの時にはヘイトダメージは発生しないので、
                          <span className="font-bold text-red-500">
                            {" "}ヘイト倍率 = 0
                          </span>
                          でOK。
                        </p>

                        <p className="mt-2">
                          例：30点のダメージを受け、ヘイトアンダーで、追加の補正がない場合
                          <p className="mt-1">                          
                          コマンド： C(({"{HP}"} + {"{障壁}"}) -{" "}
                          <span className="font-bold text-red-500">
                            30
                          </span>
                          {" "}- {"{ヘイト}"} *{" "}
                          <span className="font-bold text-red-500">
                            0
                          </span>
                            {" "}-{" "}
                          <span className="font-bold text-red-500">
                            0
                          </span>
                          )
                        </p>
                          と入力する。
                        </p>
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
                          ダメージロールには、その特技単独のダイスや計算式のみが反映されています。
                          マスタリー系やスタイルに関しては各自で修正してください。
                        </p>
                        <p>
                          現在、表示できるダメージロールは
                          [直接攻撃を除くダメージ]、
                          [HP回復]、
                          [弱点、軽減を除く強度が存在するBSとCS]
                          となっています。
                        </p>
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