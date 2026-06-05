import Link from "next/link";
import StaticPage from "@/components/static-page";
import type { ReactNode } from "react";
import { EXTERNAL_LINKS, TOOL_CONFIG,  } from "@/components/tool-config";

const BODY_TEXT_CLASS = "text-sm leading-8 text-neutral-800";

type BaseDataValue = string | number;

type BaseDataRow = {
  itemName: string;
  keyName: string;
  value: BaseDataValue;
};

type CoreMaterialRow = {
  power: number;
  core: number;
  catalyst: number;
};

type BasicAttackType = "melee" | "shooting" | "magical";
type BasicTarget = "single" | "multi";

type EnemyBaseData = {
  base_str: number;
  base_dex: number;
  base_pow: number;
  base_int: number;
  base_avoid_coefficient: number;
  base_avoid_fix: number;
  base_resist_coefficient: number;
  base_resist_fix: number;
  base_pd_coefficient: number;
  base_pd_fix: number;
  base_md_coefficient: number;
  base_md_fix: number;
  base_hp_coefficient: number;
  base_hp_fix: number;
  base_action_fix: number;
  base_hateCr: number;
  base_hate_fix: number;
  base_damageAll_coefficient: number;
  base_aggression_coefficient: number;
  base_basicAttackType: BasicAttackType;
  base_basicAttackRole_fix: number;
  base_basicAttackRoleDice: number;
  base_basicTarget: BasicTarget;
  base_basicRange: number;
};

type BaseDataDefinition = {
  itemName: string;
  keyName: keyof EnemyBaseData;
  valueLabel: string;
};

const baseDataDefinitions: BaseDataDefinition[] = [
  { itemName: "STR", keyName: "base_str", valueLabel: "数値" },
  { itemName: "DEX", keyName: "base_dex", valueLabel: "数値" },
  { itemName: "POW", keyName: "base_pow", valueLabel: "数値" },
  { itemName: "INT", keyName: "base_int", valueLabel: "数値" },
  {
    itemName: "回避値（係数）",
    keyName: "base_avoid_coefficient",
    valueLabel: "数値",
  },
  {
    itemName: "回避値（固定値）",
    keyName: "base_avoid_fix",
    valueLabel: "数値",
  },
  {
    itemName: "抵抗値（係数）",
    keyName: "base_resist_coefficient",
    valueLabel: "数値",
  },
  {
    itemName: "抵抗値（固定値）",
    keyName: "base_resist_fix",
    valueLabel: "数値",
  },
  {
    itemName: "物理防御（係数）",
    keyName: "base_pd_coefficient",
    valueLabel: "数値",
  },
  {
    itemName: "物理防御（固定値）",
    keyName: "base_pd_fix",
    valueLabel: "数値",
  },
  {
    itemName: "魔法防御（係数）",
    keyName: "base_md_coefficient",
    valueLabel: "数値",
  },
  {
    itemName: "魔法防御（固定値）",
    keyName: "base_md_fix",
    valueLabel: "数値",
  },
  {
    itemName: "HP（係数）",
    keyName: "base_hp_coefficient",
    valueLabel: "数値",
  },
  {
    itemName: "HP（固定値）",
    keyName: "base_hp_fix",
    valueLabel: "数値",
  },
  {
    itemName: "行動値（固定値）",
    keyName: "base_action_fix",
    valueLabel: "数値",
  },
  {
    itemName: "ヘイト倍率（CR係数）",
    keyName: "base_hateCr",
    valueLabel: "数値",
  },
  {
    itemName: "ヘイト倍率（固定値）",
    keyName: "base_hate_fix",
    valueLabel: "数値",
  },
  {
    itemName: "ダメージ（係数）",
    keyName: "base_damageAll_coefficient",
    valueLabel: "数値",
  },
  {
    itemName: "攻撃（係数）",
    keyName: "base_aggression_coefficient",
    valueLabel: "数値",
  },
  {
    itemName: "攻撃方法",
    keyName: "base_basicAttackType",
    valueLabel: "melee / shooting / magical",
  },
  {
    itemName: "命中値（固定値）",
    keyName: "base_basicAttackRole_fix",
    valueLabel: "数値",
  },
  {
    itemName: "命中値（ダイス）",
    keyName: "base_basicAttackRoleDice",
    valueLabel: "数値",
  },
  {
    itemName: "攻撃対象",
    keyName: "base_basicTarget",
    valueLabel: "single / multi",
  },
  {
    itemName: "射程",
    keyName: "base_basicRange",
    valueLabel: "数値",
  },
];

