import assert from "node:assert/strict";
import test from "node:test";

import { createPiece } from "../../utils/createPiece";
import {
  DUMMY_COMMANDS,
  expectedCharacterCommands,
} from "./fixtures/expectedCharacterCommands";

const characterIds = [
  "228050",
  "228051",
  "228052",
  "228053",
  "228054",
  "228055",
  "228056",
  "228057",
  "228058",
  "228059",
  "228060",
  "228061",
  "228062",
  "228063",
  "228064",
  "228065",
  "228066",
  "228067",
  "228068",
  "228069",
  "228070",
  "228071",
  "228072",
  "228073",
] as const;

type CocofoliaCharacterPiece = {
  kind?: unknown;
  data?: {
    name?: unknown;
    commands?: unknown;
  };
};

function parsePiece(result: string): CocofoliaCharacterPiece {
  return JSON.parse(result) as CocofoliaCharacterPiece;
}

function extractCommands(piece: CocofoliaCharacterPiece): string {
  assert.equal(piece.kind, "character");
  assert.equal(typeof piece.data?.name, "string");
  assert.notEqual(piece.data.name, "");
  assert.equal(typeof piece.data?.commands, "string");

  return piece.data.commands;
}

function normalizeCommandText(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd();
}

for (const characterId of characterIds) {
  const expectedCommands = expectedCharacterCommands[characterId];
  const skipReason =
    expectedCommands === DUMMY_COMMANDS
      ? "期待コマンドが未設定のためスキップします。fixtures/expectedCharacterCommands.ts にコマンドを貼り付けてください。"
      : false;

  test(
    `character ${characterId} creates matching Cocofolia commands`,
    { timeout: 30_000, skip: skipReason },
    async () => {
      const pieceText = await createPiece(characterId);
      const piece = parsePiece(pieceText);
      const actualCommands = extractCommands(piece);

      assert.equal(
        normalizeCommandText(actualCommands),
        normalizeCommandText(expectedCommands),
      );
    },
  );
}
