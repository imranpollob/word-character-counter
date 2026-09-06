import React, { useState, useRef } from 'react';
import { Trash2, RotateCcw, FilePlus2 } from 'lucide-react';
import { TextMetrics } from '../types/counter';

interface EditorProps {
  text: string;
  metrics: TextMetrics;
  onChange: (newText: string) => void;
  onClear: () => void;
  onRestoreCleared: (restoredText: string) => void;
}

const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. 

Writing clearly and concisely is essential for effective communication. Whether you are drafting an essay, crafting a social post, or preparing an article, keeping track of your word and character count helps you stay focused and adhere to strict editorial guidelines.

Dr. Smith published his research in vol. 4 of the journal on March 15. The paper received over 3.14 thousand citations! Feel free to edit, paste, or test your text here.`;

export const Editor: React.FC<EditorProps> = ({
  text,
  onChange,
  onClear,
  onRestoreCleared,
}) => {
  const [clearedBackup, setClearedBackup] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="relative bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full min-h-[440px] sm:min-h-[520px] lg:min-h-[620px] transition-colors">
      {/* Undo Alert (shown immediately if text was cleared) */}
      {clearedBackup && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-amber-50 dark:bg-amber-950/80 border-b border-amber-200 dark:border-amber-700 text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium transition-all z-20">
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

      {/* Floating Action Button in Corner (Clear or Sample) - No Top/Bottom Bars */}
      <div className="absolute top-3.5 right-3.5 z-10">
        {text ? (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-300 bg-white/95 dark:bg-slate-800/95 hover:bg-rose-50 dark:hover:bg-rose-950/80 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 shadow-xs transition-colors cursor-pointer"
            title="Clear text"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        ) : (
          <button
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/90 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs transition-colors cursor-pointer"
            title="Load sample text"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Sample Text</span>
          </button>
        )}
      </div>

      {/* Pure Textarea Area */}
      <div className="flex-1 flex p-4 sm:p-5">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            onChange(e.target.value);
            if (clearedBackup) setClearedBackup(null);
          }}
          placeholder="Start typing or paste your text here..."
          className="w-full h-full min-h-[400px] sm:min-h-[480px] lg:min-h-[580px] bg-transparent text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base sm:text-lg leading-relaxed resize-none focus:outline-hidden font-normal selection:bg-blue-600 selection:text-white"
          spellCheck="true"
        />
      </div>
    </div>
  );
};
