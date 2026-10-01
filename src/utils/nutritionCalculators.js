/**
 * Nutrition and Metabolic Health Calculators
 */

// Daily Micronutrient Recommended Daily Allowances (RDA)
export const RDA_MICRONUTRIENTS = {
  fiber: { name: 'Dietary Fiber', target: 30, unit: 'g', tip: 'Supports gut health and stable glycemic response' },
  sodium: { name: 'Sodium', target: 2000, unit: 'mg', max: 2300, tip: 'Keep under 2,300mg for optimal blood pressure' },
  potassium: { name: 'Potassium', target: 3500, unit: 'mg', tip: 'Essential for muscle contraction & electrolyte balance' },
  iron: { name: 'Iron', target: 18, unit: 'mg', tip: 'Vital for cellular oxygen transport' },
  calcium: { name: 'Calcium', target: 1000, unit: 'mg', tip: 'Maintains bone density and nerve signaling' },
  magnesium: { name: 'Magnesium', target: 400, unit: 'mg', tip: 'Crucial for enzymatic reactions and deep sleep' },
  vitaminC: { name: 'Vitamin C', target: 90, unit: 'mg', tip: 'Antioxidant defense and collagen synthesis' },
  vitaminD: { name: 'Vitamin D', target: 20, unit: 'mcg', tip: 'Immune resilience and hormonal balance' },
};

export const DIET_GOALS = {
  cut: {
    id: 'cut',
    name: 'Fat Loss (Cut)',
    calorieAdjustment: -500,
    macroRatio: { protein: 0.35, carbs: 0.35, fat: 0.30 },
    description: 'Moderate 500 kcal deficit with high protein to preserve lean muscle tissue.',
  },
  maintain: {
    id: 'maintain',
    name: 'Balanced Maintenance',
    calorieAdjustment: 0,
    macroRatio: { protein: 0.25, carbs: 0.50, fat: 0.25 },
    description: 'Even caloric balance to stabilize weight, boost stamina and energy.',
  },
  bulk: {
    id: 'bulk',
    name: 'Muscle Growth (Lean Bulk)',
    calorieAdjustment: 300,
    macroRatio: { protein: 0.30, carbs: 0.45, fat: 0.25 },
    description: 'Clean surplus to fuel hypertrophic muscle recovery and progressive overload.',
  },
  keto: {
    id: 'keto',
    name: 'Ketogenic (Low Carb)',
    calorieAdjustment: -300,
    macroRatio: { protein: 0.25, carbs: 0.05, fat: 0.70 },
    description: 'Very low carbohydrate intake to promote nutritional ketosis and fat oxidation.',
  },
  high_protein: {
    id: 'high_protein',
    name: 'High Protein Athletic',
    calorieAdjustment: 0,
    macroRatio: { protein: 0.40, carbs: 0.35, fat: 0.25 },
    description: 'Optimized for strength athletes, bodybuilders, and powerlifters.',
  },
};

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Desk job, little to no regular exercise', factor: 1.2 },
  { id: 'light', label: 'Light Exercise', desc: 'Active 1-3 days per week (walking, light cardio)', factor: 1.375 },
  { id: 'moderate', label: 'Moderate Exercise', desc: 'Workout 3-5 days per week (gym, jogging)', factor: 1.55 },
  { id: 'very_active', label: 'Very Active', desc: 'Hard exercise or sports 6-7 days a week', factor: 1.725 },
  { id: 'athlete', label: 'Extra Active', desc: 'Twice-a-day training or physical labor job', factor: 1.9 },
];

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor formula
 */
export function calculateBMR({ gender, weightKg, heightCm, age }) {
  if (gender === 'female') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
  // Default to male
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
export function calculateTDEE({ gender, weightKg, heightCm, age, activityLevel }) {
  const bmr = calculateBMR({ gender, weightKg, heightCm, age });
  const activity = ACTIVITY_LEVELS.find((a) => a.id === activityLevel) || ACTIVITY_LEVELS[2];
  const tdee = Math.round(bmr * activity.factor);
  return { bmr, tdee };
}

/**
 * Calculate recommended macros based on target calories and diet goal
 */
export function calculateMacroSplit(targetCalories, goalId = 'cut') {
  const goal = DIET_GOALS[goalId] || DIET_GOALS.maintain;
  const calories = Math.max(1200, targetCalories);

  // 1g Protein = 4 kcal, 1g Carbs = 4 kcal, 1g Fat = 9 kcal
  const proteinGrams = Math.round((calories * goal.macroRatio.protein) / 4);
  const carbsGrams = Math.round((calories * goal.macroRatio.carbs) / 4);
  const fatGrams = Math.round((calories * goal.macroRatio.fat) / 9);
  const fiberGrams = Math.max(28, Math.round((calories / 1000) * 14));

  return {
    calories,
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams,
    fiber: fiberGrams,
    waterMl: Math.round(calories * 1.3), // approx 1.3 ml per kcal
  };
}

/**
 * Format date helpers
 */
export function getFormattedDateKey(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateKey) {
  const todayKey = getFormattedDateKey(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = getFormattedDateKey(yesterdayDate);

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowKey = getFormattedDateKey(tomorrowDate);

  const [y, m, d] = dateKey.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const friendly = `${dayNames[dateObj.getDay()]}, ${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}`;

  if (dateKey === todayKey) return `Today (${friendly})`;
  if (dateKey === yesterdayKey) return `Yesterday (${friendly})`;
  if (dateKey === tomorrowKey) return `Tomorrow (${friendly})`;
  return friendly;
}
