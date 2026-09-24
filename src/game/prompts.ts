export interface PromptTemplate {
  id: string;
  title: string;
  badge: string;
  description: string;
  targetEnvironment: string;
  prompt: string;
  keyHighlights: string[];
}

export const MASTER_AI_STUDIO_PROMPT = `Build a complete, production-ready, fully playable Flappy Bird arcade game in React and TypeScript that runs directly in the browser with 60 FPS Canvas rendering, authentic physics, and zero external asset dependencies.

### CRITICAL ASSET & AUDIO CONSTRAINTS (Zero 404s, Zero Broken URLs)
1. DO NOT load external image files, sprite sheets, or CDN URLs. Render all game assets (bird with animated flapping wings, 3D cylindrical green pipes with rim collars, scrolling grass ground, parallax skyline, and clouds) procedurally on an HTML5 <canvas>.
2. DO NOT use external audio URLs (no remote .mp3 or .wav files). Synthesize all retro arcade sound effects dynamically using the browser's native Web Audio API (OscillatorNode and GainNode):
   - Flap sound: Frequency sweep from 360Hz to 620Hz over 0.08s (sine wave).
   - Score point chime: Crisp two-tone chime (987.77Hz / B5 followed by 1318.51Hz / E6).
   - Collision/Hit: Low-frequency sawtooth crunch from 220Hz down to 45Hz.
   - Fall/Die: Descending pitch whistle slide from 480Hz down to 120Hz.
   - Swoosh: Gentle pitch sweep for menu transitions.
   Include a toggle button to mute/unmute audio.

### GAMEPLAY & PHYSICS SPECIFICATIONS
- Canvas dimensions: 360px wide by 600px high (centered and responsive on both mobile and desktop screens).
- Gravity: 0.28 per frame.
- Jump / Flap impulse: -6.4 vertical velocity.
- Terminal fall velocity: 10.0 max.
- Angular tilt: Bird smoothly rotates upward to -25° on flap, then gradually tilts downward to +70° during freefall.
- Pipe mechanics:
  - Width: 64px, with a wider 72px collar rim at the pipe entrance.
  - Pipe gap: 125px vertical opening.
  - Pipe spawn interval: ~100 frames (~1.6 seconds).
  - Pipe scrolling speed: 2.2px per frame.
  - Authentic 3D lighting: green highlights, midtones, dark borders, and inner shadow lines.
- Ground: Height 100px with scrolling green grass edge, angled stripes, and textured dirt base.
- Collision Detection: Tight circular bounding box for bird (radius ~12px) against pipe rectangles and the ground, with a generous 2px grace window to feel arcade-authentic.

### GAME STATES & USER INTERFACE
Implement a clean state machine:
1. 'READY' / MENU:
   - Bird gently hovers in place with idle wing flapping.
   - Clear animated instructions: "TAP OR PRESS SPACE TO FLAP".
   - Current high score badge.
2. 'PLAYING':
   - Active physics loop running via requestAnimationFrame.
   - Live score counter in prominent retro arcade numbers at top-center.
3. 'GAME_OVER':
   - Brief screen flash (white overlay 100ms) on death.
   - Retro scorecard modal showing:
     - Final Score
     - Best High Score (persisted in localStorage)
     - "NEW" banner if high score was broken
     - Medal earned based on performance:
       * Bronze (10+ points)
       * Silver (20+ points)
       * Gold (30+ points)
       * Platinum (40+ points)
   - "PLAY AGAIN" button that restarts immediately without reloading the page.

### INPUT CONTROLS & RESPONSIVENESS
- Support Spacebar, Arrow Up key, Mouse click, and Mobile touch tap on the canvas.
- Call event.preventDefault() on Space and Arrow keys to prevent the web page from scrolling while playing.
- Seamless touch responsiveness with touch-action: manipulation.
- High-DPI canvas scaling using window.devicePixelRatio for crisp graphics on Retina screens.`;

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'master-one-shot',
    title: 'The Master 1-Shot Prompt (Recommended)',
    badge: 'Best for Google AI Studio',
    description:
      'Engineered specifically to guarantee Google AI Studio builds the complete, fully functioning Flappy Bird game on the first prompt with zero errors.',
    targetEnvironment: 'Google AI Studio (React + Vite + Canvas + Web Audio)',
    prompt: MASTER_AI_STUDIO_PROMPT,
    keyHighlights: [
      'Zero external assets (bans broken image/audio URLs)',
      'Native Web Audio API procedural sound synthesizer',
      'Exact 2013 arcade physics & angular tilt formula',
      'High score persistence in localStorage + 4 Medal tiers',
      'Responsive touch + keyboard with preventDefault() scroll lock',
    ],
  },
  {
    id: 'retro-8bit',
    title: 'Retro 8-Bit GameBoy / Arcade Prompt',
    badge: 'Chiptune & Scanlines',
    description:
      'A nostalgic 8-bit retro arcade version with chiptune square-wave sound effects, CRT scanline overlay, pixel-art scaling, and monochrome / green-tint options.',
    targetEnvironment: 'Google AI Studio (React + TypeScript)',
    prompt: `Create an authentic 8-Bit Retro Arcade Flappy Bird game in React and TypeScript with chiptune sound synthesis and CRT scanline aesthetics.

Key Requirements:
1. AUDIO: Use the Web Audio API with square wave and noise oscillators to create genuine 8-bit chiptune sound effects (jump bloop, coin ding, crunch noise hit). Provide a retro sound toggle.
2. GRAPHICS: Procedural 8-bit pixel art drawn to a 320x480 canvas scaled up with image-rendering: pixelated. Render retro pixel bird, brick pipes, scrolling dithered ground, and distant pixel mountains. Add a toggleable CRT scanline filter overlay with slight screen curvature.
3. CONTROLS: Spacebar, W key, click, and mobile tap. Prevent default window scrolling.
4. GAMEPLAY: Authentic physics (gravity: 0.3, flap impulse: -6.5), pipes with 120px gap, score multiplier, high score stored in localStorage, and retro "INSERT COIN" / "GAME OVER" typography.
5. NO EXTERNAL ASSETS: All sounds and visual sprites must be generated procedurally in code with zero external network requests.`,
    keyHighlights: [
      'Chiptune square wave Web Audio synthesizer',
      'CRT scanline overlay and pixel-art rendering',
      '8-bit color palette and retro arcade scoreboard',
      'Zero external asset dependencies',
    ],
  },
  {
    id: 'cyberpunk-neon',
    title: 'Cyberpunk Synthwave Flappy Prompt',
    badge: 'Neon Glow & Synthwave',
    description:
      'A modern futuristic neon remake with neon pipes, particle trails, glowing laser bird, synthwave sound effects, and pulsing electronic backdrops.',
    targetEnvironment: 'Google AI Studio (React + TypeScript)',
    prompt: `Build a futuristic Cyberpunk Synthwave Flappy Bird game in React and TypeScript with canvas glow effects, particle trails, and synthesized synthwave sound effects.

Key Requirements:
1. VISUALS: Deep dark sci-fi background with animated glowing perspective grid horizon. Neon cyan, magenta, and electric purple aesthetic. Bird is a cyber jet/drone leaving a glowing particle trail (Canvas shadowBlur and shadowColor). Pipes are glowing laser gate columns with animated energy beams.
2. SYNTHESIZED SOUNDS: Synthesize futuristic sci-fi sound effects using Web Audio API (FM-style laser flap, synth chime score point, electric buzz death).
3. MECHANICS: Classic Flappy timing with fluid smooth rotation, difficulty tiers (Hyperdrive mode), dynamic combo multiplier for tight gap maneuvers, and screen shake on crash.
4. HIGH SCORE & STATS: LocalStorage persistence, best score, total flaps counter, and unlockable neon drone skins.
5. ZERO ASSET URLS: All effects, audio, and visuals must be 100% self-contained in TypeScript/Canvas with no remote images or sound files.`,
    keyHighlights: [
      'Canvas shadowBlur neon bloom & glowing laser gates',
      'Dynamic particle exhaust trail system',
      'Synthwave FM audio synthesis',
      'Screen shake and combo multipliers',
    ],
  },
  {
    id: 'vanilla-html',
    title: 'Single-File Vanilla HTML5 Prompt',
    badge: 'Zero Build Tools',
    description:
      'A single self-contained index.html file containing HTML, CSS, JavaScript, Canvas renderer, and Web Audio. Runs instantly by double-clicking or pasting into Codepen.',
    targetEnvironment: 'Single index.html file (Browser / Codepen / JSFiddle)',
    prompt: `Generate a complete, self-contained single-file HTML5 Flappy Bird game inside a single index.html file with inline <style> and <script> tags. It must run immediately in any modern browser without any build tools, npm packages, or external CDN assets.

Requirements:
1. Everything inside one file: HTML structure, modern CSS flexbox layout, and JavaScript ES6 game engine.
2. Native Web Audio API for sound effects (flap sweep, score bell, crash noise) - zero audio file dependencies.
3. Canvas 2D procedural rendering for the bird, pipes, ground, parallax background, score counter, and game over medal card - zero image dependencies.
4. Physics: gravity 0.28, jump impulse -6.4, angular tilt with velocity, 125px pipe gaps, 2.2px/frame scroll speed.
5. Controls: Spacebar, Arrow Up, Click, and Touch Tap on mobile with event.preventDefault() to lock page scrolling.
6. LocalStorage high score saving and restart button without page refresh.`,
    keyHighlights: [
      '100% self-contained in a single index.html',
      'Runs without Vite, Node, or npm build steps',
      'Self-synthesizing Web Audio and procedural Canvas',
      'Mobile touch + desktop keyboard friendly',
    ],
  },
];

