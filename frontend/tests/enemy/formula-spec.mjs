// This file mirrors the values and formulas documented in
// app/enemy/formula/page.tsx. Do not derive expected values from production code.

export const enemyFormulaTypes = [
  "アーマラー",
  "フェンサー",
  "グラップラー",
  "サポーター",
  "ヒーラー",
  "スピア",
  "アーチャー",
  "シューター",
  "ボマー",
];

export const enemyFormulaRanks = ["モブ", "ノーマル", "ボス", "レイド"];

export const enemyFormulaCrValues = Array.from({ length: 30 }, (_, index) => index + 1);

export const enemyFormulaBaseData = {
  アーマラー: {
    str: 7,
    dex: 3,
    pow: 4,
    int: 2,
    avoidCoefficient: 1.2,
    avoidFix: 4,
    resistCoefficient: 1.1,
    resistFix: 2,
    physicalDefenseCoefficient: 2.2,
    physicalDefenseFix: 8,
    magicDefenseCoefficient: 1.7,
    magicDefenseFix: 2,
    hitPointCoefficient: 8.5,
    hitPointFix: 48,
    actionFix: -2,
    hateCr: 0,
    hateFix: 1,
    basicAttackType: "melee",
    basicAttackRoleFix: 2,
    basicAttackRoleDice: 2,
    basicTarget: "single",
    basicRange: 0,
  },
  フェンサー: {
    str: 7,
    dex: 4,
    pow: 2,
    int: 3,
    avoidCoefficient: 1.1,
    avoidFix: 4,
    resistCoefficient: 1.1,
    resistFix: 2,
    physicalDefenseCoefficient: 1.7,
    physicalDefenseFix: 5,
    magicDefenseCoefficient: 1.7,
    magicDefenseFix: 1,
    hitPointCoefficient: 8.4,
    hitPointFix: 45,
    actionFix: -2,
    hateCr: 2,
    hateFix: 1,
    basicAttackType: "melee",
    basicAttackRoleFix: 2,
    basicAttackRoleDice: 2,
    basicTarget: "single",
    basicRange: 0,
  },
  グラップラー: {
    str: 7,
    dex: 4,
    pow: 2,
    int: 3,
    avoidCoefficient: 1.1,
    avoidFix: 2,
    resistCoefficient: 1.1,
    resistFix: 4,
    physicalDefenseCoefficient: 0.9,
    physicalDefenseFix: 2,
    magicDefenseCoefficient: 1.3,
    magicDefenseFix: 3,
    hitPointCoefficient: 7.5,
    hitPointFix: 45,
    actionFix: 0,
    hateCr: 0,
    hateFix: 1,
    basicAttackType: "melee",
    basicAttackRoleFix: 2,
    basicAttackRoleDice: 2,
    basicTarget: "single",
    basicRange: 0,
  },
  サポーター: {
    str: 4,
    dex: 2,
    pow: 7,
    int: 3,
    avoidCoefficient: 1.2,
    avoidFix: 2,
    resistCoefficient: 1.1,
    resistFix: 7,
    physicalDefenseCoefficient: 1.5,
    physicalDefenseFix: 3,
    magicDefenseCoefficient: 1.8,
    magicDefenseFix: 5,
    hitPointCoefficient: 5,
    hitPointFix: 35,
    actionFix: 2,
    hateCr: 0,
    hateFix: 1,
    basicAttackType: "magical",
    basicAttackRoleFix: 2,
    basicAttackRoleDice: 2,
    basicTarget: "single",
    basicRange: 4,
  },
  ヒーラー: {
    str: 3,
    dex: 2,
    pow: 7,
    int: 4,
    avoidCoefficient: 1.2,
    avoidFix: 2,
    resistCoefficient: 1.1,
    resistFix: 7,
    physicalDefenseCoefficient: 1.8,
    physicalDefenseFix: 8,
    magicDefenseCoefficient: 1.7,
    magicDefenseFix: 1,
    hitPointCoefficient: 6,
    hitPointFix: 30,
    actionFix: -2,
    hateCr: 0,
    hateFix: 1,
    basicAttackType: "melee",
    basicAttackRoleFix: 2,
    basicAttackRoleDice: 2,
    basicTarget: "single",
    basicRange: 2,
  },
  スピア: {
    str: 4,
    dex: 7,
    pow: 2,
    int: 3,
    avoidCoefficient: 1.2,
    avoidFix: 7,
    resistCoefficient: 1.1,
    resistFix: 2,
    physicalDefenseCoefficient: 1.7,
    physicalDefenseFix: 5,
    magicDefenseCoefficient: 1.5,
    magicDefenseFix: 3,
    hitPointCoefficient: 6,
    hitPointFix: 30,
    actionFix: 0,
    hateCr: 0,
    hateFix: 2,
    basicAttackType: "melee",
    basicAttackRoleFix: 1,
    basicAttackRoleDice: 3,
    basicTarget: "single",
    basicRange: 0,
  },
  アーチャー: {
    str: 3,
    dex: 4,
    pow: 2,
    int: 7,
    avoidCoefficient: 1.1,
    avoidFix: 4,
    resistCoefficient: 1.1,
    resistFix: 2,
    physicalDefenseCoefficient: 1.6,
    physicalDefenseFix: 6,
    magicDefenseCoefficient: 1.9,
    magicDefenseFix: 5,
    hitPointCoefficient: 5,
    hitPointFix: 26,
    actionFix: 0,
    hateCr: 2,
    hateFix: 2,
    basicAttackType: "shooting",
    basicAttackRoleFix: 0,
    basicAttackRoleDice: 3,
    basicTarget: "single",
    basicRange: 3,
  },
  シューター: {
    str: 3,
    dex: 2,
    pow: 5,
    int: 7,
    avoidCoefficient: 1.2,
    avoidFix: 2,
    resistCoefficient: 1.1,
    resistFix: 5,
    physicalDefenseCoefficient: 1.3,
    physicalDefenseFix: 3,
    magicDefenseCoefficient: 1.9,
    magicDefenseFix: 5,
    hitPointCoefficient: 4,
    hitPointFix: 26,
    actionFix: 1,
    hateCr: 2,
    hateFix: 2,
    basicAttackType: "magical",
    basicAttackRoleFix: 0,
    basicAttackRoleDice: 3,
    basicTarget: "single",
    basicRange: 4,
  },
  ボマー: {
    str: 3,
    dex: 2,
    pow: 5,
    int: 7,
    avoidCoefficient: 1.2,
    avoidFix: 2,
    resistCoefficient: 1.1,
    resistFix: 5,
    physicalDefenseCoefficient: 1.3,
    physicalDefenseFix: 3,
    magicDefenseCoefficient: 1.9,
    magicDefenseFix: 5,
    hitPointCoefficient: 4,
    hitPointFix: 26,
    actionFix: -2,
    hateCr: 2,
    hateFix: 2,
    basicAttackType: "magical",
    basicAttackRoleFix: 0,
    basicAttackRoleDice: 3,
    basicTarget: "multi",
    basicRange: 4,
  },
};

