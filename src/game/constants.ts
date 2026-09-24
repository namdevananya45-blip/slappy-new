import { Difficulty, ThemeMode, BirdSkin, MedalType } from './types';

export const CANVAS_WIDTH = 360;
export const CANVAS_HEIGHT = 600;
export const GROUND_HEIGHT = 100;
export const PLAYABLE_HEIGHT = CANVAS_HEIGHT - GROUND_HEIGHT;

export const BIRD_WIDTH = 34;
export const BIRD_HEIGHT = 24;
export const BIRD_RADIUS = 12;

export const PIPE_WIDTH = 64;
export const PIPE_COLLAR_WIDTH = 72;
export const PIPE_COLLAR_HEIGHT = 26;
export const PIPE_MIN_HEIGHT = 50;
export const PIPE_SPAWN_INTERVAL = 100; // frames (~1.6 seconds at 60fps)

export const DIFFICULTY_PRESETS: Record<
  Difficulty,
  {
    gravity: number;
    jumpVelocity: number;
    pipeSpeed: number;
    gap: number;
    label: string;
    description: string;
  }
> = {
  EASY: {
    gravity: 0.22,
    jumpVelocity: -5.8,
    pipeSpeed: 1.8,
    gap: 150,
    label: 'Breeze (Easy)',
    description: 'Wider gaps, softer gravity, relaxed pace.',
  },
  CLASSIC: {
    gravity: 0.28,
    jumpVelocity: -6.4,
    pipeSpeed: 2.2,
    gap: 125,
    label: 'Authentic (Classic)',
    description: 'The exact timing and physics of the 2013 original.',
  },
  HARDCORE: {
    gravity: 0.35,
    jumpVelocity: -7.2,
    pipeSpeed: 2.8,
    gap: 105,
    label: 'Hardcore',
    description: 'Tight pipe clearances and rapid downward pull.',
  },
};

export const THEME_CONFIG: Record<
  ThemeMode,
  {
    name: string;
    skyTop: string;
    skyBottom: string;
    cityFar: string;
    cityNear: string;
    cloudColor: string;
    treeColor: string;
    pipeBody: { light: string; mid: string; dark: string; border: string; highlight: string };
    ground: { top: string; stripe1: string; stripe2: string; soil: string };
  }
> = {
  DAY: {
    name: 'Sunny Day',
    skyTop: '#4ec0ca',
    skyBottom: '#9be2ea',
    cityFar: '#bde7bd',
    cityNear: '#80cf80',
    cloudColor: 'rgba(255, 255, 255, 0.85)',
    treeColor: '#4ca355',
    pipeBody: {
      light: '#73bf2e',
      mid: '#5c9e22',
      dark: '#417116',
      border: '#2e4e10',
      highlight: '#99e048',
    },
    ground: {
      top: '#73bf2e',
      stripe1: '#99e048',
      stripe2: '#5c9e22',
      soil: '#ded895',
    },
  },
  NIGHT: {
    name: 'Midnight Sky',
    skyTop: '#0b1329',
    skyBottom: '#1c2b52',
    cityFar: '#16203d',
    cityNear: '#1f2e54',
    cloudColor: 'rgba(90, 115, 160, 0.4)',
    treeColor: '#1a332d',
    pipeBody: {
      light: '#3d7a46',
      mid: '#2b5832',
      dark: '#1c3d23',
      border: '#0e2313',
      highlight: '#529e5e',
    },
    ground: {
      top: '#2b5832',
      stripe1: '#3d7a46',
      stripe2: '#1c3d23',
      soil: '#535b6b',
    },
  },
  SUNSET: {
    name: 'Golden Sunset',
    skyTop: '#d95a53',
    skyBottom: '#f3b061',
    cityFar: '#a35056',
    cityNear: '#73323e',
    cloudColor: 'rgba(255, 225, 190, 0.65)',
    treeColor: '#6e3845',
    pipeBody: {
      light: '#e07a3c',
      mid: '#ba5824',
      dark: '#873a11',
      border: '#572208',
      highlight: '#f79f65',
    },
    ground: {
      top: '#ba5824',
      stripe1: '#e07a3c',
      stripe2: '#873a11',
      soil: '#c9966b',
    },
  },
};

export const BIRD_SKINS: Record<
  BirdSkin,
  {
    name: string;
    body: string;
    belly: string;
    wing: string;
    wingEdge: string;
    beak: string;
    eyeOutline: string;
    cheek: string;
  }
> = {
  CLASSIC: {
    name: 'Faby Yellow',
    body: '#f7d336',
    belly: '#fdf5c8',
    wing: '#ffffff',
    wingEdge: '#de9b21',
    beak: '#f75628',
    eyeOutline: '#1a1a1a',
    cheek: '#fa7b55',
  },
  RAVEN: {
    name: 'Shadow Raven',
    body: '#2b2d42',
    belly: '#474966',
    wing: '#181926',
    wingEdge: '#6b6e94',
    beak: '#f39c12',
    eyeOutline: '#ffffff',
    cheek: '#54587a',
  },
  CYBER: {
    name: 'Neon Cyber',
    body: '#00e5ff',
    belly: '#a5f3fc',
    wing: '#0284c7',
    wingEdge: '#0369a1',
    beak: '#ff007f',
    eyeOutline: '#0f172a',
    cheek: '#ec4899',
  },
  PHOENIX: {
    name: 'Phoenix Crimson',
    body: '#ef4444',
    belly: '#fed7aa',
    wing: '#f59e0b',
    wingEdge: '#b45309',
    beak: '#fbbf24',
    eyeOutline: '#18181b',
    cheek: '#dc2626',
  },
};

export const MEDAL_THRESHOLDS: { type: MedalType; minScore: number; color: string; label: string }[] = [
  { type: 'PLATINUM', minScore: 40, color: '#e5e7eb', label: 'Platinum Medal' },
  { type: 'GOLD', minScore: 30, color: '#fbbf24', label: 'Gold Medal' },
  { type: 'SILVER', minScore: 20, color: '#cbd5e1', label: 'Silver Medal' },
  { type: 'BRONZE', minScore: 10, color: '#d97706', label: 'Bronze Medal' },
];

export function getMedalForScore(score: number): MedalType {
  for (const threshold of MEDAL_THRESHOLDS) {
    if (score >= threshold.minScore) {
      return threshold.type;
    }
  }
  return 'NONE';
}
