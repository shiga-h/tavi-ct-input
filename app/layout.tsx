import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAVI術前CT所見入力",
  description: "TAVI術前CT所見のスマホ入力→メール起動アプリ",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}


