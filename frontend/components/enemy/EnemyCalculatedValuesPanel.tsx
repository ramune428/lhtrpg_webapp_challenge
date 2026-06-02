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

const valueItems: Array<[keyof CalculatedValues, string]> = [
  ["strength", "STR"],
  ["dexterity", "DEX"],
  ["power", "POW"],
  ["intelligence", "INT"],
  ["avoid", "回避"],
  ["avoidDice", "回避D"],
  ["resist", "抵抗"],
  ["resistDice", "抵抗D"],
  ["physicalDefense", "物防"],
  ["magicDefense", "魔防"],
  ["hitPoint", "HP"],
  ["hate", "ヘイト"],
  ["action", "行動"],
  ["move", "移動"],
  ["fate", "因果力"],
];

export default function EnemyCalculatedValuesPanel({
  calculated,
  onApply,
}: EnemyCalculatedValuesPanelProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">推奨能力値</h3>
          <p className="mt-1 text-sm leading-6 text-neutral-700">
            種別・ランク・CRから算出した目安値です。
          </p>
        </div>
        <button
          type="button"
          onClick={onApply}
          className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-white"
        >
          推奨値を反映
        </button>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {valueItems.map(([key, label]) => (
          <div key={key} className="rounded-xl bg-white p-3">
            <dt className="text-xs text-neutral-500">{label}</dt>
            <dd className="mt-1 text-lg font-semibold">{calculated[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
