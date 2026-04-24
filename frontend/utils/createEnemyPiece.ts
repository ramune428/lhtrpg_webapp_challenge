import * as XLSX from "xlsx";

export const enemyRanks = ["モブ", "ノーマル", "ボス", "レイド"] as const;
export type EnemyRank = (typeof enemyRanks)[number];

export const enemyTypes = [
  "アーマラー",
  "フェンサー",
  "グラップラー",
  "サポーター",
  "ヒーラー",
  "スピア",
  "アーチャー",
  "シューター",
  "ボマー",
  "不明",
] as const;
export type EnemyType = (typeof enemyTypes)[number];

export const enemyRaces = [
  "人型",
  "自然",
  "精霊",
  "幻獣",
  "不死",
  "人造",
  "人間",
  "ギミック",
] as const;
export type EnemyRace = (typeof enemyRaces)[number];

export const popularityList = [
  "超有名",
  "有名",
  "一般的",
  "普通",
  "珍しい",
  "無名",
  "秘密",
] as const;
export type EnemyPopularity = (typeof popularityList)[number];

export const skillTimings = [
  "常時",
  "セットアップ",
  "ムーブ",
  "マイナー",
  "メジャー",
  "クリンナップ",
  "インスタント",
  "行動",
  "ダメージロール",
  "判定直前",
  "判定直後",
  "ダメージ適用直前",
  "ダメージ適用直後",
  "本文",
  "EXパワー",
] as const;

export type EnemySkillInput = {
  name: string;
  tags: string;
  timing: string;
  roleAttack: string;
  roleDefense: string;
  target: string;
  range: string;
  limit: string;
  effect: string;
};

export type EnemyDropItemInput = {
  dice: string;
  name: string;
  description: string;
};

export type EnemyFormData = {
  name: string;
  rank: EnemyRank;
  cr: number;
  enemyType: EnemyType;
  race: EnemyRace;
  popularity: EnemyPopularity;
  identification: string;
  tags: string;
  memo: string;
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
  skills: EnemySkillInput[];
  items: EnemyDropItemInput[];
};

type EnemyDataDefinition = {
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
  base_basicAttackType: "melee" | "shooting" | "magical";
  base_basicAttackRole_fix: number;
  base_basicAttackRoleDice: number;
  base_basicTarget: "single" | "multi";
  base_basicRange: number;
  explanation: string;
};

