"use client";

import Link from "next/link";
import { useState } from "react";
import AppNav from "@/components/app-nav";
import {
  createEnemyPiece,
  type EnemyDropItemInput,
  type EnemyFormData,
  type EnemySkillInput,
} from "@/utils/createEnemyPiece";

type EnemySkillRow = EnemySkillInput & {
  id: string;
};

type EnemyDropItemRow = EnemyDropItemInput & {
  id: string;
};

const enemyRanks = ["モブ", "ノーマル", "ボス", "レイド"];
const enemyTypes = [
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
];
const enemyRaces = [
  "人型",
  "自然",
  "精霊",
  "幻獣",
  "不死",
  "人造",
  "人間",
  "ギミック",
];
const skillTimings = [
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
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createEmptySkillRow(): EnemySkillRow {
  return {
    id: makeId(),
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

function createEmptyDropItemRow(): EnemyDropItemRow {
  return {
    id: makeId(),
    dice: "",
    name: "",
    description: "",
  };
}

export default function EnemyPage() {
  const [name, setName] = useState("");
  const [rank, setRank] = useState("ノーマル");
  const [cr, setCr] = useState(1);
  const [enemyType, setEnemyType] = useState("アーマラー");
  const [race, setRace] = useState("人型");
  const [tags, setTags] = useState("");
  const [memo, setMemo] = useState("");

  const [hitPoint, setHitPoint] = useState(0);
  const [hate, setHate] = useState(0);
  const [fate, setFate] = useState(0);
  const [physicalDefense, setPhysicalDefense] = useState(0);
  const [magicDefense, setMagicDefense] = useState(0);
  const [action, setAction] = useState(0);

  const [skills, setSkills] = useState<EnemySkillRow[]>([createEmptySkillRow()]);
  const [items, setItems] = useState<EnemyDropItemRow[]>([createEmptyDropItemRow()]);

  const [result, setResult] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const updateSkill = (
    id: string,
    field: keyof Omit<EnemySkillRow, "id">,
    value: string
  ) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  const updateItem = (
    id: string,
    field: keyof Omit<EnemyDropItemRow, "id">,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addSkill = () => {
    setSkills((prev) => [...prev, createEmptySkillRow()]);
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => {
      const next = prev.filter((skill) => skill.id !== id);
      return next.length > 0 ? next : [createEmptySkillRow()];
    });
  };

  const addItem = () => {
    setItems((prev) => [...prev, createEmptyDropItemRow()]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      return next.length > 0 ? next : [createEmptyDropItemRow()];
    });
  };

  const handleGenerate = () => {
    if (!name.trim()) {
      setStatusMessage("名称を入力してください。");
      return;
    }

    const formData: EnemyFormData = {
      name,
      rank,
      cr,
      enemyType,
      race,
      tags,
      memo,
      hitPoint,
      hate,
      fate,
      physicalDefense,
      magicDefense,
      action,
      skills: skills.map(({ id, ...skill }) => skill),
      items: items.map(({ id, ...item }) => item),
    };

    const piece = createEnemyPiece(formData);
    setResult(piece);
    setStatusMessage("エネミー駒コマンドを生成しました。");
  };

  const handleClear = () => {
    setName("");
    setRank("ノーマル");
    setCr(1);
    setEnemyType("アーマラー");
    setRace("人型");
    setTags("");
    setMemo("");
    setHitPoint(0);
    setHate(0);
    setFate(0);
    setPhysicalDefense(0);
    setMagicDefense(0);
    setAction(0);
    setSkills([createEmptySkillRow()]);
    setItems([createEmptyDropItemRow()]);
    setResult("");
    setStatusMessage("");
  };

  const handleCopy = async () => {
    if (!result) {
      setStatusMessage("コピーする内容がありません。");
      return;
    }

    try {
      await navigator.clipboard.writeText(result);
      setStatusMessage("エネミー駒コマンドをコピーしました。");
    } catch (error) {
      console.error(error);
      setStatusMessage("コピーに失敗しました。");
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-8">
        <AppNav current="enemy" />

        <header className="mb-10">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            LHTRPG- エネミーデータ/駒作成ツール（CCFOLIA）
          </h1>

          <p className="text-sm leading-8 text-neutral-800">
            エネミーデータを入力し、CCFOLIA に貼り付けるための駒コマンドを生成します。
          </p>
          <p className="mt-2 text-sm leading-8 text-neutral-700">
            まずは CCFOLIA 用の出力を優先した版です。CSV / JSON の出力は後で追加しやすい構成にしています。
          </p>

          <div className="mt-4 text-sm text-neutral-600">
            <Link href="/" className="underline underline-offset-4">
              ← キャラ駒作成ツールへ戻る
            </Link>
          </div>
        </header>

        <section className="mb-10 rounded-2xl border border-neutral-300 p-6">
          <h2 className="mb-4 text-2xl font-semibold">基本情報</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例：鉄躯緑鬼"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">ランク</label>
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              >
                {enemyRanks.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">CR</label>
              <input
                type="number"
                min={1}
                value={cr}
                onChange={(e) => setCr(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">タイプ</label>
              <select
                value={enemyType}
                onChange={(e) => setEnemyType(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              >
                {enemyTypes.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">大種族</label>
              <select
                value={race}
                onChange={(e) => setRace(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              >
                {enemyRaces.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm font-medium">タグ</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="例：ボス, 人型"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm font-medium">メモ</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="解説や備考を入力"
                className="min-h-[140px] w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              />
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-neutral-300 p-6">
          <h2 className="mb-4 text-2xl font-semibold">CCFOLIA用ステータス</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">HP</label>
              <input
                type="number"
                value={hitPoint}
                onChange={(e) => setHitPoint(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">ヘイト倍率</label>
              <input
                type="number"
                value={hate}
                onChange={(e) => setHate(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">因果力</label>
              <input
                type="number"
                value={fate}
                onChange={(e) => setFate(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">物防</label>
              <input
                type="number"
                value={physicalDefense}
                onChange={(e) => setPhysicalDefense(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">魔防</label>
              <input
                type="number"
                value={magicDefense}
                onChange={(e) => setMagicDefense(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">行動力</label>
              <input
                type="number"
                value={action}
                onChange={(e) => setAction(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
              />
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-neutral-300 p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">ドロップ品</h2>
            <button
              type="button"
              onClick={addItem}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-sm transition hover:bg-neutral-50"
            >
              ドロップ品を追加
            </button>
          </div>

          <div className="space-y-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-2xl border border-neutral-200 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="font-medium">ドロップ品 {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg border border-neutral-300 px-3 py-1 text-sm transition hover:bg-neutral-50"
                  >
                    削除
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">ダイス</label>
                    <input
                      type="text"
                      value={item.dice}
                      onChange={(e) =>
                        updateItem(item.id, "dice", e.target.value)
                      }
                      placeholder="例：固定 / 1,2,3 / 1～6"
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      アイテム名
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, "name", e.target.value)
                      }
                      placeholder="例：コア素材[CR10]"
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium">解説</label>
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      placeholder="任意"
                      className="min-h-[100px] w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-neutral-300 p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">特技</h2>
            <button
              type="button"
              onClick={addSkill}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-sm transition hover:bg-neutral-50"
            >
              特技を追加
            </button>
          </div>

          <div className="space-y-6">
            {skills.map((skill, index) => (
              <div
                key={skill.id}
                className="rounded-2xl border border-neutral-200 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="font-medium">特技 {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="rounded-lg border border-neutral-300 px-3 py-1 text-sm transition hover:bg-neutral-50"
                  >
                    削除
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium">特技名</label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) =>
                        updateSkill(skill.id, "name", e.target.value)
                      }
                      placeholder="例：《基本攻撃手段》"
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">タグ</label>
                    <input
                      type="text"
                      value={skill.tags}
                      onChange={(e) =>
                        updateSkill(skill.id, "tags", e.target.value)
                      }
                      placeholder="例：白兵攻撃"
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      タイミング
                    </label>
                    <select
                      value={skill.timing}
                      onChange={(e) =>
                        updateSkill(skill.id, "timing", e.target.value)
                      }
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    >
                      {skillTimings.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">命中値</label>
                    <input
                      type="text"
                      value={skill.roleAttack}
                      onChange={(e) =>
                        updateSkill(skill.id, "roleAttack", e.target.value)
                      }
                      placeholder="例：12 + 2 D"
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">判定</label>
                    <input
                      type="text"
                      value={skill.roleDefense}
                      onChange={(e) =>
                        updateSkill(skill.id, "roleDefense", e.target.value)
                      }
                      placeholder="例：回避"
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">対象</label>
                    <input
                      type="text"
                      value={skill.target}
                      onChange={(e) =>
                        updateSkill(skill.id, "target", e.target.value)
                      }
                      placeholder="例：単体"
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">射程</label>
                    <input
                      type="text"
                      value={skill.range}
                      onChange={(e) =>
                        updateSkill(skill.id, "range", e.target.value)
                      }
                      placeholder="例：至近 / 4Sq"
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="mb-2 block text-sm font-medium">制限</label>
                    <input
                      type="text"
                      value={skill.limit}
                      onChange={(e) =>
                        updateSkill(skill.id, "limit", e.target.value)
                      }
                      placeholder="任意"
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="mb-2 block text-sm font-medium">効果</label>
                    <textarea
                      value={skill.effect}
                      onChange={(e) =>
                        updateSkill(skill.id, "effect", e.target.value)
                      }
                      placeholder="例：対象に[20 + 2D]の物理ダメージを与える。"
                      className="min-h-[120px] w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-neutral-300 p-6">
          <h2 className="mb-4 text-2xl font-semibold">出力</h2>

          <div className="mb-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              className="rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50"
            >
              コマンドを生成する
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50"
            >
              クリア
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl border border-neutral-300 px-5 py-3 text-base font-medium transition hover:bg-neutral-50"
            >
              コピー
            </button>
          </div>

          <p className="mb-4 min-h-[1.5rem] text-sm text-neutral-600">
            {statusMessage}
          </p>

          <label
            htmlFor="enemy-result"
            className="mb-2 block text-lg font-semibold"
          >
            CCFOLIA用 エネミー駒作成コマンド
          </label>

          <textarea
            id="enemy-result"
            value={result}
            readOnly
            placeholder="ここに生成されたコマンドが表示されます"
            className="min-h-[320px] w-full resize-y rounded-xl border border-neutral-300 px-4 py-3 text-sm leading-6 outline-none"
          />
        </section>
      </div>
    </main>
  );
}