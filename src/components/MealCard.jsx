import React from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import { Plus, Trash2, Clock } from 'lucide-react';

const MEAL_CONFIG = {
  breakfast: {
    title: 'Breakfast',
    icon: '🌅',
    recommendedPct: '25%',
    timeHint: '7:00 AM - 9:30 AM',
    quickAdds: [
      { name: 'Oats & Berries', id: 'f_rolled_oats', multiplier: 1 },
      { name: 'Eggs (2 Whole)', id: 'f_eggs_whole', multiplier: 1 },
    ],
  },
  lunch: {
    title: 'Lunch',
    icon: '☀️',
    recommendedPct: '35%',
    timeHint: '12:00 PM - 2:00 PM',
    quickAdds: [
      { name: 'Chicken & Rice', id: 'f_chicken_breast', multiplier: 1.2 },
      { name: 'Salmon Salad', id: 'f_salmon_fillet', multiplier: 1 },
    ],
  },
  dinner: {
    title: 'Dinner',
    icon: '🌙',
    recommendedPct: '30%',
    timeHint: '6:30 PM - 8:30 PM',
    quickAdds: [
      { name: 'Tofu & Greens', id: 'f_tofu_firm', multiplier: 1 },
      { name: 'Lean Beef & Sweet Potato', id: 'f_lean_beef', multiplier: 1 },
    ],
  },
  snacks: {
    title: 'Snacks & Extras',
    icon: '🍏',
    recommendedPct: '10%',
    timeHint: 'Between meals',
    quickAdds: [
      { name: 'Greek Yogurt', id: 'f_greek_yogurt_0', multiplier: 1 },
      { name: 'Almonds', id: 'f_almonds', multiplier: 1 },
    ],
  },
};

export function MealCard({ mealKey, onAddFood }) {
  const { currentDayData, removeFoodItem } = useNutrition();

  const config = MEAL_CONFIG[mealKey] || {
    title: mealKey,
    icon: '🍽️',
    recommendedPct: '25%',
    timeHint: 'Anytime',
  };

  const loggedItems = (currentDayData.meals && currentDayData.meals[mealKey]) || [];

  // Calculate totals for this meal
  const mealCalories = loggedItems.reduce((acc, item) => acc + (Number(item.calories) || 0), 0);
  const mealProtein = Math.round(loggedItems.reduce((acc, item) => acc + (Number(item.protein) || 0), 0) * 10) / 10;
  const mealCarbs = Math.round(loggedItems.reduce((acc, item) => acc + (Number(item.carbs) || 0), 0) * 10) / 10;
  const mealFat = Math.round(loggedItems.reduce((acc, item) => acc + (Number(item.fat) || 0), 0) * 10) / 10;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700">
      {/* Meal Header */}
      <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xl p-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200/50 dark:border-slate-700/50">
            {config.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {config.title}
              </h3>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-700/60 px-2 py-0.2 rounded-full">
                ~{config.recommendedPct}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{config.timeHint}</span>
            </div>
          </div>
        </div>

        {/* Meal Calories & Quick Add Button */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-base font-black text-slate-900 dark:text-white">
              {mealCalories}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
              kcal
            </span>
          </div>

          <button
            onClick={() => onAddFood(mealKey)}
            className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs transition active:scale-95 flex items-center gap-1"
            title={`Log item to ${config.title}`}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline pr-1">Add</span>
          </button>
        </div>
      </div>

      {/* Meal Macro Subtotal Bar */}
      <div className="px-4 py-2 bg-slate-100/40 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            <strong className="text-emerald-600 dark:text-emerald-400">{mealProtein}g</strong> P
          </span>
          <span>
            <strong className="text-amber-600 dark:text-amber-400">{mealCarbs}g</strong> C
          </span>
          <span>
            <strong className="text-rose-600 dark:text-rose-400">{mealFat}g</strong> F
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          {loggedItems.length} {loggedItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Logged Items List */}
      <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800/80 flex-1 min-h-[110px]">
        {loggedItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-6 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              No food logged for {config.title.toLowerCase()} yet.
            </p>
            <button
              onClick={() => onAddFood(mealKey)}
              className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Log something nutritious
            </button>
          </div>
        ) : (
          loggedItems.map((item) => (
            <div
              key={item.id}
              className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 rounded-lg px-2 -mx-2 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="text-base select-none shrink-0">{item.icon || '🥗'}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    {item.servingUnit} • {item.protein}g P • {item.carbs}g C • {item.fat}g F
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {item.calories} <span className="text-[10px] font-normal text-slate-400">kcal</span>
                </span>
                <button
                  onClick={() => removeFoodItem(mealKey, item.id)}
                  title="Remove item"
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
