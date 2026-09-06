import { describe, it, expect } from 'vitest';
import {
  countWords,
  countCharacters,
  countCharactersNoSpaces,
  countSentences,
  countParagraphs,
  countLines,
  calculateMetrics,
} from '../src/core/basicCounters';

describe('basicCounters', () => {
  it('handles empty and whitespace strings gracefully', () => {
    const metrics = calculateMetrics('');
    expect(metrics.words).toBe(0);
    expect(metrics.characters).toBe(0);
    expect(metrics.charactersNoSpaces).toBe(0);
    expect(metrics.sentences).toBe(0);
    expect(metrics.paragraphs).toBe(0);
    expect(metrics.lines).toBe(0);
    expect(metrics.readingTimeFormatted).toBe('0 sec');

    const whitespaceMetrics = calculateMetrics('   \n\t  \n  ');
    expect(whitespaceMetrics.words).toBe(0);
    expect(whitespaceMetrics.charactersNoSpaces).toBe(0);
    expect(whitespaceMetrics.sentences).toBe(0);
    expect(whitespaceMetrics.paragraphs).toBe(0);
  });

  it('correctly counts words and characters', () => {
    const text = 'The quick brown fox jumps over the lazy dog.';
    expect(countWords(text)).toBe(9);
    expect(countCharacters(text)).toBe(44);
    expect(countCharactersNoSpaces(text)).toBe(36);
  });

  it('handles hyphenated words and contractions', () => {
    const text = "State-of-the-art technology isn't always easy to understand.";
    expect(countWords(text)).toBe(7);
  });

  it('counts sentences accurately and ignores abbreviations and decimals', () => {
    const text = 'Dr. Smith bought 3.14 liters of milk. He went home! Did he call Mr. Adams? Yes, he did.';
    // Sentences should be 4:
    // 1: Dr. Smith bought 3.14 liters of milk.
    // 2: He went home!
    // 3: Did he call Mr. Adams?
    // 4: Yes, he did.
    expect(countSentences(text)).toBe(4);
  });

  it('correctly counts paragraphs and lines', () => {
    const text = `First paragraph with some text.

Second paragraph here.


Third paragraph.`;
    expect(countParagraphs(text)).toBe(3);
    expect(countLines(text)).toBe(6);
  });

  it('computes reading time and speaking time correctly', () => {
    // 450 words should be exactly 2 minutes reading (at 225 wpm)
    const words450 = Array(450).fill('word').join(' ');
    const metrics = calculateMetrics(words450);
    expect(metrics.words).toBe(450);
    expect(metrics.readingTimeFormatted).toBe('2 min');
    // At 130 wpm: 450 / 130 * 60 = 207.69 sec -> 3 min 28 sec
    expect(metrics.speakingTimeFormatted).toBe('3 min 28 sec');
  });
});

