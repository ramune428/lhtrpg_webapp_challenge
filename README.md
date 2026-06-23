# LHTRPG 駒作成ツール

ログ・ホライズンTRPG（LHTRPG）向けのCCFOLIA用駒作成Webアプリです。

## 公開ページ

* キャラクター駒作成ツール

  * https://lhtrpg-tools.com/character
* キャラクター駒作成ツール（テスト・確認用）

  * https://lhtrpg-tools.com/character-preview

現在は主に以下の2つのツールを提供しています。

* キャラクター駒作成ツール

  * ログ・ホライズンTRPG冒険者窓口のキャラクターJSONを取得し、CCFOLIAに貼り付け可能なキャラクター駒作成コマンドを生成します。
* エネミーデータ/駒作成ツール

  * GM・ディベロッパー向けに、エネミーデータの作成、推奨能力値計算、CCFOLIA用コマンド生成、JSON/XLSX出力を行います。

## ディレクトリ構成

```text
.
└── frontend/   # Next.js アプリ本体
```

## 現在の実装方針

現在の公開Webアプリでは、主な処理は `frontend` 側で実行しています。

キャラクター駒作成処理は、フロントエンドからログ・ホライズンTRPG冒険者窓口のJSONを取得し、ブラウザ上でCCFOLIA用の出力形式に変換します。

## 起動方法

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

起動後、ブラウザで以下を開きます。

```text
http://localhost:3000
```

### ビルド確認

```bash
cd frontend
npm run build
```

### Lint確認

```bash
cd frontend
npm run lint
```

### エネミー計算式テスト

```bash
cd frontend
npm run test:enemy-formula
```

このテストでは、`/enemy/formula` の計算式ページに記載された値・計算式を正として、エネミーデータ/駒作成ツールの推奨能力値計算を確認します。

主な確認対象は以下です。

* エネミータイプ9種類（アーマラー、フェンサー、グラップラー、サポーター、ヒーラー、スピア、アーチャー、シューター、ボマー）
* ランク4種類（モブ、ノーマル、ボス、レイド）
* CR1〜30
* STR / DEX / POW / INT
* 回避・抵抗
* 物理防御・魔法防御
* HP・ヘイト倍率・行動力・移動力
* 基本攻撃の命中値、攻撃タイプ、対象、射程
* 大種族「ギミック」時の特殊計算条件

テストの主な参照先は以下です。

```text
frontend/tests/enemy/formula.test.ts
  テスト項目を定義しています。

frontend/tests/enemy/formula-spec.mjs
  計算式ページを正とした期待値・基本値・計算式を定義しています。

frontend/utils/enemy/calculate.ts
  画面側から使用する公開計算処理です。

frontend/utils/enemy/rank.ts
  大種族「ギミック」のランク補正処理です。
```

## 主なページ

* `/character`

  * キャラクター駒作成ツール
* `/character/how-to`

  * キャラクター駒作成ツールの使い方
* `/character/command-details`

  * 生成コマンドの内訳
* `/character/updates`

  * キャラクター駒作成ツールのアップデート情報
* `/enemy`

  * エネミーデータ/駒作成ツール
* `/enemy/official-data`

  * 公式データの取り扱い説明
* `/enemy/how-to`

  * エネミーデータ/駒作成ツールの使い方
* `/enemy/formula`

  * エネミーデータ計算式
* `/enemy/updates`
