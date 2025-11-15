# GitHub Pages デプロイ手順

## 前提条件

- GitHubアカウントを持っていること
- Gitがインストールされていること

## 手順

### 1. GitHubリポジトリの作成

1. GitHubにログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `tavi-ct-input`）
4. **Public**または**Private**を選択
   - Public: コードが公開されるが、無料でGitHub Pagesが使える
   - Private: コードは非公開だが、GitHub Pro（有料）が必要な場合も（2021年以降は無料プランでもプライベートリポジトリのGitHub Pagesが使える）
5. 「Create repository」をクリック

### 2. ローカルでGitリポジトリを初期化

```powershell
cd "C:\Users\sqjyp\OneDrive\デスクトップ\management\tavi-ct-input"
git init
git add .
git commit -m "Initial commit"
```

### 3. GitHubリポジトリと接続

```powershell
git remote add origin https://github.com/[ユーザー名]/tavi-ct-input.git
git branch -M main
git push -u origin main
```

### 4. GitHub Actionsで自動デプロイを設定

`.github/workflows/deploy.yml`ファイルを作成：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 5. GitHub Pagesの設定

1. GitHubリポジトリの「Settings」→「Pages」に移動
2. 「Source」で「GitHub Actions」を選択
3. 保存

### 6. デプロイの実行

```powershell
git add .
git commit -m "Add GitHub Actions workflow"
git push
```

### 7. デプロイの確認

1. GitHubリポジトリの「Actions」タブでデプロイの進行状況を確認
2. 完了後、`https://[ユーザー名].github.io/tavi-ct-input/` にアクセス

## カスタムドメインを使う場合

### next.config.mjsの設定

カスタムドメインを使う場合は、`basePath`を削除または空文字列に：

```javascript
const nextConfig = {
  output: 'export',
  // basePath: '/tavi-ct-input', // この行を削除またはコメントアウト
  images: {
    unoptimized: true,
  },
};
```

### GitHub Pagesの設定

1. 「Settings」→「Pages」でカスタムドメインを設定
2. DNS設定でCNAMEレコードを追加

## 更新方法

コードを更新したら：

```powershell
git add .
git commit -m "Update app"
git push
```

GitHub Actionsが自動的にビルドとデプロイを実行します。

## トラブルシューティング

### 404エラーが出る場合

- `next.config.mjs`の`basePath`を確認
- リポジトリ名と一致しているか確認

### デプロイが失敗する場合

- GitHubリポジトリの「Actions」タブでエラーログを確認
- `package.json`の依存関係が正しいか確認

