"use client";

import { useState, type ChangeEvent } from "react";

export default function Page() {
  const [characterUrl, setCharacterUrl] = useState("");
  const [piece, setPiece] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCharacterUrl(e.target.value);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-piece", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          character_url: characterUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPiece(data.detail ?? "エラーが発生しました。");
        return;
      }

      setPiece(data.piece ?? "");
    } catch {
      setPiece("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCharacterUrl("");
    setPiece("");
  };

  return (
    <main style={{ maxWidth: "900px", margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "24px" }}>LHTRPG 駒生成</h1>

      <div style={{ marginBottom: "16px" }}>
        <label
          htmlFor="characterUrl"
          style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}
        >
          キャラクターURL
        </label>
        <input
          id="characterUrl"
          type="text"
          value={characterUrl}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          {loading ? "生成中..." : "コマンドを生成する"}
        </button>

        <button
          onClick={handleClear}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          クリア
        </button>
      </div>

      <div>
        <p style={{ fontWeight: 700, marginBottom: "8px" }}>生成結果</p>
        <textarea
          value={piece}
          readOnly
          style={{
            width: "100%",
            height: "220px",
            padding: "12px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
          }}
        />
      </div>
    </main>
  );
}