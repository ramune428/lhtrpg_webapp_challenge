import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <aside className="mx-auto w-full max-w-6xl px-6 pt-8 sm:px-8">
        <section className="rounded-xl border border-neutral-300 bg-neutral-50 px-5 py-4 text-sm leading-7 text-neutral-800">
          <h2 className="font-semibold text-neutral-950">
            大種族「ギミック」のエネミーランク
          </h2>
          <p className="mt-2">
            大種族が「ギミック」の場合、エネミーランクは常に「ノーマル」として扱います。
          </p>
          <p>
            入力データや読込データに別のランクが指定されている場合も、計算および出力時は「ノーマル」に補正します。
          </p>
        </section>
      </aside>
      {children}
    </>
  );
}
