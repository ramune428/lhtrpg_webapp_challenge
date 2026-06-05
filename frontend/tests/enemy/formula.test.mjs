import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateEnemyValues,
  enemyTypes,
} from "../../utils/createEnemyPiece.ts";
import {
  calculateExpectedExplicitGimmickValues,
  calculateExpectedNonGimmickValues,
  enemyFormulaCrValues,
  enemyFormulaRanks,
  enemyFormulaTypes,
} from "./formula-spec.mjs";

function pickNonGimmickValues(values) {
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
  };
}

function pickExplicitGimmickValues(values) {
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
  };
}

test("計算式ページに記載された9タイプが実装側に存在する", () => {
  const implementedTypes = enemyTypes.filter((enemyType) => enemyType !== "不明");

  assert.deepEqual(implementedTypes, enemyFormulaTypes);
});

for (const enemyType of enemyFormulaTypes) {
  for (const rank of enemyFormulaRanks) {
    test(`${enemyType} / ${rank} / CR1～30 が計算式ページと一致する`, () => {
      for (const cr of enemyFormulaCrValues) {
        const actual = calculateEnemyValues({
          enemyType,
          race: "人型",
          rank,
          cr,
        });
        const expected = calculateExpectedNonGimmickValues(enemyType, rank, cr);

        assert.deepEqual(
          pickNonGimmickValues(actual),
          expected,
          `${enemyType} / ${rank} / CR${cr}`,
        );
      }
    });
  }
}

for (const enemyType of enemyFormulaTypes) {
  for (const rank of enemyFormulaRanks) {
    test(`ギミック ${enemyType} / ${rank} / CR1～30 が明記された特殊条件と一致する`, () => {
      for (const cr of enemyFormulaCrValues) {
        const actual = calculateEnemyValues({
          enemyType,
          race: "ギミック",
          rank,
          cr,
        });
        const expected = calculateExpectedExplicitGimmickValues(
          enemyType,
          rank,
          cr,
        );

        assert.deepEqual(
          pickExplicitGimmickValues(actual),
          expected,
          `ギミック ${enemyType} / ${rank} / CR${cr}`,
        );
      }
    });
  }
}
