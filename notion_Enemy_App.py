import streamlit as st
import pandas as pd
import json


# 各値の計算式
class AbilityCalculator:
    def __init__(self, enemy_type, enemy_data_dic, enemy_race, enemy_rank, cr,
                 json_data):
        self._json_data = json_data
        self._enemy_type = enemy_type
        self._enemy_data = enemy_data_dic[enemy_type]
        self._race = enemy_race
        self._rank = enemy_rank
        self._cr = cr
        self._str = self._enemy_data["base_str"]
        self._dex = self._enemy_data["base_dex"]
        self._pow = self._enemy_data["base_pow"]
        self._int = self._enemy_data["base_int"]
        self._avoid_coefficient = self._enemy_data["base_avoid_coefficient"]
        self._avoid_fix = self._enemy_data["base_avoid_fix"]
        self._resist_coefficient = self._enemy_data["base_resist_coefficient"]
        self._resist_fix = self._enemy_data["base_resist_fix"]
        self._pd_coefficient = self._enemy_data["base_pd_coefficient"]
        self._pd_fix = self._enemy_data["base_pd_fix"]
        self._md_coefficient = self._enemy_data["base_md_coefficient"]
        self._md_fix = self._enemy_data["base_md_fix"]
        self._hp_coefficient = self._enemy_data["base_hp_coefficient"]
        self._hp_fix = self._enemy_data["base_hp_fix"]
        self._action_fix = self._enemy_data["base_action_fix"]
        self._hate_cr = self._enemy_data["base_hateCr"]
        self._hate_fix = self._enemy_data["base_hate_fix"]
        self._basic_attack_type = self._enemy_data["base_basicAttackType"]
        self._basic_attack_role_fix = self._enemy_data[
            "base_basicAttackRole_fix"]
        self._basic_attack_role_dice = self._enemy_data[
            "base_basicAttackRoleDice"]
        self._basic_target = self._enemy_data["base_basicTarget"]
        self._basic_range = self._enemy_data["base_basicRange"]

    # STRを計算
    def get_str(self):
        if self._json_data is not None:
            return self._json_data["strength"]
        else:
            return 0 if self._race == "ギミック" else int(
                (self._cr * 1.1 + self._str) // 3)

    # DEXを計算
    def get_dex(self):
        if self._json_data is not None:
            return self._json_data["dexterity"]
        else:
            return 0 if self._race == "ギミック" else int(
                (self._cr * 1.1 + self._dex) // 3)

    # POWを計算
    def get_pow(self):
        if self._json_data is not None:
            return self._json_data["power"]
        else:
            return 0 if self._race == "ギミック" else int(
                (self._cr * 1.1 + self._pow) // 3)

    # INTを計算
    def get_int(self):
        if self._json_data is not None:
            return self._json_data["intelligence"]
        else:
            return 0 if self._race == "ギミック" else int(
                (self._cr * 1.1 + self._int) // 3)

    # 回避値を計算
    def get_avoid(self):
        if self._json_data is not None:
            return self._json_data["avoid"]
        else:
            avoid_value = (
                                  self._cr * self._avoid_coefficient + self._avoid_fix) // 3
            return int(avoid_value)

    def get_avoid_dice(self):
        if self._json_data is not None:
            return self._json_data["avoid_dice"]
        else:
            return 3 if self._enemy_type == "グラップラー" else 2

    # 抵抗値を計算
    def get_resist(self):
        if self._json_data is not None:
            return self._json_data["resist"]
        else:
            resist_value = (
                                   self._cr * self._resist_coefficient + self._resist_fix) // 3
            return int(resist_value)

    def get_resist_dice(self):
        if self._json_data is not None:
            return self._json_data["resist_dice"]
        else:
            return 3 if self._enemy_type == "グラップラー" else 2

    # 物理防御を計算
    def get_physical_defense(self):
        if self._json_data is not None:
            return self._json_data["physical_defense"]
        else:
            return int(self._cr * self._pd_coefficient + self._pd_fix)

    # 魔法防御を計算
    def get_magic_defense(self):
        if self._json_data is not None:
            return self._json_data["magic_defense"]
        else:
            return int(self._cr * self._md_coefficient + self._md_fix)

    # 最大HPを計算
    def get_hit_point(self):
        if self._json_data is not None:
            return self._json_data["hit_point"]
        else:
            hp = self._cr * self._hp_coefficient + self._hp_fix
            if self._race == "ギミック" or self._rank == "モブ":
                hp = hp / 2
            elif self._rank in "ボス":
                hp = hp * 4
            elif self._rank in "レイド":
                hp = hp * 10
            return int(hp)

    # ヘイト倍率を計算
    def get_hate(self):
        if self._json_data is not None:
            return self._json_data["hate"]
        else:
            if self._rank in ["ボス", "レイド"]:
                return int(self._cr / 2.4 + 4)
            else:
                return 0 if self._race == "ギミック" else int(
                    (self._cr + self._hate_cr) // 6 + self._hate_fix)

    # 行動値を計算
    def get_action(self):
        if self._json_data is not None:
            return self._json_data["action"]
        else:
            value1 = (self._cr * 1.1 + 7) // 3
            value2 = (self._cr * 1.1 + 3) // 3
            return 0 if self._race == "ギミック" else int(
                value1 + value2 + self._action_fix)

    # 移動力を計算
    def get_move(self):
        if self._json_data is not None:
            return self._json_data["move"]
        else:
            return 0 if self._race == "ギミック" else 2

    def get_fate(self):
        if self._json_data is not None:
            return self._json_data["fate"]
        else:
            return 0

    # 攻撃方法を決定
    def get_basic_attack_type(self):
        return self._basic_attack_type

    # 攻撃対象を決定
    def get_basic_target(self):
        return self._basic_target

    # 攻撃射程を決定
    def get_basic_range(self):
        return self._basic_range

    # 命中値を計算
    def get_role(self):
        role_value = (self._cr * 1.1 + 7) // 3 + self._basic_attack_role_fix
        role_dice = self._basic_attack_role_dice
        if self._rank in "モブ":
            return f"{int(role_value + role_dice * 3)}[固定]"
        else:
            return f"{int(role_value)} + {role_dice} D"

    # ダメージを計算
    def get_damage_fix(self, rate=1):
        damage_dice = 2
        return f"{int(self.get_damage(rate) - 7)} + {damage_dice} D"

    # エネミーのタイプによってダメージの計算式を決定
    def get_damage(self, rate=1):
        result = 0
        if self._enemy_type in ["アーマラー", "フェンサー", "グラップラー",
                                "ヒーラー"]:
            result = self.get_physical_damage1()
        elif self._enemy_type in "サポーター":
            result = self.get_magic_damage1()
        elif self._enemy_type in ["スピア", "アーチャー"]:
            result = self.get_physical_damage2()
        elif self._enemy_type in ["シューター", "ボマー"]:
            result = self.get_magic_damage2()
        return result * rate

    # ダメージの計算式_1
    def get_physical_damage1(self):
        return self.get_magic_damage1() + 8

    # ダメージの計算式_2
    def get_physical_damage2(self):
        return self.get_magic_damage2() + 8

    # ダメージの計算式_3
    def get_magic_damage1(self):
        return self._cr * 3.5 + 8

    # ダメージの計算式_4
    def get_magic_damage2(self):
        return self._cr * 6 + 18

    # ドロップ品の金銭を計算
    def get_gold(self):
        gold = (self._cr + 2) * (self._cr + 2) * 0.72 + 17
        if self._race == "ギミック" or self._rank == "モブ":
            gold = gold / 2
        elif self._rank in ["ボス", "レイド"]:
            gold = gold * 4
        gold = int(gold) - (int(gold) % 5)  # 切り捨てて5の倍数にする
        return f"換金({gold} G)"

    # コア素材の値段を計算
    def get_drop_core(self):
        # コア素材_推奨価格
        core_price_list = [
            30, 40, 50, 60, 80, 100, 120, 140, 180, 220,
            240, 300, 340, 380, 440, 500, 560, 620, 680, 740,
            820, 900, 980, 1060, 1160, 1240, 1340, 1440, 1540, 1640,
            1760
        ]
        if self._rank == "ボス" or self._rank == "レイド":
            core_price = core_price_list[self._cr - 1]
        else:
            return None
        return f"コア素材[CR{self._cr}] ({str(core_price)} G)"

    # 魔触媒の値段を計算
    def get_drop_catalyst(self):
        # 魔触媒_推奨価格
        catalyst_price_list = [
            15, 20, 25, 30, 40, 50, 60, 70, 90, 110,
            120, 150, 170, 190, 220, 250, 280, 310, 340, 370,
            410, 450, 490, 530, 580, 620, 670, 720, 770, 820,
            880
        ]
        if self._rank == "ボス" or self._rank == "レイド":
            catalyst_price = catalyst_price_list[self._cr]
            catalyst_strength = self._cr + 1
        else:
            catalyst_price = catalyst_price_list[self._cr - 1]
            catalyst_strength = self._cr
        return f"魔触媒{catalyst_strength} ({str(catalyst_price)} G)"


class JsonDataParser:
    def __init__(self, file_contents, race_list, enemy_rank_list, type_list,
                 popularity_dic):
        self.file_contents = file_contents
        self.race_list = race_list
        self.enemy_rank_list = enemy_rank_list
        self.type_list = type_list
        self.popularity_dic = popularity_dic

    def parse_json(self):
        result_dict = {}  # result_dictを初期化

        try:
            json_data = json.loads(self.file_contents)
            check = json_data.get("index_type")
            if check == "エネミー":
                result_dict["json_data"] = json_data
                result_dict.update(self.process_json_data(json_data))
                return result_dict
            else:
                st.error("JSONファイルが正しくありません。")
        except json.JSONDecodeError:
            st.error("JSONファイルが読み込めません。")

    def process_json_data(self, json_data):
        result_dict = {}  # メソッド内でresult_dictを初期化

        if json_data["ruby"] != "null":
            result_dict["j_name"] = json_data["name"] + json_data["ruby"]
        else:
            result_dict["j_name"] = json_data["name"]

        rank = json_data["rank"]
        if rank in self.enemy_rank_list:  # 変数名を修正
            result_dict["j_rank"] = self.enemy_rank_list.index(rank)

        result_dict["j_cr"] = json_data["character_rank"]

        if "type" in json_data:
            j_type = json_data["type"]
            result_dict["j_type"] = self.type_list.index(j_type)
        else:
            result_dict["j_type"] = 9

        tags = json_data["tags"]
        result_dict["j_race"] = [index for index, element in
                                 enumerate(race_list) if element in tags]

        result_dict["j_identification"] = json_data["identification"]

        if result_dict["j_identification"] == "自動":
            result_dict["j_popularity"] = 0
        else:
            popularity = result_dict["j_identification"] - int(
                (result_dict["j_cr"] - 1) / 3 + 1)
            if popularity in self.popularity_dic.values():
                result_dict["j_popularity"] = list(
                    self.popularity_dic.values()).index(popularity)

        result_dict["j_tags"] = json_data["tags"]

        result_dict["j_memo"] = json_data["contents"]

        result_dict["j_items"] = json_data["items"]

        result_dict["j_skills"] = json_data["skills"]

        return result_dict


# 知名度を計算
def identification(popularity="一般的", cr=1):
    if popularity != "超有名":
        identification = popularity_dic[popularity] + int(
            (cr - 1) / 3 + 1)
    else:
        identification = "自動成功"
    return identification


def create_ccfolia():
    new_enemy_memo = enemy_memo.replace("\r\n", "\\n")

    skill_command = ""
    skill_memo = ""

    for s in skills:
        if s["特技名"] != "":
            if skill_command != "":
                skill_command += f"{s['特技名']}\\n{s['効果']}\\n"
            else:
                skill_command = f"{s['特技名']}\\n{s['効果']}\\n"

            if skill_memo != "":
                skill_memo += "\\n"

            skill_memo += f"{s['特技名']}"

            if s["タグ"] != "":
                skill_memo += f"_[{s['タグ']}]"
            if s["タイミング"] != "":
                skill_memo += f"_{s['タイミング']}"
            if s["命中値"] != "":
                skill_memo += f"_対決（{s['命中値']}／{s['判定']}）"
            if s["対象"] != "":
                skill_memo += f"_{s['対象']}"
            if s["射程"] != "":
                skill_memo += f"_{s['射程']}"
            if s["制限"] != "":
                skill_memo += f"_{s['制限']}"
            skill_memo += f"_{s['効果']}"

    item_command = ""
    for i in items:
        i_dice = ""
        if i["アイテム名"] != "" and i['ダイス'] != "":
            if item_command != "":
                item_command += "\\n"

            for dice in i['ダイス']:
                if i_dice != "":
                    i_dice += "," + str(dice)
                else:
                    i_dice = str(dice)
            item_command += f"ダイス: {i_dice}"
            item_command += f"_アイテム名: {i['アイテム名']}"

            if i["解説"] == "":
                pass
            else:
                item_command += f"_解説: {i['解説']}"

    new_enemy_tag = ""
    for tag in enemy_tag.split(','):
        if new_enemy_tag == "":
            new_enemy_tag = f"\"{tag.strip()}\""
        else:
            new_enemy_tag += f", \"{tag.strip()}\""

    ccfolia_txt = (
            "{\"kind\":\"character\",\"data\":{" +
            f"\"name\":\"{enemy_name}\"," +
            f"\"initiative\":{enemy_action}," +
            f"\"memo\":\"<タグ>\\n[{enemy_tag}]\\n\\n<解説>\\n{new_enemy_memo}\\n\\n<ドロップ品>\\n{item_command}\\n\\n<特技>\\n{skill_memo}\"," +
            "\"status\":[" +
            "{" + f"\"label\":\"HP\", \"value\":{enemy_hit_point}, \"max\":{enemy_hit_point}" + "}," +
            "{" + f"\"label\":\"ヘイト倍率\", \"value\":{enemy_hate}, \"max\":{enemy_hate}" + "}," +
            "{" + f"\"label\":\"因果力\", \"value\":{0}, \"max\":{0}" + "}" +
            "]," +
            "\"params\":[" +
            "{" + f"\"label\":\"CR\", \"value\":\"{enemy_cr}\"" + "}," +
            "{" + f"\"label\":\"物防\", \"value\":\"{enemy_physical_defense}\"" + "}," +
            "{" + f"\"label\":\"魔防\", \"value\":\"{enemy_magical_defense}\"" + "}" +
            "]," +
            "\"commands\":" +
            f"\"{skill_command}\""
            "}}"
    )
    return ccfolia_txt


def create_csv():
    enemy_data = {
        "row_1": ["名称", enemy_name.replace("－", "-"), None, "CR", enemy_cr, None, "大種族",
                  enemy_race, None, "タイプ", enemy_type, None, None, None],
        "row_2": ["タグ", enemy_tag.replace("－", "-"), None, "知名度", enemy_popularity,
                  None, "識別難易度", enemy_identification, None, "ランク",
                  enemy_rank, None, None, None],
        "row_3": [None, None, None, None, None, None, None, None, None, None,
                  None, None, None, None],
        "row_4": ["STR", enemy_str, None, "DEX", enemy_dex, None, "POW",
                  enemy_pow, None, "INT", enemy_int, None, None, None],
        "row_5": ["回避", enemy_avoidance, None, "抵抗", enemy_resistance,
                  None, "物防", enemy_physical_defense, None, "魔防",
                  enemy_magical_defense, None, None, None],
        "row_6": ["最大HP", enemy_hit_point, None, "ヘイト倍率",
                  enemy_hate, None, "行動力", enemy_action, None, "移動力",
                  enemy_move, None, "因果力", enemy_fate],
    }

    x = 7
    item_data = {}
    for i in items:
        i_dice = ""
        if i["ダイス"] != "" and i["アイテム名"] != "":
            i_name = i["アイテム名"]
            i_exp = "" if i["解説"] == "" else i["解説"]

            for dice in i['ダイス']:
                if i_dice != "":
                    i_dice += "," + str(dice)
                else:
                    i_dice = str(dice)

            item_list1 = [None, None, None, None, None, None, None, None, None,
                          None, None, None, None, None]
            if i_exp == "":
                item_list2 = ["ダイス", i_dice, None, "アイテム名", i_name.replace("－", "-"),
                              None,
                              None, None, None, None, None, None, None, None]
            else:
                item_list2 = ["ダイス", i_dice, None, "アイテム名", i_name.replace("－", "-"),
                              None,
                              "解説", i_exp.replace("－", "-"), None, None, None, None, None, None]

            for item_list in [item_list1, item_list2]:
                item_data[f"row_{x}"] = item_list
                x += 1

    skill_data = {}
    for s in skills:
        s_name = "" if s["特技名"] == "" else s["特技名"]
        s_tag = "" if s["タグ"] == "" else s["タグ"]
        s_timing = "" if s["タイミング"] == "" else s["タイミング"]
        s_roll_e = "" if s["命中値"] == "" else s["命中値"]
        s_roll_p = "" if s["判定"] == "" else s["判定"]
        s_target = "" if s["対象"] == "" else s["対象"]
        s_range = "" if s["射程"] == "" else s["射程"]
        s_description = "" if s["効果"] == "" else s["効果"]

        skill_list1 = [None, None, None, None, None, None, None, None, None,
                       None, None, None, None, None]
        skill_list2 = ["特技名", s_name.replace("－", "-"), None, "タグ", s_tag.replace("－", "-"), None, None, None,
                       None, None, None, None, None, None]
        if s_roll_e == "":
            skill_list3 = ["タイミング", s_timing, None, "判定", None, None,
                           None, None, None, None, None, None, None, None]
        else:
            skill_list3 = ["タイミング", s_timing, None, "判定",
                           f"({s_roll_e}／{s_roll_p})", None, None, None, None,
                           None, None, None, None, None]
        skill_list4 = ["対象", s_target, None, "射程", s_range, None, None,
                       None, None, None, None, None, None, None]
        skill_list5 = ["効果", s_description.replace("－", "-"), None, None, None, None, None,
                       None, None, None, None, None, None, None]

        for skill_list in [skill_list1, skill_list2, skill_list3, skill_list4,
                           skill_list5]:
            skill_data[f"row_{x}"] = skill_list
            x += 1

    df = pd.DataFrame({**enemy_data, **item_data, **skill_data})
    return df.T.to_csv(header=False, index=False).encode('shift-jis')


def create_json():
    new_enemy_memo = enemy_memo.replace("\r\n", "\\n")

    skill_command = ""
    for s in skills:
        if skill_command != "":
            skill_command += ","
        if s["特技名"] == "":
            pass
        else:
            skill_command += "{" + f"\"name\":\"{s['特技名']}\","

            if s["タイミング"] == "":
                skill_command += f"\"timing\":null,"
            else:
                skill_command += f"\"timing\":\"{s['タイミング']}\","

            if s["命中値"] == "":
                skill_command += f"\"role\":null,"
            else:
                skill_command += f"\"role\":\"対決（{s['命中値']}／{s['判定']}）\","

            if s["対象"] == "":
                skill_command += f"\"target\":null,"
            else:
                skill_command += f"\"target\":\"{s['対象']}\","

            if s["射程"] == "":
                skill_command += f"\"range\":null,"
            else:
                skill_command += f"\"range\":\"{s['射程']}\","

            if s["制限"] == "":
                skill_command += f"\"limit\":null,"
            else:
                skill_command += f"\"limit\":\"{s['制限']}\","

            if s["効果"] == "":
                skill_command += f"\"function\":null,"
            else:
                skill_command += f"\"function\":\"{s['効果']}\","

            if s["タグ"] == "":
                skill_command += f"\"tags\":[]"
            else:
                skill_command += f"\"tags\":[\"{s['タグ']}\"]"

            skill_command += "}"

    item_command = ""
    for i in items:
        i_dice = ""
        if item_command != "":
            item_command += ","

        for dice in i['ダイス']:
            if i_dice != "":
                i_dice += "," + str(dice)
            else:
                i_dice = str(dice)
        item_command += "{" + f"\"dice\":\"{i_dice}\","

        if i["アイテム名"] == "":
            item_command += f"\"item\":null,"
        else:
            item_command += f"\"item\":\"{i['アイテム名']}\","

        if i["解説"] == "":
            item_command += f"\"exp\":null"
        else:
            item_command += f"\"exp\":\"{i['解説']}\""

        item_command += "}"

    new_enemy_tag = ""
    for tag in enemy_tag.split(','):
        if new_enemy_tag == "":
            new_enemy_tag = f"\"{tag.strip()}\""
        else:
            new_enemy_tag += f", \"{tag.strip()}\""

    json_txt = (
            "{" + f"\"id\":null," +
            "\"index_type\":\"エネミー\"," +
            f"\"name\":\"{enemy_name}\"," +
            f"\"ruby\":\"null\"," +
            f"\"rank\":\"{enemy_rank}\"," +
            f"\"type\":\"{enemy_type}\"," +
            f"\"character_rank\":{enemy_cr}," +
            f"\"identification\":{enemy_identification}," +
            f"\"strength\":{enemy_str}," +
            f"\"dexterity\":{enemy_dex}," +
            f"\"power\":{enemy_pow}," +
            f"\"intelligence\":{enemy_int}," +
            f"\"avoid\":{enemy_avoidance}," +
            f"\"avoid_dice\":{enemy_avoidance_dice}," +
            f"\"resist\":{enemy_resistance}," +
            f"\"resist_dice\":{enemy_resistance_dice}," +
            f"\"physical_defense\":{enemy_physical_defense}," +
            f"\"magic_defense\":{enemy_magical_defense}," +
            f"\"hit_point\":{enemy_hit_point}," +
            f"\"hate\":{enemy_hate}," +
            f"\"action\":{enemy_action}," +
            f"\"move\":{enemy_move}," +
            f"\"fate\":{enemy_fate}," +
            f"\"contents\":\"{new_enemy_memo}\"," +
            f"\"tags\":[{new_enemy_tag}]," +
            f"\"skills\":[{skill_command}]," +
            f"\"items\":[{item_command}]" +
            "}"
    )
    return json_txt


# エネミータイプ一覧
type_list = ["アーマラー", "フェンサー", "グラップラー", "サポーター",
             "ヒーラー", "スピア", "アーチャー", "シューター", "ボマー", "不明"]
# エネミーの大種族
race_list = ["人型", "自然", "精霊", "幻獣", "不死", "人造", "人間", "ギミック"]

# エネミーのランク
enemy_rank_list = ["モブ", "ノーマル", "ボス", "レイド"]

# エネミー知名度
popularity_list = ["超有名", "有名", "一般的", "普通", "珍しい", "無名", "秘密"]
popularity_dic = {"超有名": "自動", "有名": 2, "一般的": 4,
                  "普通": 6, "珍しい": 7, "無名": 9, "秘密": 12}

# 特技のタイミング
skill_timing_list = ["常時", "セットアップ", "ムーブ", "マイナー", "メジャー",
                     "クリンナップ", "インスタント", "行動",
                     "ダメージロール", "判定直前", "判定直後",
                     "ダメージ適用直前", "ダメージ適用直後", "本文",
                     "EXパワー"]

# 別ファイルから読み込むように変更できる？？
# 各エネミータイプのデータ一覧
enemy_data_dic = {
    "アーマラー": {
        "base_str": 7,  # STR
        "base_dex": 3,  # DEX
        "base_pow": 4,  # POW
        "base_int": 2,  # INT
        "base_avoid_coefficient": 1.2,  # 回避値_係数
        "base_avoid_fix": 4,  # 回避値_固定値
        "base_resist_coefficient": 1.1,  # 抵抗値_係数
        "base_resist_fix": 2,  # 抵抗値_固定
        "base_pd_coefficient": 2.2,  # 物理防御_係数
        "base_pd_fix": 8,  # 物理防御_固定値
        "base_md_coefficient": 1.7,  # 魔法防御_係数
        "base_md_fix": 2,  # 魔法防御_固定値
        "base_hp_coefficient": 8.5,  # HP_係数
        "base_hp_fix": 48,  # HP_固定値
        "base_action_fix": -2,  # 行動値_固定値
        "base_hateCr": 0,  # ヘイト倍率_CR上昇値
        "base_hate_fix": 1,  # ヘイト倍率_固定値
        "base_damageAll_coefficient": 1,  # ダメージ_係数？？？
        "base_aggression_coefficient": 0.55,  # ？？？
        "base_basicAttackType": "melee",  # 攻撃タイプ
        "base_basicAttackRole_fix": 2,  # 命中値_固定値
        "base_basicAttackRoleDice": 2,  # 命中値_ダイス
        "base_basicTarget": "single",  # 攻撃対象
        "base_basicRange": 0,  # 射程
        "explanation": "【物理防御力】と【最大ＨＰ】に秀でる反面【行動力】は低いエネミーです。クラスで言うと〈守護戦士〉にちかいでしょう。仲間を守る特技やＰＣの移動を阻害する特技を与えるべきです。このＥタイプのエネミーは倒しにくい反面、ＰＣに脅威を感じさせることには向いていません。過剰に出すとセッションが停滞します。またソロボスにも向きません。『ＬＨＺ』記載の代表的なエネミーは〈鉄躯緑鬼〉（P４４４）です。",
        # 解説
    },
    "フェンサー": {
        "base_str": 7,
        "base_dex": 4,
        "base_pow": 2,
        "base_int": 3,
        "base_avoid_coefficient": 1.1,
        "base_avoid_fix": 4,
        "base_resist_coefficient": 1.1,
        "base_resist_fix": 2,
        "base_pd_coefficient": 1.7,
        "base_pd_fix": 5,
        "base_md_coefficient": 1.7,
        "base_md_fix": 1,
        "base_hp_coefficient": 8.4,
        "base_hp_fix": 45,
        "base_action_fix": -2,
        "base_hateCr": 2,
        "base_hate_fix": 1,
        "base_damageAll_coefficient": 1,
        "base_aggression_coefficient": 0.55,
        "base_basicAttackType": "melee",
        "base_basicAttackRole_fix": 2,
        "base_basicAttackRoleDice": 2,
        "base_basicTarget": "single",
        "base_basicRange": 0,
        "explanation": "アーマラーほどではありませんが、【物理防御力】と【最大ＨＰ】に秀で、【行動力】は低いエネミーです。クラスで言うと〈武士〉にちかいでしょう。仲間を守る特技や反撃する特技を与えるべきです。このＥタイプのエネミーはＰＣに先に倒してしまおうと思わせることに向いています。比較的ソロボスにむいています。『ＬＨＺ』記載の代表的なエネミーは〈吸血鬼〉（P４５７）です。",
    },
    "グラップラー": {
        "base_str": 7,
        "base_dex": 4,
        "base_pow": 2,
        "base_int": 3,
        "base_avoid_coefficient": 1.1,
        "base_avoid_fix": 2,
        "base_resist_coefficient": 1.1,
        "base_resist_fix": 4,
        "base_pd_coefficient": 0.9,
        "base_pd_fix": 2,
        "base_md_coefficient": 1.3,
        "base_md_fix": 3,
        "base_hp_coefficient": 7.5,
        "base_hp_fix": 45,
        "base_action_fix": 0,
        "base_hateCr": 0,
        "base_hate_fix": 1,
        "base_damageAll_coefficient": 1,
        "base_aggression_coefficient": 0.55,
        "base_basicAttackType": "melee",
        "base_basicAttackRole_fix": 2,
        "base_basicAttackRoleDice": 2,
        "base_basicTarget": "single",
        "base_basicRange": 0,
        "explanation": "【最大ＨＰ】と［防御判定］に秀でる反面、【防御力】が低いエネミーです。仲間を守る特技やＰＣの妨害、反撃をする特技を与えるべきです。このＥタイプのエネミーはかなり倒しにくい反面、ＰＣに脅威を感じさせることには向いていません。過剰に出すとセッションが停滞します。〈武闘家〉と似た特性をもっていますが、ヘイトルールの存在もありエネミーの役割やデザインは〈武闘家〉からはなれ、ある種の妨害役と考えるべきです。またボスそのものにも向いていません。『ＬＨＺ』記載の代表的なエネミーは〈屍食少女〉（P４３６）です。",
    },
    "サポーター": {
        "base_str": 4,
        "base_dex": 2,
        "base_pow": 7,
        "base_int": 3,
        "base_avoid_coefficient": 1.2,
        "base_avoid_fix": 2,
        "base_resist_coefficient": 1.1,
        "base_resist_fix": 7,
        "base_pd_coefficient": 1.5,
        "base_pd_fix": 3,
        "base_md_coefficient": 1.8,
        "base_md_fix": 5,
        "base_hp_coefficient": 5.0,
        "base_hp_fix": 35,
        "base_action_fix": 2,
        "base_hateCr": 0,
        "base_hate_fix": 1,
        "base_damageAll_coefficient": 1,
        "base_aggression_coefficient": 0.55,
        "base_basicAttackType": "magical",
        "base_basicAttackRole_fix": 2,
        "base_basicAttackRoleDice": 2,
        "base_basicTarget": "single",
        "base_basicRange": 4,
        "explanation": "【抵抗値】と【行動力】に秀でる反面、物理的な攻撃に弱いエネミーです。クラスで言うと〈吟遊詩人〉〈付与術師〉にちかいでしょう。仲間をサポートする特技やＰＣにさまざまな妨害を行なう特技を与えるべきです。CR３以上の環境では、強力なBSや地形支配の要素をもつこともあります。このＥタイプのエネミーは、単体でＰＣに脅威を感じさせることは難しいでしょう。群れボスに向いています。『ＬＨＺ』記載の代表的なエネミーは〈棘茨イタチ〉（P４２４）です。",
    },
    "ヒーラー": {
        "base_str": 3,
        "base_dex": 2,
        "base_pow": 7,
        "base_int": 4,
        "base_avoid_coefficient": 1.2,
        "base_avoid_fix": 2,
        "base_resist_coefficient": 1.1,
        "base_resist_fix": 7,
        "base_pd_coefficient": 1.8,
        "base_pd_fix": 8,
        "base_md_coefficient": 1.7,
        "base_md_fix": 1,
        "base_hp_coefficient": 6.0,
        "base_hp_fix": 30,
        "base_action_fix": -2,
        "base_hateCr": 0,
        "base_hate_fix": 1,
        "base_damageAll_coefficient": 1,
        "base_aggression_coefficient": 0.55,
        "base_basicAttackType": "melee",
        "base_basicAttackRole_fix": 2,
        "base_basicAttackRoleDice": 2,
        "base_basicTarget": "single",
        "base_basicRange": 2,
        "explanation": "【抵抗値】に秀で、【防御力】もやや高いものの、トータルではあまり打たれづよくないエネミーです。仲間を守る特技を中心に与えるべきです。このＥタイプのエネミーは攻撃が得意ではないため、単体でＰＣに脅威を感じさせることは難しいでしょう。〈施療神官〉〈森呪使い〉〈神祇官〉にちかいEタイプですが過剰な回復能力は戦闘に停滞をもたらす可能性もあります。支援系の能力に切り替えるなどの工夫が必要でしょう。群れボスに向いています。『ＬＨＺ』記載の代表的なエネミーは〈一角獣〉（P４４９）です。",
    },
    "スピア": {
        "base_str": 4,
        "base_dex": 7,
        "base_pow": 2,
        "base_int": 3,
        "base_avoid_coefficient": 1.2,
        "base_avoid_fix": 7,
        "base_resist_coefficient": 1.1,
        "base_resist_fix": 2,
        "base_pd_coefficient": 1.7,
        "base_pd_fix": 5,
        "base_md_coefficient": 1.5,
        "base_md_fix": 3,
        "base_hp_coefficient": 6.0,
        "base_hp_fix": 30,
        "base_action_fix": 0,
        "base_hateCr": 0,
        "base_hate_fix": 2,
        "base_damageAll_coefficient": 1,
        "base_aggression_coefficient": 0.85,
        "base_basicAttackType": "melee",
        "base_basicAttackRole_fix": 1,
        "base_basicAttackRoleDice": 3,
        "base_basicTarget": "single",
        "base_basicRange": 0,
        "explanation": "【回避値】が高く、もっとも高い物理ダメージを与えることができるエネミーです。クラスで言うと〈暗殺者〉〈盗剣士〉にちかいでしょう。ＢＳや追加ダメージを与える特技、自身の移動を強化する特技を与えるべきです。このＥタイプのエネミーは、ＰＣに脅威を感じさせることに向いていて、低ＣＲからつかいやすく高ＣＲまでエネミーアタッカーの主力として活躍できます。ソロボスおよび群れボスのどちらにも向いています。『ＬＨＺ』記載の代表的なエネミーは〈刃のマスカルウィン〉（P４６７）です。",
    },
    "アーチャー": {
        "base_str": 3,
        "base_dex": 4,
        "base_pow": 2,
        "base_int": 7,
        "base_avoid_coefficient": 1.1,
        "base_avoid_fix": 4,
        "base_resist_coefficient": 1.1,
        "base_resist_fix": 2,
        "base_pd_coefficient": 1.6,
        "base_pd_fix": 6,
        "base_md_coefficient": 1.9,
        "base_md_fix": 5,
        "base_hp_coefficient": 5.0,
        "base_hp_fix": 26,
        "base_action_fix": 0,
        "base_hateCr": 2,
        "base_hate_fix": 2,
        "base_damageAll_coefficient": 0.9,
        "base_aggression_coefficient": 0.85,
        "base_basicAttackType": "shooting",
        "base_basicAttackRole_fix": 0,
        "base_basicAttackRoleDice": 3,
        "base_basicTarget": "single",
        "base_basicRange": 3,
        "explanation": "［射撃攻撃］を用い、射程３～４の距離から物理ダメージを与えてくるエネミーです。【魔法防御力】にもやや秀でますが、同一Ｓｑを対象とした攻撃は苦手です。クラスで言うと〈暗殺者〉にちかいでしょう。ＰＣを強制的に移動させる特技や、ダメージ追加特技を与えるべきです。このＥタイプのエネミーは、他のエネミーとの連携をイメージしてデザインするとよいでしょう。スピアタイプと比較した場合、移動の必要なく、集中攻撃が可能であるという特徴があります。作成には注意が必要です。ソロボスおよび群れボスのどちらにも向いています。『ＬＨＺ』記載の代表的なエネミーは〈時計仕掛の蜻蛉〉（P４３３）です。",
    },
    "シューター": {
        "base_str": 3,
        "base_dex": 2,
        "base_pow": 5,
        "base_int": 7,
        "base_avoid_coefficient": 1.2,
        "base_avoid_fix": 2,
        "base_resist_coefficient": 1.1,
        "base_resist_fix": 5,
        "base_pd_coefficient": 1.3,
        "base_pd_fix": 3,
        "base_md_coefficient": 1.9,
        "base_md_fix": 5,
        "base_hp_coefficient": 4.0,
        "base_hp_fix": 26,
        "base_action_fix": 1,
        "base_hateCr": 2,
        "base_hate_fix": 2,
        "base_damageAll_coefficient": 1,
        "base_aggression_coefficient": 0.85,
        "base_basicAttackType": "magical",
        "base_basicAttackRole_fix": 0,
        "base_basicAttackRoleDice": 3,
        "base_basicTarget": "single",
        "base_basicRange": 4,
        "explanation": "単体に対する［魔法攻撃］を用い、遠くから魔法ダメージを与えてくるエネミーです。「攻撃判定」や【行動力】に秀でる反面、【ＨＰ】や【物理防御力】は低くなっています。クラスで言うと〈妖術師〉〈召喚術師〉にちかく、アーチャーに似た特性を持っています。ＢＳや追加ダメージを与える特技を与えるべきです。このＥタイプのエネミーは攻撃を得意とする反面打たれ弱いので、他のエネミーとの連携をイメージしてデザインするとよいでしょう。『ＬＨＺ』記載の代表的なエネミーは〈小牙竜鬼の詠唱師〉（P４２２）です。",
    },
    "ボマー": {
        "base_str": 3,
        "base_dex": 2,
        "base_pow": 5,
        "base_int": 7,
        "base_avoid_coefficient": 1.2,
        "base_avoid_fix": 2,
        "base_resist_coefficient": 1.1,
        "base_resist_fix": 5,
        "base_pd_coefficient": 1.3,
        "base_pd_fix": 3,
        "base_md_coefficient": 1.9,
        "base_md_fix": 5,
        "base_hp_coefficient": 4.0,
        "base_hp_fix": 26,
        "base_action_fix": -2,
        "base_hateCr": 2,
        "base_hate_fix": 2,
        "base_damageAll_coefficient": 0.85,
        "base_aggression_coefficient": 0.85,
        "base_basicAttackType": "magical",
        "base_basicAttackRole_fix": 0,
        "base_basicAttackRoleDice": 3,
        "base_basicTarget": "multi",
        "base_basicRange": 4,
        "explanation": "範囲に対する［魔法攻撃］を用い、遠くから魔法ダメージを与えてくるエネミーです。シューターと同様、「攻撃判定」に秀でる反面【ＨＰ】や【物理防御力】は相応に低くなっています。クラスで言うと〈妖術師〉にちかいでしょう。広範囲（選択）に魔法攻撃を行う特技やBSを与える特技を与えるべきです。このＥタイプのエネミーは戦局を左右する能力がありますから弱点なども含めて設計するとよいでしょう。『ＬＨＺ』記載の代表的なエネミーは〈白姫のヘイグロト〉（P４６５）です。"
    },
    "不明": {
        "base_str": 0,
        "base_dex": 0,
        "base_pow": 0,
        "base_int": 0,
        "base_avoid_coefficient": 0,
        "base_avoid_fix": 0,
        "base_resist_coefficient": 0,
        "base_resist_fix": 0,
        "base_pd_coefficient": 0,
        "base_pd_fix": 0,
        "base_md_coefficient": 0,
        "base_md_fix": 0,
        "base_hp_coefficient": 0,
        "base_hp_fix": 0,
        "base_action_fix": 0,
        "base_hateCr": 0,
        "base_hate_fix": 0,
        "base_damageAll_coefficient": 0,
        "base_aggression_coefficient": 0,
        "base_basicAttackType": "melee",
        "base_basicAttackRole_fix": 0,
        "base_basicAttackRoleDice": 0,
        "base_basicTarget": "single",
        "base_basicRange": 0,
        "explanation": ""
    },
}

# デフォルトデータ（エラー回避用）
json_data = None
j_name = ""
j_rank = 1
j_cr = 1
j_type = 0
j_race = 0
j_popularity = 2
j_identification = 0
j_tags = ""
j_memo = ""

str_value = ""
dex_value = ""
pow_value = ""
int_value = ""
avoid_value = ""
resist_value = ""
physical_defense_value = ""
magic_defense_value = ""
hit_point_value = ""
hate_value = ""
action_value = ""
move_value = ""
basic_attack_type_value = ""
basic_target_value = ""
basic_range_value = ""
role_value = ""
damage_value = ""
gold_value = ""
drop_core_value = ""
drop_catalyst_value = ""

num_i = 1
num_s = 1
skills = []

piece = ""

# =====================================================

# ページタイトル
# st.title("LHTRPG_エネミー作成ツール")

tab1, tab2, tab3 = st.tabs(
    ["エネミー情報入力", "特技情報入力", "エネミーデータ出力"])

# 各項目の入力
with tab1:
    # JSONファイルを読み込む
    uploaded_file = st.file_uploader("Upload JSON")
    if uploaded_file is not None:
        file_contents = uploaded_file.read()
        parser = JsonDataParser(file_contents, race_list, enemy_rank_list,
                                type_list, popularity_dic)
        json_dict = parser.parse_json()
        if json_dict is not None:
            json_data = json_dict["json_data"]
            j_name = json_dict["j_name"]
            j_rank = json_dict["j_rank"]
            j_cr = json_dict["j_cr"]
            j_type = json_dict["j_type"]
            j_race = json_dict["j_race"][0]
            j_popularity = json_dict["j_popularity"]
            j_identification = json_dict["j_identification"]
            j_tags = json_dict["j_tags"]
            j_memo = json_dict["j_memo"]
            j_memo = j_memo.replace("\r\n", "\n")
            j_items = json_dict["j_items"]
            json_skills = json_dict["j_skills"]
            num_i = len(j_items)
            num_s = len(json_skills)

    col1, col2, col3 = st.columns((2, 1, 1))
    with col1:
        # エネミーの名前を決定
        enemy_name = st.text_input("名称", j_name)
    with col2:
        # エネミーのランクを決定
        enemy_rank = st.selectbox("ランク", enemy_rank_list, j_rank)
    with col3:
        # エネミーのCRを決定
        enemy_cr = st.number_input("CR", min_value=1, max_value=30, value=j_cr)

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        # エネミーのタイプを決定
        enemy_type = st.selectbox("タイプ", type_list, j_type)
    with col2:
        # エネミーの大種族
        enemy_race = st.selectbox("大種族", race_list, j_race)
    with col3:
        # エネミーの知名度を決定
        enemy_popularity = st.selectbox("知名度", popularity_list, j_popularity)
    with col4:
        j_identification = identification(enemy_popularity,
                                          enemy_cr)
        enemy_identification = st.text_input("識別難易度",
                                             j_identification)

    if enemy_race == "ギミック" and enemy_rank in ["ボス", "レイド"]:
        st.error(
            f"※ [エネミーランク: {enemy_rank}] と [大種族: {enemy_race}] は同時に選択できません。")

    # エネミーのタグを決定
    if json_data is None:
        if enemy_rank == "ノーマル":
            tags = f"{enemy_race}"
        else:
            tags = f"{enemy_rank}, {enemy_race}"
    else:
        tags = ', '.join(j_tags)

    enemy_tag = st.text_input("タグ", tags)

    enemy_memo = st.text_area("メモ", j_memo)

    # エネミーのタイプを解説
    if j_type == 9:
        pass
    else:
        explanation = enemy_data_dic[enemy_type]["explanation"]
        st.write(f"{enemy_type}: {explanation}")

    # エネミータイプを検索
    consecutive_type = enemy_data_dic.get(enemy_type, {})

    # 各値を計算
    if enemy_race == "ギミック" and enemy_rank in ["ボス", "レイド"]:
        pass
    else:
        # class: AbilityCalculator計算式の呼び出し
        ability_calculator = AbilityCalculator(enemy_type,
                                               enemy_data_dic,
                                               enemy_race,
                                               enemy_rank,
                                               enemy_cr,
                                               json_data)

        str_value = ability_calculator.get_str()
        dex_value = ability_calculator.get_dex()
        pow_value = ability_calculator.get_pow()
        int_value = ability_calculator.get_int()
        avoid_value = ability_calculator.get_avoid()
        avoid_dice_value = ability_calculator.get_avoid_dice()
        resist_value = ability_calculator.get_resist()
        resist_dice_value = ability_calculator.get_resist_dice()
        physical_defense_value = ability_calculator.get_physical_defense()
        magic_defense_value = ability_calculator.get_magic_defense()
        hit_point_value = ability_calculator.get_hit_point()
        hate_value = ability_calculator.get_hate()
        action_value = ability_calculator.get_action()
        move_value = ability_calculator.get_move()
        fate_value = ability_calculator.get_fate()
        basic_attack_type_value = ability_calculator.get_basic_attack_type()
        basic_target_value = ability_calculator.get_basic_target()
        basic_range_value = ability_calculator.get_basic_range()
        role_value = ability_calculator.get_role()
        damage_value = ability_calculator.get_damage_fix()
        gold_value = ability_calculator.get_gold()
        drop_core_value = ability_calculator.get_drop_core()
        drop_catalyst_value = ability_calculator.get_drop_catalyst()

    st.markdown("---")  # 区切り線

    st.write("推奨ドロップ品")
    col1, col2, col3 = st.columns(3)
    with col1:
        gold = st.write(gold_value)
    with col2:
        drop_core = st.write(drop_core_value)
    with col3:
        drop_catalyst = st.write(drop_catalyst_value)

    # ユーザーが入力するドロップ品の数を指定
    num_drop = st.number_input("ドロップ品の数", min_value=1, max_value=10,
                               value=num_i)

    # ユーザーが指定したドロップ品の数だけ入力フォームを生成
    items = []
    drop_dice_1 = ["固定", 1, 2, 3, 4, 5, 6]
    drop_dice_2 = ["固定", 1, 2, 3, 4, 5, 6, 7, 8, 9]
    for i in range(num_drop):
        json_item_name = ""
        json_item_dice = []
        json_exp = ""
        with st.expander(f"ドロップ品{i + 1}"):
            st.markdown("---")  # 区切り線

            col1, col2 = st.columns(2)
            with col1:
                if json_data is not None:
                    j_dice = j_items[i]["dice"]
                    if "固定" in j_dice:
                        json_item_dice.append(j_dice)
                    elif "～" in j_dice:
                        start, end = j_dice.split("～")
                        json_item_dice.append(int(start))
                        num = int(start)
                        count = 0
                        while num < int(end):
                            num += 1
                            json_item_dice.append(int(num))
                            count += 1
                            if count == 10:
                                break
                    elif "," in j_dice:
                        json_item_dice = [int(d) for d in j_dice.split(",")]
                if enemy_rank == "レイド":
                    item_dice = st.multiselect(f"ダイス{i + 1}",
                                               drop_dice_2,
                                               json_item_dice,
                                               placeholder="ドロップするダイスを選択してください。")
                else:
                    item_dice = st.multiselect(f"ダイス{i + 1}",
                                               drop_dice_1,
                                               json_item_dice,
                                               placeholder="ドロップするダイスを選択してください。")
            with col2:
                if json_data is not None:
                    json_item_name = j_items[i]["item"]
                item_name = st.text_input(f"アイテム名{i + 1}", json_item_name)

            if json_data is not None:
                if "exp" in j_items[i]:
                    json_exp = j_items[i]["exp"]
                    if json_exp is None:
                        json_exp = ""
            item_description = st.text_area(f"解説{i + 1}", json_exp)

            items.append({
                "ダイス": item_dice,
                "アイテム名": item_name,
                "解説": item_description,
            })
    st.markdown("---")  # 区切り線

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        enemy_str = st.number_input("STR", str_value)
    with col2:
        enemy_dex = st.number_input("DEX", dex_value)
    with col3:
        enemy_pow = st.number_input("POW", pow_value)
    with col4:
        enemy_int = st.number_input("INT", int_value)

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        if enemy_race == "ギミック" or enemy_rank == "モブ":
            new_avoid_value = int(avoid_value) + int(avoid_dice_value) * 3
            avoid_dice_value = 0
        else:
            new_avoid_value = avoid_value
        enemy_avoidance = st.number_input("回避(固定値)", int(new_avoid_value))
    with col2:
        enemy_avoidance_dice = st.number_input("回避(Dice)",
                                               int(avoid_dice_value))
    with col3:
        if enemy_race == "ギミック" or enemy_rank == "モブ":
            new_resist_value = int(resist_value) + int(resist_dice_value) * 3
            resist_dice_value = 0
        else:
            new_resist_value = avoid_value
        enemy_resistance = st.number_input("抵抗(固定値)",
                                           int(new_resist_value))
    with col4:
        enemy_resistance_dice = st.number_input("抵抗(Dice)",
                                                int(resist_dice_value))

    if enemy_race == "ギミック" and (
            enemy_avoidance_dice != 0 or resist_dice_value != 0):
        st.error(
            "※ [エネミーランク: モブ] は [回避(Dice)], [抵抗(Dice)]の値は0です。1D=3として(固定値)に加算してください。")
    elif enemy_rank == "モブ" and (
            enemy_avoidance_dice != 0 or resist_dice_value != 0):
        st.error(
            "※ [大種族: ギミック] は [回避(Dice)], [抵抗(Dice)]の値は0です。1D=3として(固定値)に加算してください。")

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        enemy_physical_defense = st.number_input("物理防御力",
                                                 int(physical_defense_value))
    with col2:
        enemy_magical_defense = st.number_input("魔法防御力",
                                                int(magic_defense_value))
    with col3:
        enemy_hit_point = st.number_input("最大HP", int(hit_point_value))
    with col4:
        enemy_hate = st.number_input("ヘイト倍率", int(hate_value))

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        enemy_action = st.number_input("行動力", int(action_value))
    with col2:
        enemy_move = st.number_input("移動力", int(move_value))
    with col3:
        enemy_fate = st.number_input("因果力", int(fate_value))
    with col4:
        st.empty()

with tab2:
    skills = []
    with st.expander("例"):
        st.markdown("---")  # 区切り線

        col1, col2 = st.columns((3, 2))
        with col1:
            ph_name = "《基本攻撃手段》"
            skill_name = st.write(f"特技名: {ph_name}")
        with col2:
            if basic_attack_type_value == "melee":
                ph_type = "白兵攻撃"
            elif basic_attack_type_value == "shooting":
                ph_type = "射撃攻撃"
            elif basic_attack_type_value == "magical":
                ph_type = "魔法攻撃"
            skill_tag = st.write(f"タグ: {ph_type}")

        col1, col2, col3 = st.columns(3)
        with col1:
            skill_timing = st.write(f"タイミング: メジャー")
        with col2:
            ph_role = role_value
            st.write(f"命中値: {ph_role}")
        with col3:
            if basic_attack_type_value == "melee":
                ph_role_pc = "回避"
            elif basic_attack_type_value == "shooting":
                ph_role_pc = "回避"
            elif basic_attack_type_value == "magical":
                ph_role_pc = "抵抗"
            st.write(f"判定: {ph_role_pc}")

        col1, col2, col3 = st.columns(3)
        with col1:
            if basic_target_value == "single":
                ph_target = "単体"
            else:
                ph_target = "範囲(選択)"
            st.write(f"対象: {ph_target}")
        with col2:

            if basic_range_value == 0:
                ph_range = "至近"
            else:
                ph_range = f"{basic_range_value}Sq"
            st.write(f"射程: {ph_range}")
        with col3:
            ph_limit = ""
            st.write(f"制限: {ph_limit}")
        ph_description = f"対象に[{damage_value}]の物理ダメージを与える。"
        st.write(f"効果: {ph_description}")
    # ギミック専用特技
    if enemy_race == "ギミック":
        with st.expander("ギミック専用特技"):
            st.markdown("---")  # 区切り線
            col1, col2 = st.columns((3, 2))
            with col1:
                gimmik_skill_name = "《意志なき機構》"
                st.write(f"特技名: {gimmik_skill_name}")
            with col2:
                gimmik_skill_tag = "-"
                st.write(f"タグ: {gimmik_skill_tag}")

            col1, col2, col3 = st.columns(3)
            with col1:
                gimmik_skill_timing = "常時"
                st.write(f"タイミング: {gimmik_skill_timing}")
            with col2:
                gimmik_skill_role_e = "-"
                st.write(f"命中値: {gimmik_skill_role_e}")
            with col3:
                gimmik_skill_role_p = "-"
                st.write(f"判定: {gimmik_skill_role_p}")

            col1, col2, col3 = st.columns(3)
            with col1:
                gimmik_skill_target = "-"
                st.write(f"対象: {gimmik_skill_target}")
            with col2:
                gimmik_skill_range = "-"
                st.write(f"射程: {gimmik_skill_range}")
            with col3:
                gimmik_skill_limit = ""
                st.write(f"制限: {gimmik_skill_limit}")

            gimmik_skill_description = "このエネミーの攻撃ではヘイトダメージが発生せず、［ヘイトアンダー］の防御ボーナスも得られない。また、このエネミーを対象として「解除難易度：ｎ」の《プロップ解除》に成功すると、このエネミーは［戦闘不能］となる。さらにこのエネミーはムーブアクションを持たない。"
            st.write(f"効果: {gimmik_skill_description}")

            skills.append({
                "特技名": gimmik_skill_name,
                "タグ": gimmik_skill_tag,
                "タイミング": gimmik_skill_timing,
                "命中値": gimmik_skill_role_e,
                "判定": gimmik_skill_role_p,
                "対象": gimmik_skill_target,
                "射程": gimmik_skill_range,
                "制限": gimmik_skill_limit,
                "効果": gimmik_skill_description,
            })

        st.markdown("---")  # 区切り線

    # ユーザーが入力する特技（スキル）の数を指定
    num_skills = st.number_input("特技の数", min_value=1, value=num_s)

    # ユーザーが指定した特技の数だけ入力フォームを生成
    for i in range(num_skills):
        # 各数値のリセット
        json_skill_name = ""
        json_skill_tag = ""
        json_skill_timing = 4
        json_skill_role_e = ""
        json_skill_role_p = ""
        json_skill_target = ""
        json_skill_range = ""
        json_skill_limit = ""
        json_skill_description = ""

        with st.expander(f"特技{i + 1}"):
            st.markdown("---")  # 区切り線

            # st.write(f"特技 {i + 1}")
            col1, col2 = st.columns((3, 2))
            with col1:
                if json_data is not None:
                    json_skill_name = json_skills[i]["name"]
                skill_name = st.text_input(f"特技名{i + 1}",
                                           value=json_skill_name,
                                           placeholder=ph_name)
            with col2:
                if json_data is not None:
                    json_skill_tag = ', '.join(json_skills[i]["tags"])
                skill_tag = st.text_input(f"タグ{i + 1}",
                                          value=json_skill_tag,
                                          placeholder=ph_type)

            col1, col2, col3 = st.columns(3)
            with col1:
                if json_data is not None:
                    json_skill_timing = [index for index, element in
                                         enumerate(skill_timing_list) if
                                         element in json_skills[i]["timing"]][0]
                skill_timing = st.selectbox(f"タイミング{i + 1}",
                                            skill_timing_list,
                                            json_skill_timing)
            with col2:
                if json_data is not None:
                    if json_skills[i]["role"] is not None:
                        start_index = json_skills[i]["role"].find("対決（")
                        end_index = json_skills[i]["role"].find("／",
                                                                start_index)

                        if start_index != -1 and end_index != -1:
                            json_skill_role_e = json_skills[i]["role"][
                                                start_index + len(
                                                    "対決（"):end_index]
                skill_role_e = st.text_input(f"命中値{i + 1}",
                                             value=json_skill_role_e,
                                             placeholder=ph_role)
            with col3:
                if json_data is not None:
                    if json_skills[i]["role"] is not None:
                        if "回避" in json_skills[i]["role"]:
                            json_skill_role_p = "回避"
                        elif "抵抗" in json_skills[i]["role"]:
                            json_skill_role_p = "抵抗"
                    else:
                        json_skill_role_p = ""
                skill_role_p = st.text_input(f"判定{i + 1}",
                                             value=json_skill_role_p,
                                             placeholder=ph_role_pc)

            if skill_role_e == "" and skill_role_p != "":
                st.error("<命中値> を入力してください")
            elif skill_role_p == "" and skill_role_e != "":
                st.error("<判定> を入力してください")

            col1, col2, col3 = st.columns(3)
            with col1:
                if json_data is not None:
                    json_skill_target = json_skills[i]["target"]
                    if json_skill_target is None:
                        json_skill_target = ""
                skill_target = st.text_input(f"対象{i + 1}",
                                             value=json_skill_target,
                                             placeholder=ph_target)
            with col2:
                if json_data is not None:
                    json_skill_range = json_skills[i]["range"]
                    if json_skill_range is None:
                        json_skill_range = ""
                skill_range = st.text_input(f"射程{i + 1}",
                                            value=json_skill_range,
                                            placeholder=ph_range)
            with col3:
                if json_data is not None:
                    json_skill_range = json_skills[i]["limit"]
                skill_limit = st.text_input(f"制限{i + 1}",
                                            value=json_skill_limit,
                                            placeholder=ph_limit)

            if json_data is not None:
                json_skill_description = json_skills[i]["function"]
            skill_description = st.text_area(f"効果{i + 1}",
                                             value=json_skill_description,
                                             placeholder=ph_description)

            if skill_description == "" and skill_name != "":
                st.error("<効果> を入力してください")
            elif skill_name == "" and skill_description != "":
                st.error("<特技名> を入力してください")

            skills.append({
                "特技名": skill_name,
                "タグ": skill_tag,
                "タイミング": skill_timing,
                "命中値": skill_role_e,
                "判定": skill_role_p,
                "対象": skill_target,
                "射程": skill_range,
                "制限": skill_limit,
                "効果": skill_description,
            })

# 出力するデータを整理&確認
with tab3:
    with st.form(key="character_form"):
        col1, col2, col3 = st.columns((2, 1, 1))
        with col1:
            st.write(f"名称: {enemy_name}")
        with col2:
            st.write(f"ランク: {enemy_rank}")
        with col3:
            st.write(f"CR: {enemy_cr}")

        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.write(f"タイプ: {enemy_type}")
        with col2:
            st.write(f"大種族: {enemy_race}")
        with col3:
            st.write(f"知名度: {enemy_popularity}")
        with col4:
            st.write(f"識別難易度: {enemy_identification}")

        st.write(f"タグ: [{enemy_tag}]")
        st.write(f"メモ: {enemy_memo}")

        st.write("ドロップ品:")
        new_item_dice = ""
        ccfolia_item = ""
        for i in items:
            item_dice = i["ダイス"]
            item_name = i["アイテム名"]
            item_exp = i["解説"]

            if item_name == "":
                pass
            else:
                with st.expander(f"{item_name}"):

                    st.markdown("---")  # 区切り線

                    col1, col2 = st.columns(2)
                    with col1:
                        for d in item_dice:
                            if new_item_dice != "":
                                new_item_dice += ","
                            new_item_dice += str(d)
                        st.write(f"ダイス: {new_item_dice}")
                    with col2:
                        st.write(f"アイテム名: {item_name}")

                    st.write(f"解説: {item_exp}")

                    ccfolia_item += f"\\n[ダイス: {new_item_dice}]\\n[アイテム名: {item_name}]\\n[解説: {item_exp}]"

        st.markdown("---")

        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.write(f"STR: {enemy_str}")
        with col2:
            st.write(f"DEX: {enemy_dex}")
        with col3:
            st.write(f"POW: {enemy_pow}")
        with col4:
            st.write(f"INT: {enemy_int}")

        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.write(f"回避: {enemy_avoidance} + {enemy_avoidance_dice} D")
        with col2:
            st.write(f"抵抗: {enemy_resistance} + {enemy_resistance_dice} D")
        with col3:
            st.write(f"物理防御力: {enemy_physical_defense}")
        with col4:
            st.write(f"魔法防御力: {enemy_magical_defense}")

        col1, col2, col3, col4, col5 = st.columns(5)
        with col1:
            st.write(f"最大HP: {enemy_hit_point}")
        with col2:
            st.write(f"ヘイト倍率: {enemy_hate}")
        with col3:
            st.write(f"行動力: {enemy_action}")
        with col4:
            st.write(f"移動力: {enemy_move}")
        with col5:
            st.write(f"因果力: {enemy_fate}")

        st.markdown("---")

        i = 0
        skill_command = ""
        skill_memo = ""
        skill_element_list = ["特技名", "タグ", "タイミング", "命中値", "判定",
                              "対象", "射程", "効果"]

        st.write("特技:")
        for s in skills:
            s_name = "" if s["特技名"] == "" else s["特技名"]
            s_tag = "" if s["タグ"] == "" else s["タグ"]
            s_timing = "" if s["タイミング"] == "" else s["タイミング"]
            s_roll_e = "" if s["命中値"] == "" else s["命中値"]
            s_roll_p = "" if s["判定"] == "" else s["判定"]
            s_target = "" if s["対象"] == "" else s["対象"]
            s_range = "" if s["射程"] == "" else s["射程"]
            s_limit = "" if s["制限"] == "" else s["制限"]
            s_description = "" if s["効果"] == "" else s["効果"]
            if s_name == "":
                pass
            else:
                with st.expander(s_name):
                    st.markdown("---")  # 区切り線

                    col1, col2 = st.columns(2)
                    with col1:
                        st.write(f"特技名: {s_name}")
                    with col2:
                        st.write(f"タグ: {s_tag}")

                    col1, col2 = st.columns(2)
                    with col1:
                        st.write(f"タイミング: {s_timing}")
                    with col2:
                        if s_roll_e != "":
                            st.write(f"対決: {s_roll_e}／{s_roll_p}")
                        else:
                            st.write("対決: ")
                    col1, col2, col3 = st.columns(3)
                    with col1:
                        st.write(f"対象: {s_target}")
                    with col2:
                        st.write(f"射程: {s_range}")
                    with col3:
                        st.write(f"制限: {s_limit}")

                    st.write(f"効果: {s_description}")
            i = i + 1

        # 実行ボタン
        action_btn_1 = st.form_submit_button("コマンドを生成する")
        if action_btn_1:
            piece = create_ccfolia()

        # テキストエリア
        text_area_1 = st.text_area(
            "",
            f"""{piece}""",
        )

        col1, col2, col3, col4, col5 = st.columns(5)
        with col1:
            st.empty()
        with col2:
            st.empty()
        with col3:
            st.empty()
        with col4:
            st.empty()
        with col5:
            # クリアボタン
            action_btn_2 = st.form_submit_button("クリア")

        if action_btn_2:
            piece = ""

    csv_data = create_csv()
    json_data = create_json()

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.empty()
    with col2:
        st.empty()
    with col3:
        st.download_button(
            "Download CSV",
            csv_data,
            file_name=f'{enemy_name}_CR{enemy_cr}.csv'
        )
    with col4:
        st.download_button(
            "Download JSON",
            json_data,
            file_name=f'{enemy_name}_CR{enemy_cr}.json'
        )
