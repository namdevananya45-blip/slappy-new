export type GameState = 'READY' | 'PLAYING' | 'GAME_OVER';

export type Difficulty = 'EASY' | 'CLASSIC' | 'HARDCORE';

export type ThemeMode = 'DAY' | 'NIGHT' | 'SUNSET';

export type BirdSkin = 'CLASSIC' | 'RAVEN' | 'CYBER' | 'PHOENIX';

export type MedalType = 'NONE' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface PipePair {
  x: number;
  topHeight: number;
  bottomHeight: number;
  gap: number;
  passed: boolean;
}

export interface Cloud {
  x: number;
  y: number;
  width: number;
  speed: number;
  scale: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface BirdState {
  x: number;
  y: number;
  vy: number;
  angle: number;
  wingFrame: number;
  wingTimer: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  difficulty: Difficulty;
  theme: ThemeMode;
  skin: BirdSkin;
}

export interface ScoreRecord {
  score: number;
  highScore: number;
  isNewHigh: boolean;
  medal: MedalType;
}
