import requests


def extract_character_id(url_or_id: str) -> str:
    """
    URL または ID 文字列から character_id を取り出す
    """
    if url_or_id is None:
        raise ValueError("URLまたはIDが空です。")

    value = str(url_or_id).strip()
    if not value:
        raise ValueError("URLまたはIDが空です。")

    if "=" in value:
        return value.rsplit("=", 1)[-1].strip()

    return value


def read_json(json_url):
    response = requests.get(json_url)
    if response.status_code == 200:
        json_data = response.json()
        return json_data
    else:
        error_message = "URLからJSONデータを取得できませんでした。"
        return error_message


def create_character_data(json_data, character_id):
    character_name = json_data['name']
    initiative = json_data['action']  # 行動値
    url = r"https://lhrpg.com/lhz/pc_status?id=" + character_id  # URL
    memo = json_data['remarks']

    character_tags = json_data['tags']
    new_character_tags = " ".join(f"[{tag}]" for tag in character_tags)

    character_data = (
        f"\"name\":\"{character_name}\","
        f"\"initiative\":{initiative},"
        f"\"externalUrl\":\"{url}\","
        f"\"memo\":\"タグ：{new_character_tags}"
    )

    if memo is None:
        character_data += "\","

    else:
        memo = json_data['remarks']
        memo = memo.replace("\r\n", "\\n")
        character_data += f"\\n {memo}\","

    return character_data, character_name


def create_status_data(json_data):
    status_hp = json_data['max_hitpoint']  # 最大HP
    status_effect = json_data['effect']  # 因果力
    # status_move = json_data['move']  # 移動力

    status_data = [
        {"HP": status_hp},
        {"再生": 0},
        {"障壁": 0},
        {"疲労": 0},
        {"ヘイト": 0},
        {"因果力": status_effect},
        # {"移動力": status_move}
    ]

    # チャットパレット用に整理
    status = "\"status\":["
    for idx, x in enumerate(status_data):
        key = list(x.keys())[0]  # 辞書 x の最初のキーを取得
        item = x[key]  # 辞書 x の値を取得
        if idx == len(status_data) - 1:
            status = status + f"{{\"label\":\"{key}\",\"value\":{item},\"max\":{item}}}],"
        else:
            status = status + f"{{\"label\":\"{key}\",\"value\":{item},\"max\":{item}}},"
    return status


def create_prams_data(json_data):
    params_rank = json_data['character_rank']
    params_physical_attack = json_data['physical_attack']
    params_magic_attack = json_data['magic_attack']
    params_heal_power = json_data['heal_power']
    params_physical_defense = json_data['physical_defense']
    params_magic_defense = json_data['magic_defense']
    # 能力値
    params_str_basic_value = json_data['str_basic_value']
    params_dex_basic_value = json_data['dex_basic_value']
    params_pow_basi_value = json_data['pow_basic_value']
    params_int_basic_value = json_data['int_basic_value']
    params_str_value = json_data['str_value']
    params_dex_value = json_data['dex_value']
    params_pow_value = json_data['pow_value']
    params_int_value = json_data['int_value']

    params_data = [
        {"CR": str(params_rank)},
        {"攻撃力": str(params_physical_attack)},
        {"魔力": str(params_magic_attack)},
        {"回復力": str(params_heal_power)},
        {"物防": str(params_physical_defense)},
        {"魔防": str(params_magic_defense)},
        {"STR基本値": str(params_str_basic_value)},
        {"DEX基本値": str(params_dex_basic_value)},
        {"POW基本値": str(params_pow_basi_value)},
        {"INT基本値": str(params_int_basic_value)},
        {"STR": str(params_str_value)},
        {"DEX": str(params_dex_value)},
        {"POW": str(params_pow_value)},
        {"INT": str(params_int_value)}
    ]

    # チャットパレット用に整理
    params = "\"params\":["
    for idx, x in enumerate(params_data):
        key = list(x.keys())[0]  # 辞書 x の最初のキーを取得
        item = x[key]  # 辞書 x の値を取得
        if idx == len(params_data) - 1:
            params = params + f"{{\"label\":\"{key}\",\"value\":\"{item}\"}}],"
        else:
            params = params + f"{{\"label\":\"{key}\",\"value\":\"{item}\"}},"

    return params


