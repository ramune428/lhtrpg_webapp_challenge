type CalculatedValues = {
  strength: number;
  dexterity: number;
  power: number;
  intelligence: number;
  avoid: number;
  avoidDice: number;
  resist: number;
  resistDice: number;
  physicalDefense: number;
  magicDefense: number;
  hitPoint: number;
  hate: number;
  action: number;
  move: number;
  fate: number;
};

type EnemyCalculatedValuesPanelProps = {
  calculated: CalculatedValues;
  onApply: () => void;
};

export default function EnemyCalculatedValuesPanel({
  onApply,
}: EnemyCalculatedValuesPanelProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-semibold">能力値</h2>
      <button
        type="button"
        onClick={onApply}
        className="rounded-xl border border-neutral-300 px-4 py-2 text-sm transition hover:bg-neutral-50"
      >
        推奨能力値を反映
      </button>
    </div>
  );
}
