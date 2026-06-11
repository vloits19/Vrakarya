// ============================================================
// Text Normalizer — Obfuscation Detection Pipeline
// ============================================================
// Transforms obfuscated text into a canonical form for matching.
// Handles leet-speak, unicode homoglyphs, separators, repeats.

/**
 * Character substitution map: leet-speak + common replacements.
 * Maps obfuscated characters to their Latin letter equivalents.
 */
const LEET_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "2": "z",
  "3": "e",
  "4": "a",
  "5": "s",
  "6": "g",
  "7": "t",
  "8": "b",
  "9": "g",
  "@": "a",
  "!": "i",
  "$": "s",
  "+": "t",
  "€": "e",
  "£": "l",
  "¥": "y",
  "©": "c",
  "®": "r",
  "µ": "u",
};

/**
 * Unicode homoglyph map: visually similar characters from
 * Cyrillic, Greek, and other scripts that look like Latin letters.
 */
const HOMOGLYPH_MAP: Record<string, string> = {
  // Cyrillic
  "\u0410": "a", // А
  "\u0412": "b", // В
  "\u0421": "c", // С
  "\u0415": "e", // Е
  "\u041D": "h", // Н
  "\u041A": "k", // К
  "\u041C": "m", // М
  "\u041E": "o", // О
  "\u0420": "p", // Р
  "\u0422": "t", // Т
  "\u0425": "x", // Х
  "\u0430": "a", // а
  "\u0435": "e", // е
  "\u043E": "o", // о
  "\u0440": "p", // р
  "\u0441": "c", // с
  "\u0443": "y", // у
  "\u0445": "x", // х
  // Greek
  "\u0391": "a", // Α
  "\u0392": "b", // Β
  "\u0395": "e", // Ε
  "\u0397": "h", // Η
  "\u0399": "i", // Ι
  "\u039A": "k", // Κ
  "\u039C": "m", // Μ
  "\u039D": "n", // Ν
  "\u039F": "o", // Ο
  "\u03A1": "p", // Ρ
  "\u03A4": "t", // Τ
  "\u03A5": "y", // Υ
  "\u03B1": "a", // α
  "\u03B5": "e", // ε
  "\u03BF": "o", // ο
  // Fullwidth Latin
  "\uFF21": "a",
  "\uFF22": "b",
  "\uFF23": "c",
  "\uFF24": "d",
  "\uFF25": "e",
  "\uFF26": "f",
  "\uFF27": "g",
  "\uFF28": "h",
  "\uFF29": "i",
  "\uFF2A": "j",
  "\uFF2B": "k",
  "\uFF2C": "l",
  "\uFF2D": "m",
  "\uFF2E": "n",
  "\uFF2F": "o",
  "\uFF30": "p",
  "\uFF31": "q",
  "\uFF32": "r",
  "\uFF33": "s",
  "\uFF34": "t",
  "\uFF35": "u",
  "\uFF36": "v",
  "\uFF37": "w",
  "\uFF38": "x",
  "\uFF39": "y",
  "\uFF3A": "z",
};

/**
 * Characters that are commonly used as separators in obfuscated text.
 */
const SEPARATOR_CHARS = new Set([
  ".",
  "-",
  "_",
  "*",
  "~",
  "|",
  "/",
  "\\",
  "'",
  '"',
  "`",
  ",",
  ";",
  ":",
]);

/**
 * Normalize a single character: apply leet-speak and homoglyph maps.
 */
function normalizeChar(ch: string): string {
  const lower = ch.toLowerCase();
  if (LEET_MAP[lower]) return LEET_MAP[lower];
  if (LEET_MAP[ch]) return LEET_MAP[ch];
  if (HOMOGLYPH_MAP[ch]) return HOMOGLYPH_MAP[ch];
  if (HOMOGLYPH_MAP[lower]) return HOMOGLYPH_MAP[lower];
  return lower;
}

/**
 * Full normalization pipeline.
 *
 * Steps:
 * 1. Lowercase
 * 2. Replace homoglyphs and leet-speak characters
 * 3. Remove separators between single characters (e.g., "f.u.c.k" → "fuck")
 * 4. Collapse repeated characters (e.g., "fuuuuck" → "fuuck" → heuristic collapse)
 * 5. Remove remaining non-letter noise
 *
 * Returns: the normalized string for matching purposes.
 */
export function normalizeText(input: string): string {
  if (!input) return "";

  let result = "";

  // Step 1-2: Convert each character
  const chars: string[] = [];
  for (const ch of input) {
    chars.push(normalizeChar(ch));
  }

  // Step 3: Remove separators between what look like single-spaced characters.
  // Detect pattern like "f u c k" or "f.u.c.k" or "f-u-c-k"
  // Strategy: strip all spaces and separator chars, but only when the text
  // looks like it's been deliberately spaced out.
  const joined = chars.join("");

  // Remove separator characters entirely for the normalized form
  const stripped = joined
    .split("")
    .filter((ch) => !SEPARATOR_CHARS.has(ch))
    .join("");

  // Step 4: Remove spaces (they could be deliberate obfuscation)
  const noSpaces = stripped.replace(/\s+/g, "");

  // Step 5: Collapse repeated characters (max 2 consecutive)
  // "fuuuuuck" → "fuuck", "niggggger" → "niigger"
  // Then collapse to single: "fuuck" → "fuck"
  result = noSpaces.replace(/(.)\1{2,}/g, "$1$1");
  // Second pass: collapse doubled chars to single
  result = result.replace(/(.)\1+/g, "$1");

  return result;
}

/**
 * Split text into word tokens for word-boundary-aware matching.
 * Preserves the original text's word positions.
 */
export interface TextToken {
  word: string;
  normalized: string;
  start: number;
  end: number;
}

/**
 * Tokenize input text into words with position tracking.
 */
export function tokenize(input: string): TextToken[] {
  const tokens: TextToken[] = [];
  const wordRegex = /\S+/g;
  let match: RegExpExecArray | null;

  while ((match = wordRegex.exec(input)) !== null) {
    tokens.push({
      word: match[0],
      normalized: normalizeText(match[0]),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return tokens;
}

/**
 * Generate a "full normalized" version of the entire input
 * (all spaces/separators removed, all chars normalized).
 * Used for detecting spaced-out obfuscation like "k o n t o l".
 */
export function normalizeFullStrip(input: string): string {
  return normalizeText(input);
}
