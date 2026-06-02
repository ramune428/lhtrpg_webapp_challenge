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