const enemyDataMap: Record<EnemyType, EnemyDataDefinition> = {
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
    explanation:
      "【物理防御力】と【最大ＨＰ】に秀でる反面【行動力】は低いエネミーです。クラスで言うと〈守護戦士〉にちかいでしょう。仲間を守る特技やＰＣの移動を阻害する特技を与えるべきです。このＥタイプのエネミーは倒しにくい反面、ＰＣに脅威を感じさせることには向いていません。過剰に出すとセッションが停滞します。またソロボスにも向きません。『ＬＨＺ』記載の代表的なエネミーは〈鉄躯緑鬼〉（P４４４）です。",
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
    explanation:
      "アーマラーほどではありませんが、【物理防御力】と【最大ＨＰ】に秀で、【行動力】は低いエネミーです。クラスで言うと〈武士〉にちかいでしょう。仲間を守る特技や反撃する特技を与えるべきです。このＥタイプのエネミーはＰＣに先に倒してしまおうと思わせることに向いています。比較的ソロボスにむいています。『ＬＨＺ』記載の代表的なエネミーは〈吸血鬼〉（P４５７）です。",
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
    explanation:
      "【最大ＨＰ】と［防御判定］に秀でる反面、【防御力】が低いエネミーです。仲間を守る特技やＰＣの妨害、反撃をする特技を与えるべきです。このＥタイプのエネミーはかなり倒しにくい反面、ＰＣに脅威を感じさせることには向いていません。過剰に出すとセッションが停滞します。〈武闘家〉と似た特性をもっていますが、ヘイトルールの存在もありエネミーの役割やデザインは〈武闘家〉からはなれ、ある種の妨害役と考えるべきです。またボスそのものにも向いていません。『ＬＨＺ』記載の代表的なエネミーは〈屍食少女〉（P４３６）です。",
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
    explanation:
      "【抵抗値】と【行動力】に秀でる反面、物理的な攻撃に弱いエネミーです。クラスで言うと〈吟遊詩人〉〈付与術師〉にちかいでしょう。仲間をサポートする特技やＰＣにさまざまな妨害を行なう特技を与えるべきです。CR３以上の環境では、強力なBSや地形支配の要素をもつこともあります。このＥタイプのエネミーは、単体でＰＣに脅威を感じさせることは難しいでしょう。群れボスに向いています。『ＬＨＺ』記載の代表的なエネミーは〈棘茨イタチ〉（P４２４）です。",
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
    explanation:
      "【抵抗値】に秀で、【防御力】もやや高いものの、トータルではあまり打たれづよくないエネミーです。仲間を守る特技を中心に与えるべきです。このＥタイプのエネミーは攻撃が得意ではないため、単体でＰＣに脅威を感じさせることは難しいでしょう。〈施療神官〉〈森呪使い〉〈神祇官〉にちかいEタイプですが過剰な回復能力は戦闘に停滞をもたらす可能性もあります。支援系の能力に切り替えるなどの工夫が必要でしょう。群れボスに向いています。『ＬＨＺ』記載の代表的なエネミーは〈一角獣〉（P４４９）です。",
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
    explanation:
      "【回避値】が高く、もっとも高い物理ダメージを与えることができるエネミーです。クラスで言うと〈暗殺者〉〈盗剣士〉にちかいでしょう。ＢＳや追加ダメージを与える特技、自身の移動を強化する特技を与えるべきです。このＥタイプのエネミーは、ＰＣに脅威を感じさせることに向いていて、低ＣＲからつかいやすく高ＣＲまでエネミーアタッカーの主力として活躍できます。ソロボスおよび群れボスのどちらにも向いています。『ＬＨＺ』記載の代表的なエネミーは〈刃のマスカルウィン〉（P４６７）です。",
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
    explanation:
      "［射撃攻撃］を用い、射程３～４の距離から物理ダメージを与えてくるエネミーです。【魔法防御力】にもやや秀でますが、同一Ｓｑを対象とした攻撃は苦手です。クラスで言うと〈暗殺者〉にちかいでしょう。ＰＣを強制的に移動させる特技や、ダメージ追加特技を与えるべきです。このＥタイプのエネミーは、他のエネミーとの連携をイメージしてデザインするとよいでしょう。スピアタイプと比較した場合、移動の必要なく、集中攻撃が可能であるという特徴があります。作成には注意が必要です。ソロボスおよび群れボスのどちらにも向いています。『ＬＨＺ』記載の代表的なエネミーは〈時計仕掛の蜻蛉〉（P４３３）です。",
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
    explanation:
      "単体に対する［魔法攻撃］を用い、遠くから魔法ダメージを与えてくるエネミーです。「攻撃判定」や【行動力】に秀でる反面、【ＨＰ】や【物理防御力】は低くなっています。クラスで言うと〈妖術師〉〈召喚術師〉にちかく、アーチャーに似た特性を持っています。ＢＳや追加ダメージを与える特技を与えるべきです。このＥタイプのエネミーは攻撃を得意とする反面打たれ弱いので、他のエネミーとの連携をイメージしてデザインするとよいでしょう。『ＬＨＺ』記載の代表的なエネミーは〈小牙竜鬼の詠唱師〉（P４２２）です。",
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
    explanation:
      "範囲に対する［魔法攻撃］を用い、遠くから魔法ダメージを与えてくるエネミーです。シューターと同様、「攻撃判定」に秀でる反面【ＨＰ】や【物理防御力】は相応に低くなっています。クラスで言うと〈妖術師〉にちかいでしょう。広範囲（選択）に魔法攻撃を行う特技やBSを与える特技を与えるべきです。このＥタイプのエネミーは戦局を左右する能力がありますから弱点なども含めて設計するとよいでしょう。『ＬＨＺ』記載の代表的なエネミーは〈白姫のヘイグロト〉（P４６５）です。",
  },
  不明: {
    base_str: 0,
    base_dex: 0,
    base_pow: 0,
    base_int: 0,
    base_avoid_coefficient: 0,
    base_avoid_fix: 0,
    base_resist_coefficient: 0,
    base_resist_fix: 0,
    base_pd_coefficient: 0,
    base_pd_fix: 0,
    base_md_coefficient: 0,
    base_md_fix: 0,
    base_hp_coefficient: 0,
    base_hp_fix: 0,
    base_action_fix: 0,
    base_hateCr: 0,
    base_hate_fix: 0,
    base_damageAll_coefficient: 0,
    base_aggression_coefficient: 0,
    base_basicAttackType: "melee",
    base_basicAttackRole_fix: 0,
    base_basicAttackRoleDice: 0,
    base_basicTarget: "single",
    base_basicRange: 0,
    explanation: "",
  },
};

