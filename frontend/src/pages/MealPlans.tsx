import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mealPlanApi, userApi } from '../services/api';
import type { MealPlan, User } from '../types';

function MealPlans() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [numDays, setNumDays] = useState(1);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadUsers();
    loadMealPlans();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userApi.list();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to load users:', err);
    }
  };

  const loadMealPlans = async () => {
    try {
      setLoading(true);
      const data = await mealPlanApi.list(selectedUserId || undefined);
      setMealPlans(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load meal plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMealPlans();
  }, [selectedUserId]);

  const handleGenerate = async () => {
    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }
    try {
      setGenerating(true);
      await mealPlanApi.generate(selectedUserId, numDays);
      loadMealPlans();
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to generate meal plan');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="text-center">Loading meal plans...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Meal Plans</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Generate New Meal Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>
              <select
                value={selectedUserId || ''}
                onChange={(e) =>
                  setSelectedUserId(e.target.value ? parseInt(e.target.value) : null)
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Days
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={numDays}
                onChange={(e) => setNumDays(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={generating || !selectedUserId}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {generating ? 'Generating...' : 'Generate Meal Plan'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Calories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mealPlans.map((plan) => (
                <tr key={plan.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plan.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.meals.length} meals
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.total_nutrition.calories.toFixed(0)} kcal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(plan.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/meal-plans/${plan.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      View
                    </Link>
                    <Link
                      to={`/meal-plans/${plan.id}/grocery-list`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Grocery List
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {mealPlans.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No meal plans found. Generate one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MealPlans;

