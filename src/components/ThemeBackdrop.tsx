import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const PETAL_SEEDS = [
  { left: '6%', delay: '0s', duration: '15s', size: 11 },
  { left: '16%', delay: '-4s', duration: '18s', size: 9 },
  { left: '28%', delay: '-9s', duration: '14s', size: 12 },
  { left: '41%', delay: '-2s', duration: '17s', size: 10 },
  { left: '54%', delay: '-7s', duration: '16s', size: 8 },
  { left: '67%', delay: '-11s', duration: '19s', size: 11 },
  { left: '79%', delay: '-3s', duration: '15s', size: 9 },
  { left: '91%', delay: '-6s', duration: '17s', size: 12 },
];

const STAR_SEEDS = [
  { top: '12%', left: '14%', delay: '0s', size: 3 },
  { top: '24%', left: '34%', delay: '1.2s', size: 2 },
  { top: '18%', left: '62%', delay: '0.6s', size: 3 },
  { top: '31%', left: '84%', delay: '2.1s', size: 2 },
  { top: '52%', left: '22%', delay: '1.7s', size: 2 },
  { top: '44%', left: '73%', delay: '0.9s', size: 3 },
  { top: '68%', left: '48%', delay: '2.5s', size: 2 },
  { top: '76%', left: '88%', delay: '1.4s', size: 3 },
];

export const ThemeBackdrop: React.FC = () => {
  const { theme, backdropIntensity, ambientEffects } = useTheme();
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (theme.id === 'academic-white') {
    return null;
  }

  // Higher backdropIntensity = clearer artwork (lower veil opacity)
  // Light themes keep veil between 0.32 and 0.80; dark themes keep veil between 0.36 and 0.82
  const normalized = (backdropIntensity - 20) / 80; // 0..1
  const veilOpacity = theme.isDark
    ? 0.82 - normalized * 0.44
    : 0.80 - normalized * 0.46;

  const showImage = Boolean(theme.imageUrl && failedUrl !== theme.imageUrl);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden no-print"
      style={{ background: theme.fallbackGradient }}
    >
      {showImage && (
        <img
          src={theme.imageUrl}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(theme.imageUrl ?? null)}
          className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
            theme.imageScaleClass ?? ''
          }`}
        />
      )}

      {/* Calibrated Contrast Veil */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: theme.isDark ? '#070b18' : '#ffffff',
          opacity: veilOpacity,
        }}
      />

      {/* Subtle Ambient Drifting Petals (Cherry Blossom) */}
      {ambientEffects && theme.ambientEffect === 'petals' && (
        <div className="absolute inset-0 overflow-hidden">
          {PETAL_SEEDS.map((p, idx) => (
            <span
              key={idx}
              className="sakura-petal"
              style={{
                left: p.left,
                width: `${p.size}px`,
                height: `${Math.round(p.size * 0.72)}px`,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* Subtle Twinkling Starlight (Starlit Shrine) */}
      {ambientEffects && theme.ambientEffect === 'stars' && (
        <div className="absolute inset-0 overflow-hidden">
          {STAR_SEEDS.map((s, idx) => (
            <span
              key={idx}
              className="star-twinkle"
              style={{
                top: s.top,
                left: s.left,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: s.delay,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
