import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "【テスト版】キャラクター駒作成ツール 検証版",
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
  return (
    <>
      <div className="border-b border-amber-300 bg-amber-50 px-6 py-3 text-center text-sm font-semibold text-amber-900">
        【テスト版】このページはキャラクター駒作成ツールの検証用ページです。
      </div>
      {children}
    </>
  );
}
