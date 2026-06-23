import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "LHTRPG キャラクター駒作成ツール";
const siteUrl = "https://lhtrpg-tools.com";
const siteDescription =
  "ログ・ホライズンTRPG（LHTRPG）向けに、CCFOLIA用のキャラクター駒作成を支援するWebツールです。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: `${siteName} | CCFOLIA用`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "LHTRPG",
    "ログ・ホライズンTRPG",
    "CCFOLIA",
    "ココフォリア",
    "キャラクター駒作成",
    "キャラクター駒",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${siteName} | CCFOLIA用`,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${siteName} | CCFOLIA用`,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