const enemyBaseDataMap: Record<string, EnemyBaseData> = {
  アーマラー: {
    base_str: 7,
    base_dex: 3,
    base_pow: 4,
    base_int: 2,
    base_avoid_coefficient: 1.2,
    base_avoid_fix: 4,
    base_resist_coefficient: 1.1,
    base_resist_fix: 2,
    base_pd_coefficient: 2.2,
    base_pd_fix: 8,
    base_md_coefficient: 1.7,
    base_md_fix: 2,
    base_hp_coefficient: 8.5,
    base_hp_fix: 48,
    base_action_fix: -2,
    base_hateCr: 0,
    base_hate_fix: 1,
    base_damageAll_coefficient: 1,
    base_aggression_coefficient: 0.55,
    base_basicAttackType: "melee",
    base_basicAttackRole_fix: 2,
    base_basicAttackRoleDice: 2,
    base_basicTarget: "single",
    base_basicRange: 0,
  },
  フェンサー: {
    base_str: 7,
    base_dex: 4,
    base_pow: 2,
    base_int: 3,
    base_avoid_coefficient: 1.1,
    base_avoid_fix: 4,
    base_resist_coefficient: 1.1,
    base_resist_fix: 2,
    base_pd_coefficient: 1.7,
    base_pd_fix: 5,
    base_md_coefficient: 1.7,
    base_md_fix: 1,
    base_hp_coefficient: 8.4,
    base_hp_fix: 45,
    base_action_fix: -2,
    base_hateCr: 2,
    base_hate_fix: 1,
    base_damageAll_coefficient: 1,
    base_aggression_coefficient: 0.55,
    base_basicAttackType: "melee",
    base_basicAttackRole_fix: 2,
    base_basicAttackRoleDice: 2,
    base_basicTarget: "single",
    base_basicRange: 0,
  },
  グラップラー: {
    base_str: 7,
    base_dex: 4,
    base_pow: 2,
    base_int: 3,
    base_avoid_coefficient: 1.1,
    base_avoid_fix: 2,
    base_resist_coefficient: 1.1,
    base_resist_fix: 4,
    base_pd_coefficient: 0.9,
    base_pd_fix: 2,
    base_md_coefficient: 1.3,
    base_md_fix: 3,
    base_hp_coefficient: 7.5,
    base_hp_fix: 45,
    base_action_fix: 0,
    base_hateCr: 0,
    base_hate_fix: 1,
    base_damageAll_coefficient: 1,
    base_aggression_coefficient: 0.55,
    base_basicAttackType: "melee",
    base_basicAttackRole_fix: 2,
    base_basicAttackRoleDice: 2,
    base_basicTarget: "single",
    base_basicRange: 0,
  },
  サポーター: {
    base_str: 4,
    base_dex: 2,
    base_pow: 7,
    base_int: 3,
    base_avoid_coefficient: 1.2,
    base_avoid_fix: 2,
    base_resist_coefficient: 1.1,
    base_resist_fix: 7,
    base_pd_coefficient: 1.5,
    base_pd_fix: 3,
    base_md_coefficient: 1.8,
    base_md_fix: 5,
    base_hp_coefficient: 5.0,
    base_hp_fix: 35,
    base_action_fix: 2,
    base_hateCr: 0,
    base_hate_fix: 1,
    base_damageAll_coefficient: 1,
    base_aggression_coefficient: 0.55,
    base_basicAttackType: "magical",
    base_basicAttackRole_fix: 2,
    base_basicAttackRoleDice: 2,
    base_basicTarget: "single",
    base_basicRange: 4,
  },
  ヒーラー: {
    base_str: 3,
    base_dex: 2,
    base_pow: 7,
    base_int: 4,
    base_avoid_coefficient: 1.2,
    base_avoid_fix: 2,
    base_resist_coefficient: 1.1,
    base_resist_fix: 7,
    base_pd_coefficient: 1.8,
    base_pd_fix: 8,
    base_md_coefficient: 1.7,
    base_md_fix: 1,
    base_hp_coefficient: 6.0,
    base_hp_fix: 30,
    base_action_fix: -2,
    base_hateCr: 0,
    base_hate_fix: 1,
    base_damageAll_coefficient: 1,
    base_aggression_coefficient: 0.55,
    base_basicAttackType: "melee",
    base_basicAttackRole_fix: 2,
    base_basicAttackRoleDice: 2,
    base_basicTarget: "single",
    base_basicRange: 2,
  },
  スピア: {
    base_str: 4,
    base_dex: 7,
    base_pow: 2,
    base_int: 3,
    base_avoid_coefficient: 1.2,
    base_avoid_fix: 7,
    base_resist_coefficient: 1.1,
    base_resist_fix: 2,
    base_pd_coefficient: 1.7,
    base_pd_fix: 5,
    base_md_coefficient: 1.5,
    base_md_fix: 3,
    base_hp_coefficient: 6.0,
    base_hp_fix: 30,
    base_action_fix: 0,
    base_hateCr: 0,
    base_hate_fix: 2,
    base_damageAll_coefficient: 1,
    base_aggression_coefficient: 0.85,
    base_basicAttackType: "melee",
    base_basicAttackRole_fix: 1,
    base_basicAttackRoleDice: 3,
    base_basicTarget: "single",
    base_basicRange: 0,
  },
  アーチャー: {
    base_str: 3,
    base_dex: 4,
    base_pow: 2,
    base_int: 7,
    base_avoid_coefficient: 1.1,
    base_avoid_fix: 4,
    base_resist_coefficient: 1.1,
    base_resist_fix: 2,
    base_pd_coefficient: 1.6,
    base_pd_fix: 6,
    base_md_coefficient: 1.9,
    base_md_fix: 5,
    base_hp_coefficient: 5.0,
    base_hp_fix: 26,
    base_action_fix: 0,
    base_hateCr: 2,
    base_hate_fix: 2,
    base_damageAll_coefficient: 0.9,
    base_aggression_coefficient: 0.85,
    base_basicAttackType: "shooting",
    base_basicAttackRole_fix: 0,
    base_basicAttackRoleDice: 3,
    base_basicTarget: "single",
    base_basicRange: 3,
  },
  シューター: {
    base_str: 3,
    base_dex: 2,
    base_pow: 5,
    base_int: 7,
    base_avoid_coefficient: 1.2,
    base_avoid_fix: 2,
    base_resist_coefficient: 1.1,
    base_resist_fix: 5,
    base_pd_coefficient: 1.3,
    base_pd_fix: 3,
    base_md_coefficient: 1.9,
    base_md_fix: 5,
    base_hp_coefficient: 4.0,
    base_hp_fix: 26,
    base_action_fix: 1,
    base_hateCr: 2,
    base_hate_fix: 2,
    base_damageAll_coefficient: 1,
    base_aggression_coefficient: 0.85,
    base_basicAttackType: "magical",
    base_basicAttackRole_fix: 0,
    base_basicAttackRoleDice: 3,
    base_basicTarget: "single",
    base_basicRange: 4,
  },
  ボマー: {
    base_str: 3,
    base_dex: 2,
    base_pow: 5,
    base_int: 7,
    base_avoid_coefficient: 1.2,
    base_avoid_fix: 2,
    base_resist_coefficient: 1.1,
    base_resist_fix: 5,
    base_pd_coefficient: 1.3,
    base_pd_fix: 3,
    base_md_coefficient: 1.9,
    base_md_fix: 5,
    base_hp_coefficient: 4.0,
    base_hp_fix: 26,
    base_action_fix: -2,
    base_hateCr: 2,
    base_hate_fix: 2,
    base_damageAll_coefficient: 0.85,
    base_aggression_coefficient: 0.85,
    base_basicAttackType: "magical",
    base_basicAttackRole_fix: 0,
    base_basicAttackRoleDice: 3,
    base_basicTarget: "multi",
    base_basicRange: 4,
  },
};