const corePriceList = [
  30, 40, 50, 60, 80, 100, 120, 140, 180, 220, 240, 300, 340, 380, 440, 500,
  560, 620, 680, 740, 820, 900, 980, 1060, 1160, 1240, 1340, 1440, 1540, 1640,
  1760,
];

const catalystPriceList = [
  15, 20, 25, 30, 40, 50, 60, 70, 90, 110, 120, 150, 170, 190, 220, 250, 280,
  310, 340, 370, 410, 450, 490, 530, 580, 620, 670, 720, 770, 820, 880,
];

function getListValue(list, index) {
  return list[index] ?? list[list.length - 1];
}

function calculateNormalHitPoint(baseData, cr) {
  return Math.floor(cr * baseData.hitPointCoefficient + baseData.hitPointFix);
}

function calculateHitPoint(baseData, rank, cr, isGimmick) {
  const normalHitPoint = calculateNormalHitPoint(baseData, cr);

  if (isGimmick || rank === "モブ") {
    return Math.floor(normalHitPoint / 2);
  }

  if (rank === "ボス") {
    return normalHitPoint * 4;
  }

  if (rank === "レイド") {
    return normalHitPoint * 10;
  }

  return normalHitPoint;
}

function calculateHate(baseData, rank, cr, isGimmick) {
  if (isGimmick) {
    return 0;
  }

  if (rank === "ボス" || rank === "レイド") {
    return Math.floor(cr / 2.4 + 4);
  }

  return Math.floor((cr + baseData.hateCr) / 6 + baseData.hateFix);
}

function calculateDefenseDice(enemyType, rank) {
  const dice = enemyType === "グラップラー" ? 3 : 2;

  if (rank === "モブ") {
    return { fixedBonus: dice * 3, dice: 0 };
  }

  return { fixedBonus: 0, dice };
}

function calculateDamageTotal(enemyType, cr) {
  switch (enemyType) {
    case "アーマラー":
    case "フェンサー":
    case "グラップラー":
    case "ヒーラー":
      return cr * 3.5 + 8 + 8;
    case "サポーター":
      return cr * 3.5 + 8;
    case "スピア":
      return cr * 6 + 18 + 8;
    case "アーチャー":
      return (cr * 6 + 18 + 8) * 0.9;
    case "シューター":
      return cr * 6 + 18;
    case "ボマー":
      return (cr * 6 + 18) * 0.85;
  }
}