# ***********************************************************************************************
def create_skill_data(json_data, hand1, hand2):
    def group_timing(skills_array):
        result_timing_dict = {}
        for item in skills_array:
            timing = item['timing']
            if timing in result_timing_dict:
                result_timing_dict[timing].append(item)
            else:
                result_timing_dict[timing] = [item]
        return result_timing_dict

    # read skills
    skills_array = json_data['skills']

    # ' timing 'で辞書を分類
    skill_timing_data = group_timing(skills_array)

    # チャットパレット用に整理
    new_chat_palette_skill = ""
    for timing, skills in skill_timing_data.items():
        chat_palette_skill = f"○ {timing}\\n"
        for skill in skills:
            tags = " ".join(f"[{tag}]" for tag in skill['tags'])
            chat_palette_skill += (
                f"《{skill['name']}》 {tags} SR:{skill['skill_rank']}/{skill['skill_max_rank']} "
                f"タイミング{skill['timing']} 判定:{skill['roll']} 対象:{skill['target']} "
                f"射程{skill['range']} コスト:{skill['cost']} 制限:{skill['limit']} "
                f"効果:{skill['function']}\\n"
            )
            chat_palette_skill = skill_palette(skill, chat_palette_skill, hand1,
                                               hand2)  # ダメージロール

        new_chat_palette_skill += chat_palette_skill + "\\n"

    # 基本動作
    basic = (
        "○基本動作\\n"
        "《ラン》 [基本動作] [移動] SR:-/- タイミング:ムーブ 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは【移動力】Ｓｑまで［通常移動］をしてもよい。\\n"
        "《ダッシュ》 [基本動作] [移動] SR:-/- タイミング:ムーブ 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは［【移動力】＋２］Ｓｑまで［通常移動］をしてもよい。あなたは直後のマイナーアクションを１回失う。マイナーアクションを失えない場合は使用できない。\\n"
        "《シフト》 [基本動作] [移動] SR:-/- タイミング:ムーブ 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは１Ｓｑまで［即時移動］をしてもよい。あなたは直後のマイナーアクションを１回失う。マイナーアクションを失えない場合は使用できない。\\n"
        "《敵情を探る》 [基本動作] [偵察] SR:-/- タイミング:ブリーフィング 判定：基本（運動） 対象:本文 射程：本文 コスト:- 制限：- 効果：次のシーンの戦闘における敵の情報を得ようと試みる。〔達成値：１０〕登場するエネミーの数を知る。〔達成値：２０〕そのうちランクが一番低いエネミー１体（該当するエネミーが複数の場合はＧＭが選択）の名称と、［ボス］［モブ］タグの有無を知る。〔ファンブル〕エネミーは偵察に気がつく。\\n"
        "《基本武器攻撃》 [基本動作] [武器攻撃] SR:-/- タイミング:メジャー 判定：対決(命中/回避) 対象:単体 射程：武器 コスト:- 制限：- 効果：対象に［【攻撃力】＋１Ｄ］の物理ダメージを与える。\\n"
        "《基本魔法攻撃》 [基本動作] [魔法攻撃] [杖] [魔石] SR:-/- タイミング: メジャー 判定：対決(命中/抵抗) 対象:単体 射程:4Sq コスト:- 制限：- 効果：対象に［【魔力】＋１Ｄ］の魔法ダメージを与える。\\n"
        "《異常探知》 [基本動作] SR:-/- タイミング:セットアップ 判定：基本（知覚／探知難易度） 対象:広範囲20（無差別） 射程：至近 コスト:- 制限：- 効果：【探知難易度】を持つ範囲内すべての存在を対象とする。対象の［隠蔽］状態および［隠密］状態は解除される。あなたの味方に対しては、解除する効果を適用しなくてもよい。\\n"
        "《エネミー識別》 [基本動作] SR:-/- タイミング:セットアップ 判定：基本（知識／識別難易度） 対象:単体 射程:20Sq コスト:- 制限：- 効果：【識別難易度】を持つキャラクターを対象とする。対象は［識別済］状態となる。\\n"
        "《プロップ解析》 [基本動作] SR:-/- タイミング:メジャー 判定：基本（解析／解析難易度） 対象:本文 射程:1Sq コスト:- 制限：- 効果：【解析難易度】を持つプロップ１つを対象とする。対象は［解析済］状態になる。\\n"
        "《プロップ解除》 [基本動作] SR:-/- タイミング:メジャー 判定：基本（解除／解除難易度） 対象:本文 射程:1Sq コスト:- 制限：- 効果：【解除難易度】を持ち、かつ［解析済］状態のプロップ１つを対象とする。対象は効果を停止する。\\n"
        "《とどめの一撃》 [基本動作] SR:-/- タイミング:インスタント 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：このメインプロセスであなたが攻撃を行ない、その攻撃により対象に含まれる［戦闘不能］状態のキャラクターにＨＰダメージを１点でも与えられる状況となった場合、そのキャラクターを［死亡］状態にする。\\n"
        "《かばう》 [基本動作] SR:-/- タイミング:ダメージ適用直前 判定：判定なし 対象:単体 射程：至近 コスト:- 制限：- 効果：あなたは［ダメージ適用ステップ］であなた以外の対象が受ける予定のダメージをかわりに受ける。対象はダメージを受けることはない。《かばう》を行なうためには［未行動］でなければならず、また《かばう》を行なうことで即座に［行動済］になる。１回の攻撃に対して１回まで使用可能。エネミーはこの基本動作を行なえない。\\n"
        "《装備の変更》 [基本動作] [準備] SR:-/- タイミング:マイナー 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：［装備品スロット］のアイテムを［所持品スロット］に移してもよい。また、［所持品スロット］のアイテムを［装備品スロット］に装備してもよい。アイテムを足下に落とす、拾うなども装備の変更の一部と見なす。１回の行動でできる装備の変更の数に制限はない。好きなように装備を変更できる。この基本動作をブリーフィングで使用する際、１つの ブリーフィングで複数回使用できる。\\n"
        "《受け渡し》 [基本動作] [準備] SR:-/- タイミング:マイナー 判定：判定なし 対象:単体 射程：至近 コスト:- 制限：- 効果：あなたの［所持品スロット］のアイテム１つを、同意した対象の［所持品スロット］に移動する。対象の［所持品スロット］に空きがない場合、対象がいるＳｑにアイテムは落とされる。この基本動作をブリーフィングで使用する際、１つのブリーフィングで複数回使用できる。\\n"
        "《隠れる》 [基本動作] SR:-/- タイミング:メジャー 判定：判定なし 対象:自身 射程：至近 コスト:- 制限：- 効果：あなたは［隠密］状態になる。ただし、あなたが［ヘイトトップ］の場合、または他のキャラクターの［阻止能力］の対象になっている場合、またはバッドステータスを受けている場合、この基本動作は使用できない。\\n"
        "《アイテム鑑定》 [基本動作] SR:-/- タイミング:メジャー 判定：基本（解析／解析難易度） 対象:本文 射程：至近 コスト:- 制限：- 効果：【解析難易度】を持つアイテム１つを対象とする。対象は［解析済］状態になる。\\n"
    )
    new_chat_palette_skill = new_chat_palette_skill + basic
    return new_chat_palette_skill


