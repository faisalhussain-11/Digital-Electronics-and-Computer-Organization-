export type ThemeId =
  | 'academic-white'
  | 'cherry-blossom'
  | 'alpine-meadow'
  | 'golden-sunset'
  | 'anime-lofi'
  | 'anime-starlight';

export interface AppTheme {
  id: ThemeId;
  name: string;
  category: 'Minimal' | 'Scenery' | 'Anime';
  tagline: string;
  isDark: boolean;
  imageUrl?: string;
  imageScaleClass?: string;
  fallbackGradient: string;
  swatchAccent: string;
  swatchBg: string;
  ambientEffect: 'none' | 'petals' | 'stars';
}

export const APP_THEMES: AppTheme[] = [
  {
    id: 'academic-white',
    name: 'Academic White',
    category: 'Minimal',
    tagline: 'Pure distraction-free monograph paper with cobalt ink.',
    isDark: false,
    fallbackGradient: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    swatchAccent: '#1D4ED8',
    swatchBg: '#FFFFFF',
    ambientEffect: 'none',
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    category: 'Scenery',
    tagline: 'Sunlit Kyoto sakura path with drifting pink petals & rose accents.',
    isDark: false,
    imageUrl: '/src/assets/images/theme_cherry_blossom_1795158291821.jpg',
    fallbackGradient: 'linear-gradient(135deg, #fff1f5 0%, #fce7f3 50%, #e0f2fe 100%)',
    swatchAccent: '#BE185D',
    swatchBg: '#FFF5F8',
    ambientEffect: 'petals',
  },
  {
    id: 'alpine-meadow',
    name: 'Alpine Meadow',
    category: 'Scenery',
    tagline: 'Peaceful mountain lake & pine valley in painterly daylight.',
    isDark: false,
    imageUrl: '/src/assets/images/theme_alpine_meadow_1795158293184.jpg',
    fallbackGradient: 'linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 55%, #f0fdf4 100%)',
    swatchAccent: '#047857',
    swatchBg: '#F4FBF8',
    ambientEffect: 'none',
  },
  {
    id: 'golden-sunset',
    name: 'Golden Sunset',
    category: 'Scenery',
    tagline: 'Warm coastal amber horizon with calm twilight clouds.',
    isDark: false,
    imageUrl: '/src/assets/images/theme_golden_sunset_1795158291279.jpg',
    imageScaleClass: 'scale-105',
    fallbackGradient: 'linear-gradient(135deg, #fffbeb 0%, #ffedd5 50%, #f3e8ff 100%)',
    swatchAccent: '#B45309',
    swatchBg: '#FFFBF5',
    ambientEffect: 'none',
  },
  {
    id: 'anime-lofi',
    name: 'Lo-Fi Anime Study',
    category: 'Anime',
    tagline: 'Rainy dusk Tokyo study room with warm lamp glow & deep indigo slate.',
    isDark: true,
    imageUrl: '/src/assets/images/theme_anime_lofi_1795158303630.jpg',
    fallbackGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #172554 100%)',
    swatchAccent: '#38BDF8',
    swatchBg: '#0F172A',
    ambientEffect: 'none',
  },
  {
    id: 'anime-starlight',
    name: 'Starlit Anime Shrine',
    category: 'Anime',
    tagline: 'Comet-streaked Milky Way over a lantern-lit hilltop shrine.',
    isDark: true,
    imageUrl: '/src/assets/images/theme_anime_starlight_1795158292588.jpg',
    fallbackGradient: 'linear-gradient(135deg, #090d1f 0%, #1e1b4b 55%, #0f172a 100%)',
    swatchAccent: '#A78BFA',
    swatchBg: '#0B1022',
    ambientEffect: 'stars',
  },
];

export function getThemeById(id: ThemeId): AppTheme {
  return APP_THEMES.find((t) => t.id === id) ?? APP_THEMES[0];
}
