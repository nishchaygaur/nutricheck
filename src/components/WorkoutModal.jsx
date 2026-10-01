import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import { Dumbbell, X, Flame, Plus, Check } from 'lucide-react';

const WORKOUT_PRESETS = [
  { name: 'Strength & Hypertrophy Training', duration: '45 mins', calories: 350, icon: '🏋️' },
  { name: 'High Intensity Interval Training (HIIT)', duration: '30 mins', calories: 320, icon: '⚡' },
  { name: 'Outdoor Running / 5K', duration: '30 mins', calories: 380, icon: '🏃' },
  { name: 'Road Cycling / Spin', duration: '45 mins', calories: 340, icon: '🚴' },
  { name: 'Brisk Walking & Steps (10k)', duration: '60 mins', calories: 250, icon: '🚶' },
  { name: 'Lap Swimming', duration: '40 mins', calories: 420, icon: '🏊' },
];

export function WorkoutModal({ isOpen, onClose }) {
  const { currentDayData, setExerciseBurn, triggerConfetti } = useNutrition();

  const [calories, setCalories] = useState(currentDayData.exerciseBurned || '');
  const [notes, setNotes] = useState(currentDayData.exerciseNotes || '');

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setCalories(preset.calories);
    setNotes(preset.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setExerciseBurn(Number(calories) || 0, notes);
    triggerConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Log Active Exercise Burn
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calories burned increase your daily available caloric allowance
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Quick Select Workout Type:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {WORKOUT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 text-left transition flex items-start gap-2"
                >
                  <span className="text-lg">{preset.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      +{preset.calories} kcal ({preset.duration})
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Burned Calories (kcal) *
            </label>
            <div className="relative">
              <Flame className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500" />
              <input
                type="number"
                min="0"
                max="3000"
                required
                placeholder="e.g. 350"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Activity Notes (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Upper Body Push + 15m incline walk"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition active:scale-98 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Workout Calorie Burn</span>
          </button>
        </form>
      </div>
    </div>
  );
}