export const PROMPT_ENGINEERING_SECRETS = [
  {
    secret: 'The Zero-Asset Rule (No Remote URLs)',
    explanation:
      'LLMs often hallucinate dead URLs like "https://example.com/bird.png" or "https://soundbible.com/flap.mp3". When loaded in sandboxed iframe environments, these fail due to CORS, adblockers, or 404s, leaving the user with a broken game. Banning remote URLs and demanding procedural canvas + Web Audio API guarantees 100% runtime reliability.',
  },
  {
    secret: 'Explicit Physics Math Constants',
    explanation:
      'If you just ask an AI for "Flappy Bird physics", it will guess gravity anywhere between 0.05 and 2.0, causing the bird to either float like a balloon or drop like an anvil. By specifying exact numbers (gravity: 0.28, flap: -6.4, gap: 125px, speed: 2.2px), the game immediately feels identical to Dong Nguyen’s 2013 classic.',
  },
  {
    secret: 'The Angular Tilt Formula',
    explanation:
      'Flappy Bird’s iconic feel comes from its rotation: snappy upward tilt (-25°) on flap, followed by a delayed nose-dive (+70°) when falling. Specifying this velocity-driven angle calculation prevents the bird from looking like a flat stiff square sliding up and down.',
  },
  {
    secret: 'Preventing Window Scroll on Spacebar',
    explanation:
      'In a browser iframe, pressing the Spacebar natively scrolls the webpage down. Forcing the AI to bind event.preventDefault() on keydown for Space and Arrow keys prevents frustrating scroll bounce.',
  },
  {
    secret: 'Web Audio API Oscillator Recipes',
    explanation:
      'Telling the AI specifically which oscillator types (sine, triangle, sawtooth) and frequency sweeps (360Hz -> 620Hz) to use ensures crisp, charming arcade sounds without needing any audio libraries or files.',
  },
];
