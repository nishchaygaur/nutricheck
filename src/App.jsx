import React, { useState } from 'react';
import { NutritionProvider, useNutrition } from './context/NutritionContext.jsx';
import { Header } from './components/Header.jsx';
import { CalorieOverview } from './components/CalorieOverview.jsx';
import { MacroCards } from './components/MacroCards.jsx';
import { HydrationTracker } from './components/HydrationTracker.jsx';
import { MealSection } from './components/MealSection.jsx';
import { MicronutrientsPanel } from './components/MicronutrientsPanel.jsx';
import { AnalyticsCharts } from './components/AnalyticsCharts.jsx';
import { FoodLogModal } from './components/FoodLogModal.jsx';
import { CalculatorModal } from './components/CalculatorModal.jsx';
import { RecipeModal } from './components/RecipeModal.jsx';
import { GroceryListModal } from './components/GroceryListModal.jsx';
import { WorkoutModal } from './components/WorkoutModal.jsx';
import { GoogleFitCard } from './components/GoogleFitCard.jsx';
import { GoogleFitModal } from './components/GoogleFitModal.jsx';
import {
  Download,
  Upload,
  RefreshCw,
  PlusCircle,
  Calculator,
  Utensils,
  ShoppingCart,
  Dumbbell,
  ShieldCheck,
  HeartHandshake,
  Activity,
} from 'lucide-react';

function DashboardContent() {
  const {
    daysData,
    userProfile,
    clearCurrentDay,
    resetToDemoData,
    triggerConfetti,
  } = useNutrition();

  // Modal control states
  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState('breakfast');
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [groceryOpen, setGroceryOpen] = useState(false);
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [fitModalOpen, setFitModalOpen] = useState(false);

  const handleOpenFoodModal = (mealKey = 'breakfast') => {
    setActiveMealType(mealKey);
    setFoodModalOpen(true);
  };

  const handleExportJSON = () => {
    const exportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      userProfile,
      daysData,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nutritrack_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Sticky Top Navigation */}
      <Header
        onOpenFoodModal={handleOpenFoodModal}
        onOpenCalculator={() => setCalculatorOpen(true)}
        onOpenRecipes={() => setRecipeOpen(true)}
        onOpenGrocery={() => setGroceryOpen(true)}
        onOpenWorkout={() => setWorkoutOpen(true)}
        onOpenFitModal={() => setFitModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Row 1: Calorie Balance Ring & Energy Breakdown */}
        <section>
          <CalorieOverview
            onOpenWorkout={() => setWorkoutOpen(true)}
            onOpenCalculator={() => setCalculatorOpen(true)}
          />
        </section>

        {/* Row 2: Google Fit Activity & Steps Sync Widget */}
        <section>
          <GoogleFitCard onOpenFitModal={() => setFitModalOpen(true)} />
        </section>

        {/* Row 3: Core Macronutrient Target Cards */}
        <section>
          <MacroCards />
        </section>

        {/* Row 3: Hydration Tracking */}
        <section>
          <HydrationTracker />
        </section>

        {/* Row 4: Meal Schedule & Food Logs */}
        <section>
          <MealSection onAddFood={handleOpenFoodModal} />
        </section>

        {/* Row 5: Micronutrients & Electrolyte Assessment */}
        <section>
          <MicronutrientsPanel />
        </section>

        {/* Row 6: 7-Day Analytics & Trends Chart */}
        <section>
          <AnalyticsCharts />
        </section>

        {/* Quick Utility Strip */}
        <section className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Client-Side Privacy: All your data is stored locally in your browser storage.</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>

            <button
              onClick={clearCurrentDay}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 hover:text-rose-600 dark:text-slate-200 font-semibold transition"
            >
              Clear Today's Logs
            </button>

            <button
              onClick={resetToDemoData}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 hover:text-emerald-600 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </section>

      </main>

      {/* Floating Bottom Action Bar for Mobile Devices */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleOpenFoodModal('breakfast')}
          className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold">Log Food</span>
        </button>

        <button
          onClick={() => setCalculatorOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400"
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[10px] font-medium">BMR/TDEE</span>
        </button>

        <button
          onClick={() => setRecipeOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400"
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] font-medium">Recipes</span>
        </button>

        <button
          onClick={() => setGroceryOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[10px] font-medium">Grocery</span>
        </button>

        <button
          onClick={() => setWorkoutOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400"
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] font-medium">Burn</span>
        </button>

        <button
          onClick={() => setFitModalOpen(true)}
          className="flex flex-col items-center gap-1 text-blue-600 dark:text-blue-400"
        >
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-medium">Fit</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-8 pb-16 lg:pb-8 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-white">NutriTrack</span>
            <span>• Built for optimal human health and metabolic performance.</span>
          </div>
          <div>
            <span>Nutritional guidelines aligned with USDA and Dietary Reference Intakes (DRI).</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <FoodLogModal
        isOpen={foodModalOpen}
        onClose={() => setFoodModalOpen(false)}
        defaultMeal={activeMealType}
      />

      <CalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />

      <RecipeModal
        isOpen={recipeOpen}
        onClose={() => setRecipeOpen(false)}
      />

      <GroceryListModal
        isOpen={groceryOpen}
        onClose={() => setGroceryOpen(false)}
      />

      <WorkoutModal
        isOpen={workoutOpen}
        onClose={() => setWorkoutOpen(false)}
      />

      <GoogleFitModal
        isOpen={fitModalOpen}
        onClose={() => setFitModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <NutritionProvider>
      <DashboardContent />
    </NutritionProvider>
  );
}
