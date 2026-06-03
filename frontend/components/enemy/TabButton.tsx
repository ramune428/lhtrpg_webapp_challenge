import type { ReactNode } from "react";

type TabButtonProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

export default function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "border-b-2 px-3 py-2 text-sm transition",
        active
          ? "border-red-500 text-red-500"
          : "border-transparent text-neutral-700 hover:text-neutral-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
