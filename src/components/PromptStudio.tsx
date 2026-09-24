import React, { useState } from 'react';
import {
  Copy,
  Check,
  Code,
  Terminal,
  Sparkles,
  Sliders,
  ShieldCheck,
  Layers,
  Wand2,
  ExternalLink,
} from 'lucide-react';
import {
  MASTER_AI_STUDIO_PROMPT,
  PROMPT_TEMPLATES,
  PROMPT_ENGINEERING_SECRETS,
  PromptTemplate,
} from '../game/prompts';
import { soundManager } from '../game/audio';

export const PromptStudio: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('master-one-shot');
  const [copied, setCopied] = useState<boolean>(false);

  // Dynamic customization options
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);
  const [includeMedals, setIncludeMedals] = useState<boolean>(true);
  const [includeDifficulties, setIncludeDifficulties] = useState<boolean>(true);
  const [includeThemes, setIncludeThemes] = useState<boolean>(true);
  const [includeScrollLock, setIncludeScrollLock] = useState<boolean>(true);

  const currentTemplate: PromptTemplate =
    PROMPT_TEMPLATES.find((t) => t.id === selectedTemplateId) || PROMPT_TEMPLATES[0];

  // Generate customized prompt when on master template
  const getDisplayPrompt = (): string => {
    if (selectedTemplateId !== 'master-one-shot') {
      return currentTemplate.prompt;
    }

    let customPrompt = `Build a complete, production-ready, fully playable Flappy Bird arcade game in React and TypeScript that runs directly in the browser with 60 FPS Canvas rendering, authentic physics, and zero external asset dependencies.\n\n`;

    customPrompt += `### CRITICAL ASSET & ZERO-404 CONSTRAINTS\n`;
    customPrompt += `1. DO NOT load external image files, sprite sheets, or CDN URLs. Render all game assets (bird with animated flapping wings, 3D cylindrical green pipes with rim collars, scrolling grass ground, parallax skyline, and clouds) procedurally on an HTML5 <canvas>.\n`;

    if (includeAudio) {
      customPrompt += `2. DO NOT use external audio URLs (no remote .mp3 or .wav files). Synthesize all retro arcade sound effects dynamically using the browser's native Web Audio API (OscillatorNode and GainNode):\n`;
      customPrompt += `   - Flap sound: Frequency sweep from 360Hz to 620Hz over 0.08s (sine wave).\n`;
      customPrompt += `   - Score point chime: Crisp two-tone chime (987.77Hz / B5 followed by 1318.51Hz / E6).\n`;
      customPrompt += `   - Collision/Hit: Low-frequency sawtooth crunch from 220Hz down to 45Hz.\n`;
      customPrompt += `   - Fall/Die: Descending pitch whistle slide from 480Hz down to 120Hz.\n`;
      customPrompt += `   - Swoosh: Gentle pitch sweep for menu transitions.\n`;
      customPrompt += `   Include a toggle button to mute/unmute audio.\n`;
    } else {
      customPrompt += `2. Keep audio silent or optional with a mute switch.\n`;
    }

    customPrompt += `\n### GAMEPLAY & PHYSICS SPECIFICATIONS\n`;
    customPrompt += `- Canvas dimensions: 360px wide by 600px high (centered and responsive on both mobile and desktop screens).\n`;
    customPrompt += `- Gravity: 0.28 per frame.\n`;
    customPrompt += `- Jump / Flap impulse: -6.4 vertical velocity.\n`;
    customPrompt += `- Terminal fall velocity: 10.0 max.\n`;
    customPrompt += `- Angular tilt: Bird smoothly rotates upward to -25° on flap, then gradually tilts downward to +70° during freefall.\n`;
    customPrompt += `- Pipe mechanics: Width 64px (with 72px rim collar), 125px vertical opening gap, ~100 frames spawn interval, 2.2px/frame scrolling speed, and authentic 3D cylindrical lighting.\n`;
    customPrompt += `- Ground: Height 100px with scrolling grass edge and dirt base.\n`;
    customPrompt += `- Collision Detection: Tight circular bounding box for bird (radius ~12px) against pipe rectangles and the ground, with a generous 2px grace window.\n`;

    if (includeDifficulties) {
      customPrompt += `- Difficulty options: Breeze (Easy - 150px gap, 0.22 gravity), Classic (Authentic 2013 physics), Hardcore (105px gap, 0.35 gravity).\n`;
    }

    if (includeThemes) {
      customPrompt += `- Themes: Day sky, Sunset amber, and Midnight sky with crescent moon and stars.\n`;
    }

    customPrompt += `\n### GAME STATES & USER INTERFACE\n`;
    customPrompt += `Implement a clean state machine:\n`;
    customPrompt += `1. 'READY' / MENU: Bird hovers with idle wing flaps, instruction prompt ("TAP OR PRESS SPACE TO FLAP"), and high score badge.\n`;
    customPrompt += `2. 'PLAYING': 60 FPS requestAnimationFrame loop with live retro score counter at top-center.\n`;
    customPrompt += `3. 'GAME_OVER': Screen flash (white overlay 100ms) on death. Scorecard showing Score, High Score (persisted in localStorage)`;

    if (includeMedals) {
      customPrompt += `, and Medals earned: Bronze (10+), Silver (20+), Gold (30+), Platinum (40+)`;
    }

    customPrompt += `, and a "PLAY AGAIN" button that restarts immediately.\n\n`;

    customPrompt += `### INPUT CONTROLS & RESPONSIVENESS\n`;
    customPrompt += `- Support Spacebar, Arrow Up key, Mouse click, and Mobile touch tap on the canvas.\n`;
    if (includeScrollLock) {
      customPrompt += `- Call event.preventDefault() on Space and Arrow keys to prevent the web page from scrolling while playing.\n`;
    }
    customPrompt += `- High-DPI canvas scaling using window.devicePixelRatio for crisp graphics on Retina screens.`;

    return customPrompt;
  };

  const currentPromptText = getDisplayPrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPromptText);
    setCopied(true);
    soundManager.playScore();
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>TESTED & VERIFIED PROMPT ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              The 1-Shot Google AI Studio Prompt
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Copy this exact prompt and paste it directly into Google AI Studio. It is
              engineered with zero external assets, Web Audio API sound synthesis, and calibrated
              2013 arcade physics so the model compiles a working game in a single turn.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Master Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero 404s / No Broken URLs</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Web Audio API Synthesizer</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Layers className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Procedural Canvas Graphics</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Wand2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>1-Turn Build Guarantee</span>
          </div>
        </div>
      </div>

      {/* Prompt Variations Tabs & Options */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Template Selectors */}
        <div className="flex border-b border-slate-800 overflow-x-auto p-2 gap-2 bg-slate-950/60">
          {PROMPT_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setSelectedTemplateId(tmpl.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTemplateId === tmpl.id
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>{tmpl.title}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  selectedTemplateId === tmpl.id
                    ? 'bg-slate-950 text-amber-300'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tmpl.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Master Prompt Customizer Bar (Only for master template) */}
        {selectedTemplateId === 'master-one-shot' && (
          <div className="p-4 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Customize Prompt Features:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-slate-300">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeAudio}
                  onChange={(e) => setIncludeAudio(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-400"
                />
                <span>Web Audio Synth</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeMedals}
                  onChange={(e) => setIncludeMedals(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-400"
                />
                <span>Scorecard Medals</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeDifficulties}
                  onChange={(e) => setIncludeDifficulties(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-400"
                />
                <span>3 Difficulties</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeThemes}
                  onChange={(e) => setIncludeThemes(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-400"
                />
                <span>Day/Night Themes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeScrollLock}
                  onChange={(e) => setIncludeScrollLock(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-400"
                />
                <span>Scroll Lock</span>
              </label>
            </div>
          </div>
        )}

        {/* Prompt Code Block Container */}
        <div className="relative group">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-amber-400" />
              <span>Target: {currentTemplate.targetEnvironment}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{currentPromptText.length} characters</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <pre className="p-5 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto max-h-[460px] whitespace-pre-wrap select-all bg-slate-950/90 scrollbar-thin scrollbar-thumb-slate-800">
            {currentPromptText}
          </pre>
        </div>

        {/* Key Highlights of this Prompt */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-300 mb-2">Key Highlights of this Prompt:</div>
          <div className="flex flex-wrap gap-2">
            {currentTemplate.keyHighlights.map((highlight, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60"
              >
                ✓ {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Engineering Secrets Section */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Why Standard AI Prompts Fail & Why This One Succeeds
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            The mathematical and architectural constraints that guarantee a flawless 1-turn generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROMPT_ENGINEERING_SECRETS.map((item, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-300 mb-2">
                <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-mono font-bold">
                  {index + 1}
                </span>
                <h4>{item.secret}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-7">{item.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
