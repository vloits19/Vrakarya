// ============================================================
// Content Moderator — Main Entry Point
// ============================================================
// Provides analyze(), censor(), and isAllowed() methods.
// Determines severity-based actions (allow/warn/censor/block).

import { matchText, type ModerationMatch } from "./matcher";

// ---- Types ----

export type ModerationAction = "allow" | "warn" | "censor" | "block";

export interface ModerationResult {
  /** Whether the text is clean (no matches found). */
  isClean: boolean;
  /** The recommended action based on highest severity. */
  action: ModerationAction;
  /** All profanity matches found. */
  matches: ModerationMatch[];
  /** Text with offending words replaced by asterisks (null if clean). */
  censored: string | null;
  /** The highest severity level among all matches (0 if clean). */
  highestSeverity: number;
}

// ---- Severity → Action mapping ----

function severityToAction(severity: number): ModerationAction {
  switch (severity) {
    case 1:
      return "allow"; // Mild insults: allow but flag internally
    case 2:
      return "censor"; // Strong profanity: censor the word
    case 3:
      return "block"; // Hate speech: block entirely
    default:
      return "allow";
  }
}

// ---- Censoring Logic ----

/**
 * Replace matched words in the original text with asterisks.
 * Only censors matches with severity >= 2.
 */
function censorText(
  input: string,
  matches: ModerationMatch[]
): string {
  // Sort matches by position (descending) so we can replace from end to start
  // without messing up indices.
  const sortedMatches = [...matches]
    .filter((m) => m.severity >= 2)
    .sort((a, b) => b.position.start - a.position.start);

  let result = input;

  for (const match of sortedMatches) {
    const { start, end } = match.position;
    const len = end - start;
    const replacement = "*".repeat(Math.min(len, 20));
    result = result.slice(0, start) + replacement + result.slice(end);
  }

  return result;
}

// ---- Public API ----

/**
 * Analyze text for profanity and return a full moderation result.
 */
export function analyze(text: string): ModerationResult {
  if (!text || text.trim().length === 0) {
    return {
      isClean: true,
      action: "allow",
      matches: [],
      censored: null,
      highestSeverity: 0,
    };
  }

  const matches = matchText(text);

  if (matches.length === 0) {
    return {
      isClean: true,
      action: "allow",
      matches: [],
      censored: null,
      highestSeverity: 0,
    };
  }

  const highestSeverity = Math.max(...matches.map((m) => m.severity));
  const action = severityToAction(highestSeverity);

  return {
    isClean: false,
    action,
    matches,
    censored: action === "censor" || action === "warn"
      ? censorText(text, matches)
      : null,
    highestSeverity,
  };
}

/**
 * Quick check: returns censored text, or the original if clean.
 */
export function censor(text: string): string {
  const result = analyze(text);
  return result.censored ?? text;
}

/**
 * Quick check: returns true if text passes moderation (not blocked).
 */
export function isAllowed(text: string): boolean {
  const result = analyze(text);
  return result.action !== "block";
}

export type { ModerationMatch };
