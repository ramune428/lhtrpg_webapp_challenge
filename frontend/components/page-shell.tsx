import type { ReactNode } from "react";
import AppNav from "@/components/app-nav";

type PageShellProps = {
  current?: "character" | "enemy";
  children: ReactNode;
};

export default function PageShell({ current, children }: PageShellProps) {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <AppNav current={current} />
        {children}
      </div>
    </main>
  );
}
