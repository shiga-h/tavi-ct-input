# GitHub Pages クイックスタートガイド

## 準備完了 ✅

以下のファイルが準備されています：
- ✅ `next.config.mjs` - GitHub Pages用の設定済み
- ✅ `.github/workflows/deploy.yml` - 自動デプロイワークフロー作成済み

## デプロイ手順

### ステップ1: GitHubリポジトリを作成

1. GitHubにログイン: https://github.com
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `tavi-ct-input`）
4. **Public**または**Private**を選択
   - Public: コードが公開されるが、無料でGitHub Pagesが使える
   - Private: コードは非公開（2021年以降は無料プランでもGitHub Pagesが使える場合あり）
5. 「Add a README file」は**チェックしない**（既にファイルがあるため）
6. 「Create repository」をクリック

### ステップ2: ローカルでGitリポジトリを初期化

PowerShellで以下を実行：

```powershell
cd "C:\Users\sqjyp\OneDrive\デスクトップ\management\tavi-ct-input"

# Gitリポジトリを初期化（まだ初期化していない場合）
git init

# すべてのファイルを追加
git add .

# 初回コミット
git commit -m "Initial commit: TAVI CT入力アプリ"
```

### ステップ3: GitHubリポジトリと接続

GitHubで作成したリポジトリのURLをコピーして、以下を実行：

```powershell
# [ユーザー名]と[リポジトリ名]を実際の値に置き換える
git remote add origin https://github.com/[ユーザー名]/tavi-ct-input.git

# メインブランチに設定
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

### ステップ4: GitHub Pagesの設定

1. GitHubリポジトリのページで「Settings」タブをクリック
2. 左メニューから「Pages」をクリック
3. 「Source」で「GitHub Actions」を選択
4. 保存（変更は自動的に保存されます）

### ステップ5: デプロイの確認

1. GitHubリポジトリの「Actions」タブをクリック
2. デプロイワークフローが実行されていることを確認
3. 完了まで数分かかります
4. 完了後、以下のURLでアクセス可能：
   ```
   https://[ユーザー名].github.io/tavi-ct-input/
   ```

## カスタムドメインを使う場合

### next.config.mjsの設定変更

カスタムドメインを使う場合は、`basePath`を削除：

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

コードを更新したら、以下を実行：

```powershell
git add .
git commit -m "更新内容の説明"
git push
```

GitHub Actionsが自動的にビルドとデプロイを実行します。

## トラブルシューティング

### 404エラーが出る場合

`next.config.mjs`の`basePath`を確認：
- リポジトリ名が`tavi-ct-input`の場合: `basePath: '/tavi-ct-input'`
- カスタムドメインを使う場合: `basePath`を削除

### デプロイが失敗する場合

1. GitHubリポジトリの「Actions」タブでエラーログを確認
2. エラーメッセージを確認して対処
3. よくある原因：
   - `package.json`の依存関係の問題
   - ビルドエラー

### ビルドが成功しない場合

ローカルでビルドを試す：

```powershell
npm run build
```

エラーが出た場合は、エラーメッセージを確認して修正してください。

## 次のステップ

1. ✅ デプロイが完了したら、URLをスタッフに共有
2. ✅ ブックマークやホーム画面に追加してもらう
3. ✅ 使用開始！

## 注意事項

- 初回デプロイには数分かかります
- 更新時も自動デプロイが実行されます（数分かかります）
- デプロイ中は「Actions」タブで進行状況を確認できます

