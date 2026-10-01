import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getInitialDemoData, INITIAL_USER_PROFILE } from '../data/sampleDays.js';
import { getFormattedDateKey, calculateMacroSplit, DIET_GOALS } from '../utils/nutritionCalculators.js';
import {
  requestGoogleFitToken,
  fetchGoogleFitDayMetrics,
  getMockGoogleFitData,
} from '../services/googleFitService.js';
import confetti from 'canvas-confetti';

const NutritionContext = createContext(null);

const STORAGE_DAYS_KEY = 'nutritrack_days_v1';
const STORAGE_PROFILE_KEY = 'nutritrack_profile_v1';
const STORAGE_THEME_KEY = 'nutritrack_theme_v1';
const STORAGE_GOOGLE_FIT_KEY = 'nutritrack_google_fit_v1';

export function NutritionProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_THEME_KEY) || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark';
    if (isDark) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Date selection state
  const [selectedDate, setSelectedDate] = useState(() => getFormattedDateKey(new Date()));

  // User Profile & Nutrition Goals
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  // Days Nutrition Logs
  const [daysData, setDaysData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DAYS_KEY);
      return saved ? JSON.parse(saved) : getInitialDemoData();
    } catch {
      return getInitialDemoData();
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  }, [userProfile]);

  // Google Fit Integration State
  const [googleFit, setGoogleFit] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GOOGLE_FIT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      isConnected: true, // Default to true in demo mode so user sees it working immediately!
      clientId: '',
      accessToken: null,
      isSyncing: false,
      lastSyncedAt: 'Just now',
      metrics: {
        steps: 8420,
        stepTarget: 10000,
        caloriesBurned: 380,
        heartMinutes: 45,
        distanceKm: 6.2,
        hydrationMl: 2250,
      },
      error: null,
      isDemo: true,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GOOGLE_FIT_KEY, JSON.stringify(googleFit));
    } catch (e) {
      console.error('Failed to save googleFit state', e);
    }
  }, [googleFit]);

  // Ensure current selected date has an entry structure
  const currentDayData = useMemo(() => {
    const day = daysData[selectedDate];
    if (day) return day;
    return {
      waterMl: 0,
      waterTargetMl: userProfile.targetWaterMl || 3000,
      exerciseBurned: 0,
      exerciseNotes: '',
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      },
    };
  }, [daysData, selectedDate, userProfile.targetWaterMl]);

  // Computed Nutrition Totals for Selected Date
  const currentDayTotals = useMemo(() => {
    const meals = currentDayData.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] };
    const allItems = [
      ...(meals.breakfast || []),
      ...(meals.lunch || []),
      ...(meals.dinner || []),
      ...(meals.snacks || []),
    ];

    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0,
      potassium: 0,
      iron: 0,
      calcium: 0,
      magnesium: 0,
      vitaminC: 0,
      vitaminD: 0,
    };

    allItems.forEach((item) => {
      totals.calories += Number(item.calories) || 0;
      totals.protein += Number(item.protein) || 0;
      totals.carbs += Number(item.carbs) || 0;
      totals.fat += Number(item.fat) || 0;
      totals.fiber += Number(item.fiber) || 0;
      totals.sodium += Number(item.sodium) || 0;
      totals.potassium += Number(item.potassium) || 0;
    });

    // Approximate micros estimation for display realism
    totals.iron = Math.round((totals.calories / 2000) * 14 * 10) / 10;
    totals.calcium = Math.round((totals.protein * 6.5) + (totals.carbs * 1.5));
    totals.magnesium = Math.round((totals.fiber * 8.5) + (totals.calories * 0.08));
    totals.vitaminC = Math.round(allItems.length * 18);
    totals.vitaminD = Math.round(totals.fat * 0.22 * 10) / 10;

    // Round values
    totals.calories = Math.round(totals.calories);
    totals.protein = Math.round(totals.protein * 10) / 10;
    totals.carbs = Math.round(totals.carbs * 10) / 10;
    totals.fat = Math.round(totals.fat * 10) / 10;
    totals.fiber = Math.round(totals.fiber * 10) / 10;
    totals.sodium = Math.round(totals.sodium);
    totals.potassium = Math.round(totals.potassium);

    // Remaining Calories calculation: Target - Consumed + Burned
    const targetCalories = userProfile.targetCalories || 2200;
    const exerciseBurned = currentDayData.exerciseBurned || 0;
    const remainingCalories = targetCalories - totals.calories + exerciseBurned;

    return {
      ...totals,
      targetCalories,
      exerciseBurned,
      remainingCalories,
      pctCalories: Number(Math.min(100, (totals.calories / targetCalories) * 100).toFixed(2)),
      pctProtein: Number(Math.min(100, (totals.protein / (userProfile.targetProtein || 160)) * 100).toFixed(2)),
      pctCarbs: Number(Math.min(100, (totals.carbs / (userProfile.targetCarbs || 200)) * 100).toFixed(2)),
      pctFat: Number(Math.min(100, (totals.fat / (userProfile.targetFat || 65)) * 100).toFixed(2)),
      pctFiber: Number(Math.min(100, (totals.fiber / (userProfile.targetFiber || 30)) * 100).toFixed(2)),
      pctWater: Number(Math.min(100, (currentDayData.waterMl / (userProfile.targetWaterMl || 3000)) * 100).toFixed(2)),
    };
  }, [currentDayData, userProfile]);

  // Actions
  const addFoodToMeal = (mealType, foodItem, portionMultiplier = 1) => {
    const multiplier = Math.max(0.1, Number(portionMultiplier) || 1);
    const newLogItem = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: foodItem.name,
      category: mealType.charAt(0).toUpperCase() + mealType.slice(1),
      portion: multiplier,
      servingUnit: foodItem.servingUnit
        ? `${Math.round((foodItem.servingSize || 100) * multiplier)} ${foodItem.servingUnit}`
        : `${multiplier} serving`,
      calories: Math.round(foodItem.calories * multiplier),
      protein: Math.round(foodItem.protein * multiplier * 10) / 10,
      carbs: Math.round(foodItem.carbs * multiplier * 10) / 10,
      fat: Math.round(foodItem.fat * multiplier * 10) / 10,
      fiber: Math.round((foodItem.fiber || 0) * multiplier * 10) / 10,
      sodium: Math.round((foodItem.sodium || 0) * multiplier),
      potassium: Math.round((foodItem.potassium || 0) * multiplier),
      icon: foodItem.icon || '🥗',
    };

    setDaysData((prev) => {
      const day = prev[selectedDate] || {
        waterMl: 0,
        waterTargetMl: userProfile.targetWaterMl || 3000,
        exerciseBurned: 0,
        exerciseNotes: '',
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      };

      const existingMeal = day.meals[mealType] || [];
      return {
        ...prev,
        [selectedDate]: {
          ...day,
          meals: {
            ...day.meals,
            [mealType]: [newLogItem, ...existingMeal],
          },
        },
      };
    });

    // Fire celebration if goal reached
    if (currentDayTotals.calories + newLogItem.calories >= userProfile.targetCalories * 0.95 &&
        currentDayTotals.calories < userProfile.targetCalories * 0.95) {
      triggerConfetti();
    }
  };

  const removeFoodItem = (mealType, foodLogId) => {
    setDaysData((prev) => {
      const day = prev[selectedDate];
      if (!day || !day.meals[mealType]) return prev;

      return {
        ...prev,
        [selectedDate]: {
          ...day,
          meals: {
            ...day.meals,
            [mealType]: day.meals[mealType].filter((item) => item.id !== foodLogId),
          },
        },
      };
    });
  };

  const updateWater = (deltaMl) => {
    setDaysData((prev) => {
      const day = prev[selectedDate] || {
        waterMl: 0,
        waterTargetMl: userProfile.targetWaterMl || 3000,
        exerciseBurned: 0,
        exerciseNotes: '',
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      };

      const newWater = Math.max(0, (day.waterMl || 0) + deltaMl);
      if (newWater >= (userProfile.targetWaterMl || 3000) && (day.waterMl || 0) < (userProfile.targetWaterMl || 3000)) {
        triggerConfetti();
      }

      return {
        ...prev,
        [selectedDate]: {
          ...day,
          waterMl: newWater,
        },
      };
    });
  };

  const setExerciseBurn = (calories, notes = '') => {
    setDaysData((prev) => {
      const day = prev[selectedDate] || {
        waterMl: 0,
        waterTargetMl: userProfile.targetWaterMl || 3000,
        exerciseBurned: 0,
        exerciseNotes: '',
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      };

      return {
        ...prev,
        [selectedDate]: {
          ...day,
          exerciseBurned: Math.max(0, Number(calories) || 0),
          exerciseNotes: notes,
        },
      };
    });
  };

  const updateUserProfile = (newFields) => {
    setUserProfile((prev) => ({
      ...prev,
      ...newFields,
    }));
  };

  const applyGoalPreset = (goalId) => {
    const goal = DIET_GOALS[goalId];
    if (!goal) return;

    const baseTdee = 2400; // standard reference
    const targetCalories = baseTdee + goal.calorieAdjustment;
    const split = calculateMacroSplit(targetCalories, goalId);

    setUserProfile((prev) => ({
      ...prev,
      goalId,
      targetCalories: split.calories,
      targetProtein: split.protein,
      targetCarbs: split.carbs,
      targetFat: split.fat,
      targetFiber: split.fiber,
    }));
  };

  const resetToDemoData = () => {
    const initial = getInitialDemoData();
    setDaysData(initial);
    setUserProfile(INITIAL_USER_PROFILE);
    localStorage.removeItem(STORAGE_DAYS_KEY);
    localStorage.removeItem(STORAGE_PROFILE_KEY);
    triggerConfetti();
  };

  const clearCurrentDay = () => {
    setDaysData((prev) => ({
      ...prev,
      [selectedDate]: {
        waterMl: 0,
        waterTargetMl: userProfile.targetWaterMl || 3000,
        exerciseBurned: 0,
        exerciseNotes: '',
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      },
    }));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // fallback
    }
  };

  // Google Fit Actions
  const connectGoogleFitLive = (clientId) => {
    setGoogleFit((prev) => ({ ...prev, isSyncing: true, error: null, clientId }));

    requestGoogleFitToken(
      clientId,
      (token) => {
        setGoogleFit((prev) => ({
          ...prev,
          isConnected: true,
          accessToken: token,
          isDemo: false,
          isSyncing: false,
          error: null,
        }));
        syncGoogleFit(selectedDate, token, false);
      },
      (err) => {
        setGoogleFit((prev) => ({
          ...prev,
          isSyncing: false,
          error: err.message || 'Failed to authenticate with Google Fit',
        }));
      }
    );
  };

  const connectGoogleFitDemo = () => {
    setGoogleFit((prev) => ({
      ...prev,
      isConnected: true,
      isDemo: true,
      error: null,
    }));
    syncGoogleFit(selectedDate, null, true);
  };

  const disconnectGoogleFit = () => {
    setGoogleFit((prev) => ({
      ...prev,
      isConnected: false,
      accessToken: null,
      lastSyncedAt: null,
      error: null,
    }));
  };

  const syncGoogleFit = async (dateKey = selectedDate, tokenOverride = null, forceDemo = false) => {
    setGoogleFit((prev) => ({ ...prev, isSyncing: true, error: null }));

    try {
      const isDemoMode = forceDemo || googleFit.isDemo || (!googleFit.accessToken && !tokenOverride);
      let metrics;

      if (isDemoMode) {
        // Simulated network delay for authentic feel
        await new Promise((r) => setTimeout(r, 600));
        metrics = getMockGoogleFitData(dateKey);
      } else {
        const token = tokenOverride || googleFit.accessToken;
        metrics = await fetchGoogleFitDayMetrics(token, dateKey);
      }

      // Update days data with fetched calories and steps
      setDaysData((prev) => {
        const day = prev[dateKey] || {
          waterMl: 0,
          waterTargetMl: userProfile.targetWaterMl || 3000,
          exerciseBurned: 0,
          exerciseNotes: '',
          meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        };

        return {
          ...prev,
          [dateKey]: {
            ...day,
            exerciseBurned: metrics.caloriesBurned || day.exerciseBurned,
            exerciseNotes: `Google Fit: ${metrics.steps.toLocaleString()} steps • ${metrics.heartMinutes} active mins`,
          },
        };
      });

      setGoogleFit((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metrics: {
          ...prev.metrics,
          ...metrics,
        },
      }));

      triggerConfetti();
    } catch (err) {
      setGoogleFit((prev) => ({
        ...prev,
        isSyncing: false,
        error: err.message || 'Error fetching Google Fit data',
      }));
    }
  };

  return (
    <NutritionContext.Provider
      value={{
        theme,
        toggleTheme,
        selectedDate,
        setSelectedDate,
        userProfile,
        updateUserProfile,
        applyGoalPreset,
        daysData,
        currentDayData,
        currentDayTotals,
        addFoodToMeal,
        removeFoodItem,
        updateWater,
        setExerciseBurn,
        resetToDemoData,
        clearCurrentDay,
        triggerConfetti,
        googleFit,
        connectGoogleFitLive,
        connectGoogleFitDemo,
        disconnectGoogleFit,
        syncGoogleFit,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  const ctx = useContext(NutritionContext);
  if (!ctx) {
    throw new Error('useNutrition must be used within NutritionProvider');
  }
  return ctx;
}
