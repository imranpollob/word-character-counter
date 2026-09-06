import { LimitSettings, ThemeMode } from '../types/counter';

const STORAGE_KEYS = {
  LIMITS: 'wcc_limit_settings',
  THEME: 'wcc_theme_mode',
};

export function getSavedLimits(): LimitSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LIMITS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {
    enabled: false,
    type: 'words',
    target: 500,
  };
}

export function saveLimits(limits: LimitSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LIMITS, JSON.stringify(limits));
  } catch (e) {
    console.warn('Unable to save limits:', e);
  }
}

export function getSavedTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // fallback
  }
  return 'system';
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.warn('Unable to save theme:', e);
  }
}
