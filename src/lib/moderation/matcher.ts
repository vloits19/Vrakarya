// ============================================================
// Pattern Matcher — Profanity Detection Engine
// ============================================================
// Matches normalized text against compiled word patterns.
// Supports word boundary enforcement and confidence scoring.

import { normalizeText, tokenize, type TextToken } from "./normalizer";
import enWordlist from "./wordlists/en.json";
import idWordlist from "./wordlists/id.json";
import allowlistData from "./wordlists/allowlist.json";

// ---- Types ----

export interface WordEntry {
  pattern: string;
  severity: 1 | 2 | 3;
  category: string;
  requireBoundary?: boolean;
}

export interface ModerationMatch {
  original: string;
  normalized: string;
  pattern: string;
  severity: 1 | 2 | 3;
  category: string;
  confidence: number;
  position: { start: number; end: number };
}

interface CompiledPattern {
  entry: WordEntry;
  normalizedPattern: string;
  regex: RegExp;
}

// ---- Allowlist ----

const allowlist = new Set(
  (allowlistData as { words: string[] }).words.map((w) => w.toLowerCase())
);

// ---- Compile word patterns ----

function compilePatterns(
  wordlist: { words: WordEntry[] }
): CompiledPattern[] {
  return wordlist.words.map((entry) => {
    const norm = normalizeText(entry.pattern);
    // Build regex: if requireBoundary, use \b anchors.
    // Otherwise, match the normalized pattern anywhere in normalized text.
    const escaped = escapeRegex(norm);
    const regexStr = entry.requireBoundary
      ? `\\b${escaped}\\b`
      : escaped;
    return {
      entry,
      normalizedPattern: norm,
      regex: new RegExp(regexStr, "gi"),
    };
  });
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Pre-compile all patterns at module load time
const compiledPatterns: CompiledPattern[] = [
  ...compilePatterns(enWordlist as { words: WordEntry[] }),
  ...compilePatterns(idWordlist as { words: WordEntry[] }),
];

// ---- Matching Engine ----

/**
 * Check if a word (in its original lowercase form) is in the allowlist.
 */
function isAllowlisted(word: string): boolean {
  return allowlist.has(word.toLowerCase());
}

/**
 * Run all compiled patterns against normalized text tokens.
 * Returns an array of matches with confidence scores.
 */
export function matchText(input: string): ModerationMatch[] {
  if (!input || input.trim().length === 0) return [];

  const matches: ModerationMatch[] = [];
  const tokens = tokenize(input);

  // Strategy 1: Per-token matching (word-level)
  // This catches individual profane words and respects word boundaries.
  for (const token of tokens) {
    if (isAllowlisted(token.word)) continue;

    for (const cp of compiledPatterns) {
      cp.regex.lastIndex = 0;
      if (cp.regex.test(token.normalized)) {
        // Calculate confidence
        const confidence = calculateConfidence(
          token.word,
          token.normalized,
          cp
        );

        if (confidence >= 0.6) {
          matches.push({
            original: token.word,
            normalized: token.normalized,
            pattern: cp.entry.pattern,
            severity: cp.entry.severity,
            category: cp.entry.category,
            confidence,
            position: { start: token.start, end: token.end },
          });
        }
      }
    }
  }

  // Strategy 2: Full-strip matching (catches spaced-out obfuscation)
  // "k o n t o l" → normalized full strip = "kontol"
  // Only run if we found no matches yet on individual tokens
  if (matches.length === 0) {
    const fullNorm = normalizeText(input);
    if (fullNorm.length >= 3) {
      for (const cp of compiledPatterns) {
        if (cp.entry.requireBoundary) continue; // skip boundary-required in full-strip mode
        cp.regex.lastIndex = 0;
        if (cp.regex.test(fullNorm)) {
          matches.push({
            original: input,
            normalized: fullNorm,
            pattern: cp.entry.pattern,
            severity: cp.entry.severity,
            category: cp.entry.category,
            confidence: 0.75, // lower confidence for full-strip matches
            position: { start: 0, end: input.length },
          });
        }
      }
    }
  }

  // Strategy 3: Multi-token window matching
  // Catches things like "mother fucker" (two words that form a profane phrase)
  if (tokens.length >= 2) {
    matchMultiTokenWindows(tokens, matches);
  }

  return deduplicateMatches(matches);
}

/**
 * Check sliding windows of 2-3 adjacent tokens for combined profanity.
 */
function matchMultiTokenWindows(
  tokens: TextToken[],
  matches: ModerationMatch[]
): void {
  for (let windowSize = 2; windowSize <= Math.min(3, tokens.length); windowSize++) {
    for (let i = 0; i <= tokens.length - windowSize; i++) {
      const windowTokens = tokens.slice(i, i + windowSize);
      const combined = windowTokens.map((t) => t.normalized).join("");
      const originalCombined = windowTokens.map((t) => t.word).join(" ");

      if (isAllowlisted(originalCombined)) continue;

      for (const cp of compiledPatterns) {
        if (cp.entry.requireBoundary) continue;
        cp.regex.lastIndex = 0;
        if (cp.regex.test(combined)) {
          matches.push({
            original: originalCombined,
            normalized: combined,
            pattern: cp.entry.pattern,
            severity: cp.entry.severity,
            category: cp.entry.category,
            confidence: 0.8,
            position: {
              start: windowTokens[0].start,
              end: windowTokens[windowTokens.length - 1].end,
            },
          });
        }
      }
    }
  }
}

/**
 * Calculate confidence score for a match.
 * - Exact match (original lowered == pattern): 1.0
 * - Normalized exact match: 0.9
 * - Substring/partial match: 0.7
 */
function calculateConfidence(
  original: string,
  normalized: string,
  cp: CompiledPattern
): number {
  const lowerOriginal = original.toLowerCase();
  const patternNorm = cp.normalizedPattern;

  // Exact original match
  if (lowerOriginal === cp.entry.pattern) return 1.0;

  // Normalized exact match
  if (normalized === patternNorm) return 0.9;

  // Normalized contains pattern (substring)
  if (normalized.includes(patternNorm)) return 0.75;

  // Pattern found via regex but not exact
  return 0.7;
}

/**
 * Remove duplicate matches (same pattern at same position).
 * Keep the highest-confidence match.
 */
function deduplicateMatches(matches: ModerationMatch[]): ModerationMatch[] {
  const seen = new Map<string, ModerationMatch>();

  for (const match of matches) {
    const key = `${match.pattern}:${match.position.start}:${match.position.end}`;
    const existing = seen.get(key);
    if (!existing || match.confidence > existing.confidence) {
      seen.set(key, match);
    }
  }

  return Array.from(seen.values());
}
