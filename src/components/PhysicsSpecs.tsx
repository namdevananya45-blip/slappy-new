import React from 'react';
import { Gauge, ArrowDown, Activity, Sparkles, Orbit, Scale } from 'lucide-react';
import { DIFFICULTY_PRESETS, CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_HEIGHT } from '../game/constants';

export const PhysicsSpecs: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Arcade Physics & Mathematical Model
        </h2>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          The exact delta-time kinematic equations that recreate Dong Nguyen&apos;s 2013 sensation.
          These formulas are embedded directly in the 1-Shot prompt to prevent AI models from
          guessing erratic values.
        </p>
      </div>

      {/* Physics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Gravity & Velocity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base mb-3">
            <ArrowDown className="w-5 h-5" />
            <h3>Kinematics & Gravity</h3>
          </div>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Standard Newtonian acceleration applied every frame (60 Hz tick), capped by a strict
            terminal velocity to prevent tunneling through pipes.
          </p>
          <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-amber-200/90 border border-slate-800/80 space-y-1.5">
            <div>vy += gravity; // 0.28 px/frame²</div>
            <div>if (vy &gt; 10.0) vy = 10.0; // Terminal clamp</div>
            <div>y += vy; // Linear displacement</div>
          </div>
          <div className="mt-4 text-xs text-slate-400 space-y-1">
            <p>· Flap Impulse: <span className="text-slate-200 font-mono">-6.4 px/frame</span></p>
            <p>· Maximum Fall Velocity: <span className="text-slate-200 font-mono">+10.0 px/frame</span></p>
            <p>· Jump Apex Duration: <span className="text-slate-200 font-mono">~23 frames (~380ms)</span></p>
          </div>
        </div>

        {/* Angular Tilt Rotation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base mb-3">
            <Orbit className="w-5 h-5" />
            <h3>Angular Tilt Dynamics</h3>
          </div>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            The distinctive bird pitch is non-linear: instantaneous nose-up pitch upon jumping,
            followed by a delayed, accelerated nose-dive into the ground.
          </p>
          <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-cyan-200/90 border border-slate-800/80 space-y-1.5">
            <div>if (vy &lt; 0) angle = -0.45 rad; // -25° jump tilt</div>
            <div>else angle = min(1.22 rad, angle + 0.045); // +70° dive</div>
          </div>
          <div className="mt-4 text-xs text-slate-400 space-y-1">
            <p>· Max Nose-Up Angle: <span className="text-slate-200 font-mono">-25° (-0.45 rad)</span></p>
            <p>· Max Nose-Down Angle: <span className="text-slate-200 font-mono">+70° (+1.22 rad)</span></p>
            <p>· Pitch Interpolation: <span className="text-slate-200 font-mono">Asymmetric slerp</span></p>
          </div>
        </div>

        {/* Pipe Clearance & Spatial Dimensions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base mb-3">
            <Gauge className="w-5 h-5" />
            <h3>Pipe Geometry & Collision</h3>
          </div>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Pipes consist of a shaft and an expanded entrance collar (rim). A 2px collision grace
            boundary makes close calls thrilling without feeling punitive.
          </p>
          <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-emerald-200/90 border border-slate-800/80 space-y-1.5">
            <div>pipeWidth = 64px; collarWidth = 72px;</div>
            <div>gap = 125px; // Vertical clearance</div>
            <div>spawnRate = 100 frames (~1.6s);</div>
          </div>
          <div className="mt-4 text-xs text-slate-400 space-y-1">
            <p>· Bird Collision Radius: <span className="text-slate-200 font-mono">12px (Effective 10px with grace)</span></p>
            <p>· Ground Clearance: <span className="text-slate-200 font-mono">{CANVAS_HEIGHT - GROUND_HEIGHT}px</span></p>
          </div>
        </div>

        {/* Difficulty Tuning Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base mb-3">
            <Scale className="w-5 h-5" />
            <h3>Difficulty Presets Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2">Mode</th>
                  <th className="py-2">Gravity</th>
                  <th className="py-2">Jump</th>
                  <th className="py-2">Gap</th>
                  <th className="py-2">Speed</th>
                </tr>
              </thead>
              <tbody className="font-mono divide-y divide-slate-800/60">
                <tr>
                  <td className="py-2.5 font-semibold text-emerald-400">Easy</td>
                  <td>0.22</td>
                  <td>-5.8</td>
                  <td>150px</td>
                  <td>1.8 px/f</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-amber-400">Classic</td>
                  <td>0.28</td>
                  <td>-6.4</td>
                  <td>125px</td>
                  <td>2.2 px/f</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-rose-400">Hardcore</td>
                  <td>0.35</td>
                  <td>-7.2</td>
                  <td>105px</td>
                  <td>2.8 px/f</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            Classic mode precisely mirrors the timing requirements of the 2013 arcade release.
          </p>
        </div>
      </div>
    </div>
  );
};
