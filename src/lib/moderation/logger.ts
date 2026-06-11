// ============================================================
// Moderation Logger — Append-Only JSONL Event Log
// ============================================================
// Logs moderation events to data/moderation-logs.jsonl for review.
// Fire-and-forget: errors are caught and logged to console, never thrown.

import { appendFile, mkdir } from "fs/promises";
import path from "path";
import type { ModerationMatch } from "./matcher";

// ---- Types ----

export interface ModerationLogEntry {
  timestamp: string;
  userId: string;
  source: string;
  input: string;
  matches: Pick<ModerationMatch, "pattern" | "severity" | "category" | "confidence">[];
  highestSeverity: number;
  result: "allowed" | "censored" | "blocked";
}

// ---- Config ----

const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "moderation-logs.jsonl");
const MAX_INPUT_LENGTH = 500;

// Ensure data directory exists (run once)
let dirEnsured = false;
async function ensureDir(): Promise<void> {
  if (dirEnsured) return;
  try {
    await mkdir(LOG_DIR, { recursive: true });
    dirEnsured = true;
  } catch {
    // Directory may already exist
    dirEnsured = true;
  }
}

// ---- Public API ----

/**
 * Log a moderation event. Fire-and-forget — never throws.
 */
export async function logModeration(entry: {
  userId: string;
  source: string;
  input: string;
  matches: ModerationMatch[];
  highestSeverity: number;
  result: "allowed" | "censored" | "blocked";
}): Promise<void> {
  try {
    await ensureDir();

    const logEntry: ModerationLogEntry = {
      timestamp: new Date().toISOString(),
      userId: entry.userId,
      source: entry.source,
      input: entry.input.slice(0, MAX_INPUT_LENGTH),
      matches: entry.matches.map((m) => ({
        pattern: m.pattern,
        severity: m.severity,
        category: m.category,
        confidence: m.confidence,
      })),
      highestSeverity: entry.highestSeverity,
      result: entry.result,
    };

    await appendFile(LOG_FILE, JSON.stringify(logEntry) + "\n", "utf-8");
  } catch (err) {
    // Never throw from logger — just warn
    console.warn("[Moderation Logger] Failed to write log entry:", err);
  }
}
