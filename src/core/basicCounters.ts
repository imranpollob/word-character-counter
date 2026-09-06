import { TextMetrics } from '../types/counter';

export const READING_WORDS_PER_MINUTE = 225;
export const SPEAKING_WORDS_PER_MINUTE = 130;

/**
 * Counts words by matching sequences of non-whitespace characters.
 */
export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

/**
 * Counts total characters including all spaces, tabs, and line breaks.
 */
export function countCharacters(text: string): number {
  return text.length;
}

/**
 * Counts characters excluding all whitespace characters.
 */
export function countCharactersNoSpaces(text: string): number {
  return text.replace(/\s/g, '').length;
}

/**
 * Counts sentences while intelligently ignoring abbreviations and decimals.
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

  // Split on sentence terminators followed by whitespace, quote/bracket, or end of string
  const sentences = normalized
    .split(/(?:[.!?]+)(?:\s+|$|["'”’\)]+)/)
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

