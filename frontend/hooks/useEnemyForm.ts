import { useMemo, useState, type ChangeEvent } from "react";
import {
  calculateEnemyValues,
  createEmptyDropItemInput,
  createEmptySkillInput,
  createEnemyJson,
  createEnemyPiece,
  createEnemyXlsx,
  getDefaultEnemyForm,
  getDefaultTags,
  getGimmickSkill,
  getSkillExample,
  parseEnemyJson,
  parseEnemyXlsx,
} from "@/utils/enemy";
import {
  buildCurrentFormData,
  normalizeCount,
  withDropRowId,
  withSkillRowId,
  type EnemyDropItemRow,
  type EnemySkillRow,
} from "@/utils/enemy/form";
import type { EnemyDropItemInput, EnemyFormData, EnemySkillInput } from "@/utils/enemy";
import { downloadBlobFile, downloadTextFile } from "@/utils/downloadFile";

export type EnemyTabKey = "basic" | "skills" | "output";

export function useEnemyForm() {
  const initialForm = useMemo(() => getDefaultEnemyForm(), []);
  const [activeTab, setActiveTab] = useState<EnemyTabKey>("basic");
  const [form, setForm] = useState<EnemyFormData>(initialForm);
  const [skills, setSkills] = useState<EnemySkillRow[]>(
    initialForm.skills.map(withSkillRowId),
  );
  const [items, setItems] = useState<EnemyDropItemRow[]>(
    initialForm.items.map(withDropRowId),
  );
  const [result, setResult] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isEnemyTypeLocked, setIsEnemyTypeLocked] = useState(false);

  const calculated = useMemo(
    () =>
      calculateEnemyValues({
        enemyType: form.enemyType,
        race: form.race,
        rank: form.rank,
        cr: form.cr,
      }),
    [form.enemyType, form.race, form.rank, form.cr],
  );

  const exampleSkill = useMemo(() => getSkillExample(calculated), [calculated]);
  const gimmickSkill = useMemo(() => getGimmickSkill(), []);
  const initialTags = useMemo(
    () => getDefaultTags(form.rank, form.race),
    [form.rank, form.race],
  );
  const outputSkills = useMemo<EnemySkillRow[]>(() => {
    if (form.race === "ギミック") {
      return [{ id: "gimmick-auto-skill", ...gimmickSkill }, ...skills];
    }
    return skills;
  }, [form.race, gimmickSkill, skills]);

  const currentData = useMemo(
    () => buildCurrentFormData(form, skills, items),
    [form, skills, items],
  );

  const updateForm = <K extends keyof EnemyFormData>(
    key: K,
    value: EnemyFormData[K],
  ) => {
    if (key === "enemyType" && isEnemyTypeLocked) {
      setStatusMessage("読み込んだエネミーデータのタイプは変更できません。");
      return;
    }

    if (key === "rank" && value === "モブ") {
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          dice: "固定",
        })),
      );
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateSkill = <K extends keyof EnemySkillInput>(
    id: string,
    key: K,
    value: EnemySkillInput[K],
  ) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, [key]: value } : skill,
      ),
    );
  };

  const updateItem = <K extends keyof EnemyDropItemInput>(
    id: string,
    key: K,
    value: EnemyDropItemInput[K],
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  };

  const handleApplyCalculatedValues = () => {
    setForm((prev) => ({
      ...prev,
      strength: calculated.strength,
      dexterity: calculated.dexterity,
      power: calculated.power,
      intelligence: calculated.intelligence,
      avoid: calculated.avoid,
      avoidDice: calculated.avoidDice,
      resist: calculated.resist,
      resistDice: calculated.resistDice,
      physicalDefense: calculated.physicalDefense,
      magicDefense: calculated.magicDefense,
      hitPoint: calculated.hitPoint,
      hate: calculated.hate,
      action: calculated.action,
      move: calculated.move,
      fate: calculated.fate,
    }));
    setStatusMessage("推奨能力値を反映しました。");
  };

  const handleGenerate = () => {
    if (!form.name.trim()) {
      setStatusMessage("名称を入力してください。");
      setActiveTab("basic");
      return;
    }

    const piece = createEnemyPiece(currentData);
    setResult(piece);
    setStatusMessage("CCFOLIA用コマンドを生成しました。");
    setActiveTab("output");
  };

  const handleCopy = async () => {
    if (!result) {
      setStatusMessage("コピーする内容がありません。");
      return;
    }

    try {
      await navigator.clipboard.writeText(result);
      setStatusMessage("CCFOLIA用コマンドをコピーしました。");
    } catch (error) {
      console.error(error);
      setStatusMessage("コピーに失敗しました。");
    }
  };

  const handleClear = () => {
    const confirmed = window.confirm("入力内容をすべてクリアします。よろしいですか？");

    if (!confirmed) {
      return;
    }

    const next = getDefaultEnemyForm();
    setForm(next);
    setSkills(next.skills.map(withSkillRowId));
    setItems(next.items.map(withDropRowId));
    setResult("");
    setIsEnemyTypeLocked(false);
    setStatusMessage("入力内容をクリアしました。");
    setActiveTab("basic");
  };

  const handleDownloadJson = () => {
    if (!form.name.trim()) {
      setStatusMessage("名称を入力してください。");
      return;
    }

    downloadTextFile(
      `${form.name || "enemy"}_CR${form.cr}.json`,
      createEnemyJson(currentData),
      "application/json;charset=utf-8",
    );
    setStatusMessage("JSONをダウンロードしました。");
  };

  const handleDownloadXlsx = () => {
    if (!form.name.trim()) {
      setStatusMessage("名称を入力してください。");
      return;
    }

    downloadBlobFile(
      `${form.name || "enemy"}_CR${form.cr}.xlsx`,
      createEnemyXlsx(currentData),
    );
    setStatusMessage("XLSXをダウンロードしました。");
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const lowerName = file.name.toLowerCase();
      const imported = lowerName.endsWith(".json")
        ? parseEnemyJson(await file.text())
        : lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")
          ? parseEnemyXlsx(await file.arrayBuffer())
          : (() => {
              throw new Error("対応している入力ファイルは JSON / XLSX です。");
            })();

      setForm(imported);
      setSkills(imported.skills.map(withSkillRowId));
      setItems(
        imported.items.map((item) =>
          withDropRowId({
            ...item,
            dice: imported.rank === "モブ" ? "固定" : item.dice,
          }),
        ),
      );
      setResult("");
      setIsEnemyTypeLocked(true);
      setStatusMessage(
        lowerName.endsWith(".json")
          ? "JSONを読み込みました。"
          : "XLSXを読み込みました。",
      );
    } catch (error) {
      console.error(error);
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "入力ファイルの読み込みに失敗しました。",
      );
    } finally {
      event.target.value = "";
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      return next.length > 0
        ? next
        : [
            withDropRowId({
              ...createEmptyDropItemInput(),
              dice: form.rank === "モブ" ? "固定" : "",
            }),
          ];
    });
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => {
      const next = prev.filter((skill) => skill.id !== id);
      return next.length > 0
        ? next
        : [withSkillRowId(createEmptySkillInput())];
    });
  };

  const handleItemCountChange = (nextCountRaw: number) => {
    setItems((prev) => {
      const nextCount = normalizeCount(nextCountRaw, prev.length);

      if (nextCount === prev.length) {
        return prev;
      }

      if (nextCount > prev.length) {
        const additional = Array.from({ length: nextCount - prev.length }, () =>
          withDropRowId({
            ...createEmptyDropItemInput(),
            dice: form.rank === "モブ" ? "固定" : "",
          }),
        );
        return [...prev, ...additional];
      }

      return prev.slice(0, nextCount);
    });
  };

  const handleSkillCountChange = (nextCountRaw: number) => {
    setSkills((prev) => {
      const nextCount = normalizeCount(nextCountRaw, prev.length);

      if (nextCount === prev.length) {
        return prev;
      }

      if (nextCount > prev.length) {
        const additional = Array.from({ length: nextCount - prev.length }, () =>
          withSkillRowId(createEmptySkillInput()),
        );
        return [...prev, ...additional];
      }

      return prev.slice(0, nextCount);
    });
  };

  return {
    activeTab,
    calculated,
    currentData,
    exampleSkill,
    form,
    gimmickSkill,
    handleApplyCalculatedValues,
    handleClear,
    handleCopy,
    handleDownloadJson,
    handleDownloadXlsx,
    handleGenerate,
    handleImportFile,
    handleItemCountChange,
    handleSkillCountChange,
    initialTags,
    isEnemyTypeLocked,
    items,
    outputSkills,
    removeItem,
    removeSkill,
    result,
    setActiveTab,
    setForm,
    setStatusMessage,
    skills,
    statusMessage,
    updateForm,
    updateItem,
    updateSkill,
  };
}
