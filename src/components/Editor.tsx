import React, { useState, useRef } from 'react';
import { Trash2, RotateCcw, FilePlus2, Target, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LimitSettings, LimitType, TextMetrics } from '../types/counter';

interface EditorProps {
  text: string;
  metrics: TextMetrics;
  limits: LimitSettings;
  onUpdateLimits: (limits: LimitSettings) => void;
  onChange: (newText: string) => void;
  onClear: () => void;
  onRestoreCleared: (restoredText: string) => void;
}

const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. 

Writing clearly and concisely is essential for effective communication. Whether you are drafting an essay, crafting a social post, or preparing an article, keeping track of your word and character count helps you stay focused and adhere to strict editorial guidelines.

Dr. Smith published his research in vol. 4 of the journal on March 15. The paper received over 3.14 thousand citations! Feel free to edit, paste, or test your text here.`;

export const Editor: React.FC<EditorProps> = ({
  text,
  metrics,
  limits,
  onUpdateLimits,
  onChange,
  onClear,
  onRestoreCleared,
}) => {
  const [clearedBackup, setClearedBackup] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Target limit calculations (Allowance / Depletion convention: starts full, reduces as text is added)
  const currentCount = limits.type === 'words' ? metrics.words : metrics.characters;
  const target = limits.target > 0 ? limits.target : 1;
  const remaining = target - currentCount;
  const isExceeded = remaining < 0;

  // Percentage remaining (starts at 100% full, reduces toward 0% as text is added)
  const remainingPercentage = Math.max(0, Math.min(100, Math.round((remaining / target) * 100)));

  // Theme-aware high contrast colors:
  // > 20% remaining: Healthy allowance (Emerald green)
  // 1% - 20% remaining: Running low (Amber warning)
  // <= 0 remaining: Exceeded / exhausted (Rose red alert)
  let progressColor = 'bg-emerald-500 dark:bg-emerald-400';
  let badgeColor = 'text-emerald-900 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700';

  if (remaining <= 0) {
    progressColor = 'bg-rose-600 dark:bg-rose-500';
    badgeColor = 'text-rose-950 dark:text-rose-200 bg-rose-100/90 dark:bg-rose-950/80 border-rose-300 dark:border-rose-700';
  } else if (remainingPercentage <= 20) {
    progressColor = 'bg-amber-600 dark:bg-amber-400';
    badgeColor = 'text-amber-950 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700';
  }

  const handleToggleLimit = () => {
    onUpdateLimits({
      ...limits,
      enabled: !limits.enabled,
    });
  };

  const handleTypeChange = (type: LimitType) => {
    onUpdateLimits({
      ...limits,
      type,
      target: type === 'words' ? (limits.type === 'words' ? limits.target : 500) : (limits.type === 'characters' ? limits.target : 280),
    });
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onUpdateLimits({
      ...limits,
      target: isNaN(val) ? 0 : Math.max(0, val),
    });
  };

  const handleClear = () => {
    if (!text) return;
    setClearedBackup(text);
    onClear();
  };

  const handleUndoClear = () => {
    if (clearedBackup !== null) {
      onRestoreCleared(clearedBackup);
      setClearedBackup(null);
    }
  };

  const handleLoadSample = () => {
    onChange(SAMPLE_TEXT);
    setClearedBackup(null);
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full min-h-[460px] sm:min-h-[540px] lg:min-h-[640px] transition-colors">
      {/* Topbar on the textarea */}
      <div className="px-3 sm:px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2.5 transition-colors">
        {/* Left: Target Limit Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleToggleLimit}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors border cursor-pointer ${limits.enabled
                ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-200 border-blue-400 dark:border-blue-600'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
              }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>{limits.enabled ? 'Limit Active' : 'Set Target Limit'}</span>
          </button>

          {limits.enabled && (
            <div className="flex items-center gap-1.5">
              <div className="inline-flex rounded-lg p-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-[11px]">
                <button
                  onClick={() => handleTypeChange('words')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${limits.type === 'words'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                    }`}
                >
                  Words
                </button>
                <button
                  onClick={() => handleTypeChange('characters')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${limits.type === 'characters'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                    }`}
                >
                  Chars
                </button>
              </div>

              <input
                type="number"
                min="1"
                max="1000000"
                value={limits.target || ''}
                onChange={handleTargetChange}
                className="w-20 px-2 py-0.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-right"
                placeholder="Target"
              />

              {/* Status Badge */}
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold ${badgeColor}`}
              >
                {isExceeded ? (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    <span>+{Math.abs(remaining).toLocaleString()} over</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{remaining.toLocaleString()} left</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Sample Text & Clear Buttons */}
        <div className="flex items-center gap-2">
          {/* Sample Text Button */}
          <button
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xs transition-colors cursor-pointer"
            title="Load sample text"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Sample Text</span>
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            disabled={!text}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-300 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/80 border border-slate-300 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Clear all text"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Progress Bar (Depletion Allowance Convention: starts 100% full, reduces as text is typed) */}
      {limits.enabled && (
        <div
          className={`w-full h-1.5 transition-colors overflow-hidden ${isExceeded ? 'bg-rose-600 dark:bg-rose-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
        >
          {!isExceeded && (
            <div
              className={`h-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${remainingPercentage}%` }}
            />
          )}
        </div>
      )}

      {/* Undo Alert (shown immediately if text was cleared) */}
      {clearedBackup && (
        <div className="flex items-center justify-between px-4 py-2 bg-amber-50 dark:bg-amber-950/80 border-b border-amber-200 dark:border-amber-700 text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium transition-all z-20">
          <span>Text cleared. Accidental click?</span>
          <button
            onClick={handleUndoClear}
            className="flex items-center gap-1.5 font-bold underline text-amber-950 dark:text-amber-100 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Undo Clear
          </button>
        </div>
      )}

      {/* Textarea Area */}
      <div className="flex-1 flex p-4 sm:p-5">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            onChange(e.target.value);
            if (clearedBackup) setClearedBackup(null);
          }}
          placeholder="Start typing or paste your text here..."
          className="w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[560px] bg-transparent text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base sm:text-lg leading-relaxed resize-none focus:outline-hidden font-normal selection:bg-blue-600 selection:text-white"
          spellCheck="true"
        />
      </div>
    </div>
  );
};
