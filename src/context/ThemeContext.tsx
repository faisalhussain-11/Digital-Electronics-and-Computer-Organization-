import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppTheme, getThemeById, ThemeId } from '../data/themes';

interface ThemePreferences {
  themeId: ThemeId;
  backdropIntensity: number; // 0 to 100 (controls how visible the scenery artwork is behind surfaces)
  ambientEffects: boolean;
}

interface ThemeContextValue extends ThemePreferences {
  theme: AppTheme;
  setThemeId: (id: ThemeId) => void;
  setBackdropIntensity: (val: number) => void;
  setAmbientEffects: (enabled: boolean) => void;
}

const STORAGE_KEY = 'deco_u24ec304_theme_v1';

const DEFAULT_PREFS: ThemePreferences = {
  themeId: 'academic-white',
  backdropIntensity: 68,
  ambientEffects: true,
};

function loadThemePrefs(): ThemePreferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<ThemePreferences>;
    return {
      themeId: parsed.themeId ?? DEFAULT_PREFS.themeId,
      backdropIntensity:
        typeof parsed.backdropIntensity === 'number'
          ? Math.max(20, Math.min(100, parsed.backdropIntensity))
          : DEFAULT_PREFS.backdropIntensity,
      ambientEffects:
        typeof parsed.ambientEffects === 'boolean'
          ? parsed.ambientEffects
          : DEFAULT_PREFS.ambientEffects,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useState<ThemePreferences>(loadThemePrefs);
  const theme = useMemo(() => getThemeById(prefs.themeId), [prefs.themeId]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme.id;
    root.classList.toggle('dark', theme.isDark);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage write issues
    }
  }, [prefs, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      ...prefs,
      theme,
      setThemeId: (themeId) => setPrefs((p) => ({ ...p, themeId })),
      setBackdropIntensity: (backdropIntensity) =>
        setPrefs((p) => ({ ...p, backdropIntensity })),
      setAmbientEffects: (ambientEffects) => setPrefs((p) => ({ ...p, ambientEffects })),
    }),
    [prefs, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
