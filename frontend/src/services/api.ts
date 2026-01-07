import axios from 'axios';
import type {
  User,
  UserProfile,
  Food,
  Meal,
  MealPlan,
  GroceryList,
  UserDietaryPreference,
  UserAllergy,
  UserFoodDislike,
  DietaryPattern,
  FoodCategory,
  UserConstraintsSummary,
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const healthCheck = async (): Promise<{ status: string }> => {
  const response = await api.get('/health/');
  return response.data;
};

// User endpoints
export const userApi = {
  list: async (): Promise<User[]> => {
    const response = await api.get('/users/');
    return response.data;
  },

  get: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  create: async (data: { username: string; email: string; password: string }): Promise<User> => {
    const response = await api.post('/users/', data);
    return response.data;
  },

  getAllowedFoods: async (userId: number): Promise<Food[]> => {
    const response = await api.get(`/users/${userId}/allowed-foods/`);
    return response.data;
  },

  getConstraintsSummary: async (userId: number): Promise<UserConstraintsSummary> => {
    const response = await api.get(`/users/${userId}/constraints-summary/`);
    return response.data;
  },
};

// User Profile endpoints
export const profileApi = {
  get: async (userId: number): Promise<UserProfile> => {
    const response = await api.get(`/users/${userId}/profile/`);
    return response.data;
  },

  create: async (userId: number, data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.post(`/users/${userId}/profile/`, data);
    return response.data;
  },

  update: async (userId: number, data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put(`/users/${userId}/profile/`, data);
    return response.data;
  },
};

// Food endpoints
export const foodApi = {
  list: async (search?: string): Promise<Food[]> => {
    const params = search ? { search } : {};
    const response = await api.get('/foods/', { params });
    return response.data;
  },

  get: async (id: number): Promise<Food> => {
    const response = await api.get(`/foods/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Food>): Promise<Food> => {
    const response = await api.post('/foods/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Food>): Promise<Food> => {
    const response = await api.put(`/foods/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/foods/${id}/`);
  },

  checkAllowed: async (foodId: number, userId: number): Promise<{
    food_id: number;
    food_name: string;
    is_allowed: boolean;
    exclusion_reasons: string[];
  }> => {
    const response = await api.get(`/foods/${foodId}/check-allowed/`, {
      params: { user_id: userId },
    });
    return response.data;
  },
};

// Meal endpoints
export const mealApi = {
  list: async (mealType?: string): Promise<Meal[]> => {
    const params = mealType ? { meal_type: mealType } : {};
    const response = await api.get('/meals/', { params });
    return response.data;
  },

  get: async (id: number): Promise<Meal> => {
    const response = await api.get(`/meals/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Meal>): Promise<Meal> => {
    const response = await api.post('/meals/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Meal>): Promise<Meal> => {
    const response = await api.put(`/meals/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/meals/${id}/`);
  },
};

// Meal Plan endpoints
export const mealPlanApi = {
  list: async (userId?: number): Promise<MealPlan[]> => {
    const params = userId ? { user_id: userId } : {};
    const response = await api.get('/meal-plans/', { params });
    return response.data;
  },

  get: async (id: number): Promise<MealPlan> => {
    const response = await api.get(`/meal-plans/${id}/`);
    return response.data;
  },

  create: async (data: Partial<MealPlan>): Promise<MealPlan> => {
    const response = await api.post('/meal-plans/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<MealPlan>): Promise<MealPlan> => {
    const response = await api.put(`/meal-plans/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/meal-plans/${id}/`);
  },

  generate: async (userId: number, numDays: number = 1): Promise<MealPlan> => {
    const response = await api.post('/meal-plans/generate/', {
      user_id: userId,
      num_days: numDays,
    });
    return response.data;
  },

  getGroceryList: async (mealPlanId: number): Promise<GroceryList> => {
    const response = await api.get(`/meal-plans/${mealPlanId}/grocery-list/`);
    return response.data;
  },
};

// Constraint endpoints
export const constraintApi = {
  // Dietary Preferences
  getDietaryPreferences: async (userId?: number): Promise<UserDietaryPreference[]> => {
    const params = userId ? { user_id: userId } : {};
    const response = await api.get('/dietary-preferences/', { params });
    return response.data;
  },

  createDietaryPreference: async (data: Partial<UserDietaryPreference>): Promise<UserDietaryPreference> => {
    const response = await api.post('/dietary-preferences/', data);
    return response.data;
  },

  deleteDietaryPreference: async (id: number): Promise<void> => {
    await api.delete(`/dietary-preferences/${id}/`);
  },

  // Allergies
  getAllergies: async (userId?: number): Promise<UserAllergy[]> => {
    const params = userId ? { user_id: userId } : {};
    const response = await api.get('/allergies/', { params });
    return response.data;
  },

  createAllergy: async (data: Partial<UserAllergy>): Promise<UserAllergy> => {
    const response = await api.post('/allergies/', data);
    return response.data;
  },

  updateAllergy: async (id: number, data: Partial<UserAllergy>): Promise<UserAllergy> => {
    const response = await api.put(`/allergies/${id}/`, data);
    return response.data;
  },

  deleteAllergy: async (id: number): Promise<void> => {
    await api.delete(`/allergies/${id}/`);
  },

  // Food Dislikes
  getFoodDislikes: async (userId?: number): Promise<UserFoodDislike[]> => {
    const params = userId ? { user_id: userId } : {};
    const response = await api.get('/food-dislikes/', { params });
    return response.data;
  },

  createFoodDislike: async (data: Partial<UserFoodDislike>): Promise<UserFoodDislike> => {
    const response = await api.post('/food-dislikes/', data);
    return response.data;
  },

  deleteFoodDislike: async (id: number): Promise<void> => {
    await api.delete(`/food-dislikes/${id}/`);
  },

  // Dietary Patterns (read-only)
  getDietaryPatterns: async (): Promise<DietaryPattern[]> => {
    const response = await api.get('/dietary-patterns/');
    return response.data;
  },

  // Food Categories (read-only)
  getFoodCategories: async (): Promise<FoodCategory[]> => {
    const response = await api.get('/food-categories/');
    return response.data;
  },
};

export default api;

