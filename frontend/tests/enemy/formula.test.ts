import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateEnemyValues,
  enemyTypes,
} from "../../utils/enemy/index";
import type {
  EnemyRank,
  EnemyType,
} from "../../utils/enemy/index";
import {
  calculateExpectedExplicitGimmickValues,
  calculateExpectedNonGimmickValues,
  enemyFormulaCrValues,
  enemyFormulaRanks,
  enemyFormulaTypes,
} from "./formula-spec.mjs";

type CalculatedValues = ReturnType<typeof calculateEnemyValues>;
type FormulaEnemyType = Exclude<EnemyType, "不明">;

const typedEnemyFormulaTypes =
  enemyFormulaTypes as readonly FormulaEnemyType[];

const typedEnemyFormulaRanks =
  enemyFormulaRanks as readonly EnemyRank[];

const typedEnemyFormulaCrValues =
  enemyFormulaCrValues as readonly number[];

function pickNonGimmickValues(values: CalculatedValues) {
  return {
    strength: values.strength,
    dexterity: values.dexterity,
    power: values.power,
    intelligence: values.intelligence,
    avoid: values.avoid,
    avoidDice: values.avoidDice,
    resist: values.resist,
    resistDice: values.resistDice,
    physicalDefense: values.physicalDefense,
    magicDefense: values.magicDefense,
    hitPoint: values.hitPoint,
    hate: values.hate,
    action: values.action,
    move: values.move,
    basicAttackType: values.basicAttackType,
    basicTarget: values.basicTarget,
    basicRange: values.basicRange,
    role: values.role,
    damage: values.damage,
    gold: values.gold,
    dropCore: values.dropCore,
    dropCatalyst: values.dropCatalyst,
  };
}

function pickExplicitGimmickValues(values: CalculatedValues) {
  return {
    strength: values.strength,
    dexterity: values.dexterity,
    power: values.power,
    intelligence: values.intelligence,
    physicalDefense: values.physicalDefense,
    magicDefense: values.magicDefense,
    hitPoint: values.hitPoint,
    hate: values.hate,
    action: values.action,
    move: values.move,
    damage: values.damage,
    gold: values.gold,
    dropCore: values.dropCore,
    dropCatalyst: values.dropCatalyst,
  };
}

test("計算式ページに記載された9タイプが実装側に存在する", () => {
  const implementedTypes = enemyTypes.filter(
    (enemyType): enemyType is FormulaEnemyType => enemyType !== "不明",
  );

  assert.deepEqual(implementedTypes, typedEnemyFormulaTypes);
});

test(
  "ノーマル／モブのヘイト倍率は (CR × CR係数) / 6 + 固定値 の最終結果を切り捨てる",
  () => {
    const result = calculateEnemyValues({
      enemyType: "フェンサー",
      race: "人型",
      rank: "ノーマル",
      cr: 10,
    });

    assert.equal(result.hate, 4);
  },
);

test(
  "CR係数が0のタイプはノーマル／モブでもヘイト倍率が固定値のままになる",
  () => {
    const result = calculateEnemyValues({
      enemyType: "アーマラー",
      race: "人型",
      rank: "ノーマル",
      cr: 30,
    });

    assert.equal(result.hate, 1);
  },
);

test("ボス／レイドのヘイト倍率は CR / 2.4 + 4 の最終結果を切り捨てる", () => {
  for (const rank of ["ボス", "レイド"] as const) {
    assert.equal(
      calculateEnemyValues({
        enemyType: "アーマラー",
        race: "人型",
        rank,
        cr: 9,
      }).hate,
      7,
      `${rank} / CR9`,
    );

    assert.equal(
      calculateEnemyValues({
        enemyType: "アーマラー",
        race: "人型",
        rank,
        cr: 30,
      }).hate,
      16,
      `${rank} / CR30`,
    );
  }
});

