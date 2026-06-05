import type { EnemyFormData } from "@/utils/enemy";

type EnemyRank = EnemyFormData["rank"];

type HitPointPreviewSettings = {
  multiplier: number;
  minMultiplier: number;
  maxMultiplier: number;
  options: number[];
  isFixed: boolean;
};

function getPreviewSettings(rank: EnemyRank): HitPointPreviewSettings {
  if (rank === "モブ") {
    return {
      multiplier: 0.5,
      minMultiplier: 0.5,
      maxMultiplier: 0.5,
      options: [0.5],
      isFixed: true,
    };
  }

  if (rank === "ノーマル") {
    return {
      multiplier: 1,
      minMultiplier: 1,
      maxMultiplier: 1,
      options: [1],
      isFixed: true,
    };
  }

  if (rank === "ボス") {
    return {
      multiplier: 4,
      minMultiplier: 2,
      maxMultiplier: 4,
      options: [2, 3, 4],
      isFixed: false,
    };
  }

  return {
    multiplier: 10,
    minMultiplier: 5,
    maxMultiplier: 10,
    options: [5, 6, 7, 8, 9, 10],
    isFixed: false,
  };
}

export function EnemyHitPointMultiplierPreview({ rank }: { rank: EnemyRank }) {
  const settings = getPreviewSettings(rank);

  return (
    <div>
      <div className="mb-2 flex min-h-5 items-center justify-between gap-2">
        <label className="block text-sm font-medium">HP倍率</label>
        <span className="whitespace-nowrap text-xs font-medium text-amber-700">
          UI確認用
        </span>
      </div>

      <select
        defaultValue={String(settings.multiplier)}
        disabled
        className="w-full cursor-not-allowed rounded-xl border border-neutral-300 bg-neutral-100 px-4 py-3 text-neutral-600 outline-none"
      >
        {settings.options.map((value) => (
          <option key={value} value={value}>
            ×{value}
          </option>
        ))}
      </select>

      <p className="mt-2 text-xs leading-6 text-neutral-500">
        {settings.isFixed
          ? `${rank}は×${settings.multiplier}で固定されます。`
          : `${rank}は×${settings.minMultiplier}～×${settings.maxMultiplier}を選択する想定です。`}
        現在は計算に反映されません。
      </p>
    </div>
  );
}

export function EnemyHitPointRecommendationPreview({
  rank,
  hitPoint,
}: {
  rank: EnemyRank;
  hitPoint: number;
}) {
  const settings = getPreviewSettings(rank);
  const baseHitPoint = Math.floor(hitPoint / settings.multiplier);
  const minHitPoint = Math.floor(baseHitPoint * settings.minMultiplier);
  const maxHitPoint = Math.floor(baseHitPoint * settings.maxMultiplier);
  const rangeLabel = settings.isFixed
    ? `${minHitPoint}（固定）`
    : `${minHitPoint} ～ ${maxHitPoint}`;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-neutral-700">最大HP</h3>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          表示のみ・未実装
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium">基準HP</label>
          <input
            type="text"
            value={baseHitPoint}
            readOnly
            className="w-full cursor-default rounded-xl border border-neutral-300 bg-white px-4 py-3 font-medium text-neutral-700 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">HP倍率</label>
          <input
            type="text"
            value={`×${settings.multiplier}`}
            readOnly
            className="w-full cursor-default rounded-xl border border-neutral-300 bg-white px-4 py-3 font-medium text-neutral-700 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">最終推奨HP</label>
          <input
            type="text"
            value={hitPoint}
            readOnly
            className="w-full cursor-default rounded-xl border border-neutral-300 bg-white px-4 py-3 font-medium text-neutral-700 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">推奨範囲</label>
          <input
            type="text"
            value={rangeLabel}
            readOnly
            className="w-full cursor-default rounded-xl border border-neutral-300 bg-white px-4 py-3 font-medium text-neutral-700 outline-none"
          />
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-neutral-600">
        基準HP {baseHitPoint} × HP倍率 {settings.multiplier} ＝ 最終推奨HP {hitPoint}
      </p>
      <p className="mt-1 text-xs leading-6 text-neutral-500">
        現在はUI確認用です。最大HPの編集方法と計算反映は未実装です。
      </p>
    </section>
  );
}
