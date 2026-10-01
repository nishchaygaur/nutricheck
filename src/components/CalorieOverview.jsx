import React from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import { Flame, Target, UtensilsCrossed, Zap, Plus, Award } from 'lucide-react';

export function CalorieOverview({ onOpenWorkout, onOpenCalculator }) {
  const { currentDayTotals, userProfile } = useNutrition();

  const target = currentDayTotals.targetCalories;
  const consumed = currentDayTotals.calories;
  const burned = currentDayTotals.exerciseBurned;
  const remaining = currentDayTotals.remainingCalories;

  // Circular progress calculations
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  // Cap visual percentage between 0 and 100 for primary ring
  const rawPct = (consumed / target) * 100;
  const pct = Number(Math.min(100, Math.max(0, rawPct)).toFixed(2));
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const isOver = remaining < 0;

  // Calorie percentage from macros
  const proteinKcal = currentDayTotals.protein * 4;
  const carbsKcal = currentDayTotals.carbs * 4;
  const fatKcal = currentDayTotals.fat * 9;
  const totalMacroKcal = proteinKcal + carbsKcal + fatKcal || 1;

  const proteinPct = Number(((proteinKcal / totalMacroKcal) * 100).toFixed(2));
  const carbsPct = Number(((carbsKcal / totalMacroKcal) * 100).toFixed(2));
  const fatPct = Number(((fatKcal / totalMacroKcal) * 100).toFixed(2));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
      {/* Background ambient decorative glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Energy Balance
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Daily Caloric Budget
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              Calorie Breakdown & Deficit
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                isOver
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              {isOver ? `Surplus +${Math.abs(remaining)} kcal` : `Deficit On Track (-${remaining} kcal left)`}
            </span>

            <button
              onClick={onOpenCalculator}
              className="text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 underline underline-offset-2 transition"
            >
              Adjust Goal
            </button>
          </div>
        </div>

        {/* Main Content Grid: Radial Ring + Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-6">
          
          {/* Radial Progress Ring */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 190 190">
                {/* Background Track */}
                <circle
                  cx="95"
                  cy="95"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="14"
                  className="text-slate-100 dark:text-slate-800"
                  fill="transparent"
                />

                {/* Progress Circle */}
                <circle
                  cx="95"
                  cy="95"
                  r={radius}
                  stroke="url(#calorieGradient)"
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  fill="transparent"
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inner Stats */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {Math.abs(remaining)}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {isOver ? 'kcal over' : 'kcal left'}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  {pct.toFixed(2)}% of budget
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3 max-w-[200px]">
              {isOver
                ? 'You have exceeded your calorie budget for today.'
                : 'Balanced pacing keeps metabolic activity elevated.'}
            </p>
          </div>

          {/* Equation Breakdown Cards */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Daily Target */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                  <Target className="w-3.5 h-3.5 text-blue-500" />
                  <span>Target</span>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {target}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  kcal / day
                </div>
              </div>

              {/* Food Consumed */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Food Intake</span>
                </div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {consumed}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  consumed
                </div>
              </div>

              {/* Workout Burned */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>Burned</span>
                  </div>
                  <button
                    onClick={onOpenWorkout}
                    title="Log Workout"
                    className="p-1 rounded-md bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                  +{burned}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {currentDayTotals.exerciseNotes || 'exercise burn'}
                </div>
              </div>

              {/* Net Remaining */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Net Budget</span>
                </div>
                <div className={`text-xl font-bold mt-1 ${isOver ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                  {remaining}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  kcal available
                </div>
              </div>
            </div>

            {/* Macro Proportional Energy Split Bar */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Caloric Source Distribution
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Protein {proteinPct.toFixed(2)}% • Carbs {carbsPct.toFixed(2)}% • Fats {fatPct.toFixed(2)}%
                </span>
              </div>

              {/* Multi-segment Progress Bar */}
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${proteinPct}%` }}
                  className="bg-emerald-500 h-full transition-all duration-500"
                  title={`Protein: ${proteinKcal} kcal (${proteinPct.toFixed(2)}%)`}
                />
                <div
                  style={{ width: `${carbsPct}%` }}
                  className="bg-amber-500 h-full transition-all duration-500"
                  title={`Carbs: ${carbsKcal} kcal (${carbsPct.toFixed(2)}%)`}
                />
                <div
                  style={{ width: `${fatPct}%` }}
                  className="bg-rose-500 h-full transition-all duration-500"
                  title={`Fat: ${fatKcal} kcal (${fatPct.toFixed(2)}%)`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Protein ({currentDayTotals.protein}g)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Carbohydrates ({currentDayTotals.carbs}g)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Fats ({currentDayTotals.fat}g)
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
