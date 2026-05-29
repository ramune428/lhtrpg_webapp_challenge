import type { Metadata } from "next";
import type { ReactNode } from "react";

const enemyTitle = "LHTRPG エネミーデータ/駒作成ツール";
const enemyDescription =
  "ログ・ホライズンTRPG向けに、エネミーデータの作成やCCFOLIA用の駒作成を支援するWebツールです。";

export const metadata: Metadata = {
  title: {
    default: enemyTitle,
    template: `%s | ${enemyTitle}`,
  },
  description: enemyDescription,
  keywords: [
    "LHTRPG",
    "ログ・ホライズンTRPG",
    "エネミーデータ",
    "エネミー駒",
    "CCFOLIA",
    "ココフォリア",
  ],
  openGraph: {
    title: enemyTitle,
    description: enemyDescription,
    url: "https://lhtrpg-tools.com/enemy",
    siteName: enemyTitle,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: enemyTitle,
    description: enemyDescription,
  },
};

export default function EnemyLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
