import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import { RDA_MICRONUTRIENTS } from '../utils/nutritionCalculators.js';
import { ShieldCheck, ChevronDown, ChevronUp, AlertCircle, Info } from 'lucide-react';

export function MicronutrientsPanel() {
  const { currentDayTotals } = useNutrition();
  const [isExpanded, setIsExpanded] = useState(false);

  const microsList = [
    { key: 'fiber', value: currentDayTotals.fiber, ...RDA_MICRONUTRIENTS.fiber },
    { key: 'potassium', value: currentDayTotals.potassium, ...RDA_MICRONUTRIENTS.potassium },
    { key: 'sodium', value: currentDayTotals.sodium, ...RDA_MICRONUTRIENTS.sodium, isLimit: true },
    { key: 'iron', value: currentDayTotals.iron, ...RDA_MICRONUTRIENTS.iron },
    { key: 'calcium', value: currentDayTotals.calcium, ...RDA_MICRONUTRIENTS.calcium },
    { key: 'magnesium', value: currentDayTotals.magnesium, ...RDA_MICRONUTRIENTS.magnesium },
    { key: 'vitaminC', value: currentDayTotals.vitaminC, ...RDA_MICRONUTRIENTS.vitaminC },
    { key: 'vitaminD', value: currentDayTotals.vitaminD, ...RDA_MICRONUTRIENTS.vitaminD },
  ];

  // Ratio check
  const sodiumToPotassium =
    currentDayTotals.potassium > 0
      ? (currentDayTotals.sodium / currentDayTotals.potassium).toFixed(2)
      : 'N/A';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Micronutrients & Electrolyte Balance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vitamins, essential minerals & cellular hydration cofactors
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
        >
          <span>{isExpanded ? 'Hide Details' : 'View Full Breakdown'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Summary Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {microsList.slice(0, 4).map((item) => {
          const pct = Number(Math.min(100, ((item.value || 0) / item.target) * 100).toFixed(2));
          return (
            <div
              key={item.key}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {item.name}
                </span>
                <span className="font-bold text-slate-500 dark:text-slate-400">
                  {pct.toFixed(2)}%
                </span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {item.value || 0}
                </span>
                <span className="text-[11px] text-slate-400">
                  / {item.target} {item.unit}
                </span>
              </div>
              <div className="mt-2 w-full bg-slate-200/70 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.isLimit && pct > 90
                      ? 'bg-amber-500'
                      : pct >= 80
                      ? 'bg-purple-500'
                      : 'bg-indigo-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Detailed Grid */}
      {isExpanded && (
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {microsList.map((item) => {
              const pct = Number((((item.value || 0) / item.target) * 100).toFixed(2));
              const isWarning = item.isLimit && pct > 100;
              return (
                <div
                  key={item.key}
                  className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-700/40 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.tip}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.value || 0}{' '}
                        <span className="text-xs text-slate-400 font-normal">{item.unit}</span>
                      </span>
                      <span
                        className={`block text-[11px] font-semibold ${
                          isWarning
                            ? 'text-rose-500'
                            : pct >= 100
                            ? 'text-emerald-500'
                            : 'text-slate-500'
                        }`}
                      >
                        {pct.toFixed(2)}% RDA
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 w-full bg-slate-200/70 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isWarning
                          ? 'bg-rose-500'
                          : pct >= 100
                          ? 'bg-emerald-500'
                          : 'bg-purple-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Electrolyte & Mineral Balance Insight Banner */}
          <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 flex items-start gap-3 text-xs text-blue-800 dark:text-blue-300">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Electrolyte Balance: </strong>
              Current Sodium-to-Potassium Ratio is{' '}
              <span className="font-bold underline">{sodiumToPotassium}</span>. Recommended clinical
              ratio is &lt; 0.6 for cardiovascular wellness and optimal cellular pump action.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
