export interface TextMetrics {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
  readingTimeFormatted: string;
  speakingTimeFormatted: string;
}

export type LimitType = 'words' | 'characters';

export interface LimitSettings {
  enabled: boolean;
  type: LimitType;
  target: number;
}

export type ThemeMode = 'system' | 'light' | 'dark';

