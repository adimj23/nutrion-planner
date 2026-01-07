import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mealPlanApi } from '../services/api';
import type { GroceryList as GroceryListType } from '../types';

function GroceryList() {
  const { id } = useParams<{ id: string }>();
  const [groceryList, setGroceryList] = useState<GroceryListType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadGroceryList();
    }
  }, [id]);

  const loadGroceryList = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await mealPlanApi.getGroceryList(parseInt(id));
      setGroceryList(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load grocery list');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="text-center">Loading grocery list...</div>
      </div>
    );
  }

  if (error || !groceryList) {
    return (
      <div className="px-4 py-8">
        <div className="text-center text-red-600">{error || 'Grocery list not found'}</div>
        <Link to="/meal-plans" className="text-indigo-600 hover:text-indigo-900 mt-4 inline-block">
          ← Back to Meal Plans
        </Link>
      </div>
    );
  }

  const totalNutrition = groceryList.items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.nutrition.calories,
      protein: acc.protein + item.nutrition.protein,
      carbs: acc.carbs + item.nutrition.carbs,
      fat: acc.fat + item.nutrition.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to={`/meal-plans/${groceryList.meal_plan_id}`}
            className="text-indigo-600 hover:text-indigo-900 mb-4 inline-block"
          >
            ← Back to Meal Plan
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Grocery List</h1>
          <p className="text-gray-600 mt-2">
            Meal Plan #{groceryList.meal_plan_id} • {groceryList.total_items} items
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Total Nutrition</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500">Total Calories</div>
              <div className="text-2xl font-bold text-gray-900">
                {totalNutrition.calories.toFixed(0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Protein</div>
              <div className="text-2xl font-bold text-gray-900">
                {totalNutrition.protein.toFixed(1)}g
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Carbs</div>
              <div className="text-2xl font-bold text-gray-900">
                {totalNutrition.carbs.toFixed(1)}g
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Fat</div>
              <div className="text-2xl font-bold text-gray-900">
                {totalNutrition.fat.toFixed(1)}g
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Food
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Protein
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carbs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fat
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groceryList.items.map((item) => (
                <tr key={item.food_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.food_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.total_quantity_grams.toFixed(1)}g
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.nutrition.calories.toFixed(0)} kcal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.nutrition.protein.toFixed(1)}g
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.nutrition.carbs.toFixed(1)}g
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.nutrition.fat.toFixed(1)}g
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GroceryList;

