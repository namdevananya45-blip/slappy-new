import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { MASTER_AI_STUDIO_PROMPT } from '../game/prompts';
import { soundManager } from '../game/audio';

interface NavbarProps {
  activeTab: 'play' | 'prompt' | 'physics' | 'guide';
  onSelectTab: (tab: 'play' | 'prompt' | 'physics' | 'guide') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MASTER_AI_STUDIO_PROMPT);
    setCopied(true);
    soundManager.playScore();
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('play')}
          className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors cursor-pointer"
        >
          FlappyArcade
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('play')}
            className={`hover:text-white transition-colors cursor-pointer py-1 ${
              activeTab === 'play'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Play Game
          </button>
          <button
            onClick={() => onSelectTab('prompt')}
            className={`hover:text-white transition-colors cursor-pointer py-1 ${
              activeTab === 'prompt'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            1-Shot Prompt
          </button>
          <button
            onClick={() => onSelectTab('physics')}
            className={`hover:text-white transition-colors cursor-pointer py-1 ${
              activeTab === 'physics'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Physics & Math
          </button>
          <button
            onClick={() => onSelectTab('guide')}
            className={`hover:text-white transition-colors cursor-pointer py-1 ${
              activeTab === 'guide'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Studio Guide
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Master Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden border-t border-slate-900 px-4 py-2 gap-2 overflow-x-auto bg-slate-950">
        {[
          { id: 'play', label: 'Play Game' },
          { id: 'prompt', label: '1-Shot Prompt' },
          { id: 'physics', label: 'Physics' },
          { id: 'guide', label: 'Studio Guide' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id as 'play' | 'prompt' | 'physics' | 'guide')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
