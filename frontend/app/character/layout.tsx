import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LHTRPG キャラクター駒作成ツール | CCFOLIA用",
  description:
    "ログ・ホライズンTRPG（LHTRPG）のキャラクターデータから、CCFOLIA用のキャラクター駒作成コマンドを生成するWebツールです。",
  alternates: {
    canonical: "/character",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LHTRPG キャラクター駒作成ツール | CCFOLIA用",
    description:
      "ログ・ホライズンTRPG（LHTRPG）のキャラクターデータから、CCFOLIA用のキャラクター駒作成コマンドを生成するWebツールです。",
    url: "/character",
    type: "website",
  },
};

export default function CharacterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