def skill_palette(skill, chat_palette_skill, hand1, hand2):
    def check_skill():
        roll_keywords = ["の物理", "の魔法",  # "の直接",
                         "の貫通", "点回復", "点まで回復"
                         ]
        bad_combat_status = ["追撃", "衰弱", "再生", "障壁"]
        damage_pump_list = [3801, 4003, 4201, 4401]

        dice_roll = ""
        damage_type = ""
        function_text = skill['function']
        skill_id = skill['id']
        if skill_id == 2624:  # シールドスウィング
            dice_roll = f"({skill['skill_rank']})D+{shield_defense_value}"
            damage_type = "(貫通ダメージ)"
        elif skill_id == 701:  # アダマスハート
            dice_roll = "C({STR基本値}*2)"
            damage_type = "(回復)"
        elif skill_id in damage_pump_list:
            if skill_id == 3801:
                dice_roll = f"C((【因果力】+{skill['skill_rank']})*7)"
                damage_type = ""
            else:
                dice_roll = f"C((【因果力】+{skill['skill_rank']})*7)"
                damage_type = ""
        elif any(keyword in function_text for keyword in roll_keywords):
            dice_roll = damage_roll(function_text)
            if "の物理ダメージ" in function_text:
                damage_type = "(物理ダメージ)"
            elif "の魔法ダメージ" in function_text:
                damage_type = "(魔法ダメージ)"
            elif "の貫通ダメージ" in function_text:
                damage_type = "(貫通ダメージ)"
            elif "点回復" in function_text or "点まで回復" in function_text:
                damage_type = "(回復)"
        elif any(keyword in function_text for keyword in bad_combat_status):
            dice_roll = bad_combat_roll(function_text)
            if "追撃" in function_text:
                damage_type = "(追撃)"
            elif "衰弱" in function_text:
                damage_type = "(衰弱)"
            elif "再生" in function_text:
                damage_type = "(再生)"
            elif "障壁" in function_text in function_text:
                damage_type = "(障壁)"

        return dice_roll, damage_type

    def damage_roll(function_text):
        def create_dice(dice_check):
            damage_dice = ""
            for dice_type_key, dice_type_list in dice_type.items():
                for index, dice in enumerate(dice_type_list):
                    if dice in dice_check:
                        if dice_type_key == "type_0":
                            damage_dice = f"({index})D"
                        elif dice_type_key == "type_1":
                            damage_dice = f"({skill['skill_rank'] + index})D"
                        elif dice_type_key == "type_2":
                            damage_dice = f"({skill['skill_rank'] * index})D"
                        elif dice_type_key == "type_3":
                            damage_dice = f"({skill['skill_rank'] * index})"

                        for action_value in action_list:
                            if action_value in dice_check:
                                damage_dice += f"+{{{action_value}}}"

                        for ability_value in ability_list:
                            if ability_value in dice_check:
                                damage_dice += f"+{{{ability_value}}}"
                    if damage_dice != "":
                        break
            if damage_dice == "":
                damage_dice = "C("

                for action_value in action_list:
                    if action_value in dice_check:
                        damage_dice += f"+{{{action_value}}}"

                for ability_value in ability_list:
                    if ability_value in dice_check:
                        damage_dice += f"+{{{ability_value}}}"
                for index, dice in enumerate(dice_type['type4']):
                    if dice in dice_check:
                        damage_dice += f"+{index}"
                damage_dice += ")"

            return damage_dice

        damage_dice = ""
        if "［" in function_text and "］の" in function_text:
            # "["と"]の"が存在する場合、それらの間の文字列を取得します
            start_index = function_text.index("［")
            end_index = function_text.index("］の")
            dice_check = function_text[start_index + 1: end_index]
            # dice_type から 特技のダメージロールを作成
            damage_dice = create_dice(dice_check)

        elif "［" in function_text and "］点回" in function_text:
            start_index = function_text.index("［")
            end_index = function_text.index("］点回")
            dice_check = function_text[start_index + 1: end_index]
            # dice_type から 特技のダメージロールを作成
            damage_dice = create_dice(dice_check)

        elif "［" in function_text and "］点まで回" in function_text:
            skill_id = skill['id']
            if skill_id == 1814:  # インドミタブル
                damage_dice = "C({回復力}+{STR}*2)"
            elif skill_id == 2105:  # リバースセルフ
                damage_dice = "C({回復力}*2+1)"
            elif skill_id == 2006:  # リザレクション
                damage_dice = "C({魔力}+{回復力})"
            elif skill_id == 2631:  # ヴァイカリウスシールド
                damage_dice = f"C({shield_defense_value}*10)"

        return damage_dice

    def bad_combat_roll(function_text):
        def create_intensity(dice_check):
            intensity_dice = ""
            for dice_type_key, dice_type_list in dice_type.items():
                for index, dice in enumerate(dice_type_list):
                    if dice in dice_check:
                        if dice_type_key == "type_0":
                            intensity_dice = f"({index})D"
                        elif dice_type_key == "type_1":
                            intensity_dice = f"({skill['skill_rank'] + index})D"
                            for action_value in action_list:
                                if action_value in dice_check:
                                    intensity_dice += f"+{{{action_value}}}"
                            for ability_value in ability_list:
                                if ability_value in dice_check:
                                    intensity_dice += f"+{{{ability_value}}}"
                        elif dice_type_key == "type_2":
                            intensity_dice = f"({skill['skill_rank'] * index})D"
                            for action_value in action_list:
                                if action_value in dice_check:
                                    intensity_dice += f"+{{{action_value}}}"
                            for ability_value in ability_list:
                                if ability_value in dice_check:
                                    intensity_dice += f"+{{{ability_value}}}"
                        elif dice_type_key == "type_3":
                            intensity_dice = f"({skill['skill_rank'] * index})"
                            for action_value in action_list:
                                if action_value in dice_check:
                                    intensity_dice += f"+{{{action_value}}}"
                            for ability_value in ability_list:
                                if ability_value in dice_check:
                                    intensity_dice += f"+{{{ability_value}}}"
                        break
            if intensity_dice == "":
                intensity_dice = "C("
                for index, value in enumerate(dice_type['type_5']):
                    if value in dice_check:
                        intensity_dice += f"{int(value)}"
                for action_value in action_list:
                    if action_value in dice_check:
                        intensity_dice += f"+{{{action_value}}}"

                for ability_value in ability_list:
                    if ability_value in dice_check:
                        intensity_dice += f"+{{{ability_value}}}"
                for index, dice in enumerate(dice_type['type_4']):
                    if dice in dice_check:
                        intensity_dice += f"*{index}"
                if "×SR" in dice_check:
                    intensity_dice += f"*{skill['skill_rank']}"
                intensity_dice += ")"

            return intensity_dice

        damage_dice = ""
        if "［再生：" in function_text and "］を与える" in function_text:
            # "["と"]の"が存在する場合、それらの間の文字列を取得します
            start_index = function_text.index("［再生：")
            end_index = function_text.index("］を与える")
            dice_check = function_text[start_index + 1: end_index]
            # dice_type から 特技のダメージロールを作成
            damage_dice = create_intensity(dice_check)

        elif "［障壁：" in function_text and "］を与える" in function_text:
            # "["と"]の"が存在する場合、それらの間の文字列を取得します
            start_index = function_text.index("［障壁：")
            end_index = function_text.index("］を与える")
            dice_check = function_text[start_index + 1: end_index]
            # dice_type から 特技のダメージロールを作成
            damage_dice = create_intensity(dice_check)

        elif "［衰弱：" in function_text and "］を与える" in function_text:
            # "["と"]点"が存在する場合、それらの間の文字列を取得します
            start_index = function_text.index("［衰弱：")
            end_index = function_text.index("］を与える")
            dice_check = function_text[start_index + 1: end_index]
            # dice_type から 特技のダメージロールを作成
            damage_dice = create_intensity(dice_check)

        elif "［追撃：" in function_text and "］を与える" in function_text:
            # "["と"]の"が存在する場合、それらの間の文字列を取得します
            start_index = function_text.index("［追撃：")
            end_index = function_text.index("］を与える")
            dice_check = function_text[start_index + 1: end_index]
            # dice_type から 特技のダメージロールを作成
            damage_dice = create_intensity(dice_check)
        elif "［追撃：" in function_text and "個与える" in function_text:
            # "["と"]の"が存在する場合、それらの間の文字列を取得します
            start_index = function_text.index("［追撃：")
            end_index = function_text.index("］を")
            dice_check = function_text[start_index + 1: end_index]
            # dice_type から 特技のダメージロールを作成
            damage_dice = create_intensity(dice_check)
            tuigeki_num = ["２", "３", "４", "５", "６", "７", "８", "(ＳＲ)"]
            for num in tuigeki_num:
                num += "個"
                if num in function_text:
                    if num == "(ＳＲ)個":
                        num = f"{skill['skill_rank']}個"
                    damage_dice += f" ×{num}"

        return damage_dice

    dice_type = {
        "type_0": ["０Ｄ", "１Ｄ", "２Ｄ", "３Ｄ", "４Ｄ", "５Ｄ", "６Ｄ", "７Ｄ",
                   "８Ｄ"],
        "type_1": ["（ＳＲ）Ｄ", "（ＳＲ＋１）Ｄ", "（ＳＲ＋２）Ｄ", "（ＳＲ＋３）Ｄ",
                   "（ＳＲ＋４）Ｄ", "（ＳＲ＋５）Ｄ", "（ＳＲ＋６）Ｄ"],
        "type_2": ["（ＳＲ×０）Ｄ", "（ＳＲ×１）Ｄ", "（ＳＲ×２）Ｄ", "（ＳＲ×３）Ｄ",
                   "（ＳＲ×４）Ｄ", "（ＳＲ×５）Ｄ", "（ＳＲ×６）Ｄ"],
        "type_3": ["ＳＲ×０", "ＳＲ×１", "ＳＲ×２", "ＳＲ×３", "ＳＲ×４", "ＳＲ×５",
                   "ＳＲ×６"],
        "type_4": ["×０", "×１", "×２", "×３", "×４", "×５", "×６"],
        "type_5": ["５", "７", "１０"],
    }

    action_list = ["攻撃力", "魔力", "回復力"]
    ability_list = ["STR基本値", "DEX基本値", "POW基本値",
                    "INT基本値",
                    "STR", "DEX", "POW", "INT"]
    # hands
    name = skill
    shields_defense = [0]
    for hand in [hand1, hand2]:
        if hand is None:
            pass
        elif "盾" in hand['tags']:
            shields_defense.append(hand['physical_defense'])
    shield_defense_value = max(shields_defense)
    dice_roll, damage_type = check_skill()
    if dice_roll != "":
        chat_palette_skill += f"[{skill['name']}]\\n"  # ダメージロール
        chat_palette_skill += f"{dice_roll} {damage_type}\\n"  # ダメージロール
    return chat_palette_skill


