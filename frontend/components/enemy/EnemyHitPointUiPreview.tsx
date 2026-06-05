import type { EnemyFormData } from "@/utils/enemy";

type EnemyRank = EnemyFormData["rank"];

type HitPointPreviewSettings = {
  multiplier: number;
  minMultiplier: number;
  maxMultiplier: number;
  options: number[];
};

function getPreviewSettings(rank: EnemyRank): HitPointPreviewSettings | null {
  if (rank === "ボス") {
    return {
      multiplier: 4,
      minMultiplier: 2,
      maxMultiplier: 4,
      options: [2, 3, 4],
    };
  }

  if (rank === "レイド") {
    return {
      multiplier: 10,
      minMultiplier: 5,
      maxMultiplier: 10,
      options: [5, 6, 7, 8, 9, 10],
    };
  }

  return null;
}

export function EnemyHitPointMultiplierPreview({ rank }: { rank: EnemyRank }) {
  const settings = getPreviewSettings(rank);

  if (!settings) {
    return null;
  }

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
        {rank}は×{settings.minMultiplier}～×{settings.maxMultiplier}を選択する想定です。
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

  if (!settings) {
    return null;
  }

  const baseHitPoint = Math.floor(hitPoint / settings.multiplier);
  const minHitPoint = baseHitPoint * settings.minMultiplier;
  const maxHitPoint = baseHitPoint * settings.maxMultiplier;

  return (
    <section className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-neutral-700">
          最大HP推奨値（UI案）
        </h3>
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
            value={`${minHitPoint} ～ ${maxHitPoint}`}
            readOnly
            className="w-full cursor-default rounded-xl border border-neutral-300 bg-white px-4 py-3 font-medium text-neutral-700 outline-none"
          />
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-neutral-600">
        基準HP {baseHitPoint} × HP倍率 {settings.multiplier} ＝ 最終推奨HP {hitPoint}
      </p>
      <p className="mt-1 text-xs leading-6 text-neutral-500">
        最終的な最大HPは、既存の最大HP入力欄で自由に調整する想定です。
      </p>
    </section>
  );
}
