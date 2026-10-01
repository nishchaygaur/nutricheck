import React, { useState, useMemo } from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import { FOOD_DATABASE, CATEGORIES } from '../data/foodDatabase.js';
import { Search, X, Plus, Sparkles, Check, ChevronRight } from 'lucide-react';

export function FoodLogModal({ isOpen, onClose, defaultMeal = 'breakfast' }) {
  const { addFoodToMeal } = useNutrition();

  const [activeTab, setActiveTab] = useState('database'); // 'database' | 'custom'
  const [selectedMeal, setSelectedMeal] = useState(defaultMeal);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState(null);
  const [portionMultiplier, setPortionMultiplier] = useState(1);

  // Custom food form state
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [customFiber, setCustomFiber] = useState('');
  const [customIcon, setCustomIcon] = useState('🥗');

  // Filtered food list
  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setPortionMultiplier(1);
  };

  const handleLogSelectedFood = () => {
    if (!selectedFood) return;
    addFoodToMeal(selectedMeal, selectedFood, portionMultiplier);
    setSelectedFood(null);
    onClose();
  };

  const handleLogCustomFood = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customCalories) return;

    const customItem = {
      id: 'custom_' + Date.now(),
      name: customName.trim(),
      category: 'Custom',
      servingSize: 1,
      servingUnit: 'portion',
      calories: Number(customCalories) || 0,
      protein: Number(customProtein) || 0,
      carbs: Number(customCarbs) || 0,
      fat: Number(customFat) || 0,
      fiber: Number(customFiber) || 0,
      sodium: 50,
      potassium: 150,
      icon: customIcon || '🍽️',
    };

    addFoodToMeal(selectedMeal, customItem, 1);
    // Reset form
    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    setCustomFiber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Log Nutritious Food</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select or search verified foods or enter custom macros
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Selector & Tabs */}
        <div className="px-5 pt-3 pb-2 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Destination Meal Pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Target Meal:
            </span>
            <div className="flex items-center p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => (
                <button
                  key={meal}
                  onClick={() => setSelectedMeal(meal)}
                  className={`px-2.5 py-1 rounded-lg font-medium capitalize transition ${
                    selectedMeal === meal
                      ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center p-1 bg-slate-200/60 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === 'database'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Food Database
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === 'custom'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Custom Food
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'database' ? (
            <div className="space-y-4">
              {/* Search input & category pills */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search foods (e.g., Avocado, Chicken breast, Oats, Quinoa)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Item Portion Tuner */}
              {selectedFood && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 animate-in fade-in duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-white dark:bg-slate-800 rounded-xl shadow-xs">
                        {selectedFood.icon}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {selectedFood.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Base Serving: {selectedFood.servingSize} {selectedFood.servingUnit}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedFood(null)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Change
                    </button>
                  </div>

                  {/* Portion Slider & Multiplier */}
                  <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        Portion Multiplier:
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                        {portionMultiplier}x (
                        {Math.round(selectedFood.servingSize * portionMultiplier)}{' '}
                        {selectedFood.servingUnit})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0.25"
                        max="3"
                        step="0.25"
                        value={portionMultiplier}
                        onChange={(e) => setPortionMultiplier(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <div className="flex gap-1">
                        {[0.5, 1, 1.5, 2].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setPortionMultiplier(m)}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              portionMultiplier === m
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {m}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Calculated Live Macros */}
                    <div className="mt-3.5 grid grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900/60">
                        <span className="text-[10px] text-slate-400 block">Calories</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {Math.round(selectedFood.calories * portionMultiplier)}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900/60">
                        <span className="text-[10px] text-emerald-600 block">Protein</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {Math.round(selectedFood.protein * portionMultiplier * 10) / 10}g
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900/60">
                        <span className="text-[10px] text-amber-600 block">Carbs</span>
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                          {Math.round(selectedFood.carbs * portionMultiplier * 10) / 10}g
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900/60">
                        <span className="text-[10px] text-rose-600 block">Fat</span>
                        <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                          {Math.round(selectedFood.fat * portionMultiplier * 10) / 10}g
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleLogSelectedFood}
                      className="mt-4 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/25 transition active:scale-98 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Log to {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Foods List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                {filteredFoods.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    No matching food found. Try searching for something else or add a custom food.
                  </div>
                ) : (
                  filteredFoods.map((food) => {
                    const isPicked = selectedFood?.id === food.id;
                    return (
                      <div
                        key={food.id}
                        onClick={() => handleSelectFood(food)}
                        className={`p-3 flex items-center justify-between cursor-pointer transition ${
                          isPicked
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/40'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{food.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              {food.name}
                              <span className="text-[10px] text-slate-400 font-normal">
                                ({food.servingSize} {food.servingUnit})
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{food.protein}g P</span> •{' '}
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">{food.carbs}g C</span> •{' '}
                              <span className="text-rose-600 dark:text-rose-400 font-semibold">{food.fat}g F</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {food.calories}
                            </span>
                            <span className="text-[10px] text-slate-400 block">kcal</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* Custom Food Entry Tab */
            <form onSubmit={handleLogCustomFood} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
                Log any homemade recipe, restaurant meal, or packaged food with your own nutritional values.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Food Name *
                </label>
                <div className="flex gap-2">
                  <select
                    value={customIcon}
                    onChange={(e) => setCustomIcon(e.target.value)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg"
                  >
                    <option value="🥗">🥗</option>
                    <option value="🍗">🍗</option>
                    <option value="🥩">🥩</option>
                    <option value="🐟">🐟</option>
                    <option value="🥪">🥪</option>
                    <option value="🥣">🥣</option>
                    <option value="🥑">🥑</option>
                    <option value="🍎">🍎</option>
                    <option value="☕">☕</option>
                    <option value="🍰">🍰</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Mom's Chicken Curry with Rice"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Calories (kcal) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 450"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 35"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 40"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 12"
                    value={customFat}
                    onChange={(e) => setCustomFat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Fiber (g) (optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 6"
                  value={customFiber}
                  onChange={(e) => setCustomFiber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/25 transition active:scale-98 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Log Custom Food to {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
