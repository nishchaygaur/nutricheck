# 🥗 NutriTrack Pro — Smart Nutritional & Health Dashboard

A high-performance, responsive, 100% frontend-only Nutritional Intelligence & Meal Tracking Dashboard built with **React 19**, **Vite**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 1. ⚡ Caloric Budget & Energy Deficit Tracking
- **Interactive Radial Gauge**: Visual circular gauge displaying calories consumed vs daily budget.
- **Dynamic Energy Balance**: Tracks `Target - Food Intake + Exercise Burn = Net Remaining Calories`.
- **Macro Calorie Split Bar**: Real-time ratio bar depicting percentage of daily calories derived from Protein, Carbohydrates, and Fats.

### 2. 🍗 Precision Macronutrient Cards
- **Dedicated Progress Cards**: For **Protein**, **Carbohydrates**, **Healthy Fats**, and **Dietary Fiber**.
- Progress bars with target benchmarks, consumed amounts, remaining grams, and completion badges.

### 3. 💧 Smart Hydration Tracker
- **Visual Cup Tracking**: Interactive water intake system based on target fluid allowance (e.g. 3.0L / day).
- **Quick Controls**: Increment or decrement with `+250ml`, `+500ml Bottle`, and `-250ml` buttons.
- Real-time hydration coaching based on daily completion percentage.

### 4. 🍽️ Comprehensive Meal Logging by Category
- **Categorized Sections**: Breakfast, Lunch, Dinner, and Snacks & Extras.
- Subtotal calories and macro breakdowns for each individual meal.
- Food item management: view portion, calories, macros, and 1-click delete.
- Quick recommendation prompts for empty meal sections.

### 5. 🔍 Built-in 50+ Food Database & Custom Food Creator
- **Fast Search & Filter**: Search foods by name or filter by category (*Protein, Carbs, Fats, Vegetables, Snacks*).
- **Interactive Serving Multiplier**: Adjust portion size slider (0.25x to 3.0x) with instant nutritional calculation before logging.
- **Custom Food Entry**: Direct manual logging for home-cooked meals, restaurant dishes, or packaged goods with custom calories, protein, carbs, fat, and fiber.

### 6. 🔬 Micronutrients & Electrolyte Balance Panel
- Tracks Recommended Daily Allowances (RDA) for **Dietary Fiber, Potassium, Sodium, Iron, Calcium, Magnesium, Vitamin C, and Vitamin D**.
- **Sodium-to-Potassium Ratio**: Evaluates cardiovascular and hydration balance.
- Detailed expandable drawer with educational dietary guidance.

### 7. 📈 7-Day Historical Analytics & Trends
- **Multi-Day Charts**: Switch between **Daily Calories vs Target**, **Stacked Macro Distribution**, and **Hydration Volume**.
- Interactive day selection: Click any bar to navigate directly to that day's log.
- Displays weekly averages for daily calories, protein, hydration, and overall consistency score.

### 8. 🧮 Scientific BMR & TDEE Health Calculator
- Implements the clinically validated **Mifflin-St Jeor formula**.
- Considers gender, age, weight, height, and activity level (Sedentary to Athlete).
- Select goals (*Fat Loss Cut, Balanced Maintenance, Muscle Growth Bulk, Ketogenic, High Protein*).
- **1-Click Apply**: Directly updates all your dashboard calorie and macro targets.

### 9. 👨‍🍳 Chef-Curated Recipe Inspiration
- High-protein, nutrient-dense recipe collection with prep times, tags, and macro breakdowns.
- 1-click "Add Recipe to Today's Meal" directly logs the meal into your schedule.

### 10. 🛒 Smart Grocery Checklist
- Automatically derives a grocery shopping list from your logged foods.
- Check off items as you shop, add custom grocery items, and copy the list to clipboard.

### 11. 🏋️ Active Exercise Calorie Burn Logger
- Log workouts (Strength training, HIIT, 5K Run, Cycling, Brisk Walk, Swimming) or custom burns.
- Adds burned calories directly into your available daily energy allowance.

### 12. ⌚ Google Fit Integration (100% Client-Side)
- **Automatic Activity Synchronization**: Fetches daily **Steps**, **Active Calorie Burn**, **Heart Points**, and **Distance** directly from Google Fit.
- **Two Sync Modes**:
  - **Instant Sandbox / Demo Sync**: Allows immediate 1-click testing with realistic activity streams without needing Google Cloud credentials.
  - **Live Google Cloud OAuth 2.0**: Connect your actual Google account using Google Identity Services (GIS) and the Google Fitness REST API.
- Automatically adds synced Google Fit calories directly to your daily caloric budget!

### 13. 🔒 100% Client-Side & Offline Ready
- No external server or database required.
- Everything persists securely in browser `localStorage`.
- Includes **JSON Backup Export**, **Clear Day**, and **Reset Sample Data** options.
- Dark & Light mode toggle with glassmorphism UI.

---

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```
