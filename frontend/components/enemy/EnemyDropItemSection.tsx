import {
  diceButtonValues,
  formatDiceAboveSelection,
  getDiceRangeBoundaryValues,
  getDropDiceAboveStartValue,
  getDropDicePreview,
  getMaxDropDice,
  getSelectedDiceValues,
  isDiceButtonEnabled,
  isNumericDiceButton,
  normalizeDiceRangeSelection,
  toFullWidthNumber,
  type EnemyFormData,
} from "@/utils/enemy";
import type { EnemyDropItemRow } from "@/utils/enemy/form";

type EnemyDropItemSectionProps = {
  calculated: {
    gold: string;
    dropCore: string;
    dropCatalyst: string;
  };
  rank: EnemyFormData["rank"];
  items: EnemyDropItemRow[];
  onItemCountChange: (nextCountRaw: number) => void;
  onUpdateItem: (
    id: string,
    key: keyof Pick<EnemyDropItemRow, "dice" | "name" | "description">,
    value: string,
  ) => void;
  onRemoveItem: (id: string) => void;
};

export default function EnemyDropItemSection({
  calculated,
  rank,
  items,
  onItemCountChange,
  onUpdateItem,
  onRemoveItem,
}: EnemyDropItemSectionProps) {
  const maxDropDice = getMaxDropDice(rank);

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-semibold">推奨ドロップ品</h2>

      <div className="mb-6 grid gap-3 text-sm leading-8 text-neutral-800 sm:grid-cols-3">
        <p>{calculated.gold}</p>
        <p>{calculated.dropCore}</p>
        <p>{calculated.dropCatalyst}</p>
      </div>

      <label className="mb-2 block text-sm font-medium">ドロップ品の数</label>
      <input
        type="number"
        min={1}
        max={99}
        value={items.length}
        onChange={(event) => onItemCountChange(event.target.valueAsNumber)}
        className="mb-4 w-24 rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-500"
      />

      <div className="space-y-4">
        {items.map((item, index) => {
          const summaryName = item.name.trim() || "（未入力）";

          return (
            <details
              key={item.id}
              className="rounded-2xl border border-neutral-300 p-4"
            >
              <summary className="cursor-pointer text-sm font-medium">
                ドロップ品{index + 1}：{summaryName}
              </summary>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <label className="block text-sm font-medium">ダイス</label>

                    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600">
                      出力：{getDropDicePreview(item.dice, maxDropDice)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {diceButtonValues.map((diceValue) => {
                      const selected = getSelectedDiceValues(
                        item.dice,
                        maxDropDice,
                      );
                      const boundaryValues = getDiceRangeBoundaryValues(
                        selected,
                        maxDropDice,
                      );
                      const isEnabled = isDiceButtonEnabled(
                        diceValue,
                        maxDropDice,
                      );
                      const isFixedActive = item.dice.trim() === "固定";
                      const isAboveButton = diceValue === "以上";
                      const isAboveActive =
                        getDropDiceAboveStartValue(item.dice, maxDropDice) !==
                        null;
                      const isAboveDisabled = isAboveButton && isFixedActive;

                      const isActive =
                        diceValue === "固定"
                          ? isFixedActive
                          : isAboveButton
                            ? isAboveActive
                            : selected.has(diceValue);

                      const isAutoFilled =
                        isNumericDiceButton(diceValue) &&
                        !isAboveActive &&
                        isActive &&
                        !boundaryValues.has(diceValue);

                      return (
                        <button
                          key={diceValue}
                          type="button"
                          disabled={!isEnabled || isAutoFilled || isAboveDisabled}
                          title={
                            !isEnabled
                              ? "レイドの場合のみ選択できます"
                              : isAboveDisabled
                                ? "固定選択中は使用できません"
                                : isAutoFilled
                                  ? "両端の値から自動で選択されています"
                                  : diceValue === "以上"
                                    ? "出力を「n～」の形式に切り替えます"
                                    : undefined
                          }
                          onClick={() => {
                            if (!isEnabled || isAutoFilled || isAboveDisabled) {
                              return;
                            }

                            if (diceValue === "固定") {
                              onUpdateItem(item.id, "dice", "固定");
                              return;
                            }

                            if (diceValue === "以上") {
                              if (isAboveActive) {
                                const selectedNumbers = Array.from(selected)
                                  .map((value) => Number(value))
                                  .filter((value) => Number.isInteger(value))
                                  .sort((a, b) => a - b);
                                const start = selectedNumbers[0] ?? 1;
                                onUpdateItem(
                                  item.id,
                                  "dice",
                                  toFullWidthNumber(start),
                                );
                                return;
                              }

                              const nextDice = formatDiceAboveSelection(
                                selected,
                                maxDropDice,
                              );
                              onUpdateItem(item.id, "dice", nextDice);
                              return;
                            }

                            if (isAboveActive) {
                              onUpdateItem(
                                item.id,
                                "dice",
                                `${toFullWidthNumber(Number(diceValue))}～`,
                              );
                              return;
                            }

                            const nextSelected = getSelectedDiceValues(
                              item.dice,
                              maxDropDice,
                            );
                            if (nextSelected.has(diceValue)) {
                              nextSelected.delete(diceValue);
                            } else {
                              nextSelected.add(diceValue);
                            }

                            const nextDice = normalizeDiceRangeSelection(
                              nextSelected,
                              maxDropDice,
                            );
                            onUpdateItem(item.id, "dice", nextDice);
                          }}
                          className={[
                            "min-w-12 rounded-xl border px-4 py-3 text-sm transition",
                            !isEnabled || isAboveDisabled
                              ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
                              : isAutoFilled
                                ? "cursor-default border-red-300 bg-red-100 text-red-700"
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
                  <p className="mt-2 text-xs leading-6 text-neutral-500">
                    ※
                    1〜6は常に選択できます。7〜10はランクが「レイド」の場合のみ選択できます。
                    「以上」は、選択中の最小値に「～」を付けた形式で出力します。
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    アイテム名
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(event) =>
                      onUpdateItem(item.id, "name", event.target.value)
                    }
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium">解説</label>
                  <textarea
                    value={item.description}
                    onChange={(event) =>
                      onUpdateItem(item.id, "description", event.target.value)
                    }
                    className="min-h-[100px] w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="rounded-xl border border-neutral-300 px-4 py-2 text-sm transition hover:bg-neutral-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
