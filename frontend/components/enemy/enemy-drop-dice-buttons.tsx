import {
  getDiceRangeBoundaryValues,
  getSelectedDiceValues,
  normalizeDiceRangeSelection,
} from "@/utils/enemyPageInput";

const diceButtonValues = ["固定", "1", "2", "3", "4", "5", "6"] as const;

type EnemyDropDiceButtonsProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function EnemyDropDiceButtons({
  value,
  onChange,
}: EnemyDropDiceButtonsProps) {
  const selected = getSelectedDiceValues(value);
  const boundaryValues = getDiceRangeBoundaryValues(selected);
  const isFixedActive = value.trim() === "固定";

  return (
    <div className="flex flex-wrap gap-2">
      {diceButtonValues.map((diceValue) => {
        const isActive =
          diceValue === "固定" ? isFixedActive : selected.has(diceValue);
        const isAutoFilled =
          diceValue !== "固定" && isActive && !boundaryValues.has(diceValue);

        return (
          <button
            key={diceValue}
            type="button"
            disabled={isAutoFilled}
            title={isAutoFilled ? "両端の値から自動で選択されています" : undefined}
            onClick={() => {
              if (isAutoFilled) {
                return;
              }

              if (diceValue === "固定") {
                onChange("固定");
                return;
              }

              const nextSelected = getSelectedDiceValues(value);
              if (nextSelected.has(diceValue)) {
                nextSelected.delete(diceValue);
              } else {
                nextSelected.add(diceValue);
              }

              onChange(normalizeDiceRangeSelection(nextSelected));
            }}
            className={[
              "min-w-12 rounded-xl border px-4 py-3 text-sm transition",
              isAutoFilled
                ? "border-red-300 bg-red-100 text-red-700 cursor-default"
                : isActive
                  ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
                  : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50",
            ].join(" ")}
          >
            {diceValue}
          </button>
        );
      })}
    </div>
  );
}
