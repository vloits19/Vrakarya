// ============================================================
// Moderation System — Public API
// ============================================================
// Single import point for the profanity filter system.
//
// Usage:
//   import { analyze, censor, isAllowed, logModeration } from "@/lib/moderation";
//
//   const result = analyze("some text");
//   if (result.action === "block") { ... }

export { analyze, censor, isAllowed } from "./moderator";
export type { ModerationResult, ModerationAction, ModerationMatch } from "./moderator";
export { logModeration } from "./logger";
export type { ModerationLogEntry } from "./logger";
