import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "LHTRPG キャラクター駒作成ツール | CCFOLIA用",
  description:
    "ログ・ホライズンTRPG（LHTRPG）のキャラクターデータから、CCFOLIA用のキャラクター駒作成コマンドを生成するWebツールです。",
  alternates: {
    canonical: "https://lhtrpg-tools.com/character",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CharacterLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
