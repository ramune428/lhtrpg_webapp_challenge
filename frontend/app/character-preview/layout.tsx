import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "キャラクター駒作成ツール 検証版",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CharacterPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
