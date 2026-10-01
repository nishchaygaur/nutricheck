import React from 'react';
import { MealCard } from './MealCard.jsx';
import { PlusCircle, Sparkles } from 'lucide-react';

export function MealSection({ onAddFood }) {
  const mealKeys = ['breakfast', 'lunch', 'dinner', 'snacks'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Meals & Dietary Logs
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              (Today's schedule)
            </span>
          </h2>
        </div>

        <button
          onClick={() => onAddFood('breakfast')}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1.5 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Quick Log Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mealKeys.map((key) => (
          <MealCard key={key} mealKey={key} onAddFood={onAddFood} />
        ))}
      </div>
    </div>
  );
}
