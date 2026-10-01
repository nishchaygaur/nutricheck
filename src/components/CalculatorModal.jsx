import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import {
  calculateTDEE,
  calculateMacroSplit,
  ACTIVITY_LEVELS,
  DIET_GOALS,
} from '../utils/nutritionCalculators.js';
import { Calculator, X, Sparkles, Check, ArrowRight } from 'lucide-react';

export function CalculatorModal({ isOpen, onClose }) {
  const { userProfile, updateUserProfile, triggerConfetti } = useNutrition();

  const [gender, setGender] = useState(userProfile.gender || 'male');
  const [age, setAge] = useState(userProfile.age || 28);
  const [weightKg, setWeightKg] = useState(userProfile.weightKg || 75);
  const [heightCm, setHeightCm] = useState(userProfile.heightCm || 178);
  const [activityLevel, setActivityLevel] = useState(userProfile.activityLevel || 'moderate');
  const [goalId, setGoalId] = useState(userProfile.goalId || 'cut');

  if (!isOpen) return null;

  // Real-time calculations
  const { bmr, tdee } = calculateTDEE({
    gender,
    weightKg: Number(weightKg) || 75,
    heightCm: Number(heightCm) || 178,
    age: Number(age) || 28,
    activityLevel,
  });

  const selectedGoal = DIET_GOALS[goalId] || DIET_GOALS.maintain;
  const targetCalories = Math.max(1200, tdee + selectedGoal.calorieAdjustment);
  const macroSplit = calculateMacroSplit(targetCalories, goalId);

  const handleApplyGoals = () => {
    updateUserProfile({
      gender,
      age: Number(age),
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      activityLevel,
      goalId,
      targetCalories: macroSplit.calories,
      targetProtein: macroSplit.protein,
      targetCarbs: macroSplit.carbs,
      targetFat: macroSplit.fat,
      targetFiber: macroSplit.fiber,
      targetWaterMl: macroSplit.waterMl,
    });
    triggerConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Metabolic BMR & TDEE Calculator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scientific Mifflin-St Jeor equation to calculate your exact caloric & macro needs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Biometrics Input Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Age
              </label>
              <input
                type="number"
                min="14"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.5"
                min="35"
                max="250"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                min="120"
                max="230"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Activity Level Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Activity Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {ACTIVITY_LEVELS.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setActivityLevel(act.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    activityLevel === act.id
                      ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-medium'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold">{act.label}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {act.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Dietary Goal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Dietary Goal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(DIET_GOALS).map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoalId(g.id)}
                  className={`p-3 rounded-xl border text-left transition ${
                    goalId === g.id
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{g.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                      {g.calorieAdjustment > 0
                        ? `+${g.calorieAdjustment} kcal`
                        : g.calorieAdjustment < 0
                        ? `${g.calorieAdjustment} kcal`
                        : 'Maintenance'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {g.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Calculation Result Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-900/60">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-200/60 dark:border-indigo-800/60">
              <div>
                <span className="text-xs text-indigo-700 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                  Target Energy Intake
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {targetCalories} <span className="text-sm font-normal text-slate-500">kcal/day</span>
                </div>
              </div>

              <div className="text-right text-xs text-slate-600 dark:text-slate-400">
                <div>BMR (Basal): <strong>{bmr}</strong> kcal</div>
                <div>TDEE (Maintenance): <strong>{tdee}</strong> kcal</div>
              </div>
            </div>

            {/* Target Macro Breakdown */}
            <div className="grid grid-cols-4 gap-2 mt-3 text-center">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/60">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                  Protein
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {macroSplit.protein}g
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/60">
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block">
                  Carbs
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {macroSplit.carbs}g
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/60">
                <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold block">
                  Fat
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {macroSplit.fat}g
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/60">
                <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold block">
                  Water
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {(macroSplit.waterMl / 1000).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyGoals}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply These Targets to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
