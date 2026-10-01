import React from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import { Dumbbell, Wheat, Droplets, Leaf } from 'lucide-react';

export function MacroCards() {
  const { currentDayTotals, userProfile } = useNutrition();

  const macros = [
    {
      id: 'protein',
      name: 'Protein',
      icon: Dumbbell,
      consumed: currentDayTotals.protein,
      target: userProfile.targetProtein || 165,
      unit: 'g',
      color: 'emerald',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderLight: 'border-emerald-200 dark:border-emerald-800/60',
      barColor: 'bg-emerald-500',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      badgeText: 'Muscle Synthesis',
    },
    {
      id: 'carbs',
      name: 'Carbohydrates',
      icon: Wheat,
      consumed: currentDayTotals.carbs,
      target: userProfile.targetCarbs || 210,
      unit: 'g',
      color: 'amber',
      bgLight: 'bg-amber-50 dark:bg-amber-950/40',
      borderLight: 'border-amber-200 dark:border-amber-800/60',
      barColor: 'bg-amber-500',
      textColor: 'text-amber-700 dark:text-amber-400',
      iconColor: 'text-amber-600 dark:text-amber-400',
      badgeText: 'Glycogen Fuel',
    },
    {
      id: 'fat',
      name: 'Healthy Fats',
      icon: Droplets,
      consumed: currentDayTotals.fat,
      target: userProfile.targetFat || 68,
      unit: 'g',
      color: 'rose',
      bgLight: 'bg-rose-50 dark:bg-rose-950/40',
      borderLight: 'border-rose-200 dark:border-rose-800/60',
      barColor: 'bg-rose-500',
      textColor: 'text-rose-700 dark:text-rose-400',
      iconColor: 'text-rose-600 dark:text-rose-400',
      badgeText: 'Hormonal Health',
    },
    {
      id: 'fiber',
      name: 'Dietary Fiber',
      icon: Leaf,
      consumed: currentDayTotals.fiber,
      target: userProfile.targetFiber || 32,
      unit: 'g',
      color: 'indigo',
      bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
      borderLight: 'border-indigo-200 dark:border-indigo-800/60',
      barColor: 'bg-indigo-500',
      textColor: 'text-indigo-700 dark:text-indigo-400',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      badgeText: 'Gut Microbiome',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {macros.map((m) => {
        const IconComponent = m.icon;
        const pct = Number(Math.min(100, (m.consumed / m.target) * 100).toFixed(2));
        const diff = Math.round((m.target - m.consumed) * 10) / 10;
        const isMet = diff <= 0;

        return (
          <div
            key={m.id}
            className={`rounded-2xl p-4.5 border ${m.borderLight} ${m.bgLight} relative overflow-hidden transition-all duration-200 hover:shadow-sm`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs ${m.iconColor}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {m.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {m.badgeText}
                  </span>
                </div>
              </div>

              <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 ${m.textColor}`}>
                {pct.toFixed(2)}%
              </span>
            </div>

            {/* Values */}
            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {m.consumed}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  / {m.target} {m.unit}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {isMet ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Goal Met ✓
                    </span>
                  ) : (
                    <span>{diff} {m.unit} left</span>
                  )}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 w-full bg-slate-200/80 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${m.barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
