export interface KeywordItem {
  phrase: string;
  count: number;
  density: number; // percentage (e.g. 3.4%)
}

export interface TextAnalysisMetrics {
  uniqueWords: number;
  vocabularyDiversity: number; // Type-Token Ratio percentage (0-100)
  averageWordLength: number; // in characters
  averageSentenceLength: number; // in words
  longestWord: string;
  longestSentence: {
    text: string;
    wordCount: number;
  };
  keywords1Gram: KeywordItem[];
  keywords2Gram: KeywordItem[];
  keywords3Gram: KeywordItem[];
}