function calculateDamage(enemyType, cr) {
  return `${Math.floor(calculateDamageTotal(enemyType, cr)) - 7} + 2 D`;
}

function calculateGold(rank, cr, isGimmick) {
  const normalGold = Math.floor((cr + 2) * (cr + 2) * 0.72 + 17);

  if (isGimmick || rank === "モブ") {
    return `換金(${Math.floor(normalGold / 2)} G)`;
  }

  if (rank === "ボス" || rank === "レイド") {
    return `換金(${normalGold * 4} G)`;
  }

  return `換金(${normalGold} G)`;
}

function calculateDropCore(rank, cr) {
  if (rank === "ボス" || rank === "レイド") {
    return `コア素材[CR${cr}] (${getListValue(corePriceList, cr - 1)} G)`;
  }

  return "コア素材 なし";
}

function calculateDropCatalyst(rank, cr) {
  const catalystIndex = rank === "ボス" || rank === "レイド" ? cr : cr - 1;
  const catalystStrength = rank === "ボス" || rank === "レイド" ? cr + 1 : cr;

  return `魔触媒${catalystStrength} (${getListValue(catalystPriceList, catalystIndex)} G)`;
}

export function calculateExpectedNonGimmickValues(enemyType, rank, cr) {
  const baseData = enemyFormulaBaseData[enemyType];
  const avoidDice = calculateDefenseDice(enemyType, rank);
  const resistDice = calculateDefenseDice(enemyType, rank);
  const roleValue =
    Math.floor((cr * 1.1 + 7) / 3) + baseData.basicAttackRoleFix;
  const role =
    rank === "モブ"
      ? `${roleValue + baseData.basicAttackRoleDice * 3}[固定]`
      : `${roleValue} + ${baseData.basicAttackRoleDice} D`;

  return {
    strength: Math.floor((cr * 1.1 + baseData.str) / 3),
    dexterity: Math.floor((cr * 1.1 + baseData.dex) / 3),
    power: Math.floor((cr * 1.1 + baseData.pow) / 3),
    intelligence: Math.floor((cr * 1.1 + baseData.int) / 3),
    avoid:
      Math.floor((cr * baseData.avoidCoefficient + baseData.avoidFix) / 3) +
      avoidDice.fixedBonus,
    avoidDice: avoidDice.dice,
    resist:
      Math.floor((cr * baseData.resistCoefficient + baseData.resistFix) / 3) +
      resistDice.fixedBonus,
    resistDice: resistDice.dice,
    physicalDefense: Math.floor(
      cr * baseData.physicalDefenseCoefficient + baseData.physicalDefenseFix,
    ),
    magicDefense: Math.floor(
      cr * baseData.magicDefenseCoefficient + baseData.magicDefenseFix,
    ),
    hitPoint: calculateHitPoint(baseData, rank, cr, false),
    hate: calculateHate(baseData, rank, cr, false),
    action:
      Math.floor((cr * 1.1 + 7) / 3) +
      Math.floor((cr * 1.1 + 3) / 3) +
      baseData.actionFix,
    move: 2,
    basicAttackType: baseData.basicAttackType,
    basicTarget: baseData.basicTarget,
    basicRange: baseData.basicRange,
    role,
    damage: calculateDamage(enemyType, cr),
    gold: calculateGold(rank, cr, false),
    dropCore: calculateDropCore(rank, cr),
    dropCatalyst: calculateDropCatalyst(rank, cr),
  };
}

export function calculateExpectedExplicitGimmickValues(enemyType, rank, cr) {
  const baseData = enemyFormulaBaseData[enemyType];

  return {
    strength: 0,
    dexterity: 0,
    power: 0,
    intelligence: 0,
    physicalDefense: Math.floor(
      cr * baseData.physicalDefenseCoefficient + baseData.physicalDefenseFix,
    ),
    magicDefense: Math.floor(
      cr * baseData.magicDefenseCoefficient + baseData.magicDefenseFix,
    ),
    hitPoint: calculateHitPoint(baseData, rank, cr, true),
    hate: calculateHate(baseData, rank, cr, true),
    action: 0,
    move: 0,
    damage: calculateDamage(enemyType, cr),
    gold: calculateGold(rank, cr, true),
    dropCore: calculateDropCore(rank, cr),
    dropCatalyst: calculateDropCatalyst(rank, cr),
  };
}