def create_equipment_data(json_data):
    hand1 = json_data['hand1']
    hand2 = json_data['hand2']
    armor = json_data['armor']
    support_item1 = json_data['support_item1']
    support_item2 = json_data['support_item2']
    support_item3 = json_data['support_item3']
    bag = json_data['bag']
    equipment = [hand1, hand2, armor, support_item1, support_item2,
                 support_item3, bag]

    equipment_data = []
    for item in equipment:
        if item is not None:
            tags = item['tags']
            if any("M" in tag for tag in tags):
                if item['prefix_function'] is not None:
                    prefix_function = item['prefix_function'].split("\n")[0]
                    equipment_data.append(item[
                                              'alias'] + " プレフィックスド効果: " + prefix_function)
                else:
                    named_function = item['function'].split("\n")[0]
                    equipment_data.append(
                        item['alias'] + " ネームド効果: " + named_function)
    return equipment_data, hand1, hand2


def create_item_data(json_data):
    # read item
    items_array = json_data['items']

    # チャットパレット用に整理
    chat_palette_item = ""
    for items in items_array:
        if items is not None:
            chat_palette_item += f"{items['alias']} "  # 名前
            items_function = items['function']
            if items['tags']:
                tags = " ".join(f"[{tag}]" for tag in items['tags'])
                chat_palette_item += tags  # タグ
            if any(("M" in tag or "魔具" in tag) for tag in items['tags']):
                if items['prefix_function'] is None:
                    items_function = items['function'].split("\n")[0]
            if items['timing'] != "－":
                chat_palette_item += f"タイミング:{items['timing']} "  # タイミング
                chat_palette_item += f"判定:{items['roll']} "  # 判定
                chat_palette_item += f"対象:{items['target']} "  # 対象
                chat_palette_item += f"射程:{items['range']} "  # 射程
            chat_palette_item += f"効果:{items_function}\\n"  # 効果
    return chat_palette_item