const popularityDiffMap: Record<EnemyPopularity, "自動" | number> = {
  超有名: "自動",
  有名: 2,
  一般的: 4,
  普通: 6,
  珍しい: 7,
  無名: 9,
  秘密: 12,
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

export type EnemyCalculatedValues = {
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
  basicAttackType: "melee" | "shooting" | "magical";
  basicTarget: "single" | "multi";
  basicRange: number;
  role: string;
  damage: string;
  gold: string;
  dropCore: string;
  dropCatalyst: string;
  explanation: string;
};

export function normalizeText(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

export function splitTags(value: string): string[] {
  return value
    .split(/[、，,]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function createEmptySkillInput(): EnemySkillInput {
  return {
    name: "",
    tags: "",
    timing: "メジャー",
    roleAttack: "",
    roleDefense: "",
    target: "",
    range: "",
    limit: "",
    effect: "",
  };
}

export function createEmptyDropItemInput(): EnemyDropItemInput {
  return {
    dice: "",
    name: "",
    description: "",
  };
}

export function getDefaultTags(rank: EnemyRank, race: EnemyRace): string {
  return rank === "ノーマル" ? race : `${rank}、${race}`;
}

function getCombinedTags(data: Pick<EnemyFormData, "rank" | "race" | "tags">): string[] {
  const initialTags = splitTags(getDefaultTags(data.rank, data.race));
  const customTags = splitTags(data.tags);
  return [...new Set([...initialTags, ...customTags])];
}

export function getCombinedTagText(
  data: Pick<EnemyFormData, "rank" | "race" | "tags">,
  delimiter = ","
): string {
  return getCombinedTags(data).join(delimiter);
}

export function calculateIdentification(
  popularity: EnemyPopularity,
  cr: number
): string {
  const value = popularityDiffMap[popularity];
  if (value === "自動") {
    return "自動成功";
  }
  return String(value + Math.floor((cr - 1) / 3 + 1));
}

export function getEnemyTypeExplanation(enemyType: EnemyType): string {
  return enemyDataMap[enemyType].explanation;
}

function getDamageBase(enemyType: EnemyType, cr: number): number {
  if (["アーマラー", "フェンサー", "グラップラー", "ヒーラー"].includes(enemyType)) {
    return cr * 3.5 + 8 + 8;
  }
  if (enemyType === "サポーター") {
    return cr * 3.5 + 8;
  }
  if (["スピア", "アーチャー"].includes(enemyType)) {
    return cr * 6 + 18 + 8;
  }
  if (["シューター", "ボマー"].includes(enemyType)) {
    return cr * 6 + 18;
  }
  return 0;
}

export function calculateEnemyValues(args: {
  enemyType: EnemyType;
  race: EnemyRace;
  rank: EnemyRank;
  cr: number;
}): EnemyCalculatedValues {
  const { enemyType, race, rank, cr } = args;
  const data = enemyDataMap[enemyType];

  const strength = race === "ギミック" ? 0 : Math.floor((cr * 1.1 + data.base_str) / 3);
  const dexterity = race === "ギミック" ? 0 : Math.floor((cr * 1.1 + data.base_dex) / 3);
  const power = race === "ギミック" ? 0 : Math.floor((cr * 1.1 + data.base_pow) / 3);
  const intelligence = race === "ギミック" ? 0 : Math.floor((cr * 1.1 + data.base_int) / 3);

  let avoid = Math.floor((cr * data.base_avoid_coefficient + data.base_avoid_fix) / 3);
  let avoidDice = enemyType === "グラップラー" ? 3 : 2;
  if (race === "ギミック" || rank === "モブ") {
    avoid += avoidDice * 3;
    avoidDice = 0;
  }

  let resist = Math.floor((cr * data.base_resist_coefficient + data.base_resist_fix) / 3);
  let resistDice = enemyType === "グラップラー" ? 3 : 2;
  if (race === "ギミック" || rank === "モブ") {
    resist += resistDice * 3;
    resistDice = 0;
  }

  const physicalDefense = Math.floor(cr * data.base_pd_coefficient + data.base_pd_fix);
  const magicDefense = Math.floor(cr * data.base_md_coefficient + data.base_md_fix);

  let hitPointBase = cr * data.base_hp_coefficient + data.base_hp_fix;
  if (race === "ギミック" || rank === "モブ") {
    hitPointBase /= 2;
  } else if (rank === "ボス") {
    hitPointBase *= 4;
  } else if (rank === "レイド") {
    hitPointBase *= 10;
  }
  const hitPoint = Math.floor(hitPointBase);

  const hate =
    rank === "ボス" || rank === "レイド"
      ? Math.floor(cr / 2.4 + 4)
      : race === "ギミック"
        ? 0
        : Math.floor((cr + data.base_hateCr) / 6 + data.base_hate_fix);

  const action =
    race === "ギミック"
      ? 0
      : Math.floor((cr * 1.1 + 7) / 3 + (cr * 1.1 + 3) / 3 + data.base_action_fix);

  const move = race === "ギミック" ? 0 : 2;
  const fate = 0;

  const roleValue = Math.floor((cr * 1.1 + 7) / 3 + data.base_basicAttackRole_fix);
  const roleDice = data.base_basicAttackRoleDice;
  const role =
    rank === "モブ"
      ? `${roleValue + roleDice * 3}[固定]`
      : `${roleValue} + ${roleDice} D`;

  const damage = `${Math.floor(getDamageBase(enemyType, cr) - 7)} + 2 D`;

  let gold = (cr + 2) * (cr + 2) * 0.72 + 17;
  if (race === "ギミック" || rank === "モブ") {
    gold /= 2;
  } else if (rank === "ボス" || rank === "レイド") {
    gold *= 4;
  }
  const goldRounded = Math.floor(gold) - (Math.floor(gold) % 5);

  const dropCore =
    rank === "ボス" || rank === "レイド"
      ? `コア素材[CR${cr}] (${corePriceList[cr - 1] ?? corePriceList[corePriceList.length - 1]} G)`
      : "なし";

  const catalystIndex = rank === "ボス" || rank === "レイド" ? cr : cr - 1;
  const catalystStrength = rank === "ボス" || rank === "レイド" ? cr + 1 : cr;
  const dropCatalyst = `魔触媒${catalystStrength} (${catalystPriceList[catalystIndex] ?? catalystPriceList[catalystPriceList.length - 1]} G)`;

  return {
    strength,
    dexterity,
    power,
    intelligence,
    avoid,
    avoidDice,
    resist,
    resistDice,
    physicalDefense,
    magicDefense,
    hitPoint,
    hate,
    action,
    move,
    fate,
    basicAttackType: data.base_basicAttackType,
    basicTarget: data.base_basicTarget,
    basicRange: data.base_basicRange,
    role,
    damage,
    gold: `換金(${goldRounded} G)`,
    dropCore,
    dropCatalyst,
    explanation: data.explanation,
  };
}

export function getSkillExample(values: EnemyCalculatedValues): EnemySkillInput {
  const attackTypeLabel =
    values.basicAttackType === "melee"
      ? "白兵攻撃"
      : values.basicAttackType === "shooting"
        ? "射撃攻撃"
        : "魔法攻撃";

  const defenseLabel = values.basicAttackType === "magical" ? "抵抗" : "回避";
  const targetLabel = values.basicTarget === "single" ? "単体" : "範囲(選択)";
  const rangeLabel = values.basicRange === 0 ? "至近" : `${values.basicRange}Sq`;
  const damageType = values.basicAttackType === "magical" ? "魔法" : "物理";

  return {
    name: "《基本攻撃手段》",
    tags: attackTypeLabel,
    timing: "メジャー",
    roleAttack: values.role,
    roleDefense: defenseLabel,
    target: targetLabel,
    range: rangeLabel,
    limit: "",
    effect: `対象に[${values.damage}]の${damageType}ダメージを与える。`,
  };
}

export function getGimmickSkill(): EnemySkillInput {
  return {
    name: "《意志なき機構》",
    tags: "-",
    timing: "常時",
    roleAttack: "",
    roleDefense: "",
    target: "-",
    range: "-",
    limit: "",
    effect:
      "このエネミーの攻撃ではヘイトダメージが発生せず、［ヘイトアンダー］の防御ボーナスも得られない。また、このエネミーを対象として「解除難易度：ｎ」の《プロップ解除》に成功すると、このエネミーは［戦闘不能］となる。さらにこのエネミーはムーブアクションを持たない。",
  };
}

export function getDefaultEnemyForm(): EnemyFormData {
  const rank: EnemyRank = "ノーマル";
  const enemyType: EnemyType = "アーマラー";
  const race: EnemyRace = "人型";
  const cr = 1;
  const popularity: EnemyPopularity = "一般的";
  const values = calculateEnemyValues({ enemyType, race, rank, cr });

  return {
    name: "",
    rank,
    cr,
    enemyType,
    race,
    popularity,
    identification: calculateIdentification(popularity, cr),
    tags: "",
    memo: "",
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
    fate: values.fate,
    skills: [createEmptySkillInput()],
    items: [createEmptyDropItemInput()],
  };
}

function parseRole(role: unknown): { roleAttack: string; roleDefense: string } {
  const text = typeof role === "string" ? role : "";
  const match = text.match(/対決（(.+?)／(.+?)）/);

  if (!match) {
    return { roleAttack: "", roleDefense: "" };
  }

  return {
    roleAttack: match[1] ?? "",
    roleDefense: match[2] ?? "",
  };
}

function asString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function sanitizeImportedPopularity(
  identificationValue: unknown,
  cr: number
): EnemyPopularity {
  if (identificationValue === "自動" || identificationValue === "自動成功") {
    return "超有名";
  }

  const identificationNumber = Number(identificationValue);
  if (!Number.isFinite(identificationNumber)) {
    return "一般的";
  }

  const diff = identificationNumber - Math.floor((cr - 1) / 3 + 1);
  const entry = Object.entries(popularityDiffMap).find(([, value]) => value === diff);
  return (entry?.[0] as EnemyPopularity | undefined) ?? "一般的";
}

export function parseEnemyJson(text: string): EnemyFormData {
  const parsed = JSON.parse(text) as Record<string, unknown>;

  if (parsed.index_type !== "エネミー") {
    throw new Error("エネミー用JSONではありません。index_type が「エネミー」ではありません。");
  }

  const rank = enemyRanks.includes(parsed.rank as EnemyRank)
    ? (parsed.rank as EnemyRank)
    : "ノーマル";

  const enemyType = enemyTypes.includes(parsed.type as EnemyType)
    ? (parsed.type as EnemyType)
    : "不明";

  const cr = Math.max(1, asNumber(parsed.character_rank, 1));

  const rawTags = Array.isArray(parsed.tags)
    ? parsed.tags.map((tag) => asString(tag))
    : [];

  const race = (enemyRaces.find((candidate) => rawTags.includes(candidate)) ??
    "人型") as EnemyRace;

  const popularity = sanitizeImportedPopularity(parsed.identification, cr);

  const ruby = asString(parsed.ruby);
  const displayName =
    ruby && ruby !== "null" ? `${asString(parsed.name)}${ruby}` : asString(parsed.name);

  const initialTagSet = new Set(splitTags(getDefaultTags(rank, race)));
  const customTags = rawTags.filter((tag) => !initialTagSet.has(tag));

  const skillsRaw = Array.isArray(parsed.skills) ? parsed.skills : [];
  const itemsRaw = Array.isArray(parsed.items) ? parsed.items : [];

  const skills = skillsRaw
    .map((entry) => {
      const skill = entry as Record<string, unknown>;
      const role = parseRole(skill.role);

      return {
        name: asString(skill.name),
        tags: Array.isArray(skill.tags)
          ? (skill.tags as unknown[]).map((tag) => asString(tag)).join("、")
          : "",
        timing: asString(skill.timing) || "メジャー",
        roleAttack: role.roleAttack,
        roleDefense: role.roleDefense,
        target: asString(skill.target),
        range: asString(skill.range),
        limit: asString(skill.limit),
        effect: asString(skill.function),
      } satisfies EnemySkillInput;
    })
    .filter((skill) => !(race === "ギミック" && skill.name.trim() === "《意志なき機構》"));

  const items = itemsRaw.map((entry) => {
    const item = entry as Record<string, unknown>;

    return {
      dice: asString(item.dice),
      name: asString(item.item),
      description: asString(item.exp),
    } satisfies EnemyDropItemInput;
  });

  return {
    name: displayName,
    rank,
    cr,
    enemyType,
    race,
    popularity,
    identification:
      parsed.identification === "自動" ? "自動成功" : asString(parsed.identification),
    tags: customTags.join("、"),
    memo: asString(parsed.contents).replace(/\r\n/g, "\n"),
    strength: asNumber(parsed.strength),
    dexterity: asNumber(parsed.dexterity),
    power: asNumber(parsed.power),
    intelligence: asNumber(parsed.intelligence),
    avoid: asNumber(parsed.avoid),
    avoidDice: asNumber(parsed.avoid_dice),
    resist: asNumber(parsed.resist),
    resistDice: asNumber(parsed.resist_dice),
    physicalDefense: asNumber(parsed.physical_defense),
    magicDefense: asNumber(parsed.magic_defense),
    hitPoint: asNumber(parsed.hit_point),
    hate: asNumber(parsed.hate),
    action: asNumber(parsed.action),
    move: asNumber(parsed.move),
    fate: asNumber(parsed.fate),
    skills: skills.length > 0 ? skills : [createEmptySkillInput()],
    items: items.length > 0 ? items : [createEmptyDropItemInput()],
  };
}

function parseCellText(value: unknown): string {
  return asString(value).trim();
}

function parseCellNumber(value: unknown, fallback = 0): number {
  const text = parseCellText(value);
  if (text === "") {
    return fallback;
  }
  return asNumber(text, fallback);
}

export function parseEnemyXlsx(buffer: ArrayBuffer): EnemyFormData {
  const workbook = XLSX.read(buffer, { type: "array" });
  const displaySheetName = workbook.SheetNames.includes("エネミー")
    ? "エネミー"
    : workbook.SheetNames[0];

  if (!displaySheetName) {
    throw new Error("XLSXのシートが見つかりません。");
  }

  let baseData: EnemyFormData | null = null;
  const rawSheetName = workbook.SheetNames.find((name) => name === "再読込用");
  if (rawSheetName) {
    const rawSheet = workbook.Sheets[rawSheetName];
    const rawRows = XLSX.utils.sheet_to_json(rawSheet, { header: 1, blankrows: false, defval: "" }) as unknown[][];
    const rawText = parseCellText(rawRows?.[0]?.[0]);
    if (rawText) {
      try {
        baseData = parseEnemyJson(rawText);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const sheet = workbook.Sheets[displaySheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: true, defval: "" }) as unknown[][];

  if (rows.length < 6) {
    throw new Error("XLSXの内容が不足しています。");
  }

  const name = parseCellText(rows[0]?.[1]);
  const cr = Math.max(1, parseCellNumber(rows[0]?.[4], 1));
  const raceText = parseCellText(rows[0]?.[7]);
  const enemyTypeText = parseCellText(rows[0]?.[10]);
  const popularityText = parseCellText(rows[1]?.[4]);
  const identificationText = parseCellText(rows[1]?.[7]);
  const rankText = parseCellText(rows[1]?.[10]);
  const combinedTagText = parseCellText(rows[1]?.[1]);

  const rank = enemyRanks.includes(rankText as EnemyRank)
    ? (rankText as EnemyRank)
    : (baseData?.rank ?? "ノーマル");
  const race = enemyRaces.includes(raceText as EnemyRace)
    ? (raceText as EnemyRace)
    : (baseData?.race ?? "人型");
  const enemyType = enemyTypes.includes(enemyTypeText as EnemyType)
    ? (enemyTypeText as EnemyType)
    : (baseData?.enemyType ?? "不明");
  const popularity = popularityList.includes(popularityText as EnemyPopularity)
    ? (popularityText as EnemyPopularity)
    : (baseData?.popularity ?? "一般的");

  const initialTagSet = new Set(splitTags(getDefaultTags(rank, race)));
  const customTags = splitTags(combinedTagText).filter((tag) => !initialTagSet.has(tag)).join("、");

  const defaultValues = calculateEnemyValues({ enemyType, race, rank, cr });

  const parsedItems: EnemyDropItemInput[] = [];
  const parsedSkills: EnemySkillInput[] = [];

  let rowIndex = 6;
  while (rowIndex < rows.length) {
    const label = parseCellText(rows[rowIndex]?.[0]);

    if (label === "ダイス") {
      parsedItems.push({
        dice: parseCellText(rows[rowIndex]?.[1]),
        name: parseCellText(rows[rowIndex]?.[4]),
        description: parseCellText(rows[rowIndex]?.[7]),
      });
      rowIndex += 1;
      continue;
    }

    if (label === "特技名") {
      const timingRow = rows[rowIndex + 1] ?? [];
      const targetRow = rows[rowIndex + 2] ?? [];
      const effectRow = rows[rowIndex + 3] ?? [];
      const roleText = parseCellText(timingRow[4]);
      const roleMatch = roleText.match(/^\((.*)／(.*)\)$/);

      const skill: EnemySkillInput = {
        name: parseCellText(rows[rowIndex]?.[1]),
        tags: parseCellText(rows[rowIndex]?.[4]).replace(/,/g, "、"),
        timing: parseCellText(timingRow[1]) || "メジャー",
        roleAttack: roleMatch?.[1]?.trim() ?? "",
        roleDefense: roleMatch?.[2]?.trim() ?? "",
        target: parseCellText(targetRow[1]),
        range: parseCellText(targetRow[4]),
        limit: parseCellText(targetRow[7]),
        effect: parseCellText(effectRow[1]),
      };

      if (!(race === "ギミック" && skill.name === "《意志なき機構》")) {
        parsedSkills.push(skill);
      }

      rowIndex += 4;
      continue;
    }

    rowIndex += 1;
  }

  const fallbackSkills = baseData?.skills?.filter(
    (skill) => !(race === "ギミック" && skill.name.trim() === "《意志なき機構》")
  );

  const mergedSkills = parsedSkills.length > 0
    ? parsedSkills.map((skill, index) => {
        const parsedLimit = skill.limit.trim();
        const fallbackLimit = fallbackSkills?.[index]?.limit?.trim() ?? "";

        return {
          ...skill,
          limit: parsedLimit || fallbackLimit,
        };
      })
    : (fallbackSkills && fallbackSkills.length > 0 ? fallbackSkills : [createEmptySkillInput()]);

  const mergedItems = parsedItems.length > 0
    ? parsedItems
    : (baseData?.items && baseData.items.length > 0 ? baseData.items : [createEmptyDropItemInput()]);

  return {
    name,
    rank,
    cr,
    enemyType,
    race,
    popularity,
    identification: identificationText || calculateIdentification(popularity, cr),
    tags: customTags,
    memo: baseData?.memo ?? "",
    strength: parseCellNumber(rows[3]?.[1], baseData?.strength ?? defaultValues.strength),
    dexterity: parseCellNumber(rows[3]?.[4], baseData?.dexterity ?? defaultValues.dexterity),
    power: parseCellNumber(rows[3]?.[7], baseData?.power ?? defaultValues.power),
    intelligence: parseCellNumber(rows[3]?.[10], baseData?.intelligence ?? defaultValues.intelligence),
    avoid: parseCellNumber(rows[4]?.[1], baseData?.avoid ?? defaultValues.avoid),
    avoidDice: baseData?.avoidDice ?? defaultValues.avoidDice,
    resist: parseCellNumber(rows[4]?.[4], baseData?.resist ?? defaultValues.resist),
    resistDice: baseData?.resistDice ?? defaultValues.resistDice,
    physicalDefense: parseCellNumber(rows[4]?.[7], baseData?.physicalDefense ?? defaultValues.physicalDefense),
    magicDefense: parseCellNumber(rows[4]?.[10], baseData?.magicDefense ?? defaultValues.magicDefense),
    hitPoint: parseCellNumber(rows[5]?.[1], baseData?.hitPoint ?? defaultValues.hitPoint),
    hate: parseCellNumber(rows[5]?.[4], baseData?.hate ?? defaultValues.hate),
    action: parseCellNumber(rows[5]?.[7], baseData?.action ?? defaultValues.action),
    move: parseCellNumber(rows[5]?.[10], baseData?.move ?? defaultValues.move),
    fate: parseCellNumber(rows[5]?.[13], baseData?.fate ?? defaultValues.fate),
    skills: mergedSkills,
    items: mergedItems,
  };
}

function normalizeDice(value: string): string {
  return value.replace(/\s+/g, "").trim();
}

function withAutomaticSkills(data: EnemyFormData): EnemySkillInput[] {
  const trimmed = data.skills.filter(
    (skill) =>
      skill.name.trim() ||
      skill.effect.trim() ||
      skill.tags.trim() ||
      skill.timing.trim() ||
      skill.roleAttack.trim() ||
      skill.roleDefense.trim() ||
      skill.target.trim() ||
      skill.range.trim() ||
      skill.limit.trim()
  );

  if (
    data.race === "ギミック" &&
    !trimmed.some((skill) => skill.name.trim() === "《意志なき機構》")
  ) {
    return [getGimmickSkill(), ...trimmed];
  }

  return trimmed;
}

function buildSkillCommand(skills: EnemySkillInput[]): string {
  return skills
    .filter((skill) => skill.name.trim())
    .map((skill) => {
      const name = skill.name.trim();
      const effect = skill.effect.trim() ? normalizeText(skill.effect) : "";
      return `${name}\n${effect}\n`;
    })
    .join("");
}

function buildSkillMemo(skills: EnemySkillInput[]): string {
  return skills
    .filter((skill) => skill.name.trim())
    .map((skill) => {
      let text = skill.name.trim();

      if (skill.tags.trim()) {
        text += `_[${skill.tags.trim()}]`;
      }
      if (skill.timing.trim()) {
        text += `_${skill.timing.trim()}`;
      }
      if (skill.roleAttack.trim() && skill.roleDefense.trim()) {
        text += `_対決（${skill.roleAttack.trim()}／${skill.roleDefense.trim()}）`;
      }
      if (skill.target.trim()) {
        text += `_${skill.target.trim()}`;
      }
      if (skill.range.trim()) {
        text += `_${skill.range.trim()}`;
      }
      if (skill.limit.trim()) {
        text += `_${skill.limit.trim()}`;
      }
      if (skill.effect.trim()) {
        text += `_${normalizeText(skill.effect)}`;
      }

      return text;
    })
    .join("\n\n");
}

function buildItemCommand(items: EnemyDropItemInput[]): string {
  return items
    .filter((item) => item.name.trim() && item.dice.trim())
    .map((item) => {
      let text = `ダイス: ${normalizeDice(item.dice)}_アイテム名: ${item.name.trim()}`;

      if (item.description.trim()) {
        text += `_解説: ${normalizeText(item.description)}`;
      }

      return text;
    })
    .join("\n");
}

export function createEnemyPiece(data: EnemyFormData): string {
  const skills = withAutomaticSkills(data);

  const piece = {
    kind: "character",
    data: {
      name: data.name.trim(),
      initiative: data.action,
      memo:
        `<タグ>\n[${getCombinedTagText(data, ",")}]\n\n` +
        `<解説>\n${normalizeText(data.memo) || ""}\n\n` +
        `<ドロップ品>\n${buildItemCommand(data.items) || ""}\n\n` +
        `<特技>\n${buildSkillMemo(skills) || ""}`,
      status: [
        { label: "HP", value: data.hitPoint, max: data.hitPoint },
        { label: "ヘイト倍率", value: data.hate, max: data.hate },
        { label: "因果力", value: data.fate, max: data.fate },
      ],
      params: [
        { label: "CR", value: String(data.cr) },
        { label: "物防", value: String(data.physicalDefense) },
        { label: "魔防", value: String(data.magicDefense) },
      ],
      commands: buildSkillCommand(skills),
    },
  };

  return JSON.stringify(piece);
}

export function createEnemyJson(data: EnemyFormData): string {
  const skills = withAutomaticSkills(data).map((skill) => ({
    name: skill.name.trim(),
    timing: skill.timing.trim() || null,
    role:
      skill.roleAttack.trim() && skill.roleDefense.trim()
        ? `対決（${skill.roleAttack.trim()}／${skill.roleDefense.trim()}）`
        : null,
    target: skill.target.trim() || null,
    range: skill.range.trim() || null,
    limit: skill.limit.trim() || null,
    function: skill.effect.trim() ? normalizeText(skill.effect) : null,
    tags: skill.tags.trim() ? splitTags(skill.tags) : [],
  }));

  const items = data.items
    .filter((item) => item.name.trim() || item.dice.trim() || item.description.trim())
    .map((item) => ({
      dice: normalizeDice(item.dice),
      item: item.name.trim() || null,
      exp: item.description.trim() ? normalizeText(item.description) : null,
    }));

  const identificationValue =
    data.identification.trim() === "自動成功"
      ? "自動"
      : Number.isFinite(Number(data.identification))
        ? Number(data.identification)
        : data.identification.trim();

  return JSON.stringify(
    {
      id: null,
      index_type: "エネミー",
      name: data.name.trim(),
      ruby: "null",
      rank: data.rank,
      type: data.enemyType,
      character_rank: data.cr,
      identification: identificationValue,
      strength: data.strength,
      dexterity: data.dexterity,
      power: data.power,
      intelligence: data.intelligence,
      avoid: data.avoid,
      avoid_dice: data.avoidDice,
      resist: data.resist,
      resist_dice: data.resistDice,
      physical_defense: data.physicalDefense,
      magic_defense: data.magicDefense,
      hit_point: data.hitPoint,
      hate: data.hate,
      action: data.action,
      move: data.move,
      fate: data.fate,
      contents: normalizeText(data.memo),
      tags: getCombinedTags(data),
      skills,
      items,
    },
    null,
    2
  );
}

function buildEnemySheetRows(data: EnemyFormData): Array<Array<string | number | null>> {
  const rows: Array<Array<string | number | null>> = [
    [
      "名称",
      data.name.replace(/－/g, "-"),
      null,
      "CR",
      data.cr,
      null,
      "大種族",
      data.race,
      null,
      "タイプ",
      data.enemyType,
      null,
      null,
      null,
    ],
    [
      "タグ",
      getCombinedTagText(data, ",").replace(/－/g, "-"),
      null,
      "知名度",
      data.popularity,
      null,
      "識別難易度",
      data.identification,
      null,
      "ランク",
      data.rank,
      null,
      null,
      null,
    ],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [
      "STR",
      data.strength,
      null,
      "DEX",
      data.dexterity,
      null,
      "POW",
      data.power,
      null,
      "INT",
      data.intelligence,
      null,
      null,
      null,
    ],
    [
      "回避",
      data.avoid,
      null,
      "抵抗",
      data.resist,
      null,
      "物防",
      data.physicalDefense,
      null,
      "魔防",
      data.magicDefense,
      null,
      null,
      null,
    ],
    [
      "最大HP",
      data.hitPoint,
      null,
      "ヘイト倍率",
      data.hate,
      null,
      "行動力",
      data.action,
      null,
      "移動力",
      data.move,
      null,
      "因果力",
      data.fate,
    ],
  ];

  for (const item of data.items) {
    let diceText = "";

    if (item.dice.trim() !== "" && item.name.trim() !== "") {
      const itemName = item.name.trim();
      const itemDescription = item.description.trim() === "" ? "" : item.description.trim();

      for (const dice of item.dice.split(/[、，,]/).map((v) => v.trim()).filter(Boolean)) {
        if (diceText !== "") {
          diceText += "," + String(dice);
        } else {
          diceText = String(dice);
        }
      }

      rows.push([null, null, null, null, null, null, null, null, null, null, null, null, null, null]);

      if (itemDescription === "") {
        rows.push([
          "ダイス",
          diceText,
          null,
          "アイテム名",
          itemName.replace(/－/g, "-"),
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ]);
      } else {
        rows.push([
          "ダイス",
          diceText,
          null,
          "アイテム名",
          itemName.replace(/－/g, "-"),
          null,
          "解説",
          itemDescription.replace(/－/g, "-"),
          null,
          null,
          null,
          null,
          null,
          null,
        ]);
      }
    }
  }

  for (const skill of withAutomaticSkills(data)) {
    const skillName = skill.name.trim() === "" ? "" : skill.name.trim();
    const skillTag = skill.tags.trim() === "" ? "" : skill.tags.trim();
    const skillTiming = skill.timing.trim() === "" ? "" : skill.timing.trim();
    const skillRollE = skill.roleAttack.trim() === "" ? "" : skill.roleAttack.trim();
    const skillRollP = skill.roleDefense.trim() === "" ? "" : skill.roleDefense.trim();
    const skillTarget = skill.target.trim() === "" ? "" : skill.target.trim();
    const skillRange = skill.range.trim() === "" ? "" : skill.range.trim();
    const skillDescription = skill.effect.trim() === "" ? "" : skill.effect.trim();

    rows.push([null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
    rows.push([
      "特技名",
      skillName.replace(/－/g, "-"),
      null,
      "タグ",
      skillTag.replace(/－/g, "-"),
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]);

    if (skillRollE === "") {
      rows.push([
        "タイミング",
        skillTiming,
        null,
        "判定",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]);
    } else {
      rows.push([
        "タイミング",
        skillTiming,
        null,
        "判定",
        `(${skillRollE}／${skillRollP})`,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]);
    }
    rows.push([
      "対象",
      skillTarget,
      null,
      "射程",
      skillRange,
      null,
      "制限",
      skill.limit.replace(/－/g, "-"),
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
    rows.push([
      "効果",
      skillDescription.replace(/－/g, "-"),
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
  }

  return rows;
}

export function createEnemyXlsx(data: EnemyFormData): Blob {
  const rows = buildEnemySheetRows(data).map((row) => row.map((cell) => (cell === null ? "" : cell)));
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 12 }, { wch: 28 }, { wch: 4 }, { wch: 12 }, { wch: 22 }, { wch: 4 },
    { wch: 12 }, { wch: 28 }, { wch: 4 }, { wch: 12 }, { wch: 22 }, { wch: 4 },
    { wch: 12 }, { wch: 22 },
  ];

  const rawSheet = XLSX.utils.aoa_to_sheet([[createEnemyJson(data)]]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "エネミー");
  XLSX.utils.book_append_sheet(workbook, rawSheet, "再読込用");
  workbook.Workbook = {
    Sheets: [
      { name: "エネミー", Hidden: 0 },
      { name: "再読込用", Hidden: 1 },
    ],
  };

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob(
    [buffer],
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );
}
