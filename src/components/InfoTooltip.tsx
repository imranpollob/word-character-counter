import React, { useState, useRef, useEffect } from 'react';

interface InfoTooltipProps {
  content: string;
  align?: 'left' | 'right' | 'center';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  align = 'center',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when tapping outside or pressing Esc
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  let alignClasses = 'left-1/2 -translate-x-1/2';
  let arrowClasses = 'left-1/2 -translate-x-1/2';
  if (align === 'left') {
    alignClasses = 'left-0 sm:left-1/2 sm:-translate-x-1/2';
    arrowClasses = 'left-2.5 sm:left-1/2 sm:-translate-x-1/2';
  } else if (align === 'right') {
    alignClasses = 'right-0 sm:left-1/2 sm:-translate-x-1/2';
    arrowClasses = 'right-2.5 sm:left-1/2 sm:-translate-x-1/2';
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-label="How is this calculated?"
        aria-expanded={isOpen}
        className="w-3.5 h-3.5 rounded-full border border-slate-400/80 dark:border-slate-500/80 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-600 dark:hover:border-slate-300 text-[10px] font-bold inline-flex items-center justify-center leading-none transition-colors cursor-pointer select-none focus:outline-hidden focus:ring-1 focus:ring-blue-500"
      >
        ?
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className={`absolute bottom-full mb-2 z-50 w-52 sm:w-60 p-2.5 bg-slate-900 dark:bg-slate-800 text-slate-100 text-xs font-normal normal-case tracking-normal rounded-lg shadow-xl border border-slate-700 dark:border-slate-600 ${alignClasses}`}
        >
          <div className="leading-relaxed">{content}</div>
          {/* Arrow pointing down toward ? button */}
          <div
            className={`absolute top-full -mt-px border-4 border-transparent border-t-slate-900 dark:border-t-slate-800 ${arrowClasses}`}
          />
        </div>
      )}
    </div>
  );
};

