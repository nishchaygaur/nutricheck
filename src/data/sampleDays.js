import { getFormattedDateKey } from '../utils/nutritionCalculators.js';

export function getInitialDemoData() {
  const today = new Date();
  const data = {};

  // Generate data for the last 7 days ending today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getFormattedDateKey(d);

    if (i === 0) {
      // TODAY: partially completed day with rich meals
      data[key] = {
        waterMl: 2250,
        waterTargetMl: 3000,
        exerciseBurned: 380, // e.g. 45 min strength training
        exerciseNotes: 'Chest & Triceps Hypertrophy (45m)',
        meals: {
          breakfast: [
            {
              id: 'log_b1',
              name: 'Power Rolled Oats with Blueberries',
              category: 'Breakfast',
              portion: 1,
              servingUnit: 'portion (70g oats + 80g berries)',
              calories: 310,
              protein: 11.2,
              carbs: 58.0,
              fat: 4.8,
              fiber: 8.5,
              sodium: 4,
              potassium: 320,
              icon: '🥣',
            },
            {
              id: 'log_b2',
              name: 'Whey Protein Isolate Shake',
              category: 'Breakfast',
              portion: 1,
              servingUnit: '1 scoop (30g)',
              calories: 120,
              protein: 25.0,
              carbs: 1.5,
              fat: 1.0,
              fiber: 0.0,
              sodium: 110,
              potassium: 160,
              icon: '🥤',
            },
          ],
          lunch: [
            {
              id: 'log_l1',
              name: 'Grilled Chicken Breast',
              category: 'Lunch',
              portion: 1.5,
              servingUnit: '150g',
              calories: 247,
              protein: 46.5,
              carbs: 0.0,
              fat: 5.4,
              fiber: 0.0,
              sodium: 111,
              potassium: 384,
              icon: '🍗',
            },
            {
              id: 'log_l2',
              name: 'Cooked Brown Rice',
              category: 'Lunch',
              portion: 1.2,
              servingUnit: '180g',
              calories: 198,
              protein: 4.2,
              carbs: 42.0,
              fat: 1.7,
              fiber: 3.4,
              sodium: 6,
              potassium: 100,
              icon: '🍚',
            },
            {
              id: 'log_l3',
              name: 'Steamed Broccoli Florets with Olive Oil',
              category: 'Lunch',
              portion: 1,
              servingUnit: '150g',
              calories: 115,
              protein: 4.2,
              carbs: 10.5,
              fat: 7.5,
              fiber: 3.9,
              sodium: 60,
              potassium: 457,
              icon: '🥦',
            },
          ],
          dinner: [
            {
              id: 'log_d1',
              name: 'Baked Atlantic Salmon Fillet',
              category: 'Dinner',
              portion: 1.3,
              servingUnit: '130g',
              calories: 268,
              protein: 28.6,
              carbs: 0.0,
              fat: 16.0,
              fiber: 0.0,
              sodium: 79,
              potassium: 499,
              icon: '🐟',
            },
            {
              id: 'log_d2',
              name: 'Baked Sweet Potato',
              category: 'Dinner',
              portion: 1,
              servingUnit: '130g',
              calories: 112,
              protein: 2.0,
              carbs: 26.0,
              fat: 0.1,
              fiber: 3.9,
              sodium: 71,
              potassium: 438,
              icon: '🍠',
            },
            {
              id: 'log_d3',
              name: 'Raw Baby Spinach Salad',
              category: 'Dinner',
              portion: 1,
              servingUnit: '100g',
              calories: 23,
              protein: 2.9,
              carbs: 3.6,
              fat: 0.4,
              fiber: 2.2,
              sodium: 79,
              potassium: 558,
              icon: '🥬',
            },
          ],
          snacks: [
            {
              id: 'log_s1',
              name: 'Fresh Haas Avocado with Lime',
              category: 'Snacks',
              portion: 0.6,
              servingUnit: '60g',
              calories: 96,
              protein: 1.2,
              carbs: 5.1,
              fat: 8.8,
              fiber: 4.0,
              sodium: 4,
              potassium: 291,
              icon: '🥑',
            },
            {
              id: 'log_s2',
              name: 'Raw Almonds',
              category: 'Snacks',
              portion: 1,
              servingUnit: '28g',
              calories: 164,
              protein: 6.0,
              carbs: 6.1,
              fat: 14.2,
              fiber: 3.5,
              sodium: 1,
              potassium: 208,
              icon: '🌰',
            },
          ],
        },
      };
    } else {
      // Historical past days for trend analysis
      const calorieVariations = [2150, 1980, 2240, 2050, 2180, 1920];
      const proteinVariations = [162, 154, 175, 158, 168, 149];
      const carbsVariations = [205, 185, 215, 195, 210, 180];
      const fatVariations = [65, 59, 72, 63, 67, 58];
      const burnedVariations = [420, 310, 500, 250, 450, 360];

      const idx = (6 - i) % 6;
      data[key] = {
        waterMl: 2500 + (idx % 3) * 250,
        waterTargetMl: 3000,
        exerciseBurned: burnedVariations[idx],
        exerciseNotes: 'Daily Workout',
        meals: {
          breakfast: [
            {
              id: `hist_b_${i}`,
              name: 'Oats & Protein Breakfast',
              category: 'Breakfast',
              portion: 1,
              servingUnit: 'serving',
              calories: Math.round(calorieVariations[idx] * 0.25),
              protein: Math.round(proteinVariations[idx] * 0.28),
              carbs: Math.round(carbsVariations[idx] * 0.35),
              fat: Math.round(fatVariations[idx] * 0.2),
              fiber: 7.5,
              sodium: 180,
              potassium: 350,
              icon: '🥣',
            },
          ],
          lunch: [
            {
              id: `hist_l_${i}`,
              name: 'Lean Protein & Rice Bowl',
              category: 'Lunch',
              portion: 1,
              servingUnit: 'serving',
              calories: Math.round(calorieVariations[idx] * 0.38),
              protein: Math.round(proteinVariations[idx] * 0.42),
              carbs: Math.round(carbsVariations[idx] * 0.4),
              fat: Math.round(fatVariations[idx] * 0.35),
              fiber: 9.0,
              sodium: 350,
              potassium: 620,
              icon: '🍗',
            },
          ],
          dinner: [
            {
              id: `hist_d_${i}`,
              name: 'Nutritious Dinner Plate',
              category: 'Dinner',
              portion: 1,
              servingUnit: 'serving',
              calories: Math.round(calorieVariations[idx] * 0.27),
              protein: Math.round(proteinVariations[idx] * 0.25),
              carbs: Math.round(carbsVariations[idx] * 0.18),
              fat: Math.round(fatVariations[idx] * 0.35),
              fiber: 8.2,
              sodium: 400,
              potassium: 540,
              icon: '🐟',
            },
          ],
          snacks: [
            {
              id: `hist_s_${i}`,
              name: 'Healthy Snack & Nuts',
              category: 'Snacks',
              portion: 1,
              servingUnit: 'serving',
              calories: Math.round(calorieVariations[idx] * 0.1),
              protein: Math.round(proteinVariations[idx] * 0.05),
              carbs: Math.round(carbsVariations[idx] * 0.07),
              fat: Math.round(fatVariations[idx] * 0.1),
              fiber: 3.5,
              sodium: 50,
              potassium: 190,
              icon: '🥑',
            },
          ],
        },
      };
    }
  }

  return data;
}

export const INITIAL_USER_PROFILE = {
  name: 'Alex Morgan',
  age: 28,
  gender: 'male',
  weightKg: 76,
  heightCm: 178,
  activityLevel: 'moderate',
  goalId: 'cut',
  targetCalories: 2200,
  targetProtein: 165,
  targetCarbs: 210,
  targetFat: 68,
  targetFiber: 32,
  targetWaterMl: 3000,
  streakDays: 14,
};
