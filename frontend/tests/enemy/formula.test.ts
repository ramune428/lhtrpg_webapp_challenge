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

test("formula types exist", () => {
  const implementedTypes = enemyTypes.filter(
    (enemyType): enemyType is FormulaEnemyType => enemyType !== "不明",
  );

  assert.deepEqual(implementedTypes, typedEnemyFormulaTypes);
});

test("normal hate uses CR plus hate bonus", () => {
  assert.equal(
    calculateEnemyValues({
      enemyType: "スピア",
      race: "人型",
      rank: "ノーマル",
      cr: 25,
    }).hate,
    6,
  );

  assert.equal(
    calculateEnemyValues({
      enemyType: "アーマラー",
      race: "人型",
      rank: "ノーマル",
      cr: 30,
    }).hate,
    6,
  );
});

test("boss and raid hate uses CR / 2.4 + 4", () => {
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

test("gimmick hate is always 0", () => {
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

test("only bomber applies a basic damage coefficient", () => {
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
    "79 + 2 D",
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

test("gold uses official drop expectation integer values", () => {
  assert.equal(
    calculateEnemyValues({
      enemyType: "アーマラー",
      race: "人型",
      rank: "ノーマル",
      cr: 1,
    }).gold,
    "換金(23 G)",
  );

  assert.equal(
    calculateEnemyValues({
      enemyType: "スピア",
      race: "人型",
      rank: "ノーマル",
      cr: 25,
    }).gold,
    "換金(541 G)",
  );

  assert.equal(
    calculateEnemyValues({
      enemyType: "アーマラー",
      race: "人型",
      rank: "モブ",
      cr: 1,
    }).gold,
    "換金(11 G)",
  );

  assert.equal(
    calculateEnemyValues({
      enemyType: "アーマラー",
      race: "人型",
      rank: "ボス",
      cr: 1,
    }).gold,
    "換金(92 G)",
  );
});

test("boss and raid drops use core and CR+1 catalyst", () => {
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
    test(`${enemyType} / ${rank} / CR1-30 matches formula spec`, () => {
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
      `gimmick ${enemyType} / input rank ${inputRank} / CR1-30 matches normal-rank special rules`,
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
            `ギミック ${enemyType} / ${inputRank} / CR${cr}`,
          );
        }
      },
    );
  }
}
