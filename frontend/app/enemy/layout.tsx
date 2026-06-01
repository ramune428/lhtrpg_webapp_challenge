import type { Metadata } from "next";
import type { ReactNode } from "react";

const enemyTitle = "LHTRPG エネミーデータ/駒作成ツール | CCFOLIA用";
const enemyDescription =
  "ログ・ホライズンTRPG（LHTRPG）のエネミーデータ作成と、CCFOLIA用のエネミー駒作成を支援するWebツールです。";

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
  alternates: {
    canonical: "/enemy",
  },
  robots: {
    index: true,
    follow: true,
  },
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
