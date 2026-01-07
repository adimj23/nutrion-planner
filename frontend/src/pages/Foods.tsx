import { useEffect, useState } from 'react';
import { foodApi } from '../services/api';
import type { Food } from '../types';

function Foods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadFoods();
  }, [search]);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const data = await foodApi.list(search || undefined);
      setFoods(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">Loading foods...</div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Foods Database</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search foods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2"
            />
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calories/100g
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categories
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {foods.map((food) => (
                <tr key={food.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {food.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {food.calories_per_100g.toFixed(1)} kcal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {food.protein_per_100g.toFixed(1)}g
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {food.carbs_per_100g.toFixed(1)}g
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {food.fat_per_100g.toFixed(1)}g
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {food.categories.length > 0
                      ? food.categories.map((cat) => cat.name).join(', ')
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {foods.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {search ? 'No foods found matching your search.' : 'No foods in database.'}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Foods;

