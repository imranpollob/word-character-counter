import React, { useState, useEffect, useMemo } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { StatsSummary } from './components/StatsSummary';
import { Editor } from './components/Editor';
import { TextAnalysisSection } from './components/TextAnalysis/TextAnalysisSection';
import { SeoContent } from './components/SeoContent';
import { Footer } from './components/Footer';
import { calculateMetrics } from './core/basicCounters';
import { analyzeText } from './core/textAnalysis';
import { LimitSettings, ThemeMode } from './types/counter';
import {
  getSavedLimits,
  saveLimits,
  getSavedTheme,
  saveTheme,
} from './utils/storage';

export const App: React.FC = () => {
  // State: No text autosave - starts fresh in session
  const [text, setText] = useState<string>('');
  const [limits, setLimits] = useState<LimitSettings>(() => getSavedLimits());
  const [theme, setTheme] = useState<ThemeMode>(() => getSavedTheme());

  // Calculated Metrics (Instant & Reactive)
  const metrics = useMemo(() => calculateMetrics(text), [text]);

  // Phase 3 Text Analysis (Vocabulary, Lengths, Longest Token/Sentence)
  const analysis = useMemo(() => analyzeText(text, true), [text]);

  // Save limits on change
  const handleUpdateLimits = (newLimits: LimitSettings) => {
    setLimits(newLimits);
    saveLimits(newLimits);
  };

  // Theme Handling with high-contrast system sync
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();
    saveTheme(theme);

    const listener = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  // Clear & Undo Handlers
  const handleClear = () => {
    setText('');
  };

  const handleRestoreCleared = (restoredText: string) => {
    setText(restoredText);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-950 dark:text-white transition-colors duration-200">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Header Section: Semantic H1 on Left, Theme Switcher on Right */}
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Word &amp; Character Counter
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Calculate live word count, character count (with &amp; without spaces), sentences, paragraphs, reading time, and speaking time in real time.
            </p>
          </div>

          {/* Theme Switcher on the Right */}
          <div className="flex items-center shrink-0 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs text-xs">
            <button
              onClick={() => setTheme('light')}
              title="Light Mode"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${theme === 'light'
                ? 'bg-brand-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark Mode"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${theme === 'dark'
                ? 'bg-brand-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('system')}
              title="System Default"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${theme === 'system'
                ? 'bg-brand-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Responsive Grid:
            - Mobile (< lg): Metrics & Analysis shown FIRST (order-1), Editor shown second (order-2)
            - Desktop (lg): Editor on LEFT (lg:order-1), Metrics & Analysis on RIGHT (lg:order-2)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Metrics & Analysis Column (order-1 on mobile, lg:order-2 on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-5 2xl:col-span-4 space-y-4">
            {/* 1. Counter Metrics */}
            <StatsSummary metrics={metrics} />

            {/* 2. Text Analysis & Vocabulary directly below the metrics */}
            <TextAnalysisSection analysis={analysis} />
          </div>

          {/* Editor Column (order-2 on mobile, lg:order-1 on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-7 2xl:col-span-8">
            <Editor
              text={text}
              metrics={metrics}
              limits={limits}
              onUpdateLimits={handleUpdateLimits}
              onChange={setText}
              onClear={handleClear}
              onRestoreCleared={handleRestoreCleared}
            />
          </div>
        </div>

        {/* Search Engine Optimization & Educational Content */}
        <SeoContent />
      </main>

      <Footer />
    </div>
  );
};

export default App;
