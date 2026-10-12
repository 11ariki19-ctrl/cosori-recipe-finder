# COSORI TABLE — エアフライヤーレシピ検索

COSORIエアフライヤー向けの日本語レシピ検索アプリです。React + TypeScript + Vite で構築し、GitHub Pages で公開できる構成です。

## 主な機能
- 料理名・食材による検索
- カテゴリ、調理時間、レシピ種別で絞り込み
- 温度・時間・材料・手順の詳細表示
- お気に入り（このブラウザに保存）
- スマートフォン対応
- GitHub Actions による自動デプロイ

## ローカル実行
Node.js 22 以降をインストール後:

```bash
npm install
npm run dev
```

## GitHub Pages 公開
1. このプロジェクトを新しい GitHub リポジトリ `cosori-recipe-finder` にアップロードします。
2. リポジトリの **Settings → Pages** を開き、Build and deployment の Source を **GitHub Actions** にします。
3. `main` ブランチに push すると Actions がビルド・公開します。
4. Actions の完了後、`https://<GitHubユーザー名>.github.io/cosori-recipe-finder/` を確認します。

## レシピ情報について
初期データには動作確認用のオリジナルレシピが含まれます。公式レシピは、掲載元・URL・利用条件を確認してから登録してください。初期データの温度・時間は目安です。機種、食材の大きさ、量により調整し、必ず取扱説明書と食品の安全な加熱条件を確認してください。