test("ギミックはボス／レイドを含む全ランクでヘイト倍率が0になる", () => {
  for (const rank of typedEnemyFormulaRanks) {
    const result = calculateEnemyValues({
      enemyType: "フェンサー",
      race: "ギミック",
      rank,
      cr: 30,
    });

    assert.equal(result.hate, 0, `ギミック / ${rank}`);
  }
});

test("アーチャーとボマーだけ基本攻撃ダメージに係数を適用する", () => {
  const cr = 10;

  assert.equal(
    calculateEnemyValues({
      enemyType: "スピア",
      race: "人型",
      rank: "ノーマル",
      cr,
    }).damage,
    "79 + 2 D",
  );
  assert.equal(
    calculateEnemyValues({
      enemyType: "アーチャー",
      race: "人型",
      rank: "ノーマル",
      cr,
    }).damage,
    "70 + 2 D",
  );
  assert.equal(
    calculateEnemyValues({
      enemyType: "シューター",
      race: "人型",
      rank: "ノーマル",
      cr,
    }).damage,
    "71 + 2 D",
  );
  assert.equal(
    calculateEnemyValues({
      enemyType: "ボマー",
      race: "人型",
      rank: "ノーマル",
      cr,
    }).damage,
    "59 + 2 D",
  );
});

test("金銭は通常金額を5G丸めしてからランク補正を適用する", () => {
  assert.equal(
    calculateEnemyValues({
      enemyType: "アーマラー",
      race: "人型",
      rank: "ノーマル",
      cr: 1,
    }).gold,
    "換金(20 G)",
  );

  assert.equal(
    calculateEnemyValues({
      enemyType: "アーマラー",
      race: "人型",
      rank: "モブ",
      cr: 1,
    }).gold,
    "換金(10 G)",
  );

  assert.equal(
    calculateEnemyValues({
      enemyType: "アーマラー",
      race: "人型",
      rank: "ボス",
      cr: 1,
    }).gold,
    "換金(80 G)",
  );
});

test("ボス／レイドはコア素材とCR+1の魔触媒を持つ", () => {
  for (const rank of ["ボス", "レイド"] as const) {
    const result = calculateEnemyValues({
      enemyType: "アーマラー",
      race: "人型",
      rank,
      cr: 9,
    });

    assert.equal(result.dropCore, "コア素材[CR9] (180 G)");
    assert.equal(result.dropCatalyst, "魔触媒10 (110 G)");
  }
});

for (const enemyType of typedEnemyFormulaTypes) {
  for (const rank of typedEnemyFormulaRanks) {
    test(`${enemyType} / ${rank} / CR1～30 が計算式ページと一致する`, () => {
      for (const cr of typedEnemyFormulaCrValues) {
        const actual = calculateEnemyValues({
          enemyType,
          race: "人型",
          rank,
          cr,
        });

        const expected = calculateExpectedNonGimmickValues(
          enemyType,
          rank,
          cr,
        );

        assert.deepEqual(
          pickNonGimmickValues(actual),
          expected,
          `${enemyType} / ${rank} / CR${cr}`,
        );
      }
    });
  }
}

for (const enemyType of typedEnemyFormulaTypes) {
  for (const inputRank of typedEnemyFormulaRanks) {
    test(
      `ギミック ${enemyType} / 入力ランク${inputRank} / CR1～30 がノーマル相当の特殊条件と一致する`,
      () => {
        for (const cr of typedEnemyFormulaCrValues) {
          const actual = calculateEnemyValues({
            enemyType,
            race: "ギミック",
            rank: inputRank,
            cr,
          });

          const expected = calculateExpectedExplicitGimmickValues(
            enemyType,
            "ノーマル",
            cr,
          );

          assert.deepEqual(
            pickExplicitGimmickValues(actual),
            expected,
            `ギミック ${enemyType} / 入力ランク${inputRank} / CR${cr}`,
          );
        }
      },
    );
  }
}
