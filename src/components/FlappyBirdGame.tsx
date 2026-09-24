import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Trophy,
  Award,
  Zap,
  Play,
  Sun,
  Moon,
  Sunset,
  Copy,
  Check,
} from 'lucide-react';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYABLE_HEIGHT,
  BIRD_RADIUS,
  PIPE_WIDTH,
  PIPE_COLLAR_WIDTH,
  PIPE_COLLAR_HEIGHT,
  PIPE_MIN_HEIGHT,
  PIPE_SPAWN_INTERVAL,
  DIFFICULTY_PRESETS,
  MEDAL_THRESHOLDS,
  getMedalForScore,
} from '../game/constants';
import {
  BirdSkin,
  Cloud,
  Difficulty,
  GameState,
  MedalType,
  Particle,
  PipePair,
  ThemeMode,
} from '../game/types';
import { soundManager } from '../game/audio';
import { CanvasRenderer } from '../game/renderer';
import { MASTER_AI_STUDIO_PROMPT } from '../game/prompts';

interface FlappyBirdGameProps {
  onOpenPromptModal?: () => void;
}

export const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({ onOpenPromptModal }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game UI States
  const [gameState, setGameState] = useState<GameState>('READY');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('flappy_ai_studio_highscore');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);
  const [medal, setMedal] = useState<MedalType>('NONE');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('CLASSIC');
  const [theme, setTheme] = useState<ThemeMode>('DAY');
  const [skin, setSkin] = useState<BirdSkin>('CLASSIC');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Mutable Game Loop State in Ref to avoid closure staleness
  const gameRef = useRef<{
    state: GameState;
    score: number;
    highScore: number;
    bird: {
      x: number;
      y: number;
      vy: number;
      angle: number;
      wingFrame: number;
      wingTimer: number;
    };
    pipes: PipePair[];
    pipeSpawnTimer: number;
    clouds: Cloud[];
    particles: Particle[];
    groundOffset: number;
    skylineOffset: number;
    flashAlpha: number;
    gameOverTime: number;
    difficulty: Difficulty;
    theme: ThemeMode;
    skin: BirdSkin;
  }>({
    state: 'READY',
    score: 0,
    highScore: 0,
    bird: {
      x: 90,
      y: 260,
      vy: 0,
      angle: 0,
      wingFrame: 1,
      wingTimer: 0,
    },
    pipes: [],
    pipeSpawnTimer: 0,
    clouds: [
      { x: 20, y: 70, width: 80, speed: 0.35, scale: 0.9 },
      { x: 170, y: 120, width: 90, speed: 0.25, scale: 0.75 },
      { x: 300, y: 55, width: 75, speed: 0.4, scale: 0.85 },
    ],
    particles: [],
    groundOffset: 0,
    skylineOffset: 0,
    flashAlpha: 0,
    gameOverTime: 0,
    difficulty: 'CLASSIC',
    theme: 'DAY',
    skin: 'CLASSIC',
  });

  // Keep ref in sync with latest high score & settings
  useEffect(() => {
    gameRef.current.highScore = highScore;
    gameRef.current.difficulty = difficulty;
    gameRef.current.theme = theme;
    gameRef.current.skin = skin;
  }, [highScore, difficulty, theme, skin]);

  // Audio mute sync
  const toggleSound = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundManager.setMuted(next);
      return next;
    });
  }, []);

  // Spawn pipe helper
  const spawnPipePair = useCallback(() => {
    const diff = DIFFICULTY_PRESETS[gameRef.current.difficulty];
    const gap = diff.gap;
    const maxTop = PLAYABLE_HEIGHT - gap - PIPE_MIN_HEIGHT;
    const topHeight = Math.floor(PIPE_MIN_HEIGHT + Math.random() * (maxTop - PIPE_MIN_HEIGHT));
    const bottomHeight = PLAYABLE_HEIGHT - topHeight - gap;

    gameRef.current.pipes.push({
      x: CANVAS_WIDTH + 10,
      topHeight,
      bottomHeight,
      gap,
      passed: false,
    });
  }, []);

  // Reset Game
  const resetGame = useCallback(() => {
    const g = gameRef.current;
    g.state = 'READY';
    g.score = 0;
    g.bird.x = 90;
    g.bird.y = 260;
    g.bird.vy = 0;
    g.bird.angle = 0;
    g.bird.wingFrame = 1;
    g.pipes = [];
    g.pipeSpawnTimer = 0;
    g.particles = [];
    g.flashAlpha = 0;
    g.gameOverTime = 0;

    setScore(0);
    setIsNewHigh(false);
    setMedal('NONE');
    setGameState('READY');
    soundManager.playSwoosh();
  }, []);

  // Jump / Flap Action
  const triggerFlap = useCallback(() => {
    const g = gameRef.current;
    const diff = DIFFICULTY_PRESETS[g.difficulty];

    if (g.state === 'READY') {
      g.state = 'PLAYING';
      setGameState('PLAYING');
      g.bird.vy = diff.jumpVelocity;
      g.bird.angle = -0.45; // ~ -25 deg
      soundManager.playFlap();
      return;
    }

    if (g.state === 'PLAYING') {
      g.bird.vy = diff.jumpVelocity;
      g.bird.angle = -0.45;
      soundManager.playFlap();

      // Spawn subtle jump wind burst
      for (let i = 0; i < 4; i++) {
        g.particles.push({
          x: g.bird.x - 12 + Math.random() * 4,
          y: g.bird.y + 6 + Math.random() * 6,
          vx: -(1 + Math.random() * 2),
          vy: (Math.random() - 0.5) * 1.5,
          color: 'rgba(255, 255, 255, 0.7)',
          size: 2.5 + Math.random() * 1.5,
          life: 14,
          maxLife: 14,
        });
      }
      return;
    }

    if (g.state === 'GAME_OVER') {
      // Small cooldown of 350ms to prevent accidental immediate restart on double-click
      if (Date.now() - g.gameOverTime > 350) {
        resetGame();
      }
    }
  }, [resetGame]);

  // Handle Game Over
  const handleCollision = useCallback(() => {
    const g = gameRef.current;
    if (g.state !== 'PLAYING') return;

    g.state = 'GAME_OVER';
    g.flashAlpha = 1.0;
    g.gameOverTime = Date.now();
    soundManager.playHit();
    setTimeout(() => soundManager.playDie(), 120);

    const finalScore = g.score;
    const wonMedal = getMedalForScore(finalScore);
    setMedal(wonMedal);

    let isHigh = false;
    if (finalScore > g.highScore) {
      isHigh = true;
      setIsNewHigh(true);
      setHighScore(finalScore);
      try {
        localStorage.setItem('flappy_ai_studio_highscore', finalScore.toString());
      } catch {
        // storage ignored
      }
    } else {
      setIsNewHigh(false);
    }

    setGameState('GAME_OVER');

    // Spawn dramatic impact particles
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 3.5;
      g.particles.push({
        x: g.bird.x,
        y: g.bird.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: i % 2 === 0 ? '#f7d336' : '#ffffff',
        size: 2 + Math.random() * 3,
        life: 25,
        maxLife: 25,
      });
    }
  }, []);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        triggerFlap();
      } else if (e.code === 'KeyM') {
        toggleSound();
      } else if (e.code === 'KeyR' && gameRef.current.state === 'GAME_OVER') {
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerFlap, toggleSound, resetGame]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle High-DPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    const renderer = new CanvasRenderer(ctx);
    let animationId: number;

    const gameLoop = () => {
      const g = gameRef.current;
      const diff = DIFFICULTY_PRESETS[g.difficulty];

      // 1. UPDATE LOGIC
      if (g.state === 'READY') {
        // Gentle bobbing hover
        g.bird.y = 260 + Math.sin(Date.now() / 240) * 6;
        g.bird.angle = 0;
        // Idle wing flapping
        g.bird.wingTimer += 1;
        if (g.bird.wingTimer > 8) {
          g.bird.wingFrame = (g.bird.wingFrame + 1) % 3;
          g.bird.wingTimer = 0;
        }
        // Idle scrolling background & ground
        g.groundOffset += diff.pipeSpeed * 0.7;
        g.skylineOffset += 0.5;
      } else if (g.state === 'PLAYING') {
        // Bird Physics
        g.bird.vy += diff.gravity;
        if (g.bird.vy > 10) g.bird.vy = 10;
        g.bird.y += g.bird.vy;

        // Smooth Angular Tilt
        if (g.bird.vy < 0) {
          // Tilting up on jump
          g.bird.angle = Math.max(-0.48, g.bird.angle - 0.12);
        } else {
          // Progressively nose-dive down
          g.bird.angle = Math.min(1.22, g.bird.angle + 0.045);
        }

        // Active wing flap
        g.bird.wingTimer += 1;
        if (g.bird.wingTimer > 5) {
          g.bird.wingFrame = (g.bird.wingFrame + 1) % 3;
          g.bird.wingTimer = 0;
        }

        // Ceiling collision
        if (g.bird.y - BIRD_RADIUS <= 0) {
          g.bird.y = BIRD_RADIUS;
          g.bird.vy = 0;
        }

        // Ground collision
        if (g.bird.y + BIRD_RADIUS >= PLAYABLE_HEIGHT) {
          g.bird.y = PLAYABLE_HEIGHT - BIRD_RADIUS;
          handleCollision();
        }

        // Pipe spawning
        g.pipeSpawnTimer += 1;
        if (g.pipeSpawnTimer >= PIPE_SPAWN_INTERVAL) {
          spawnPipePair();
          g.pipeSpawnTimer = 0;
        }

        // Update pipes & collisions
        const collarOffset = (PIPE_COLLAR_WIDTH - PIPE_WIDTH) / 2;
        for (let i = g.pipes.length - 1; i >= 0; i--) {
          const pipe = g.pipes[i];
          pipe.x -= diff.pipeSpeed;

          // Check if bird passed pipe for score
          if (!pipe.passed && pipe.x + PIPE_WIDTH < g.bird.x) {
            pipe.passed = true;
            g.score += 1;
            setScore(g.score);
            soundManager.playScore();

            // Spawn celebration sparkle
            g.particles.push({
              x: pipe.x + PIPE_WIDTH / 2,
              y: pipe.topHeight + pipe.gap / 2,
              vx: 0,
              vy: -0.8,
              color: '#fbbf24',
              size: 4,
              life: 18,
              maxLife: 18,
            });
          }

          // Pipe collision boxes
          // Top pipe shaft: (pipe.x, 0, PIPE_WIDTH, pipe.topHeight - PIPE_COLLAR_HEIGHT)
          // Top collar: (pipe.x - collarOffset, pipe.topHeight - PIPE_COLLAR_HEIGHT, PIPE_COLLAR_WIDTH, PIPE_COLLAR_HEIGHT)
          // Bottom collar: (pipe.x - collarOffset, PLAYABLE_HEIGHT - pipe.bottomHeight, PIPE_COLLAR_WIDTH, PIPE_COLLAR_HEIGHT)
          // Bottom pipe shaft: (pipe.x, PLAYABLE_HEIGHT - pipe.bottomHeight + PIPE_COLLAR_HEIGHT, PIPE_WIDTH, pipe.bottomHeight)

          const birdBox = {
            left: g.bird.x - BIRD_RADIUS + 2, // 2px grace window
            right: g.bird.x + BIRD_RADIUS - 2,
            top: g.bird.y - BIRD_RADIUS + 2,
            bottom: g.bird.y + BIRD_RADIUS - 2,
          };

          // Check horizontal overlap with collar bounds
          const collarLeft = pipe.x - collarOffset;
          const collarRight = pipe.x + PIPE_WIDTH + collarOffset;

          if (birdBox.right > collarLeft && birdBox.left < collarRight) {
            // In horizontal range of the pipe pair
            const topPipeLimit = pipe.topHeight;
            const bottomPipeLimit = PLAYABLE_HEIGHT - pipe.bottomHeight;

            if (birdBox.top < topPipeLimit || birdBox.bottom > bottomPipeLimit) {
              handleCollision();
            }
          }

          // Remove offscreen pipes
          if (pipe.x < -PIPE_COLLAR_WIDTH - 20) {
            g.pipes.splice(i, 1);
          }
        }

        // Scroll ground and skyline
        g.groundOffset += diff.pipeSpeed;
        g.skylineOffset += diff.pipeSpeed * 0.4;
      } else if (g.state === 'GAME_OVER') {
        // Fall to the ground if in mid-air
        if (g.bird.y + BIRD_RADIUS < PLAYABLE_HEIGHT) {
          g.bird.vy += 0.4;
          g.bird.y += g.bird.vy;
          g.bird.angle = Math.min(1.4, g.bird.angle + 0.08);
          if (g.bird.y + BIRD_RADIUS >= PLAYABLE_HEIGHT) {
            g.bird.y = PLAYABLE_HEIGHT - BIRD_RADIUS;
            g.bird.vy = 0;
          }
        }
      }

      // Parallax Clouds Update
      for (const cloud of g.clouds) {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.width * cloud.scale < -30) {
          cloud.x = CANVAS_WIDTH + 20;
          cloud.y = 40 + Math.random() * 110;
        }
      }

      // Particles Update
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        if (p.life <= 0) {
          g.particles.splice(i, 1);
        }
      }

      // Screen Flash Fade
      if (g.flashAlpha > 0) {
        g.flashAlpha = Math.max(0, g.flashAlpha - 0.08);
      }

      // 2. RENDER STAGE
      renderer.clear();
      renderer.drawBackground(g.theme, g.clouds, g.skylineOffset);
      renderer.drawPipes(g.pipes, g.theme);
      renderer.drawGround(g.groundOffset, g.theme);
      renderer.drawBird(g.bird.x, g.bird.y, g.bird.angle, g.bird.wingFrame, g.skin);
      renderer.drawParticles(g.particles);
      renderer.drawFlash(g.flashAlpha);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [handleCollision, spawnPipePair]);

  // Copy Master Prompt Handler
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(MASTER_AI_STUDIO_PROMPT);
    setCopiedPrompt(true);
    soundManager.playScore();
    setTimeout(() => setCopiedPrompt(false), 2400);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Game Header Controls */}
      <div className="w-full max-w-[360px] flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          {/* Theme toggles */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setTheme('DAY')}
              title="Day Mode"
              className={`p-1.5 rounded transition-colors ${
                theme === 'DAY' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('SUNSET')}
              title="Sunset Mode"
              className={`p-1.5 rounded transition-colors ${
                theme === 'SUNSET' ? 'bg-orange-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('NIGHT')}
              title="Night Mode"
              className={`p-1.5 rounded transition-colors ${
                theme === 'NIGHT' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* High Score Pill */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>BEST</span>
          <span className="font-bold text-amber-300 tabular-nums">{highScore}</span>
        </div>
      </div>

      {/* Canvas Viewport Frame */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 select-none touch-none">
        <canvas
          ref={canvasRef}
          onClick={triggerFlap}
          onTouchStart={(e) => {
            e.preventDefault();
            triggerFlap();
          }}
          className="block cursor-pointer w-[360px] h-[600px]"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* LIVE IN-GAME SCORE OVERLAY (During PLAYING state) */}
        {gameState === 'PLAYING' && (
          <div className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none">
            <span
              className="text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.85)] font-mono tabular-nums select-none"
              style={{
                WebkitTextStroke: '2px #1e293b',
              }}
            >
              {score}
            </span>
          </div>
        )}

        {/* READY / MENU OVERLAY */}
        {gameState === 'READY' && (
          <div
            onClick={triggerFlap}
            className="absolute inset-0 flex flex-col items-center justify-between p-6 bg-black/15 cursor-pointer backdrop-blur-[1px]"
          >
            {/* Top title */}
            <div className="text-center pt-8 animate-bounce">
              <h1 className="text-4xl font-extrabold tracking-wider text-amber-400 drop-shadow-[0_4px_0_#92400e] uppercase">
                Flappy Bird
              </h1>
              <p className="text-xs font-semibold text-white/90 drop-shadow mt-1">
                Authentic 2013 Arcade Physics
              </p>
            </div>

            {/* Tap instruction */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center animate-pulse">
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              </div>
              <div className="text-center">
                <span className="inline-block bg-slate-950/80 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 shadow-lg tracking-wide uppercase">
                  Tap or Space to Flap
                </span>
                <p className="text-[11px] text-white/80 drop-shadow mt-1">
                  Mouse Click · Spacebar · Touch
                </p>
              </div>
            </div>

            {/* Bottom difficulty badge */}
            <div className="pb-8 text-center">
              <span className="text-[11px] font-mono text-slate-900 bg-amber-400/90 font-semibold px-2.5 py-1 rounded shadow">
                Mode: {DIFFICULTY_PRESETS[difficulty].label}
              </span>
            </div>
          </div>
        )}

        {/* GAME OVER SCORECARD OVERLAY */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
            {/* Game Over Title */}
            <h2 className="text-3xl font-black text-rose-500 uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-4">
              Game Over
            </h2>

            {/* Retro Scorecard Box */}
            <div className="w-full max-w-[290px] bg-amber-100 border-4 border-amber-800 rounded-xl p-4 shadow-2xl text-slate-900 mb-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-amber-800/20">
                {/* Medal Box */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    Medal
                  </span>
                  <div className="w-14 h-14 rounded-full border-2 border-amber-800/40 bg-amber-200/80 flex items-center justify-center mt-1 shadow-inner">
                    {medal === 'PLATINUM' && (
                      <Award className="w-8 h-8 text-slate-300 drop-shadow" />
                    )}
                    {medal === 'GOLD' && (
                      <Award className="w-8 h-8 text-amber-500 drop-shadow fill-amber-400" />
                    )}
                    {medal === 'SILVER' && (
                      <Award className="w-8 h-8 text-slate-400 drop-shadow fill-slate-300" />
                    )}
                    {medal === 'BRONZE' && (
                      <Award className="w-8 h-8 text-amber-700 drop-shadow fill-amber-600" />
                    )}
                    {medal === 'NONE' && (
                      <span className="text-[10px] text-amber-800/50 font-bold">—</span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-amber-900 mt-1 capitalize">
                    {medal !== 'NONE' ? medal.toLowerCase() : 'None'}
                  </span>
                </div>

                {/* Scores breakdown */}
                <div className="flex flex-col items-end gap-2 text-right pl-3">
                  <div>
                    <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                      Score
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono tabular-nums leading-none">
                      {score}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 justify-end">
                      {isNewHigh && (
                        <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                          New!
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                        Best
                      </span>
                    </div>
                    <div className="text-2xl font-black text-amber-700 font-mono tabular-nums leading-none">
                      {highScore}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medal Guidance hint */}
              <div className="pt-2 text-[10px] text-center text-amber-900/70">
                {score < 10 && 'Score 10+ points for Bronze Medal'}
                {score >= 10 && score < 20 && 'Nice! Score 20+ for Silver Medal'}
                {score >= 20 && score < 30 && 'Great! Score 30+ for Gold Medal'}
                {score >= 30 && score < 40 && 'Master tier! Score 40+ for Platinum'}
                {score >= 40 && 'Flappy Legend! Platinum tier unlocked!'}
              </div>
            </div>

            {/* Restart Button */}
            <div className="flex flex-col items-center gap-2 w-full max-w-[290px]">
              <button
                onClick={resetGame}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold text-sm rounded-xl border-b-4 border-emerald-700 shadow-lg transition-transform"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again (Space)</span>
              </button>

              {/* Quick Prompt Copy Trigger */}
              <button
                onClick={handleCopyPrompt}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 active:scale-98 text-amber-400 hover:text-amber-300 font-mono text-xs rounded-xl border border-slate-700 transition-colors"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Prompt Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy 1-Shot AI Studio Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls & Skin Customizer Strip */}
      <div className="w-full max-w-[360px] mt-4 flex flex-col gap-3">
        {/* Difficulty Selector */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          <span className="text-slate-400 font-medium px-2 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Difficulty:</span>
          </span>
          <div className="flex items-center gap-1">
            {(['EASY', 'CLASSIC', 'HARDCORE'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  if (gameState === 'READY') resetGame();
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  difficulty === d
                    ? 'bg-amber-400 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d === 'EASY' ? 'Easy' : d === 'CLASSIC' ? 'Classic' : 'Hardcore'}
              </button>
            ))}
          </div>
        </div>

        {/* Bird Skin Selector */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          <span className="text-slate-400 font-medium px-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Skin:</span>
          </span>
          <div className="flex items-center gap-1">
            {[
              { id: 'CLASSIC', label: 'Classic', color: 'bg-amber-400' },
              { id: 'RAVEN', label: 'Raven', color: 'bg-slate-700' },
              { id: 'CYBER', label: 'Cyber', color: 'bg-cyan-400' },
              { id: 'PHOENIX', label: 'Phoenix', color: 'bg-rose-500' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSkin(s.id as BirdSkin)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg font-medium transition-all ${
                  skin === s.id
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