const coreMaterialRows: CoreMaterialRow[] = [
  { power: 1, core: 30, catalyst: 15 },
  { power: 2, core: 40, catalyst: 20 },
  { power: 3, core: 50, catalyst: 25 },
  { power: 4, core: 60, catalyst: 30 },
  { power: 5, core: 80, catalyst: 40 },
  { power: 6, core: 100, catalyst: 50 },
  { power: 7, core: 120, catalyst: 60 },
  { power: 8, core: 140, catalyst: 70 },
  { power: 9, core: 180, catalyst: 90 },
  { power: 10, core: 220, catalyst: 110 },
  { power: 11, core: 240, catalyst: 120 },
  { power: 12, core: 300, catalyst: 150 },
  { power: 13, core: 340, catalyst: 170 },
  { power: 14, core: 380, catalyst: 190 },
  { power: 15, core: 440, catalyst: 220 },
  { power: 16, core: 500, catalyst: 250 },
  { power: 17, core: 560, catalyst: 280 },
  { power: 18, core: 620, catalyst: 310 },
  { power: 19, core: 680, catalyst: 340 },
  { power: 20, core: 740, catalyst: 370 },
  { power: 21, core: 820, catalyst: 410 },
  { power: 22, core: 900, catalyst: 450 },
  { power: 23, core: 980, catalyst: 490 },
  { power: 24, core: 1060, catalyst: 530 },
  { power: 25, core: 1160, catalyst: 580 },
  { power: 26, core: 1240, catalyst: 620 },
  { power: 27, core: 1340, catalyst: 670 },
  { power: 28, core: 1440, catalyst: 720 },
  { power: 29, core: 1540, catalyst: 770 },
  { power: 30, core: 1640, catalyst: 820 },
  { power: 31, core: 1760, catalyst: 880 },
];

