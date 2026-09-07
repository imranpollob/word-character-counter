import React from 'react';
import { TextAnalysisMetrics } from '../../types/analysis';
import { InfoTooltip } from '../InfoTooltip';

interface TextAnalysisSectionProps {
  analysis: TextAnalysisMetrics;
}

export const TextAnalysisSection: React.FC<TextAnalysisSectionProps> = ({ analysis }) => {
  return (
    <div className="pt-2">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        Text Analysis &amp; Vocabulary
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* 1. Unique Words */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Unique Words
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
            {analysis.uniqueWords.toLocaleString()}
          </div>
        </div>

        {/* 2. Vocabulary Diversity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
            <span>Vocab Diversity</span>
            <InfoTooltip
              content="Calculated as (Unique Words ÷ Total Words) × 100. Measures vocabulary richness and lexical variety (Type-Token Ratio)."
              align="right"
            />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
            {analysis.vocabularyDiversity > 0 ? `${analysis.vocabularyDiversity.toFixed(1)}%` : '0%'}
          </div>
        </div>

        {/* 3. Average Word Length */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Avg Word Length
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
            {analysis.averageWordLength > 0 ? `${analysis.averageWordLength.toFixed(1)}` : '0'}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">chars</span>
          </div>
        </div>

        {/* 4. Average Sentence Length */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Avg Sentence
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
            {analysis.averageSentenceLength > 0 ? `${analysis.averageSentenceLength.toFixed(1)}` : '0'}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">words</span>
          </div>
        </div>

        {/* 5. Longest Word */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Longest Word
          </div>
          <div
            title={analysis.longestWord}
            className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white truncate"
          >
            {analysis.longestWord ? analysis.longestWord : '—'}
          </div>
          {analysis.longestWord && (
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {analysis.longestWord.length} chars
            </div>
          )}
        </div>

        {/* 6. Longest Sentence */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Longest Sentence
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
            {analysis.longestSentence.wordCount > 0 ? analysis.longestSentence.wordCount : 0}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">words</span>
          </div>
        </div>
      </div>
    </div>
  );
};
