import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { healthCheck } from '../services/api';

function Home() {
  const [status, setStatus] = useState<string>('checking...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    healthCheck()
      .then((data) => setStatus(data.status))
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }, []);

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Nutrition Planner
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Plan your meals, track your nutrition, and manage your dietary constraints.
        </p>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Backend Status</h2>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                status === 'ok' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-gray-700">
              {status === 'ok' ? 'Connected' : error || 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/users"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Manage Users
            </h3>
            <p className="text-gray-600">
              Create and manage user accounts and profiles
            </p>
          </Link>

          <Link
            to="/meal-plans"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Meal Plans
            </h3>
            <p className="text-gray-600">
              Generate and view meal plans based on your goals
            </p>
          </Link>

          <Link
            to="/foods"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Foods Database
            </h3>
            <p className="text-gray-600">
              Browse and manage the foods database
            </p>
          </Link>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Dietary Constraints
            </h3>
            <p className="text-gray-600">
              Set up dietary preferences, allergies, and food dislikes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

