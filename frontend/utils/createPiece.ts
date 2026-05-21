type AnyRecord = Record<string, unknown>;

type StatusEntry = {
  label: string;
  value: number;
  max: number;
};

type ParamEntry = {
  label: string;
  value: string;
};

type AbilityEntry = {
  label: string;
  value: string;
};

function asString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

function asNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asRecord(value: unknown): AnyRecord | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as AnyRecord;
}

function firstLine(value: unknown): string {
  return asString(value).split("\n")[0] ?? "";
}

function pythonListLikeString(values: unknown): string {
  const array = asArray(values).map((item) => asString(item));
  return `[${array.map((item) => `'${item}'`).join(", ")}]`;
}

function convertDToLH(value: string): string {
  let newValue = value.replace(/D/g, "LH");

  if (value.includes("2D")) {
    newValue = "2LH+" + newValue;
  }
  if (value.includes("3D")) {
    newValue = "3LH+" + newValue;
  }
  if (value.includes("4D")) {
    newValue = "4LH+" + newValue;
  }

  if (newValue.length >= 4) {
    newValue = newValue.slice(0, -4);
  }

  return newValue;
}

function createCharacterData(jsonData: AnyRecord, characterId: string) {
  const characterName = asString(jsonData.name);
  const initiative = asNumber(jsonData.action);
  const url = `https://lhrpg.com/lhz/pc_status?id=${characterId}`;
  const memo = jsonData.remarks;
  const characterTags = pythonListLikeString(jsonData.tags);

  return {
    name: characterName,
    initiative,
    externalUrl: url,
    memo:
      memo === null || memo === undefined
        ? characterTags
        : `${characterTags} \n ${asString(memo).replace(/\r\n/g, "\n")}`,
  };
}

function createStatusData(jsonData: AnyRecord): StatusEntry[] {
  const statusHp = asNumber(jsonData.max_hitpoint);
  const statusEffect = asNumber(jsonData.effect);

  const statusData = [
    { label: "HP", value: statusHp, max: statusHp },
    { label: "再生", value: 0, max: 0 },
    { label: "障壁", value: 0, max: 0 },
    { label: "疲労", value: 0, max: 0 },
    { label: "ヘイト", value: 0, max: 0 },
    { label: "因果力", value: statusEffect, max: statusEffect },
  ];

  return statusData;
}

function createParamsData(jsonData: AnyRecord): ParamEntry[] {
  const paramsData: ParamEntry[] = [
    { label: "CR", value: asString(jsonData.character_rank) },
    { label: "攻撃力", value: asString(jsonData.physical_attack) },
    { label: "魔力", value: asString(jsonData.magic_attack) },
    { label: "回復力", value: asString(jsonData.heal_power) },
    { label: "物防", value: asString(jsonData.physical_defense) },
    { label: "魔防", value: asString(jsonData.magic_defense) },
    { label: "STR基本値", value: asString(jsonData.str_basic_value) },
    { label: "DEX基本値", value: asString(jsonData.dex_basic_value) },
    { label: "POW基本値", value: asString(jsonData.pow_basic_value) },
    { label: "INT基本値", value: asString(jsonData.int_basic_value) },
    { label: "STR", value: asString(jsonData.str_value) },
    { label: "DEX", value: asString(jsonData.dex_value) },
    { label: "POW", value: asString(jsonData.pow_value) },
    { label: "INT", value: asString(jsonData.int_value) },
  ];

  return paramsData;
}

function getShieldDefenseValue(hand1: AnyRecord | null, hand2: AnyRecord | null): number {
  const shieldsDefense: number[] = [];

  for (const hand of [hand1, hand2]) {
    if (!hand) {
      continue;
    }

    const tags = asArray(hand.tags).map((tag) => asString(tag));
    if (tags.includes("盾")) {
      shieldsDefense.push(asNumber(hand.physical_defense));
    }
  }

  return shieldsDefense.length > 0 ? Math.max(...shieldsDefense) : 0;
}

