import { KeywordItem, TextAnalysisMetrics } from '../types/analysis';

/**
 * Standard English stop words list for keyword filtering.
 */
export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any',
  'are', "aren't", 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', "can't", 'cannot', 'could', "couldn't", 'did',
  "didn't", 'do', 'does', "doesn't", 'doing', "don't", 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', "hadn't", 'has', "hasn't", 'have',
  "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's",
  'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 'i', "i'd", "i'll",
  "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself',
  "let's", 'me', 'more', 'most', "mustn't", 'my', 'myself', 'no', 'nor', 'not', 'of',
  'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll", "she's", 'should',
  "shouldn't", 'so', 'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', "there's", 'these', 'they', "they'd", "they'll",
  "they're", "they've", 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', "wasn't", 'we', "we'd", "we'll", "we're", "we've", 'were', "weren't",
  'what', "what's", 'when', "when's", 'where', "where's", 'which', 'while', 'who',
  "who's", 'whom', 'why', "why's", 'with', "won't", 'would', "wouldn't", 'you',
  "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Extracts and cleans words into lowercase tokens.
 */
export function extractWordTokens(text: string): string[] {
  if (!text || !text.trim()) return [];
  // Match words, including contractions with apostrophes or hyphens
  const matches = text.toLowerCase().match(/\b[a-z0-9]+(?:['’\-][a-z0-9]+)*\b/gi);
  return matches || [];
}

/**
 * Extracts sentences preserving their text.
 */
export function extractSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  // Protect decimals like 3.14
  let normalized = trimmed.replace(/\b(\d+)\.(\d+)\b/g, '$1_$2');

  // Protect abbreviations
  const abbreviations = ['dr', 'mr', 'mrs', 'ms', 'prof', 'sr', 'jr', 'vs', 'etc', 'eg', 'ie', 'approx'];
  for (const abbr of abbreviations) {
    const reg = new RegExp(`\\b${abbr}\\.`, 'gi');
    normalized = normalized.replace(reg, `${abbr}_`);
  }

  return normalized
    .split(/(?:[.!?]+)(?:\s+|$|["'”’\)]+)/)
    .map(s => s.replace(/_/g, '.').trim())
    .filter(s => s.length > 0 && /\S/.test(s));
}

/**
 * Calculates n-grams (1, 2, or 3 words) with frequency and density.
 */
export function calculateNGrams(
  tokens: string[],
  n: number,
  totalWords: number,
  filterStopWords: boolean = false
): KeywordItem[] {
  if (tokens.length < n || totalWords === 0) return [];

  const frequencyMap = new Map<string, number>();

  for (let i = 0; i <= tokens.length - n; i++) {
    const slice = tokens.slice(i, i + n);

    // For 1-grams, optionally filter stop words
    if (n === 1 && filterStopWords && STOP_WORDS.has(slice[0])) {
      continue;
    }

    // For 2-grams & 3-grams, filter if all words in the phrase are stop words
    if (n > 1 && filterStopWords && slice.every(w => STOP_WORDS.has(w))) {
      continue;
    }

    const phrase = slice.join(' ');
    frequencyMap.set(phrase, (frequencyMap.get(phrase) || 0) + 1);
  }

  const result: KeywordItem[] = [];
  for (const [phrase, count] of frequencyMap.entries()) {
    // Density calculation: (occurrence count / total words) * 100
    const density = Math.round((count / totalWords) * 1000) / 10;
    result.push({ phrase, count, density });
  }

  // Sort descending by count, then alphabetically
  return result.sort((a, b) => b.count - a.count || a.phrase.localeCompare(b.phrase));
}

/**
 * Computes full Phase 3 text analysis metrics.
 */
export function analyzeText(text: string, filterStopWords: boolean = false): TextAnalysisMetrics {
  const tokens = extractWordTokens(text);
  const totalWords = tokens.length;

  if (totalWords === 0) {
    return {
      uniqueWords: 0,
      vocabularyDiversity: 0,
      averageWordLength: 0,
      averageSentenceLength: 0,
      longestWord: '',
      longestSentence: { text: '', wordCount: 0 },
      keywords1Gram: [],
      keywords2Gram: [],
      keywords3Gram: [],
    };
  }

  // Unique words
  const uniqueSet = new Set(tokens);
  const uniqueWords = uniqueSet.size;

  // Vocabulary Diversity (Type-Token Ratio)
  const vocabularyDiversity = Math.round((uniqueWords / totalWords) * 1000) / 10;

  // Average word length (chars per word)
  const totalCharsInWords = tokens.reduce((sum, token) => sum + token.length, 0);
  const averageWordLength = Math.round((totalCharsInWords / totalWords) * 10) / 10;

  // Longest word
  let longestWord = '';
  for (const token of uniqueSet) {
    if (token.length > longestWord.length) {
      longestWord = token;
    }
  }

  // Sentences and longest sentence
  const sentences = extractSentences(text);
  const sentenceCount = sentences.length || 1;
  const averageSentenceLength = Math.round((totalWords / sentenceCount) * 10) / 10;

  let longestSentence = { text: '', wordCount: 0 };
  for (const s of sentences) {
    const sTokens = extractWordTokens(s);
    if (sTokens.length > longestSentence.wordCount) {
      longestSentence = {
        text: s,
        wordCount: sTokens.length,
      };
    }
  }

  // N-Grams
  const keywords1Gram = calculateNGrams(tokens, 1, totalWords, filterStopWords);
  const keywords2Gram = calculateNGrams(tokens, 2, totalWords, filterStopWords);
  const keywords3Gram = calculateNGrams(tokens, 3, totalWords, filterStopWords);

  return {
    uniqueWords,
    vocabularyDiversity,
    averageWordLength,
    averageSentenceLength,
    longestWord,
    longestSentence,
    keywords1Gram,
    keywords2Gram,
    keywords3Gram,
  };
}

