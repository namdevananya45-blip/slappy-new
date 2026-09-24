import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { MASTER_AI_STUDIO_PROMPT } from '../game/prompts';
import { soundManager } from '../game/audio';

export const StudioGuide: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MASTER_AI_STUDIO_PROMPT);
    setCopied(true);
    soundManager.playScore();
    setTimeout(() => setCopied(false), 2200);
  };

  const steps = [
    {
      num: '01',
      title: 'Open Google AI Studio Build',
      desc: 'Go to Google AI Studio and click "+ New App" or start a new conversation with the coding model.',
    },
    {
      num: '02',
      title: 'Paste the Exact Master Prompt',
      desc: 'Paste the copied prompt directly into the first prompt input. Do not dilute it with generic requests like "make flappy bird simple".',
    },
    {
      num: '03',
      title: 'Watch It Build in One Go',
      desc: 'The model sets up the Canvas renderer, Web Audio synthesizer, keyboard & touch handlers, and high-score localStorage in a single execution turn.',
    },
    {
      num: '04',
      title: 'Immediate Browser Execution',
      desc: 'Once compilation succeeds, the preview pane immediately displays the playable game with full sound and keyboard controls.',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          How to Deploy Flappy Bird in Google AI Studio
        </h2>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          Step-by-step instructions to get 100% first-turn compile and play rates in Google AI Studio
          using the master prompt.
        </p>
      </div>

      {/* Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((s) => (
          <div
            key={s.num}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <span className="text-2xl font-black text-amber-400 font-mono">{s.num}</span>
              <h3 className="text-base font-bold text-white mt-2">{s.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{s.desc}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center text-xs text-emerald-400 gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Guaranteed compatibility</span>
            </div>
          </div>
        ))}
      </div>

      {/* Golden Rules of AI Game Prompting */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>The 3 Golden Rules of Browser Game Prompting</span>
        </h3>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <h4 className="font-semibold text-amber-300 text-sm mb-1">
              Rule 1: Always forbid external media URLs
            </h4>
            <p className="leading-relaxed">
              Never let the LLM fetch audio or images from external URLs. In sandboxed preview
              environments, iframe CORS restrictions or broken CDNs lead to silent crashes. Always
              demand native <code className="text-amber-300 font-mono">Web Audio API</code> and{' '}
              <code className="text-amber-300 font-mono">Canvas 2D</code> procedural rendering.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <h4 className="font-semibold text-amber-300 text-sm mb-1">
              Rule 2: Dictate numeric physics constants
            </h4>
            <p className="leading-relaxed">
              If you don&apos;t specify gravity (<code className="text-amber-300 font-mono">0.28</code>),
              jump velocity (<code className="text-amber-300 font-mono">-6.4</code>), and gap size (
              <code className="text-amber-300 font-mono">125px</code>), the model defaults to
              untested generic values that feel sluggish or unplayable.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <h4 className="font-semibold text-amber-300 text-sm mb-1">
              Rule 3: Enforce event.preventDefault() on controls
            </h4>
            <p className="leading-relaxed">
              The Spacebar and Arrow Up keys scroll browser pages by default. The prompt must
              explicitly instruct the agent to suppress default scrolling so hitting space bounces the
              bird instead of scrolling the window.
            </p>
          </div>
        </div>

        {/* Copy CTA */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            Ready to build? Copy the Master Prompt and paste it into Google AI Studio now.
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 py-2.5 px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied to Clipboard!</span>
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
    </div>
  );
};