def create_ability_data(json_data):
    def convert_D_to_LH(ability_data):
        result_list = []
        for item in ability_data:
            new_dict = {}
            for key, value in item.items():
                # "LH"を先頭に追加し、"D"を"LH"に置換
                new_value = value.replace("D", "LH")
                if "2D" in value:
                    new_value = "2LH+" + new_value
                if "3D" in value:
                    new_value = "3LH+" + new_value
                if "4D" in value:
                    new_value = "4LH+" + new_value
                new_value = new_value[:-4]
                new_dict[key] = new_value
            result_list.append(new_dict)
        return result_list

    abl_motion = json_data['abl_motion']  # 運動
    abl_durability = json_data['abl_durability']  # 耐久
    abl_dismantle = json_data['abl_dismantle']  # 解除
    abl_operate = json_data['abl_operate']  # 操作
    abl_sense = json_data['abl_sense']  # 知覚
    abl_negotiate = json_data['abl_negotiate']  # 交渉
    abl_knowledge = json_data['abl_knowledge']  # 知識
    abl_analyze = json_data['abl_analyze']  # 解析
    abl_avoid = json_data['abl_avoid']  # 回避値（ヘイトトップ）
    abl_resist = json_data['abl_resist']  # 抵抗値（ヘイトトップ）
    abl_hit = json_data['abl_hit']  # 命中値

    ability_data = [
        {"運動値": str(abl_motion)},
        {"耐久値": str(abl_durability)},
        {"解除値": str(abl_dismantle)},
        {"操作値": str(abl_operate)},
        {"知覚値": str(abl_sense)},
        {"交渉値": str(abl_negotiate)},
        {"知識値": str(abl_knowledge)},
        {"解析値": str(abl_analyze)},
        {"回避値": str(abl_avoid)},
        {"抵抗値": str(abl_resist)},
        {"命中値": str(abl_hit)}
    ]
    # D -> LH 変換
    new_ability_data = convert_D_to_LH(ability_data)
    return new_ability_data


