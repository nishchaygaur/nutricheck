import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import { RECIPES } from '../data/recipes.js';
import { FOOD_DATABASE } from '../data/foodDatabase.js';
import { Utensils, X, Clock, Plus, CheckCircle, ChefHat } from 'lucide-react';

export function RecipeModal({ isOpen, onClose }) {
  const { addFoodToMeal, triggerConfetti } = useNutrition();
  const [selectedRecipe, setSelectedRecipe] = useState(RECIPES[0]);
  const [targetMeal, setTargetMeal] = useState('lunch');
  const [addedMessage, setAddedMessage] = useState(false);

  if (!isOpen) return null;

  const handleAddRecipeToLog = () => {
    if (!selectedRecipe) return;

    // Log the entire recipe as a single curated food item or by ingredients
    const recipeFoodItem = {
      id: 'rec_log_' + Date.now(),
      name: selectedRecipe.name,
      category: targetMeal.charAt(0).toUpperCase() + targetMeal.slice(1),
      servingSize: 1,
      servingUnit: 'serving',
      calories: selectedRecipe.calories,
      protein: selectedRecipe.protein,
      carbs: selectedRecipe.carbs,
      fat: selectedRecipe.fat,
      fiber: selectedRecipe.fiber,
      sodium: 320,
      potassium: 540,
      icon: selectedRecipe.image,
    };

    addFoodToMeal(targetMeal, recipeFoodItem, 1);
    setAddedMessage(true);
    triggerConfetti();

    setTimeout(() => {
      setAddedMessage(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Chef-Curated Nutrient-Dense Recipes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Balanced meals crafted for high protein retention, low GI energy, and optimal satiety
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

        {/* Content Body Grid: Left list of recipes, Right detail view */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          
          {/* Left Recipes Selector */}
          <div className="md:col-span-5 p-3 space-y-2 overflow-y-auto">
            {RECIPES.map((recipe) => {
              const isSelected = selectedRecipe.id === recipe.id;
              return (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`p-3 rounded-2xl cursor-pointer transition border text-left flex items-start gap-3 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs'
                      : 'border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span className="text-2xl p-2 bg-white dark:bg-slate-800 rounded-xl shadow-xs">
                    {recipe.image}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {recipe.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {recipe.calories} kcal • {recipe.protein}g protein
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {recipe.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Recipe Details */}
          <div className="md:col-span-7 p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                      {selectedRecipe.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedRecipe.prepTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {selectedRecipe.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {selectedRecipe.description}
                  </p>
                </div>
              </div>

              {/* Recipe Macros Grid */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-semibold">Calories</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {selectedRecipe.calories}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-emerald-600 block font-semibold">Protein</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {selectedRecipe.protein}g
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-amber-600 block font-semibold">Carbs</span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">
                    {selectedRecipe.carbs}g
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-rose-600 block font-semibold">Fat</span>
                  <span className="text-base font-black text-rose-600 dark:text-rose-400">
                    {selectedRecipe.fat}g
                  </span>
                </div>
              </div>

              {/* Ingredients List */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">
                  Ingredients Breakdown
                </h4>
                <div className="space-y-1.5">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {ing.name}
                      </span>
                      <span className="text-[11px] text-slate-400">verified raw</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Meal Selector and Action */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Log as:</span>
                <select
                  value={targetMeal}
                  onChange={(e) => setTargetMeal(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold capitalize text-slate-800 dark:text-slate-200"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              <button
                onClick={handleAddRecipeToLog}
                disabled={addedMessage}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 disabled:bg-emerald-600"
              >
                {addedMessage ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Added to {targetMeal}!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Recipe to Today's {targetMeal}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