function skillPalette(
  skill: AnyRecord,
  chatPaletteSkill: string,
  hand1: AnyRecord | null,
  hand2: AnyRecord | null
): string {
  const diceType = {
    type_0: ["０Ｄ", "１Ｄ", "２Ｄ", "３Ｄ", "４Ｄ", "５Ｄ", "６Ｄ", "７Ｄ", "８Ｄ"],
    type_1: [
      "（ＳＲ）Ｄ",
      "（ＳＲ＋１）Ｄ",
      "（ＳＲ＋２）Ｄ",
      "（ＳＲ＋３）Ｄ",
      "（ＳＲ＋４）Ｄ",
      "（ＳＲ＋５）Ｄ",
      "（ＳＲ＋６）Ｄ",
    ],
    type_2: [
      "（ＳＲ×０）Ｄ",
      "（ＳＲ×１）Ｄ",
      "（ＳＲ×２）Ｄ",
      "（ＳＲ×３）Ｄ",
      "（ＳＲ×４）Ｄ",
      "（ＳＲ×５）Ｄ",
      "（ＳＲ×６）Ｄ",
    ],
    type_3: ["ＳＲ×０", "ＳＲ×１", "ＳＲ×２", "ＳＲ×３", "ＳＲ×４", "ＳＲ×５", "ＳＲ×６"],
    type_4: ["×０", "×１", "×２", "×３", "×４", "×５", "×６"],
    type_5: ["５", "７", "１０"],
  };

  const actionList = ["攻撃力", "魔力", "回復力"];
  const abilityList = [
    "STR基本値",
    "DEX基本値",
    "POW基本値",
    "INT基本値",
    "STR",
    "DEX",
    "POW",
    "INT",
  ];

  const shieldDefenseValue = getShieldDefenseValue(hand1, hand2);
  const functionText = asString(skill.function);
  const skillId = asNumber(skill.id);
  const skillRank = asNumber(skill.skill_rank);

  function createDice(diceCheck: string): string {
    let damageDice = "";

    for (const [diceTypeKey, diceTypeList] of Object.entries(diceType)) {
      for (let index = 0; index < diceTypeList.length; index += 1) {
        const dice = diceTypeList[index];
        if (diceCheck.includes(dice)) {
          if (diceTypeKey === "type_0") {
            damageDice = `(${index})D`;
          } else if (diceTypeKey === "type_1") {
            damageDice = `(${skillRank + index})D`;
          } else if (diceTypeKey === "type_2") {
            damageDice = `(${skillRank * index})D`;
          } else if (diceTypeKey === "type_3") {
            damageDice = `(${skillRank * index})`;
          }

          for (const actionValue of actionList) {
            if (diceCheck.includes(actionValue)) {
              damageDice += `+{${actionValue}}`;
            }
          }

          for (const abilityValue of abilityList) {
            if (diceCheck.includes(abilityValue)) {
              damageDice += `+{${abilityValue}}`;
            }
          }
        }

        if (damageDice !== "") {
          break;
        }
      }

      if (damageDice !== "") {
        break;
      }
    }

    if (damageDice === "") {
      damageDice = "C(";

      for (const actionValue of actionList) {
        if (diceCheck.includes(actionValue)) {
          damageDice += `+{${actionValue}}`;
        }
      }

      for (const abilityValue of abilityList) {
        if (diceCheck.includes(abilityValue)) {
          damageDice += `+{${abilityValue}}`;
        }
      }

      for (let index = 0; index < diceType.type_4.length; index += 1) {
        const dice = diceType.type_4[index];
        if (diceCheck.includes(dice)) {
          damageDice += `+${index}`;
        }
      }

      damageDice += ")";
    }

    return damageDice;
  }

  function damageRoll(text: string): string {
    let damageDice = "";

    if (text.includes("［") && text.includes("］の")) {
      const startIndex = text.indexOf("［");
      const endIndex = text.indexOf("］の");
      const diceCheck = text.slice(startIndex + 1, endIndex);
      damageDice = createDice(diceCheck);
    } else if (text.includes("［") && text.includes("］点回")) {
      const startIndex = text.indexOf("［");
      const endIndex = text.indexOf("］点回");
      const diceCheck = text.slice(startIndex + 1, endIndex);
      damageDice = createDice(diceCheck);
    } else if (text.includes("［") && text.includes("］点まで回")) {
      if (skillId === 1814) {
        damageDice = "C({回復力}+{STR}*2)";
      } else if (skillId === 2105) {
        damageDice = "C({回復力}*2+1)";
      } else if (skillId === 2006) {
        damageDice = "C({魔力}+{回復力})";
      } else if (skillId === 2631) {
        damageDice = `C(${shieldDefenseValue}*10)`;
      }
    }

    return damageDice;
  }

  function createIntensity(diceCheck: string): string {
    let intensityDice = "";

    for (const [diceTypeKey, diceTypeList] of Object.entries(diceType)) {
      for (let index = 0; index < diceTypeList.length; index += 1) {
        const dice = diceTypeList[index];
        if (diceCheck.includes(dice)) {
          if (diceTypeKey === "type_0") {
            intensityDice = `(${index})D`;
          } else if (diceTypeKey === "type_1") {
            intensityDice = `(${skillRank + index})D`;
          } else if (diceTypeKey === "type_2") {
            intensityDice = `(${skillRank * index})D`;
          } else if (diceTypeKey === "type_3") {
            intensityDice = `(${skillRank * index})`;
          }

          for (const actionValue of actionList) {
            if (diceCheck.includes(actionValue)) {
              intensityDice += `+{${actionValue}}`;
            }
          }

          for (const abilityValue of abilityList) {
            if (diceCheck.includes(abilityValue)) {
              intensityDice += `+{${abilityValue}}`;
            }
          }
        }

        if (intensityDice !== "") {
          break;
        }
      }

      if (intensityDice !== "") {
        break;
      }
    }

    if (intensityDice === "") {
      intensityDice = "C(";

      for (let index = 0; index < diceType.type_5.length; index += 1) {
        const value = diceType.type_5[index];
        if (diceCheck.includes(value)) {
          intensityDice += `${Number(value)}`;
        }
      }

      for (const actionValue of actionList) {
        if (diceCheck.includes(actionValue)) {
          intensityDice += `+{${actionValue}}`;
        }
      }

      for (const abilityValue of abilityList) {
        if (diceCheck.includes(abilityValue)) {
          intensityDice += `+{${abilityValue}}`;
        }
      }

      for (let index = 0; index < diceType.type_4.length; index += 1) {
        const dice = diceType.type_4[index];
        if (diceCheck.includes(dice)) {
          intensityDice += `*${index}`;
        }
      }

      if (diceCheck.includes("×SR")) {
        intensityDice += `*${skillRank}`;
      }

      intensityDice += ")";
    }

    return intensityDice;
  }

  function badCombatRoll(text: string): string {
    let damageDice = "";

    if (text.includes("［再生：") && text.includes("］を与える")) {
      const startIndex = text.indexOf("［再生：");
      const endIndex = text.indexOf("］を与える");
      const diceCheck = text.slice(startIndex + 1, endIndex);
      damageDice = createIntensity(diceCheck);
    } else if (text.includes("［障壁：") && text.includes("］を与える")) {
      const startIndex = text.indexOf("［障壁：");
      const endIndex = text.indexOf("］を与える");
      const diceCheck = text.slice(startIndex + 1, endIndex);
      damageDice = createIntensity(diceCheck);
    } else if (text.includes("［衰弱：") && text.includes("］を与える")) {
      const startIndex = text.indexOf("［衰弱：");
      const endIndex = text.indexOf("］を与える");
      const diceCheck = text.slice(startIndex + 1, endIndex);
      damageDice = createIntensity(diceCheck);
    } else if (text.includes("［追撃：") && text.includes("］を与える")) {
      const startIndex = text.indexOf("［追撃：");
      const endIndex = text.indexOf("］を与える");
      const diceCheck = text.slice(startIndex + 1, endIndex);
      damageDice = createIntensity(diceCheck);
    } else if (text.includes("［追撃：") && text.includes("個与える")) {
      const startIndex = text.indexOf("［追撃：");
      const endIndex = text.indexOf("］を");
      const diceCheck = text.slice(startIndex + 1, endIndex);
      damageDice = createIntensity(diceCheck);

      const tuigekiNum = ["２", "３", "４", "５", "６", "７", "８", "(ＳＲ)"];
      for (let num of tuigekiNum) {
        const checkText = `${num}個`;
        if (text.includes(checkText)) {
          if (checkText === "(ＳＲ)個") {
            num = `${skillRank}個`;
          } else {
            num = checkText;
          }
          damageDice += ` ×${num}`;
        }
      }
    }

    return damageDice;
  }

  function checkSkill(): { diceRoll: string; damageType: string } {
    const rollKeywords = ["の物理", "の魔法", "の貫通", "点回復", "点まで回復"];
    const badCombatStatus = ["追撃", "衰弱", "再生", "障壁"];
    const damagePumpSkillIds = new Set([3202, 3216, 3801, 4003, 4201, 4401]);

    let diceRoll = "";
    let damageType = "";

    if (skillId === 2624) {
      diceRoll = `(${skillRank})D+${shieldDefenseValue}`;
      damageType = "(貫通ダメージ)";
    } else if (damagePumpSkillIds.has(skillId)) {
      if (skillId === 3801 || skillId === 4003 || skillId === 4201 || skillId === 4401) {
        diceRoll = `C((【因果力】+${skillRank})*7)`;
        damageType = "";
      } else if (skillId === 3202 || skillId === 3216) {
        diceRoll = "(2)D";
        damageType = "(回復)";
      }
    } else if (rollKeywords.some((keyword) => functionText.includes(keyword))) {
      diceRoll = damageRoll(functionText);

      if (functionText.includes("の物理ダメージ")) {
        damageType = "(物理ダメージ)";
      } else if (functionText.includes("の魔法ダメージ")) {
        damageType = "(魔法ダメージ)";
      } else if (functionText.includes("の貫通ダメージ")) {
        damageType = "(貫通ダメージ)";
      } else if (functionText.includes("点回復") || functionText.includes("点まで回復")) {
        damageType = "(回復)";
      }
    } else if (badCombatStatus.some((keyword) => functionText.includes(keyword))) {
      diceRoll = badCombatRoll(functionText);

      if (functionText.includes("追撃")) {
        damageType = "(追撃)";
      } else if (functionText.includes("衰弱")) {
        damageType = "(衰弱)";
      } else if (functionText.includes("再生")) {
        damageType = "(再生)";
      } else if (functionText.includes("障壁")) {
        damageType = "(障壁)";
      }
    }

    return { diceRoll, damageType };
  }

  const { diceRoll, damageType } = checkSkill();

  if (diceRoll !== "") {
    chatPaletteSkill += `[${asString(skill.name)}]\n`;
    chatPaletteSkill += `${diceRoll} ${damageType}\n`;
  }

  return chatPaletteSkill;
}