def create_chat_palette(skill_data, equipment_data, item_data,
                        ability_data):
    # データ整理

    # ○戦闘の基本
    line1 = (
            "○戦闘の基本\\n" +
            ability_data[10]['命中値'] + ">=0 " + "命中値\\n" +
            ability_data[8]['回避値'] + ">=0 " + "回避値(ヘイトトップ)\\n" +
            ability_data[8][
                '回避値'] + ">=0 " + "回避値(ヘイトアンダー)\\n" +
            ability_data[9]['抵抗値'] + ">=0 " + "抵抗値(ヘイトトップ)\\n" +
            ability_data[9][
                '抵抗値'] + ">=0 " + "抵抗値(ヘイトアンダー)\\n" +
            "{攻撃力}+1D6 " + "基本武器攻撃、物理ダメージ\\n" +
            "{魔力}+1D6 " + "基本魔法攻撃、魔法ダメージ\\n")

    # ○被ダメ計算用
    line2 = (
            "○被ダメ計算用\\n" +
            "C(0-{物防}-0) 被ダメージ=物理ダメージ-物防-軽減\\n" +
            "C(0-{魔防}-0) 被ダメージ=魔法ダメージ-魔防-軽減\\n" +
            "C(({HP}+{障壁})-0-{ヘイト}*0-0) 残HP=(HP+障壁)-ダメージ-ヘイトダメージ-その他\\n"
    )

    # ○特技
    line3 = skill_data

    # ○装備アイテム効果
    equipment = ""
    for item in equipment_data:
        equipment = equipment + f"{item}\\n"
    line4 = ("○装備アイテム効果\\n" + equipment)

    # "○所持アイテム一覧\\n"
    line5 = ("○所持アイテム一覧\\n" + item_data)

    # "○各種判定\\n"
    line6 = "○各種判定\\n"
    for ability in ability_data:
        for key, value in ability.items():
            line6 += f"{value}>=0 {key}\\n"

    # ○消耗表
    line7 = (
            "○消耗表\\n" +
            "PCT{CR}+0 体力消耗表\\n" +
            "ECT{CR}+0 気力消耗表\\n" +
            "GCT{CR}+0 物品消耗表\\n" +
            "CCT{CR}+0 金銭消耗表\\n")

    # ○財宝表
    line8 = (
            "○財宝表\\n" +
            "CTRS{CR}+0 金銭財宝表\\n" +
            "MTRS{CR}+0 魔法素材財宝表\\n" +
            "ITRS{CR}+0 換金アイテム財宝表\\n")

    # チャットパレット作成
    chat_palette = (
            line1 + "\\n" + line2 + "\\n" + line3 + "\\n" + line4 + "\\n" +
            line5 + "\\n" + line6 + "\\n" + line7 + "\\n" + line8)

    chat_palette = "\"commands\":\"" + chat_palette

    return chat_palette

# ***********************************************************************************************


def create_piece(character_id: str):
    json_url = f"https://lhrpg.com/lhz/api/{character_id}.json"
    json_data = read_json(json_url)

    # read_json がエラーメッセージ文字列を返した場合
    if isinstance(json_data, str):
        return json_data

    try:
        character_data, character_name = create_character_data(json_data, character_id)
        status_data = create_status_data(json_data)
        prams_data = create_prams_data(json_data)
        equipment_data, hand1, hand2 = create_equipment_data(json_data)
        skill_data = create_skill_data(json_data, hand1, hand2)
        item_data = create_item_data(json_data)
        ability_data = create_ability_data(json_data)
        chat_palette = create_chat_palette(
            skill_data,
            equipment_data,
            item_data,
            ability_data,
        )

        piece = (
            "{\"kind\":\"character\",\"data\":{"
            + character_data
            + status_data
            + prams_data
            + chat_palette
            + "\"}}"
        )

        return piece

    except TypeError:
        return "データの解析に失敗しました。"


def create_piece_from_url(url_or_id: str):
    character_id = extract_character_id(url_or_id)
    return create_piece(character_id)