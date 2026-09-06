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

  it('accurately counts complex emojis and grapheme clusters as 1 character each', () => {
    // Standard emoji
    expect(countCharacters('😃')).toBe(1);
    expect(countCharactersNoSpaces('😃')).toBe(1);

    // ZWJ family sequence (👨‍👩‍👧‍👦 has 11 UTF-16 code units but is 1 visual emoji)
    expect(countCharacters('👨‍👩‍👧‍👦')).toBe(1);
    expect(countCharactersNoSpaces('👨‍👩‍👧‍👦')).toBe(1);

    // Skin-tone modified emoji (👍🏽 has 4 code units but is 1 visual emoji)
    expect(countCharacters('👍🏽')).toBe(1);
    expect(countCharactersNoSpaces('👍🏽')).toBe(1);

    // Country flags (🇺🇸 uses 2 regional indicator symbols)
    expect(countCharacters('🇺🇸')).toBe(1);
    expect(countCharactersNoSpaces('🇺🇸')).toBe(1);

    // Rainbow flag (🏳️‍🌈 has 6 code units)
    expect(countCharacters('🏳️‍🌈')).toBe(1);
    expect(countCharactersNoSpaces('🏳️‍🌈')).toBe(1);

    // Combining accent mark (cafe\u0301 is 4 graphemes, not 5)
    expect(countCharacters('cafe\u0301')).toBe(4);
    expect(countCharactersNoSpaces('cafe\u0301')).toBe(4);

    // Mixed text with emojis and whitespace
    const mixed = 'Hello 👋 world! 🌍';
    expect(countCharacters(mixed)).toBe(16);
    expect(countCharactersNoSpaces(mixed)).toBe(13);
  });

  it('correctly handles multilingual words and sentences across international scripts', () => {
    // Bangla with Dari (।) and question mark (?)
    const bangla = 'আমি বাংলায় গান গাই। আমি বাংলাকে ভালোবাসি! তুমি কি জানো?';
    expect(countWords(bangla)).toBe(10);
    expect(countSentences(bangla)).toBe(3);

    // Arabic with question mark (؟)
    const arabic = 'مرحبا بكم في موقعنا. هل يعجبك الموقع؟ شكرا جزيلا!';
    expect(countWords(arabic)).toBe(9);
    expect(countSentences(arabic)).toBe(3);

    // Chinese with ideographic full stops (。) and exclamations (！)
    const cjk = '我爱编写代码。这也是一个句子！';
    expect(countWords(cjk)).toBeGreaterThan(2);
    expect(countSentences(cjk)).toBe(2);
  });
});

