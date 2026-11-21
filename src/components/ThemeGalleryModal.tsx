import React, { useEffect } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import { APP_THEMES, AppTheme } from '../data/themes';
import { useTheme } from '../context/ThemeContext';

interface ThemeGalleryModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES: AppTheme['category'][] = ['Minimal', 'Scenery', 'Anime'];

export const ThemeGalleryModal: React.FC<ThemeGalleryModalProps> = ({ open, onClose }) => {
  const {
    theme: activeTheme,
    setThemeId,
    backdropIntensity,
    setBackdropIntensity,
    ambientEffects,
    setAmbientEffects,
  } = useTheme();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-studio-title"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/55 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative z-10 w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Appearance &amp; Study Atmosphere
            </div>
            <h2
              id="theme-studio-title"
              className="text-lg font-bold text-slate-900 dark:text-slate-100"
            >
              Choose a Study Theme
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close theme selector"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Categories */}
          {CATEGORIES.map((category) => {
            const items = APP_THEMES.filter((t) => t.category === category);
            return (
              <div key={category} className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {category} Themes
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => {
                    const selected = item.id === activeTheme.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setThemeId(item.id)}
                        className={`group text-left rounded-xl border overflow-hidden transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-accent ${
                          selected
                            ? 'border-accent ring-2 ring-accent/25 bg-accent-soft/40'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* 16:9 Artwork / Minimal Preview */}
                        <div
                          className="relative aspect-16/9 w-full overflow-hidden"
                          style={{ background: item.fallbackGradient }}
                        >
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={`${item.name} theme preview`}
                              referrerPolicy="no-referrer"
                              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                                item.imageScaleClass ?? ''
                              }`}
                            />
                          ) : (
                            <div className="w-full h-full p-3.5 flex flex-col justify-between bg-slate-50 border-b border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <span className="h-2 w-10 rounded bg-slate-300" />
                                <span className="h-2 w-6 rounded bg-blue-600" />
                              </div>
                              <div className="space-y-1.5">
                                <span className="block h-2 w-4/5 rounded bg-slate-200" />
                                <span className="block h-2 w-3/5 rounded bg-slate-200" />
                              </div>
                            </div>
                          )}

                          {/* Bottom gradient scrim for selected indicator */}
                          {selected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent text-accent-fg flex items-center justify-center shadow-sm">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        {/* Metadata (unboxed) */}
                        <div className="p-3.5 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {item.name}
                            </span>
                            <span
                              aria-hidden="true"
                              className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                              style={{ backgroundColor: item.swatchAccent }}
                            />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                            {item.tagline}
                          </p>
                          <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            {item.isDark ? 'Dark mode' : 'Light mode'} · {item.category}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Fine-Tune Controls for Scenic & Anime Themes */}
          {activeTheme.id !== 'academic-white' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  <label htmlFor="scenery-visibility-slider">
                    Scenery Backdrop Visibility
                  </label>
                  <span className="font-mono font-semibold tabular-nums">
                    {backdropIntensity}%
                  </span>
                </div>
                <input
                  id="scenery-visibility-slider"
                  type="range"
                  min={20}
                  max={100}
                  step={2}
                  value={backdropIntensity}
                  onChange={(e) => setBackdropIntensity(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Subtle veil (maximum reading focus)</span>
                  <span>Vivid scenery</span>
                </div>
              </div>

              {activeTheme.ambientEffect !== 'none' && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                    <Sparkles className="w-4 h-4 text-accent-text shrink-0" />
                    <span>
                      {activeTheme.ambientEffect === 'petals'
                        ? 'Gentle drifting cherry blossom petals'
                        : 'Subtle starlight twinkle'}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={ambientEffects}
                    onClick={() => setAmbientEffects(!ambientEffects)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      ambientEffects
                        ? 'bg-accent text-accent-fg border-accent'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {ambientEffects ? 'On' : 'Off'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Active: <strong className="text-slate-800 dark:text-slate-200">{activeTheme.name}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent hover:bg-accent-hover text-accent-fg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
