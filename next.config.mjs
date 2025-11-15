/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages用の設定
  output: 'export',
  // GitHub Pagesでリポジトリ名が 'tavi-ct-input' の場合
  // カスタムドメインを使う場合は basePath を削除またはコメントアウト
  basePath: '/tavi-ct-input',
  images: {
    unoptimized: true, // 静的エクスポート時は画像最適化を無効化
  },
};

export default nextConfig;