function createSkillData(jsonData: AnyRecord, hand1: AnyRecord | null, hand2: AnyRecord | null): string {
  const skillsArray = asArray<AnyRecord>(jsonData.skills);
  const skillTimingMap = new Map<string, AnyRecord[]>();

  for (const item of skillsArray) {
    const timing = asString(item.timing);
    const current = skillTimingMap.get(timing) ?? [];
    current.push(item);
    skillTimingMap.set(timing, current);
  }

  let newChatPaletteSkill = "";

  for (const [timing, skills] of skillTimingMap.entries()) {
    let chatPaletteSkill = `○ ${timing}\n`;

    for (const skill of skills) {
      const tags = asArray(skill.tags)
        .map((tag) => `[${asString(tag)}]`)
        .join(" ");

      chatPaletteSkill += `《${asString(skill.name)}》 ${tags} SR:${asString(
        skill.skill_rank
      )}/${asString(skill.skill_max_rank)} タイミング${asString(skill.timing)} 判定:${asString(
        skill.roll
      )} 対象:${asString(skill.target)} 射程${asString(skill.range)} コスト:${asString(
        skill.cost
      )} 制限:${asString(skill.limit)} 効果:${asString(skill.function)}\n`;

      chatPaletteSkill = skillPalette(skill, chatPaletteSkill, hand1, hand2);
    }

    newChatPaletteSkill += `${chatPaletteSkill}\n`;
  }

  const basic = [
    "○基本動作",
    "《ラン》 [基本動作] [移動] SR:-/- タイミング:ムーブ 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは【移動力】Ｓｑまで［通常移動］をしてもよい。",
    "《ダッシュ》 [基本動作] [移動] SR:-/- タイミング:ムーブ 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは［【移動力】＋２］Ｓｑまで［通常移動］をしてもよい。あなたは直後のマイナーアクションを１回失う。マイナーアクションを失えない場合は使用できない。",
    "《シフト》 [基本動作] [移動] SR:-/- タイミング:ムーブ 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは１Ｓｑまで［即時移動］をしてもよい。あなたは直後のマイナーアクションを１回失う。マイナーアクションを失えない場合は使用できない。",
    "《敵情を探る》 [基本動作] [偵察] SR:-/- タイミング:ブリーフィング 判定：基本（運動） 対象:本文 射程：本文 コスト:- 制限：- 効果：次のシーンの戦闘における敵の情報を得ようと試みる。〔達成値：１０〕登場するエネミーの数を知る。〔達成値：２０〕そのうちランクが一番低いエネミー１体（該当するエネミーが複数の場合はＧＭが選択）の名称と、［ボス］［モブ］タグの有無を知る。〔ファンブル〕エネミーは偵察に気がつく。",
    "《基本武器攻撃》 [基本動作] [武器攻撃] SR:-/- タイミング:メジャー 判定：対決(命中/回避) 対象:単体 射程：武器 コスト:- 制限：- 効果：対象に［【攻撃力】＋１Ｄ］の物理ダメージを与える。",
    "《基本魔法攻撃》 [基本動作] [魔法攻撃] [杖] [魔石] SR:-/- タイミング: メジャー 判定：対決(命中/抵抗) 対象:単体 射程:4Sq コスト:- 制限：- 効果：対象に［【魔力】＋１Ｄ］の魔法ダメージを与える。",
    "《異常探知》 [基本動作] SR:-/- タイミング:セットアップ 判定：基本（知覚／探知難易度） 対象:広範囲20（無差別） 射程：至近 コスト:- 制限：- 効果：【探知難易度】を持つ範囲内すべての存在を対象とする。対象の［隠蔽］状態および［隠密］状態は解除される。あなたの味方に対しては、解除する効果を適用しなくてもよい。",
    "《エネミー識別》 [基本動作] SR:-/- タイミング:セットアップ 判定：基本（知識／識別難易度） 対象:単体 射程:20Sq コスト:- 制限：- 効果：【識別難易度】を持つキャラクターを対象とする。対象は［識別済］状態となる。",
    "《プロップ解析》 [基本動作] SR:-/- タイミング:メジャー 判定：基本（解析／解析難易度） 対象:本文 射程:1Sq コスト:- 制限：- 効果：【解析難易度】を持つプロップ１つを対象とする。対象は［解析済］状態になる。",
    "《プロップ解除》 [基本動作] SR:-/- タイミング:メジャー 判定：基本（解除／解除難易度） 対象:本文 射程:1Sq コスト:- 制限：- 効果：【解除難易度】を持ち、かつ［解析済］状態のプロップ１つを対象とする。対象は効果を停止する。",
    "《とどめの一撃》 [基本動作] SR:-/- タイミング:インスタント 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：このメインプロセスであなたが攻撃を行ない、その攻撃により対象に含まれる［戦闘不能］状態のキャラクターにＨＰダメージを１点でも与えられる状況となった場合、そのキャラクターを［死亡］状態にする。",
    "《かばう》 [基本動作] SR:-/- タイミング:ダメージ適用直前 判定：判定なし 対象:単体 射程：至近 コスト:- 制限：- 効果：あなたは［ダメージ適用ステップ］であなた以外の対象が受ける予定のダメージをかわりに受ける。対象はダメージを受けることはない。《かばう》を行なうためには［未行動］でなければならず、また《かばう》を行なうことで即座に［行動済］になる。１回の攻撃に対して１回まで使用可能。エネミーはこの基本動作を行なえない。",
    "《装備の変更》 [基本動作] [準備] SR:-/- タイミング:マイナー 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：［装備品スロット］のアイテムを［所持品スロット］に移してもよい。また、［所持品スロット］のアイテムを［装備品スロット］に装備してもよい。アイテムを足下に落とす、拾うなども装備の変更の一部と見なす。１回の行動でできる装備の変更の数に制限はない。好きなように装備を変更できる。この基本動作をブリーフィングで使用する際、１つの ブリーフィングで複数回使用できる。",
    "《受け渡し》 [基本動作] [準備] SR:-/- タイミング:マイナー 判定：判定なし 対象:単体 射程：至近 コスト:- 制限：- 効果：あなたの［所持品スロット］のアイテム１つを、同意した対象の［所持品スロット］に移動する。対象の［所持品スロット］に空きがない場合、対象がいるＳｑにアイテムは落とされる。この基本動作をブリーフィングで使用する際、１つのブリーフィングで複数回使用できる。",
    "《隠れる》 [基本動作] SR:-/- タイミング:メジャー 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは［隠密］状態になる。ただし、あなたが［ヘイトトップ］の場合、または他のキャラクターの［阻止能力］の対象になっている場合、またはバッドステータスを受けている場合、この基本動作は使用できない。",
    "《アイテム鑑定》 [基本動作] SR:-/- タイミング:メジャー 判定：基本（解析／解析難易度） 対象:本文 射程：至近 コスト:- 制限：- 効果：【解析難易度】を持つアイテム１つを対象とする。対象は［解析済］状態になる。",
  ].join("\n");

  newChatPaletteSkill += basic;
  return newChatPaletteSkill;
}

