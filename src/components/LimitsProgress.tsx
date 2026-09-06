import React from 'react';
import { LimitSettings, LimitType, TextMetrics } from '../types/counter';
import { Target, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LimitsProgressProps {
  limits: LimitSettings;
  metrics: TextMetrics;
  onUpdateLimits: (limits: LimitSettings) => void;
}

export const LimitsProgress: React.FC<LimitsProgressProps> = ({
  limits,
  metrics,
  onUpdateLimits,
}) => {
  const currentCount = limits.type === 'words' ? metrics.words : metrics.characters;
  const target = limits.target > 0 ? limits.target : 1;
  const percentage = Math.min(100, Math.round((currentCount / target) * 100));
  const rawPercentage = (currentCount / target) * 100;
  const remaining = target - currentCount;
  const isExceeded = remaining < 0;

  // High contrast color states
  let progressColor = 'bg-blue-600 dark:bg-blue-400';
  let badgeColor = 'text-blue-900 dark:text-blue-200 bg-blue-100/80 dark:bg-blue-950/80 border-blue-300 dark:border-blue-600';

  if (rawPercentage >= 100) {
    progressColor = 'bg-rose-600 dark:bg-rose-500';
    badgeColor = 'text-rose-950 dark:text-rose-200 bg-rose-100/90 dark:bg-rose-950/80 border-rose-300 dark:border-rose-600';
  } else if (rawPercentage >= 80) {
    progressColor = 'bg-amber-600 dark:bg-amber-400';
    badgeColor = 'text-amber-950 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/80 border-amber-300 dark:border-amber-600';
  }

  const handleToggle = () => {
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

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 shadow-xs transition-colors mb-3">
      {/* Header with Limit Toggle */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors border cursor-pointer ${limits.enabled
              ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-200 border-blue-400 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/80'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-950 dark:hover:text-white'
            }`}
        >
          <Target className="w-4 h-4" />
          <span>{limits.enabled ? 'Limit Active' : 'Set Target Limit'}</span>
        </button>

        {limits.enabled && (
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs">
            <button
              onClick={() => handleTypeChange('words')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${limits.type === 'words'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-200 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700'
                }`}
            >
              Words
            </button>
            <button
              onClick={() => handleTypeChange('characters')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${limits.type === 'characters'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-200 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700'
                }`}
            >
              Chars
            </button>
          </div>
        )}
      </div>

      {/* Target input when enabled */}
      {limits.enabled && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Target {limits.type}:
          </label>
          <input
            type="number"
            min="1"
            max="1000000"
            value={limits.target || ''}
            onChange={handleTargetChange}
            className="w-28 px-2.5 py-1 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-right"
            placeholder="500"
          />
        </div>
      )}

      {/* Progress Bar & Status (when active) */}
      {limits.enabled && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {currentCount.toLocaleString()} / {limits.target.toLocaleString()} {limits.type}
            </span>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold ${badgeColor}`}>
              {isExceeded ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>+{Math.abs(remaining).toLocaleString()} over</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{remaining.toLocaleString()} left</span>
                </>
              )}
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${progressColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
