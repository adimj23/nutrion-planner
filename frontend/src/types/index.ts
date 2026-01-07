// User types
export interface User {
  id: number;
  username: string;
  email: string;
  profile?: UserProfile;
  dietary_preferences?: UserDietaryPreference[];
}

export interface UserProfile {
  id: number;
  age: number;
  height: number;
  weight: number;
  activity_level: string;
  calorie_target: number;
  protein_target: number;
  carb_target: number;
  fat_target: number;
  created_at: string;
  updated_at: string;
}

// Food types
export interface FoodCategory {
  id: number;
  name: string;
  description: string;
}

export interface Food {
  id: number;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  categories: FoodCategory[];
  created_at: string;
  updated_at: string;
}

// Meal types
export interface MealFood {
  id: number;
  food: Food;
  food_id: number;
  quantity_in_grams: number;
  created_at: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface Meal {
  id: number;
  name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: MealFood[];
  total_nutrition: Nutrition;
  created_at: string;
  updated_at: string;
}

// Meal Plan types
export interface MealPlan {
  id: number;
  user: number;
  meals: Meal[];
  start_date?: string;
  end_date?: string;
  total_nutrition: Nutrition;
  created_at: string;
  updated_at: string;
}

export interface GroceryItem {
  food_id: number;
  food_name: string;
  total_quantity_grams: number;
  nutrition: Nutrition;
}

export interface GroceryList {
  meal_plan_id: number;
  items: GroceryItem[];
  total_items: number;
}

// Constraint types
export interface DietaryPattern {
  id: number;
  name: string;
  description: string;
  excluded_categories: FoodCategory[];
}

export interface UserDietaryPreference {
  id: number;
  user: number;
  pattern: DietaryPattern;
  pattern_id: number;
  custom_notes: string;
  created_at: string;
  updated_at: string;
}

export interface UserAllergy {
  id: number;
  user: number;
  food?: Food;
  food_id?: number;
  allergen_name: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface UserFoodDislike {
  id: number;
  user: number;
  food: Food;
  food_id: number;
  reason: string;
  created_at: string;
}

export interface UserConstraintsSummary {
  dietary_patterns: string[];
  allergies: string[];
  dislikes: string[];
  total_allowed_foods: number;
  total_excluded_foods: number;
}