function createEquipmentData(jsonData: AnyRecord): {
  equipmentData: string[];
  hand1: AnyRecord | null;
  hand2: AnyRecord | null;
} {
  const hand1 = asRecord(jsonData.hand1);
  const hand2 = asRecord(jsonData.hand2);
  const armor = asRecord(jsonData.armor);
  const supportItem1 = asRecord(jsonData.support_item1);
  const supportItem2 = asRecord(jsonData.support_item2);
  const supportItem3 = asRecord(jsonData.support_item3);
  const bag = asRecord(jsonData.bag);

  const equipment = [hand1, hand2, armor, supportItem1, supportItem2, supportItem3, bag];
  const equipmentData: string[] = [];

  for (const item of equipment) {
    if (!item) {
      continue;
    }

    const tags = asArray(item.tags).map((tag) => asString(tag));

    if (tags.some((tag) => tag.includes("M"))) {
      if (item.prefix_function !== null && item.prefix_function !== undefined) {
        const prefixFunction = firstLine(item.prefix_function);
        equipmentData.push(`${asString(item.alias)} プレフィックスド効果: ${prefixFunction}`);
      } else {
        const namedFunction = firstLine(item.function);
        equipmentData.push(`${asString(item.alias)} ネームド効果: ${namedFunction}`);
      }
    }
  }

  return { equipmentData, hand1, hand2 };
}

