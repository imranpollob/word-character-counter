import { TextMetrics } from '../types/counter';

export const READING_WORDS_PER_MINUTE = 225;
export const SPEAKING_WORDS_PER_MINUTE = 130;

// CJK regex for unspaced scripts (Chinese, Japanese)
const CJK_REGEX = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;

let wordSegmenter: Intl.Segmenter | null = null;
if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
  try {
    wordSegmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
  } catch {
    wordSegmenter = null;
  }
}

/**
 * Counts words across any language or script.
 * For space-delimited scripts (English, Bangla, Spanish, Arabic, etc.), matches whitespace-separated words.
 * For unspaced scripts (Chinese, Japanese), uses Unicode word segmentation.
 */
export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  if (CJK_REGEX.test(text) && wordSegmenter) {
    let count = 0;
    for (const seg of wordSegmenter.segment(text)) {
      if (seg.isWordLike) count++;
    }
    return count;
  }
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

// Lazy-initialized Intl.Segmenter instance for grapheme-cluster-accurate counting (emojis, flags, modifiers, combining accents)
let graphemeSegmenter: Intl.Segmenter | null = null;
if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
  try {
    graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  } catch {
    graphemeSegmenter = null;
  }
}

/**
 * Counts total characters (grapheme clusters) including spaces, tabs, and line breaks.
 * Correctly counts multi-codepoint emojis (e.g. 👨‍👩‍👧‍👦, 🇺🇸, 👍🏽) and combining accents as 1 character.
 */
export function countCharacters(text: string): number {
  if (!text) return 0;
  if (graphemeSegmenter) {
    let count = 0;
    for (const _ of graphemeSegmenter.segment(text)) {
      count++;
    }
    return count;
  }
  // Fallback for older environments without Intl.Segmenter
  return Array.from(text).length;
}

/**
 * Counts characters (grapheme clusters) excluding whitespace.
 */
export function countCharactersNoSpaces(text: string): number {
  if (!text) return 0;
  const noSpaces = text.replace(/\s+/g, '');
  return countCharacters(noSpaces);
}

/**
 * International sentence terminator regex supporting:
 * - Western: . ! ?
 * - Indic (Bangla, Hindi, Sanskrit): । (danda \u0964), ॥ (double danda \u0965)
 * - CJK (Chinese, Japanese): 。 (ideographic period \u3002), ！ (\uFF01), ？ (\uFF1F)
 * - Arabic / Persian / Urdu: ؟ (\u061F)
 * - Armenian: ։ (\u0589)
 * - Ethiopic: ። (\u1362)
 */
export const SENTENCE_SPLIT_REGEX = /(?:[。！？।॥؟։።]+|[.!?]+(?:\s+|$|["'”’\)\]]+))/;

/**
 * Counts sentences across any language while intelligently ignoring abbreviations and decimals.
 */
export function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  // Protect decimals like 3.14
  let normalized = trimmed.replace(/\b(\d+)\.(\d+)\b/g, '$1_$2');

  // Protect common honorifics & abbreviations
  const abbreviations = [
    'dr', 'mr', 'mrs', 'ms', 'prof', 'sr', 'jr',
    'vs', 'etc', 'eg', 'ie', 'no', 'vol', 'dept', 'approx', 'fig'
  ];
  for (const abbr of abbreviations) {
    const reg = new RegExp(`\\b${abbr}\\.`, 'gi');
    normalized = normalized.replace(reg, `${abbr}_`);
  }

  // Split on sentence terminators
  const sentences = normalized
    .split(SENTENCE_SPLIT_REGEX)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /\S/.test(s));

  return sentences.length;
}

/**
 * Counts non-empty paragraphs.
 */
export function countParagraphs(text: string): number {
  if (!text.trim()) return 0;
  return text
    .split(/\n+/)
    .filter((p) => p.trim().length > 0)
    .length;
}

/**
 * Counts lines in the text.
 */
export function countLines(text: string): number {
  if (!text) return 0;
  return text.split('\n').length;
}

/**
 * Formats duration in seconds into a friendly human-readable string.
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0 sec';
  const totalSeconds = Math.round(seconds);
  if (totalSeconds < 60) {
    return `${totalSeconds} sec`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }
  return `${minutes} min ${remainingSeconds} sec`;
}

/**
 * Calculates complete text metrics for live display.
 */
export function calculateMetrics(text: string): TextMetrics {
  const words = countWords(text);
  const characters = countCharacters(text);
  const charactersNoSpaces = countCharactersNoSpaces(text);
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);
  const lines = countLines(text);

  const readingTimeSeconds = words > 0 ? (words / READING_WORDS_PER_MINUTE) * 60 : 0;
  const speakingTimeSeconds = words > 0 ? (words / SPEAKING_WORDS_PER_MINUTE) * 60 : 0;

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
    readingTimeSeconds,
    speakingTimeSeconds,
    readingTimeFormatted: formatDuration(readingTimeSeconds),
    speakingTimeFormatted: formatDuration(speakingTimeSeconds),
  };
}

