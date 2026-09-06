import React from 'react';
import { TextMetrics } from '../types/counter';
import { InfoTooltip } from './InfoTooltip';

interface StatsSummaryProps {
  metrics: TextMetrics;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
      {/* 1. Words */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-1">
          Words
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
          {metrics.words.toLocaleString()}
        </div>
      </div>

      {/* 2. Characters (With Spaces) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
          Chars (all)
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
          {metrics.characters.toLocaleString()}
        </div>
      </div>

      {/* 3. Characters (No Spaces) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
          Chars (no spaces)
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
          {metrics.charactersNoSpaces.toLocaleString()}
        </div>
      </div>

      {/* 4. Sentences */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
          Sentences
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
          {metrics.sentences.toLocaleString()}
        </div>
      </div>

      {/* 5. Paragraphs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
          Paragraphs
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
          {metrics.paragraphs.toLocaleString()}
        </div>
      </div>

      {/* 6. Lines */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
          Lines
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
          {metrics.lines.toLocaleString()}
        </div>
      </div>

      {/* 7. Reading Time */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mb-1">
          <span>Reading Time</span>
          <InfoTooltip
            content="Calculated at 225 words per minute (WPM), the standard average silent reading speed for adults."
            align="left"
          />
        </div>
        <div className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
          {metrics.readingTimeFormatted}
        </div>
      </div>

      {/* 8. Speaking Time */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-colors shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 mb-1">
          <span>Speaking Time</span>
          <InfoTooltip
            content="Calculated at 130 words per minute (WPM), the standard conversational speaking pace."
            align="right"
          />
        </div>
        <div className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
          {metrics.speakingTimeFormatted}
        </div>
      </div>
    </div>
  );
};
