import { describe, it, expect } from 'vitest';
import {
  extractWordTokens,
  extractSentences,
  calculateNGrams,
  analyzeText,
} from '../src/core/textAnalysis';

describe('textAnalysis', () => {
  it('handles empty text gracefully', () => {
    const analysis = analyzeText('');
    expect(analysis.uniqueWords).toBe(0);
    expect(analysis.vocabularyDiversity).toBe(0);
    expect(analysis.averageWordLength).toBe(0);
    expect(analysis.averageSentenceLength).toBe(0);
    expect(analysis.longestWord).toBe('');
    expect(analysis.longestSentence.wordCount).toBe(0);
    expect(analysis.keywords1Gram).toEqual([]);
    expect(analysis.keywords2Gram).toEqual([]);
    expect(analysis.keywords3Gram).toEqual([]);
  });

  it('correctly calculates unique words and vocabulary diversity', () => {
    // "apple apple banana orange" -> 4 total words, 3 unique
    // diversity = 3 / 4 * 100 = 75.0%
    const text = 'apple apple banana orange';
    const analysis = analyzeText(text);
    expect(analysis.uniqueWords).toBe(3);
    expect(analysis.vocabularyDiversity).toBe(75.0);
  });

  it('identifies longest word and longest sentence accurately', () => {
    const text = 'Short sentence. This is an extraordinarily informative sentence with many words.';
    const analysis = analyzeText(text);
    expect(analysis.longestWord).toBe('extraordinarily');
    expect(analysis.longestSentence.wordCount).toBe(9);
    expect(analysis.longestSentence.text).toContain('extraordinarily informative');
  });

  it('computes average word and sentence length', () => {
    // Two sentences:
    // Sentence 1: "Hello world" (2 words, 5+5=10 chars)
    // Sentence 2: "This is test" (3 words, 4+2+4=10 chars)
    // Total words = 5, Total sentences = 2
    // Avg sentence length = 5 / 2 = 2.5 words
    // Total chars = 20, Total words = 5 -> Avg word length = 4.0 chars
    const text = 'Hello world. This is test.';
    const analysis = analyzeText(text);
    expect(analysis.averageSentenceLength).toBe(2.5);
    expect(analysis.averageWordLength).toBe(4.0);
  });

  it('generates 1-gram, 2-gram, and 3-gram phrases', () => {
    const text = 'artificial intelligence and artificial intelligence research';
    const tokens = extractWordTokens(text);
    const bigrams = calculateNGrams(tokens, 2, tokens.length, false);
    
    // "artificial intelligence" occurs 2 times
    const topBigram = bigrams[0];
    expect(topBigram.phrase).toBe('artificial intelligence');
    expect(topBigram.count).toBe(2);

    const trigrams = calculateNGrams(tokens, 3, tokens.length, false);
    expect(trigrams.length).toBeGreaterThan(0);
    expect(trigrams.some(t => t.phrase === 'artificial intelligence and')).toBe(true);
  });

  it('filters stop words when requested', () => {
    const text = 'the quick the brown the fox';
    const analysisWithFilter = analyzeText(text, true);
    const analysisWithoutFilter = analyzeText(text, false);

    // "the" is a stop word
    expect(analysisWithFilter.keywords1Gram.some(k => k.phrase === 'the')).toBe(false);
    expect(analysisWithoutFilter.keywords1Gram.some(k => k.phrase === 'the')).toBe(true);
  });

  it('correctly analyzes Bangla text (vocabulary, unique words, and dari sentences)', () => {
    const banglaText = 'আমি বাংলায় গান গাই। আমি বাংলাকে ভালোবাসি। তুমি কি জানো?';
    const analysis = analyzeText(banglaText);

    // 10 total words, 9 unique words ('আমি' repeats once)
    expect(analysis.uniqueWords).toBe(9);
    expect(analysis.vocabularyDiversity).toBe(90.0);
    expect(analysis.longestWord).toBe('ভালোবাসি');

    // Sentences separated by Dari (।) and question mark (?)
    expect(extractSentences(banglaText).length).toBe(3);
  });

  it('correctly analyzes Spanish, Arabic, and CJK text', () => {
    // Spanish with accents and inverted punctuation
    const spanishText = '¡Hola mundo! ¿Cómo estás hoy?';
    const spanishTokens = extractWordTokens(spanishText);
    expect(spanishTokens).toEqual(['hola', 'mundo', 'cómo', 'estás', 'hoy']);
    expect(extractSentences(spanishText).length).toBe(2);

    // Arabic
    const arabicText = 'مرحبا بكم في موقعنا. هل يعجبك الموقع؟';
    const arabicTokens = extractWordTokens(arabicText);
    expect(arabicTokens.length).toBe(7);
    expect(extractSentences(arabicText).length).toBe(2);

    // Chinese with ideographic full stops
    const cjkText = '我爱编写代码。这也是一个句子！';
    const cjkTokens = extractWordTokens(cjkText);
    expect(cjkTokens.length).toBeGreaterThan(0);
    expect(extractSentences(cjkText).length).toBe(2);
  });
});
