import React from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import { Droplet, Plus, Minus, Sparkles, CheckCircle2 } from 'lucide-react';

export function HydrationTracker() {
  const { currentDayData, updateWater, userProfile } = useNutrition();

  const currentWater = currentDayData.waterMl || 0;
  const targetWater = userProfile.targetWaterMl || 3000;
  const pct = Number(Math.min(100, (currentWater / targetWater) * 100).toFixed(2));

  const totalCups = Math.max(8, Math.round(targetWater / 250));
  const filledCups = Math.min(totalCups, Math.floor(currentWater / 250));

  let statusText = 'Keep sipping water throughout the day!';
  if (pct >= 100) {
    statusText = '🌟 Outstanding! Daily hydration target reached!';
  } else if (pct >= 75) {
    statusText = '💧 Almost there! Just a couple more glasses.';
  } else if (pct >= 50) {
    statusText = '👍 Great steady hydration halfway through the day.';
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
            <Droplet className="w-5 h-5 fill-cyan-500 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Hydration Tracker
              {pct >= 100 && (
                <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Met
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target: {(targetWater / 1000).toFixed(1)}L per day
            </p>
          </div>
        </div>

        {/* Amount display */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
            {currentWater.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            / {targetWater.toLocaleString()} ml ({pct.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Main Hydration Progress Bar */}
      <div className="mt-4">
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/40 dark:border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 rounded-full transition-all duration-500 relative"
            style={{ width: `${pct}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            {statusText}
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {Math.max(0, targetWater - currentWater)} ml remaining
          </span>
        </div>
      </div>

      {/* Interactive Cup Icons row & Quick Add Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Visual Cups */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {Array.from({ length: totalCups }).map((_, index) => {
            const isFilled = index < filledCups;
            return (
              <button
                key={index}
                onClick={() => {
                  const targetMl = (index + 1) * 250;
                  const diff = targetMl - currentWater;
                  updateWater(diff);
                }}
                title={`Set to ${(index + 1) * 250} ml`}
                className={`w-7 h-8 rounded-lg flex items-center justify-center transition-all ${
                  isFilled
                    ? 'bg-cyan-500 text-white shadow-xs scale-100 hover:bg-cyan-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 scale-95'
                }`}
              >
                <Droplet className={`w-3.5 h-3.5 ${isFilled ? 'fill-white' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Quick Add Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateWater(-250)}
            disabled={currentWater <= 0}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold disabled:opacity-40 transition flex items-center gap-1"
          >
            <Minus className="w-3 h-3" />
            250ml
          </button>

          <button
            onClick={() => updateWater(250)}
            className="px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-semibold transition flex items-center gap-1"
          >
            <Plus className="w-3 h-3 text-cyan-600" />
            +250ml
          </button>

          <button
            onClick={() => updateWater(500)}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            +500ml Bottle
          </button>
        </div>
      </div>
    </div>
  );
}