function toExampleBaseDataRows(): BaseDataRow[] {
  return baseDataDefinitions.map((definition) => ({
    itemName: definition.itemName,
    keyName: definition.keyName,
    value: definition.valueLabel,
  }));
}

function toBaseDataRows(data: EnemyBaseData): BaseDataRow[] {
  return baseDataDefinitions.map((definition) => ({
    itemName: definition.itemName,
    keyName: definition.keyName,
    value: data[definition.keyName],
  }));
}

function DetailsBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="rounded-xl border border-neutral-200 bg-white px-5 py-4">
      <summary className="cursor-pointer select-none font-medium text-neutral-900">
        {title}
      </summary>
      <div className="mt-4 space-y-3 text-sm leading-7 text-neutral-800">
        {children}
      </div>
    </details>
  );
}

function FormulaText({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg bg-neutral-50 px-3 py-2 font-mono text-sm text-neutral-900">
      {children}
    </div>
  );
}

function BaseDataTable({ rows }: { rows: BaseDataRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse border border-neutral-300 text-sm">
        <thead>
          <tr className="bg-neutral-100">
            <th className="w-[30%] border border-neutral-300 px-3 py-2 text-left font-bold text-neutral-900">
              項目
            </th>
            <th className="w-[42%] border border-neutral-300 px-3 py-2 text-left font-bold text-neutral-900">
              内部キー
            </th>
            <th className="w-[28%] border border-neutral-300 px-3 py-2 text-left font-bold text-neutral-900">
              値
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.keyName} className="bg-white">
              <td className="border border-neutral-300 px-3 py-2 align-top text-neutral-900">
                {row.itemName}
              </td>
              <td className="border border-neutral-300 px-3 py-2 align-top">
                <code className="font-mono text-[13px] text-neutral-900">
                  {row.keyName}
                </code>
              </td>
              <td className="whitespace-nowrap border border-neutral-300 px-3 py-2 align-top font-mono text-neutral-900">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoreMaterialTable({ rows }: { rows: CoreMaterialRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[360px] border-collapse border border-neutral-300 text-sm">
        <thead>
          <tr className="bg-neutral-100">
            <th className="border border-neutral-300 px-3 py-2 text-left font-bold text-neutral-900">
              強度
            </th>
            <th className="border border-neutral-300 px-3 py-2 text-left font-bold text-neutral-900">
              コア素材
            </th>
            <th className="border border-neutral-300 px-3 py-2 text-left font-bold text-neutral-900">
              魔触媒
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.power} className="bg-white">
              <td className="border border-neutral-300 px-3 py-2">{row.power}</td>
              <td className="border border-neutral-300 px-3 py-2">{row.core}</td>
              <td className="border border-neutral-300 px-3 py-2">
                {row.catalyst}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GimmickRankNotice() {
  return (
    <aside className="rounded-xl border border-neutral-300 bg-neutral-50 px-5 py-4 text-sm leading-7 text-neutral-800">
      <h2 className="font-semibold text-neutral-950">
        大種族「ギミック」のエネミーランク
      </h2>
      <p className="mt-2">
        大種族が「ギミック」の場合、エネミーランクは常に「ノーマル」として扱います。
      </p>
      <p>
        入力データや読込データに別のランクが指定されている場合も、計算および出力時は「ノーマル」に補正します。
      </p>
    </aside>
  );
}

function BaseDataSection() {
  return (
    <div className="space-y-3">
      <DetailsBlock title="設定項目一覧">
        <BaseDataTable rows={toExampleBaseDataRows()} />
      </DetailsBlock>

      {Object.entries(enemyBaseDataMap).map(([typeName, data]) => (
        <DetailsBlock key={typeName} title={typeName}>
          <BaseDataTable rows={toBaseDataRows(data)} />
        </DetailsBlock>
      ))}
    </div>
  );
}

function CalculationFormulaSection() {
  return (
    <div className="space-y-3">
      <p>算出された数値の小数点以下は切り捨て。</p>

      <DetailsBlock title="各能力値（STR / DEX / POW / INT）">
        <FormulaText>{"(<CR> * 1.1 + <base_各能力値>) // 3"}</FormulaText>
        <p>ギミックの場合、上記の計算式を適用せず 0 に固定する</p>
      </DetailsBlock>

      <DetailsBlock title="回避値（固定値）">
        <FormulaText>
          {"(<CR> * <base_avoid_coefficient> + <base_avoid_fix>) // 3"}
        </FormulaText>
      </DetailsBlock>

      <DetailsBlock title="回避値（ダイス）">
        <p>モブの場合、判定に用いるダイス1個につき固定値3として換算する。</p>
        <p>モブ以外でグラップラーの場合、3D とする</p>
        <p>上記以外の場合、2D とする</p>
      </DetailsBlock>

      <DetailsBlock title="抵抗値（固定値）">
        <FormulaText>
          {"(<CR> * <base_resist_coefficient> + <base_resist_fix>) // 3"}
        </FormulaText>
      </DetailsBlock>

      <DetailsBlock title="抵抗値（ダイス）">
        <p>モブの場合、判定に用いるダイス1個につき固定値3として換算する。</p>
        <p>モブ以外でグラップラーの場合、3D とする</p>
        <p>上記以外の場合、2D とする</p>
      </DetailsBlock>

      <DetailsBlock title="物理防御">
        <FormulaText>{"<CR> * <base_pd_coefficient> + <base_pd_fix>"}</FormulaText>
      </DetailsBlock>

      <DetailsBlock title="魔法防御">
        <FormulaText>{"<CR> * <base_md_coefficient> + <base_md_fix>"}</FormulaText>
      </DetailsBlock>

      <DetailsBlock title="HP">
        <FormulaText>{"<CR> * <base_hp_coefficient> + <base_hp_fix>"}</FormulaText>
        <p>ギミック または モブの場合、上記の計算結果を 1/2 倍する</p>
        <p>ボスの場合、上記の計算結果を 4 倍する</p>
        <p>レイドの場合、上記の計算結果を 10 倍する</p>
      </DetailsBlock>

      <DetailsBlock title="ヘイト">
        <p>ギミックの場合、固定値 0 とする</p>

        <p>ボス または レイドの場合、以下の計算式で算出する</p>
        <FormulaText>{"<CR> / 2.4 + 4"}</FormulaText>

        <p>ノーマル または モブの場合、以下の計算式で算出する</p>
        <FormulaText>
          {"(<CR> * <base_hateCr>) / 6 + <base_hate_fix>"}
        </FormulaText>
      </DetailsBlock>

      <DetailsBlock title="行動値">
        <FormulaText>{"value1 = (<CR> * 1.1 + 7) // 3"}</FormulaText>
        <FormulaText>{"value2 = (<CR> * 1.1 + 3) // 3"}</FormulaText>
        <FormulaText>{"value1 + value2 + <base_action_fix>"}</FormulaText>

        <p>ギミックの場合、上記の計算式を適用せず 0 に固定する</p>
      </DetailsBlock>

      <DetailsBlock title="移動力">
        <p>ギミックの場合、固定値 0 とする</p>
        <p>それ以外の場合、固定値 2 とする</p>
      </DetailsBlock>

      <DetailsBlock title="命中値（固定値）">
        <FormulaText>
          {"(<CR> * 1.1 + 7) // 3 + <base_basicAttackRole_fix>"}
        </FormulaText>
      </DetailsBlock>

      <DetailsBlock title="命中値（ダイス）">
        <FormulaText>{"<base_basicAttackRoleDice>"}</FormulaText>
        <p>モブの場合、 1D = 3 として換算する</p>
        <p>例： 2D → 6、3D → 9</p>
      </DetailsBlock>

      <DetailsBlock title="ダメージ固定値">
        <DetailsBlock title="アーマラー、フェンサー、グラップラー、ヒーラー">
          <FormulaText>{"<CR> * 3.5 + 8 + 8"}</FormulaText>
        </DetailsBlock>

        <DetailsBlock title="サポーター">
          <FormulaText>{"<CR> * 3.5 + 8"}</FormulaText>
        </DetailsBlock>

        <DetailsBlock title="スピア、アーチャー">
          <FormulaText>{"<CR> * 6 + 18 + 8"}</FormulaText>
        </DetailsBlock>

        <DetailsBlock title="シューター、ボマー">
          <FormulaText>{"<CR> * 6 + 18"}</FormulaText>
        </DetailsBlock>
      </DetailsBlock>

      <DetailsBlock title="ドロップ［金銭］">
        <FormulaText>
          {"gold = (<CR> + 2) * (<CR> + 2) * 0.72 + 17"}
        </FormulaText>
        <p>ギミック または モブの場合、上記の計算結果を 1/2 倍する</p>
        <p>ボス または レイドの場合、上記の計算結果を 4 倍する</p>
        <p>※ 最終値は 5 の倍数になるように切り捨てる</p>
      </DetailsBlock>

      <DetailsBlock title="ドロップ［コア、魔触媒］">
        <CoreMaterialTable rows={coreMaterialRows} />
      </DetailsBlock>
    </div>
  );
}

export default function EnemyFormulaPage() {
  return (
    <StaticPage
      current="enemy"
      title="計算式"
      backHref={TOOL_CONFIG.enemy.href}
      sections={[
        {
          title: "概要",
          hideTitle: true,
          paragraphs: [
            <p key="formula-lead" className={BODY_TEXT_CLASS}>
              {TOOL_CONFIG.enemy.toolLabel} で使用している計算式をまとめています。
              CR、ランク、タイプの係数や能力値、識別難易度、特技例などがどのように算出されるかを確認できます。
              <br />
              この計算式は公式の
              <Link
                href={EXTERNAL_LINKS.enemyDataGuide}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                「ログ・ホライズンTRPGエネミーデータガイド（高CR対応拡張版）」
              </Link>
              のJavaScriptから計算式を求めて反映させています。
            </p>,
          ],
        },
        {
          title: "大種族「ギミック」のエネミーランク",
          hideTitle: true,
          paragraphs: [
            <GimmickRankNotice key="gimmick-rank-notice" />,
          ],
        },
        {
          title: "各タイプの基本データ",
          paragraphs: [<BaseDataSection key="base-data" />],
        },
        {
          title: "各数値の計算式",
          paragraphs: [<CalculationFormulaSection key="formulas" />],
        },
      ]}
    />
  );
}
