import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mealPlanApi } from '../services/api';
import type { MealPlan } from '../types';

function MealPlanDetail() {
  const { id } = useParams<{ id: string }>();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadMealPlan();
    }
  }, [id]);

  const loadMealPlan = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await mealPlanApi.get(parseInt(id));
      setMealPlan(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load meal plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="text-center">Loading meal plan...</div>
      </div>
    );
  }

  if (error || !mealPlan) {
    return (
      <div className="px-4 py-8">
        <div className="text-center text-red-600">{error || 'Meal plan not found'}</div>
        <Link to="/meal-plans" className="text-indigo-600 hover:text-indigo-900 mt-4 inline-block">
          ← Back to Meal Plans
        </Link>
      </div>
    );
  }

  const mealsByType = mealPlan.meals.reduce((acc, meal) => {
    if (!acc[meal.meal_type]) {
      acc[meal.meal_type] = [];
    }
    acc[meal.meal_type].push(meal);
    return acc;
  }, {} as Record<string, typeof mealPlan.meals>);

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            to="/meal-plans"
            className="text-indigo-600 hover:text-indigo-900 mb-4 inline-block"
          >
            ← Back to Meal Plans
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Meal Plan #{mealPlan.id}</h1>
            <Link
              to={`/meal-plans/${mealPlan.id}/grocery-list`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              View Grocery List
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Total Nutrition</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500">Calories</div>
              <div className="text-2xl font-bold text-gray-900">
                {mealPlan.total_nutrition.calories.toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Protein</div>
              <div className="text-2xl font-bold text-gray-900">
                {mealPlan.total_nutrition.protein.toFixed(1)}g
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Carbs</div>
              <div className="text-2xl font-bold text-gray-900">
                {mealPlan.total_nutrition.carbs.toFixed(1)}g
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Fat</div>
              <div className="text-2xl font-bold text-gray-900">
                {mealPlan.total_nutrition.fat.toFixed(1)}g
              </div>
            </div>
          </div>
        </div>

        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
          const meals = mealsByType[mealType] || [];
          if (meals.length === 0) return null;

          return (
            <div key={mealType} className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 capitalize">{mealType}</h2>
              <div className="space-y-6">
                {meals.map((meal) => (
                  <div key={meal.id} className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">{meal.name}</h3>
                    <div className="mb-3">
                      <div className="text-sm text-gray-600 mb-2">Foods:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {meal.foods.map((mealFood) => (
                          <li key={mealFood.id} className="text-sm text-gray-700">
                            {mealFood.food.name} ({mealFood.quantity_in_grams}g)
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Calories: </span>
                        <span className="font-medium">
                          {meal.total_nutrition.calories.toFixed(0)} kcal
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Protein: </span>
                        <span className="font-medium">
                          {meal.total_nutrition.protein.toFixed(1)}g
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Carbs: </span>
                        <span className="font-medium">
                          {meal.total_nutrition.carbs.toFixed(1)}g
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Fat: </span>
                        <span className="font-medium">
                          {meal.total_nutrition.fat.toFixed(1)}g
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MealPlanDetail;