function createItemData(jsonData: AnyRecord): string {
  const itemsArray = asArray<AnyRecord>(jsonData.items);
  let chatPaletteItem = "";

  for (const item of itemsArray) {
    if (!item) {
      continue;
    }

    chatPaletteItem += `${asString(item.alias)} `;
    let itemsFunction = asString(item.function);
    const tags = asArray(item.tags).map((tag) => asString(tag));

    if (tags.length > 0) {
      chatPaletteItem += `${tags.map((tag) => `[${tag}]`).join(" ")} `;
    }

    if (tags.some((tag) => tag.includes("M") || tag.includes("魔具"))) {
      if (item.prefix_function === null || item.prefix_function === undefined) {
        itemsFunction = firstLine(item.function);
      }
    }

    if (asString(item.timing) !== "－") {
      chatPaletteItem += `タイミング:${asString(item.timing)} `;
      chatPaletteItem += `判定:${asString(item.roll)} `;
      chatPaletteItem += `対象:${asString(item.target)} `;
      chatPaletteItem += `射程:${asString(item.range)} `;
    }

    chatPaletteItem += `効果:${itemsFunction}\n`;
  }

  return chatPaletteItem;
}

function createAbilityData(jsonData: AnyRecord): AbilityEntry[] {
  const abilityData: AbilityEntry[] = [
    { label: "運動値", value: asString(jsonData.abl_motion) },
    { label: "耐久値", value: asString(jsonData.abl_durability) },
    { label: "解除値", value: asString(jsonData.abl_dismantle) },
    { label: "操作値", value: asString(jsonData.abl_operate) },
    { label: "知覚値", value: asString(jsonData.abl_sense) },
    { label: "交渉値", value: asString(jsonData.abl_negotiate) },
    { label: "知識値", value: asString(jsonData.abl_knowledge) },
    { label: "解析値", value: asString(jsonData.abl_analyze) },
    { label: "回避値", value: asString(jsonData.abl_avoid) },
    { label: "抵抗値", value: asString(jsonData.abl_resist) },
    { label: "命中値", value: asString(jsonData.abl_hit) },
  ];

  return abilityData.map((item) => ({
    label: item.label,
    value: convertDToLH(item.value),
  }));
}

