# scripts

開発作業用の一時スクリプトを配置します。

## refactor-enemy-page-stage1.mjs

`app/enemy/page.tsx` の第1段階リファクタリングを適用するスクリプトです。

実施内容:

- `@/utils/createEnemyPiece` からの import を `@/utils/enemy` に寄せる
- `TabButton` を `@/components/enemy` から import する
- `downloadTextFile` / `downloadBlobFile` を `@/utils/downloadFile` から import する
- `enemy/page.tsx` 内のダイス処理・フォーム補助処理・ダウンロード処理・TabButton定義を削除する

実行手順:

```bash
cd frontend
node scripts/refactor-enemy-page-stage1.mjs
npm run lint
npm run build
```

問題なければ、差分を確認してコミットしてください。

```bash
git diff -- app/enemy/page.tsx
git add app/enemy/page.tsx
git commit -m "Use extracted enemy utilities in enemy page"
```

## refactor-enemy-page-stage2.mjs

`app/enemy/page.tsx` の第2段階リファクタリングを適用するスクリプトです。

事前条件:

- `refactor-enemy-page-stage1.mjs` 適用後であること
- `npm run lint` と `npm run build` が通っていること

実施内容:

- 能力値セクション上部の推奨能力値表示・反映ボタンを `EnemyCalculatedValuesPanel` に置き換える
- 出力タブ下部の生成・コピー・JSON/XLSX出力・結果表示を `EnemyOutputPanel` に置き換える

実行手順:

```bash
cd frontend
node scripts/refactor-enemy-page-stage2.mjs
npm run lint
npm run build
```

問題なければ、差分を確認してコミットしてください。

```bash
git diff -- app/enemy/page.tsx
git add app/enemy/page.tsx
git commit -m "Use extracted enemy page panels"
```
