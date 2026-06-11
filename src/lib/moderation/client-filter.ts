// ============================================================
// Client-side Content Filter — Lightweight Profanity Check
// ============================================================
// A lightweight, browser-safe version of the moderation system.
// Does NOT use Node.js APIs (no fs, no path).
// Used for instant client-side validation before server submission.

const LEET_MAP: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s",
  "7": "t", "@": "a", "!": "i", "$": "s",
};

function normalizeForClient(input: string): string {
  if (!input) return "";
  let result = "";
  for (const ch of input.toLowerCase()) {
    result += LEET_MAP[ch] || ch;
  }
  // Remove separators and spaces
  result = result.replace(/[.\-_*~|/\\,;:'"` ]/g, "");
  // Collapse repeats
  result = result.replace(/(.)\1{2,}/g, "$1$1");
  result = result.replace(/(.)\1+/g, "$1");
  return result;
}

/**
 * Blocked patterns — severity 2+ words from both English and Indonesian.
 * These are the normalized canonical forms.
 */
const BLOCKED_PATTERNS: { pattern: string; boundary?: boolean }[] = [
  // English — severity 3 (hate speech)
  { pattern: "niger" },
  { pattern: "niga" },
  { pattern: "fagot" },
  { pattern: "fag", boundary: true },
  // English — severity 2 (strong profanity)
  { pattern: "fuk" },
  { pattern: "shit", boundary: true },
  { pattern: "bitch" },
  { pattern: "ashole" },
  { pattern: "dick", boundary: true },
  { pattern: "pusy", boundary: true },
  { pattern: "cok", boundary: true },
  { pattern: "cunt" },
  { pattern: "whore" },
  { pattern: "slut", boundary: true },
  { pattern: "dumbas" },
  { pattern: "motherfuker" },
  { pattern: "bulshit" },
  // Indonesian — severity 2
  { pattern: "kontol" },
  { pattern: "memek" },
  { pattern: "ngentot" },
  { pattern: "entot" },
  { pattern: "pepek" },
  { pattern: "jembut" },
  { pattern: "ngewe" },
  { pattern: "tempik" },
  { pattern: "titit" },
  { pattern: "bangsat" },
  { pattern: "bajingan" },
  { pattern: "keparat" },
  { pattern: "jancuk" },
  { pattern: "jancok" },
  { pattern: "cukimai" },
  { pattern: "kimak", boundary: true },
  { pattern: "pantek" },
  { pattern: "pukimak" },
  { pattern: "sundala" },
  { pattern: "lonte", boundary: true },
  { pattern: "pelacur" },
];

/**
 * Allowlist — words that contain profanity substrings but are safe.
 */
const ALLOWLIST = new Set([
  "assassin", "class", "classic", "cockpit", "cocktail",
  "cockatoo", "cocoa", "dickens", "document", "discuss",
  "discussion", "grass", "pass", "passenger", "password",
  "shiitake", "therapist", "bigger", "digger", "trigger",
  "snigger", "dagger", "stagger", "swagger", "nigeria",
  "nigerian", "niger", "nigel", "bass", "mass", "glass",
]);

/**
 * Check if text contains profanity (client-side).
 * Returns the matched pattern name if found, or null if clean.
 */
export function checkProfanity(input: string): string | null {
  if (!input || input.trim().length < 2) return null;

  const lower = input.toLowerCase().trim();

  // Check allowlist first
  if (ALLOWLIST.has(lower)) return null;

  const normalized = normalizeForClient(input);

  for (const entry of BLOCKED_PATTERNS) {
    if (entry.boundary) {
      // Word must match entirely
      if (normalized === normalizeForClient(entry.pattern)) {
        return entry.pattern;
      }
    } else {
      // Substring match
      if (normalized.includes(normalizeForClient(entry.pattern))) {
        return entry.pattern;
      }
    }
  }

  return null;
}

/**
 * Quick boolean check.
 */
export function isCleanText(input: string): boolean {
  return checkProfanity(input) === null;
}