function createChatPalette(
  skillData: string,
  equipmentData: string[],
  itemData: string,
  abilityData: AbilityEntry[]
): string {
  const line1 =
    "○戦闘の基本\n" +
    `${abilityData[10]?.value ?? ""}>=0 命中値\n` +
    `${abilityData[8]?.value ?? ""}>=0 回避値(ヘイトトップ)\n` +
    `${abilityData[8]?.value ?? ""}>=0 回避値(ヘイトアンダー)\n` +
    `${abilityData[9]?.value ?? ""}>=0 抵抗値(ヘイトトップ)\n` +
    `${abilityData[9]?.value ?? ""}>=0 抵抗値(ヘイトアンダー)\n` +
    "{攻撃力}+1D6 基本武器攻撃、物理ダメージ\n" +
    "{魔力}+1D6 基本魔法攻撃、魔法ダメージ\n";

  const line2 =
    "○被ダメージ計算用\n" +
    "C(0-{物防}-0) 被ダメージ（物理）=物理ダメージ-物防-軽減\n" +
    "C(0-{魔防}-0) 被ダメージ（魔法）=魔法ダメージ-魔防-軽減\n" +
    "C(({HP}+{障壁})-0-{ヘイト}*0-0) 残りHP=(HP+障壁)-ダメージ-ヘイト値*倍率-その他\n";

  const line3 = skillData;

  let equipment = "";
  for (const item of equipmentData) {
    equipment += `${item}\n`;
  }
  const line4 = `○装備アイテム効果\n${equipment}`;

  const line5 = `○所持アイテム一覧\n${itemData}`;

  let line6 = "○各種判定\n";
  for (const ability of abilityData) {
    line6 += `${ability.value}>=0 ${ability.label}\n`;
  }

  const line7 =
    "○消耗表\n" +
    "PCT{CR}+0 体力消耗表\n" +
    "ECT{CR}+0 気力消耗表\n" +
    "GCT{CR}+0 物品消耗表\n" +
    "CCT{CR}+0 金銭消耗表\n";

  const line8 =
    "○財宝表\n" +
    "CTRS{CR}+0 金銭財宝表\n" +
    "MTRS{CR}+0 魔法素材財宝表\n" +
    "ITRS{CR}+0 換金アイテム財宝表\n";

  return `${line1}\n${line2}\n${line3}\n${line4}\n${line5}\n${line6}\n${line7}\n${line8}`;
}

export async function createPiece(characterId: string): Promise<string> {
  const jsonUrl = `https://lhrpg.com/lhz/api/${characterId}.json`;

  const response = await fetch(jsonUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("URLからJSONデータを取得できませんでした。");
  }

  const jsonData = await response.json();

  try {
    const characterData = createCharacterData(jsonData, characterId);
    const statusData = createStatusData(jsonData);
    const paramsData = createParamsData(jsonData);
    const { equipmentData, hand1, hand2 } = createEquipmentData(jsonData);
    const skillData = createSkillData(jsonData, hand1, hand2);
    const itemData = createItemData(jsonData);
    const abilityData = createAbilityData(jsonData);
    const chatPalette = createChatPalette(skillData, equipmentData, itemData, abilityData);

    const piece = {
      kind: "character",
      data: {
        ...characterData,
        status: statusData,
        params: paramsData,
        commands: chatPalette,
      },
    };

    return JSON.stringify(piece);
  } catch (error) {
    console.error(error);
    return JSON.stringify(jsonData, null, 2);
  }
}