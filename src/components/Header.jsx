import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import { formatDisplayDate, getFormattedDateKey, DIET_GOALS } from '../utils/nutritionCalculators.js';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Flame,
  Moon,
  Sun,
  PlusCircle,
  Calculator,
  Utensils,
  ShoppingCart,
  Dumbbell,
  RotateCcw,
  Sparkles,
  Activity,
} from 'lucide-react';

export function Header({
  onOpenFoodModal,
  onOpenCalculator,
  onOpenRecipes,
  onOpenGrocery,
  onOpenWorkout,
  onOpenFitModal,
}) {
  const {
    theme,
    toggleTheme,
    selectedDate,
    setSelectedDate,
    userProfile,
    applyGoalPreset,
    resetToDemoData,
    googleFit,
  } = useNutrition();

  const [showGoalMenu, setShowGoalMenu] = useState(false);

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    setSelectedDate(getFormattedDateKey(date));
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    setSelectedDate(getFormattedDateKey(date));
  };

  const handleToday = () => {
    setSelectedDate(getFormattedDateKey(new Date()));
  };

  const currentGoal = DIET_GOALS[userProfile.goalId] || DIET_GOALS.cut;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Health Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-xl">
                🥗
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Nutri<span className="text-emerald-500">Track</span>
                  </h1>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    Pro
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Precision Macro & Micronutrient Intelligence
                </p>
              </div>
            </div>

            {/* Mobile actions row */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>
              <button
                onClick={() => onOpenFoodModal('breakfast')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-emerald-500/20"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Log
              </button>
            </div>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={handlePrevDay}
              title="Previous Day"
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-1.5 transition"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>{formatDisplayDate(selectedDate)}</span>
            </button>

            <button
              onClick={handleNextDay}
              title="Next Day"
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Goal Selector & Streaks & Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2.5">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold"
              title="Current tracking streak"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{userProfile.streakDays || 14} Day Streak</span>
            </div>

            {/* Goal Preset Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowGoalMenu(!showGoalMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Goal:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {currentGoal.name}
                </span>
              </button>

              {showGoalMenu && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setShowGoalMenu(false)}
                >
                  <div className="px-2 py-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Select Dietary Objective
                  </div>
                  {Object.values(DIET_GOALS).map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => {
                        applyGoalPreset(goal.id);
                        setShowGoalMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex flex-col gap-0.5 ${
                        userProfile.goalId === goal.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="font-semibold flex items-center justify-between">
                        {goal.name}
                        {userProfile.goalId === goal.id && (
                          <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        {goal.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fast Tools Buttons */}
            <button
              onClick={onOpenCalculator}
              title="BMR & TDEE Health Calculator"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-500" />
              <span>Calculator</span>
            </button>

            <button
              onClick={onOpenRecipes}
              title="Healthy Meal Recipes"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-500" />
              <span>Recipes</span>
            </button>

            <button
              onClick={onOpenGrocery}
              title="Smart Grocery List"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-teal-500" />
              <span>Grocery List</span>
            </button>

            {/* Google Fit Sync Button */}
            <button
              onClick={onOpenFitModal}
              title="Google Fit Activity Sync"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            >
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden md:inline">Google Fit</span>
              {googleFit?.isConnected && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Google Fit Active" />
              )}
            </button>

            <button
              onClick={onOpenWorkout}
              title="Log Workout & Calorie Burn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            >
              <Dumbbell className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Burn:</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                +{userProfile.exerciseBurned || 0} kcal
              </span>
            </button>

            {/* Quick Log Food CTA */}
            <button
              onClick={() => onOpenFoodModal('breakfast')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/25 transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Food</span>
            </button>

            {/* Demo Reset */}
            <button
              onClick={resetToDemoData}
              title="Reset Demo Data"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold hidden xl:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold hidden xl:inline">Dark</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
