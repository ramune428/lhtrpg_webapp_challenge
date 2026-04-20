import Link from "next/link";

type AppNavProps = {
  current?: "character" | "enemy";
};

export default function AppNav({ current }: AppNavProps) {
  const baseClass =
    "rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-neutral-50";
  const activeClass = "border-black bg-black text-white hover:bg-black";
  const normalClass = "border-neutral-300 text-black";

  return (
    <nav className="mb-8 flex flex-wrap gap-3">
      <Link
        href="/"
        className={`${baseClass} ${
          current === "character" ? activeClass : normalClass
        }`}
      >
        キャラ駒作成ツール
      </Link>

      <Link
        href="/character/subpages"
        className={`${baseClass} border-neutral-300 text-black`}
      >
        キャラ側サブページ
      </Link>

      <Link
        href="/enemy"
        className={`${baseClass} ${
          current === "enemy" ? activeClass : normalClass
        }`}
      >
        エネミーデータ/駒作成ツール
      </Link>

      <Link
        href="/enemy/subpages"
        className={`${baseClass} border-neutral-300 text-black`}
      >
        エネミー側サブページ
      </Link>
    </nav>
  );
}
