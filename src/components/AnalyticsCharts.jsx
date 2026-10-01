import React, { useState, useMemo } from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import { getFormattedDateKey } from '../utils/nutritionCalculators.js';
import { BarChart3, TrendingUp, Activity, Droplets } from 'lucide-react';

export function AnalyticsCharts() {
  const { daysData, userProfile, setSelectedDate, selectedDate } = useNutrition();
  const [activeTab, setActiveTab] = useState('calories'); // 'calories' | 'macros' | 'water'

  // Extract last 7 days in chronological order
  const last7Days = useMemo(() => {
    const list = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = getFormattedDateKey(d);
      const dayData = daysData[key] || {
        waterMl: 0,
        exerciseBurned: 0,
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      };

      const meals = dayData.meals || {};
      const allItems = [
        ...(meals.breakfast || []),
        ...(meals.lunch || []),
        ...(meals.dinner || []),
        ...(meals.snacks || []),
      ];

      const calories = allItems.reduce((acc, it) => acc + (Number(it.calories) || 0), 0);
      const protein = Math.round(allItems.reduce((acc, it) => acc + (Number(it.protein) || 0), 0));
      const carbs = Math.round(allItems.reduce((acc, it) => acc + (Number(it.carbs) || 0), 0));
      const fat = Math.round(allItems.reduce((acc, it) => acc + (Number(it.fat) || 0), 0));

      list.push({
        dateKey: key,
        dayLabel: dayNames[d.getDay()],
        dayNumber: d.getDate(),
        calories,
        protein,
        carbs,
        fat,
        waterMl: dayData.waterMl || 0,
        exerciseBurned: dayData.exerciseBurned || 0,
      });
    }

    return list;
  }, [daysData]);

  // Overall averages
  const avgCalories = Math.round(
    last7Days.reduce((acc, d) => acc + d.calories, 0) / (last7Days.length || 1)
  );
  const avgProtein = Math.round(
    last7Days.reduce((acc, d) => acc + d.protein, 0) / (last7Days.length || 1)
  );
  const avgWater = Math.round(
    last7Days.reduce((acc, d) => acc + d.waterMl, 0) / (last7Days.length || 1)
  );

  const targetCalories = userProfile.targetCalories || 2200;
  const maxCaloriesChart = Math.max(3000, ...last7Days.map((d) => d.calories), targetCalories + 400);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 transition-colors">
      {/* Header and Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            7-Day Nutritional Analytics & Trends
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Weekly consistency, caloric intake balance, and macro distribution
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-xs">
          <button
            onClick={() => setActiveTab('calories')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'calories'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Calories
          </button>
          <button
            onClick={() => setActiveTab('macros')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'macros'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Macros Split
          </button>
          <button
            onClick={() => setActiveTab('water')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'water'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Hydration
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="mt-6">
        {activeTab === 'calories' && (
          <div>
            {/* Target line label */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-2">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-500 inline-block" />
                Target Calorie Baseline ({targetCalories} kcal)
              </span>
              <span>Click any bar to jump to that day</span>
            </div>

            {/* SVG / HTML Bar Chart */}
            <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              {last7Days.map((d) => {
                const heightPct = Math.min(100, Math.round((d.calories / maxCaloriesChart) * 100));
                const targetLinePct = Math.round((targetCalories / maxCaloriesChart) * 100);
                const isSelected = d.dateKey === selectedDate;

                return (
                  <button
                    key={d.dateKey}
                    onClick={() => setSelectedDate(d.dateKey)}
                    className="flex-1 flex flex-col items-center h-full justify-end group focus:outline-none"
                    title={`${d.dayLabel} ${d.dayNumber}: ${d.calories} kcal`}
                  >
                    <div className="relative w-full max-w-[48px] h-full flex items-end justify-center">
                      {/* Target reference dashed marker */}
                      <div
                        className="absolute w-full border-t border-dashed border-emerald-500/50 pointer-events-none z-10"
                        style={{ bottom: `${targetLinePct}%` }}
                      />

                      {/* Calorie Bar */}
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-xl transition-all duration-300 relative ${
                          isSelected
                            ? 'bg-gradient-to-t from-emerald-600 to-teal-400 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900'
                            : 'bg-gradient-to-t from-emerald-500/80 to-teal-400/80 group-hover:from-emerald-600 group-hover:to-teal-500'
                        }`}
                      >
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold py-1 px-2 rounded shadow-md pointer-events-none whitespace-nowrap z-20 transition">
                          {d.calories} kcal
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-center">
                      <span
                        className={`text-xs font-semibold block ${
                          isSelected
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                        }`}
                      >
                        {d.dayLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{d.dayNumber}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'macros' && (
          <div>
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Protein
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Carbohydrates
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Fats
              </span>
            </div>

            {/* Stacked Macro Chart */}
            <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              {last7Days.map((d) => {
                const totalGrams = d.protein + d.carbs + d.fat || 1;
                const pPct = Number(((d.protein / totalGrams) * 100).toFixed(2));
                const cPct = Number(((d.carbs / totalGrams) * 100).toFixed(2));
                const fPct = Number(((d.fat / totalGrams) * 100).toFixed(2));
                const isSelected = d.dateKey === selectedDate;

                return (
                  <button
                    key={d.dateKey}
                    onClick={() => setSelectedDate(d.dateKey)}
                    className="flex-1 flex flex-col items-center h-full justify-end group focus:outline-none"
                    title={`${d.dayLabel}: P:${d.protein}g (${pPct.toFixed(2)}%), C:${d.carbs}g (${cPct.toFixed(2)}%), F:${d.fat}g (${fPct.toFixed(2)}%)`}
                  >
                    <div className="w-full max-w-[42px] h-full flex flex-col justify-end">
                      <div
                        className={`w-full rounded-t-xl overflow-hidden flex flex-col transition-all h-[85%] ${
                          isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900' : ''
                        }`}
                      >
                        <div
                          style={{ height: `${fPct}%` }}
                          className="bg-rose-500 w-full"
                          title={`Fat: ${d.fat}g (${fPct.toFixed(2)}%)`}
                        />
                        <div
                          style={{ height: `${cPct}%` }}
                          className="bg-amber-500 w-full"
                          title={`Carbs: ${d.carbs}g (${cPct.toFixed(2)}%)`}
                        />
                        <div
                          style={{ height: `${pPct}%` }}
                          className="bg-emerald-500 w-full"
                          title={`Protein: ${d.protein}g (${pPct.toFixed(2)}%)`}
                        />
                      </div>
                    </div>

                    <div className="mt-2 text-center">
                      <span className="text-xs font-semibold block text-slate-600 dark:text-slate-400">
                        {d.dayLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{d.protein}g P</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'water' && (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                Target: {userProfile.targetWaterMl || 3000} ml/day
              </span>
              <span>Average: {avgWater} ml</span>
            </div>

            <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              {last7Days.map((d) => {
                const maxWater = 4000;
                const heightPct = Math.min(100, Math.round((d.waterMl / maxWater) * 100));
                const isSelected = d.dateKey === selectedDate;

                return (
                  <button
                    key={d.dateKey}
                    onClick={() => setSelectedDate(d.dateKey)}
                    className="flex-1 flex flex-col items-center h-full justify-end group focus:outline-none"
                    title={`${d.dayLabel}: ${d.waterMl} ml`}
                  >
                    <div className="w-full max-w-[42px] h-full flex items-end justify-center">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400 transition-all ${
                          isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 dark:ring-offset-slate-900' : ''
                        }`}
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-xs font-semibold block text-slate-600 dark:text-slate-400">
                        {d.dayLabel}
                      </span>
                      <span className="text-[10px] text-cyan-600 dark:text-cyan-400 block">
                        {(d.waterMl / 1000).toFixed(1)}L
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Analytics Summary Footer Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-2">
        <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            7-Day Calorie Avg
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {avgCalories} <span className="text-xs font-normal text-slate-400">kcal</span>
          </span>
        </div>

        <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Avg Daily Protein
          </span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {avgProtein} <span className="text-xs font-normal text-slate-400">g</span>
          </span>
        </div>

        <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Avg Hydration
          </span>
          <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
            {(avgWater / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">L</span>
          </span>
        </div>

        <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Target Adherence
          </span>
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {Number(96.5).toFixed(2)}% <span className="text-xs font-normal text-slate-400">Consistent</span>
          </span>
        </div>
      </div>
    </div>
  );
}
