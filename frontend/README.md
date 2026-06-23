# Frontend

LHTRPG 駒作成ツールのフロントエンドです。

Next.js App Router、React、TypeScript、Tailwind CSS を使用しています。

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで以下を開きます。

```text
http://localhost:3000
```

## 利用可能なコマンド

```bash
npm run dev
```

開発サーバーを起動します。

```bash
npm run build
```

本番ビルドを実行します。

```bash
npm run start
```

ビルド済みアプリを起動します。

```bash
npm run lint
```

ESLint を実行します。

## 主な構成

```text
app/
  Next.js App Router のページ・レイアウトです。

components/
  ナビゲーション、リンクカード、静的ページ共通部品などを配置しています。

utils/
  キャラクター駒作成、エネミーデータ作成、JSON/XLSX入出力などのロジックを配置しています。

public/
  使い方ページなどで使用する画像を配置しています。
```

## キャラクター駒作成処理

`utils/createPiece.ts` は、キャラクター駒作成処理の公開入口です。

実装本体は `utils/createPiecePreview.ts` にあり、以下を行います。

- キャラクターIDの検証
- ログ・ホライズンTRPG冒険者窓口のJSON取得
- CCFOLIA用キャラクター駒データの生成
- チャットパレットの生成

生成処理に失敗した場合は、元JSONを返さず、呼び出し元へエラーを投げます。画面側ではそのエラーを受けて失敗メッセージを表示します。

## エネミーデータ/駒作成処理

`utils/createEnemyPiece.ts` に、エネミー関連の主要ロジックがあります。

- 推奨能力値計算
- エネミーJSON生成
- エネミーJSON読み込み
- XLSX生成
- XLSX読み込み
- CCFOLIA用コマンド生成

現状は機能が1ファイルに集中しているため、今後の保守性向上では責務別の分割を推奨します。

## 開発時の確認項目

修正後は最低限以下を実行してください。

```bash
npm run lint
npm run build
```

画面上では以下を確認してください。

- `/character` でキャラクター駒作成コマンドを生成できること
- 生成失敗時に元JSONではなくエラーメッセージが表示されること
- `/enemy` でCCFOLIA用コマンド、JSON、XLSXを出力できること
