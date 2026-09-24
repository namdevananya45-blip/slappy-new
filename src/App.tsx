import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FlappyBirdGame } from './components/FlappyBirdGame';
import { PromptStudio } from './components/PromptStudio';
import { PhysicsSpecs } from './components/PhysicsSpecs';
import { StudioGuide } from './components/StudioGuide';
import { Copy, Sparkles, Gamepad2, Code2, BookOpen, ChevronRight } from 'lucide-react';
import { MASTER_AI_STUDIO_PROMPT } from './game/prompts';
import { soundManager } from './game/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<'play' | 'prompt' | 'physics' | 'guide'>('play');
  const [promptCopied, setPromptCopied] = useState<boolean>(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(MASTER_AI_STUDIO_PROMPT);
    setPromptCopied(true);
    soundManager.playScore();
    setTimeout(() => setPromptCopied(false), 2200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Bar Contract (1 Row, 3 Zones) */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center">
        {/* Play Game Tab */}
        {activeTab === 'play' && (
          <div className="w-full flex flex-col items-center">
            {/* Quick Hero Banner with One-Click Prompt Copy */}
            <div className="w-full max-w-xl text-center mb-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ready to Build in Google AI Studio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Flappy Bird Arcade
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
                Play the authentic 2013 arcade game below. To generate this identical game in Google AI Studio with one prompt, click below:
              </p>

              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{promptCopied ? 'Copied Prompt to Clipboard!' : 'Copy 1-Shot AI Studio Prompt'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('prompt')}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium rounded-xl transition-colors"
                >
                  <span>Inspect Prompt</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* The Playable Canvas Game */}
            <FlappyBirdGame onOpenPromptModal={() => setActiveTab('prompt')} />

            {/* Below-Game Explainer Strip */}
            <div className="mt-8 max-w-xl w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <button
                onClick={() => setActiveTab('prompt')}
                className="p-3 bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-xl flex flex-col items-center gap-1 transition-colors text-left"
              >
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>1-Shot Prompt</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Inspect the prompt engineered to produce this entire game in one generation.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('physics')}
                className="p-3 bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-xl flex flex-col items-center gap-1 transition-colors text-left"
              >
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Authentic Physics</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Kinematic formulas (gravity, angular tilt, collision margins, speeds).
                </p>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className="p-3 bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-xl flex flex-col items-center gap-1 transition-colors text-left"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>AI Studio Guide</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  How to paste and compile in Google AI Studio without CORS or 404 errors.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* 1-Shot Prompt Tab */}
        {activeTab === 'prompt' && <PromptStudio />}

        {/* Physics Specs Tab */}
        {activeTab === 'physics' && <PhysicsSpecs />}

        {/* Studio Guide Tab */}
        {activeTab === 'guide' && <StudioGuide />}
      </main>

      {/* Quiet, Clean Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">FlappyArcade</span>
            <span>·</span>
            <span>Engineered for Google AI Studio</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('play')}
              className="hover:text-white transition-colors"
            >
              Play
            </button>
            <button
              onClick={() => setActiveTab('prompt')}
              className="hover:text-white transition-colors"
            >
              Prompt Studio
            </button>
            <button
              onClick={() => setActiveTab('physics')}
              className="hover:text-white transition-colors"
            >
              Physics Math
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-white transition-colors"
            >
              Studio Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
