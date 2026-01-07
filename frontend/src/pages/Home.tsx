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
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-600">How are you doing today relative to your goals?</p>
      </div>

      {/* Daily Summary Cards - From Layout 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Calories</span>
            <div className={`w-2 h-2 rounded-full ${status === 'ok' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </div>
          <div className="text-2xl font-bold text-slate-900">1,247</div>
          <div className="text-sm text-slate-500 mt-1">of 2,000 target</div>
          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" style={{ width: '62%' }} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="text-sm font-medium text-slate-600 mb-2">Protein</div>
          <div className="text-2xl font-bold text-slate-900">85g</div>
          <div className="text-sm text-slate-500 mt-1">of 150g target</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="text-sm font-medium text-slate-600 mb-2">Carbs</div>
          <div className="text-2xl font-bold text-slate-900">142g</div>
          <div className="text-sm text-slate-500 mt-1">of 200g target</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="text-sm font-medium text-slate-600 mb-2">Fat</div>
          <div className="text-2xl font-bold text-slate-900">38g</div>
          <div className="text-sm text-slate-500 mt-1">of 65g target</div>
        </div>
      </div>

      {/* Quick Stats - From Layout 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
          <div className="text-sm font-medium text-blue-700 mb-1">Remaining Calories</div>
          <div className="text-3xl font-bold text-blue-900">753</div>
          <div className="text-xs text-blue-600 mt-2">62% of target consumed</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6">
          <div className="text-sm font-medium text-emerald-700 mb-1">Meal Plans</div>
          <div className="text-3xl font-bold text-emerald-900">3</div>
          <div className="text-xs text-emerald-600 mt-2">Active this week</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
          <div className="text-sm font-medium text-purple-700 mb-1">System Status</div>
          <div className="text-3xl font-bold text-purple-900">
            {status === 'ok' ? '✓' : '✗'}
          </div>
          <div className="text-xs text-purple-600 mt-2">
            {status === 'ok' ? 'All systems operational' : 'Connection issue'}
          </div>
        </div>
      </div>

      {/* Action Cards - From Layout 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/meal-plans"
          className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Plan Your Meals</h3>
          <p className="text-slate-600 text-sm mb-4">
            Generate personalized meal plans with macro-constrained, preference-aware suggestions
          </p>
          <div className="flex items-center text-blue-600 text-sm font-medium">
            Start planning <span className="ml-2">→</span>
          </div>
        </Link>

        <Link
          to="/users"
          className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Update Preferences</h3>
          <p className="text-slate-600 text-sm mb-4">
            Adjust your dietary constraints, allergies, and nutrition goals
          </p>
          <div className="flex items-center text-emerald-600 text-sm font-medium">
            Manage settings <span className="ml-2">→</span>
          </div>
        </Link>
      </div>
    </>
  );
}

export default Home;
