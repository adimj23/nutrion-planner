import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { healthCheck } from '../services/api';

function StyleGuide() {
  const [status, setStatus] = useState<string>('checking...');
  const [error, setError] = useState<string | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<number>(1);

  useEffect(() => {
    healthCheck()
      .then((data) => setStatus(data.status))
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }, []);

  // Layout 1: Dashboard-First with Daily Summary
  const Layout1 = () => (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Today's Nutrition</h1>
          <p className="text-slate-600">Track your daily progress and plan ahead</p>
        </div>

        {/* Daily Summary Cards */}
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

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/meal-plans"
            className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Meal Planner</h3>
            </div>
            <p className="text-slate-600 mb-4">Generate personalized meal plans based on your goals and preferences</p>
            <div className="text-sm text-blue-600 font-medium">Plan meals →</div>
          </Link>

          <Link
            to="/meal-plans"
            className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Grocery List</h3>
            </div>
            <p className="text-slate-600 mb-4">View consolidated shopping list from your meal plans</p>
            <div className="text-sm text-emerald-600 font-medium">View list →</div>
          </Link>

          <Link
            to="/users"
            className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Goals & Preferences</h3>
            </div>
            <p className="text-slate-600 mb-4">Configure your dietary constraints and nutrition targets</p>
            <div className="text-sm text-purple-600 font-medium">Manage settings →</div>
          </Link>
        </div>
      </div>
    </div>
  );

  // Layout 2: Workflow-Oriented with Sidebar Navigation
  const Layout2 = () => (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 min-h-screen p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900">Nutrition Planner</h2>
            <p className="text-sm text-slate-500 mt-1">Goal-driven nutrition</p>
          </div>
          <nav className="space-y-1">
            {[
              { name: 'Dashboard / Today', icon: '📊', active: true },
              { name: 'Meal Planner', icon: '🍽️' },
              { name: 'Grocery List', icon: '🛒' },
              { name: 'Goals & Preferences', icon: '⚙️' },
              { name: 'Profile', icon: '👤' },
            ].map((item) => (
              <div
                key={item.name}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-slate-600">How are you doing today relative to your goals?</p>
            </div>

            {/* Quick Stats */}
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

            {/* Action Cards */}
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
          </div>
        </div>
      </div>
    </div>
  );

  // Layout 3: Card-Based Workflow with Separation of Concerns
  const Layout3 = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Nutrition Planner</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Daily tracking + Forward-looking planning = Better nutrition outcomes
          </p>
        </div>

        {/* Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Tracking */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Tracking</h3>
            <p className="text-sm text-slate-600 mb-4">
              Log daily meals and monitor progress against your goals
            </p>
            <div className="text-xs text-blue-600 font-medium">Today's progress →</div>
          </div>

          {/* Planning */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Planning</h3>
            <p className="text-sm text-slate-600 mb-4">
              Generate meal plans with LLM-powered, preference-aware suggestions
            </p>
            <Link to="/meal-plans" className="text-xs text-emerald-600 font-medium">
              Plan meals →
            </Link>
          </div>

          {/* Shopping */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Shopping</h3>
            <p className="text-sm text-slate-600 mb-4">
              Consolidated grocery lists from your meal plans, categorized and ready
            </p>
            <Link to="/meal-plans" className="text-xs text-amber-600 font-medium">
              View list →
            </Link>
          </div>

          {/* Setup */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Setup</h3>
            <p className="text-sm text-slate-600 mb-4">
              Define goals, constraints, and preferences that power the system
            </p>
            <Link to="/users" className="text-xs text-purple-600 font-medium">
              Configure →
            </Link>
          </div>
        </div>

        {/* Status and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">System Status</h3>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${status === 'ok' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-slate-700">
                {status === 'ok' ? 'All systems operational' : 'Connection issue detected'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/meal-plans"
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                Generate Plan
              </Link>
              <Link
                to="/users"
                className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
              >
                Update Goals
              </Link>
              <Link
                to="/foods"
                className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
              >
                Browse Foods
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Layout 4: Minimalist with Focus on Daily Progress
  const Layout4 = () => (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-light text-slate-900 mb-4 tracking-tight">
            Nutrition Planner
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mb-6"></div>
          <p className="text-lg text-slate-500 font-light">
            How am I doing today relative to my goals?
          </p>
        </div>

        {/* Daily Progress Ring */}
        <div className="flex justify-center mb-12">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-200"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88 * 0.62} ${2 * Math.PI * 88}`}
                className="text-blue-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-light text-slate-900">62%</div>
              <div className="text-sm text-slate-500 mt-1">of daily goal</div>
            </div>
          </div>
        </div>

        {/* Macro Breakdown */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Protein', value: '85g', target: '150g', color: 'blue' },
            { label: 'Carbs', value: '142g', target: '200g', color: 'emerald' },
            { label: 'Fat', value: '38g', target: '65g', color: 'amber' },
          ].map((macro) => (
            <div key={macro.label} className="text-center">
              <div className={`text-2xl font-light text-slate-900 mb-1`}>{macro.value}</div>
              <div className="text-sm text-slate-500">{macro.label}</div>
              <div className="text-xs text-slate-400 mt-1">of {macro.target}</div>
            </div>
          ))}
        </div>

        {/* Navigation Links */}
        <div className="space-y-3">
          {[
            { title: 'Meal Planner', desc: 'What should I eat next to stay on track?', link: '/meal-plans', icon: '→' },
            { title: 'Grocery List', desc: 'What do I need to buy to execute this plan?', link: '/meal-plans', icon: '→' },
            { title: 'Goals & Preferences', desc: 'Who am I, and what should the system optimize for?', link: '/users', icon: '→' },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="block p-6 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 italic">{item.desc}</p>
                </div>
                <span className="text-slate-400 group-hover:text-blue-600 transition-colors">{item.icon}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Status Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-50 rounded-full">
            <div className={`w-2 h-2 rounded-full ${status === 'ok' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-sm text-slate-600">
              {status === 'ok' ? 'System connected' : 'Connection issue'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Layout 5: Modern Dashboard with Workflow Visualization
  const Layout5 = () => (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Your nutrition workflow at a glance</p>
        </div>

        {/* Workflow Visualization */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Tracking */}
            <div className="flex-1 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Tracking</h3>
              <p className="text-sm text-slate-600">Daily logging</p>
            </div>

            <div className="hidden md:block text-slate-300 text-2xl">→</div>
            <div className="md:hidden text-slate-300 text-2xl">↓</div>

            {/* Planning */}
            <div className="flex-1 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍽️</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Planning</h3>
              <p className="text-sm text-slate-600">Meal generation</p>
            </div>

            <div className="hidden md:block text-slate-300 text-2xl">→</div>
            <div className="md:hidden text-slate-300 text-2xl">↓</div>

            {/* Shopping */}
            <div className="flex-1 text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Shopping</h3>
              <p className="text-sm text-slate-600">Grocery execution</p>
            </div>

            <div className="hidden md:block text-slate-300 text-2xl">→</div>
            <div className="md:hidden text-slate-300 text-2xl">↓</div>

            {/* Setup */}
            <div className="flex-1 text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚙️</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Setup</h3>
              <p className="text-sm text-slate-600">Preferences</p>
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/meal-plans"
            className="bg-white rounded-xl shadow-sm p-8 border-2 border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Meal Planner</h3>
                <p className="text-slate-600 mb-4">
                  Generate macro-constrained, preference-aware meal plans with LLM-powered suggestions
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <span className="text-3xl">🍽️</span>
              </div>
            </div>
            <div className="flex items-center text-blue-600 font-medium">
              Start planning <span className="ml-2">→</span>
            </div>
          </Link>

          <Link
            to="/users"
            className="bg-white rounded-xl shadow-sm p-8 border-2 border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Goals & Preferences</h3>
                <p className="text-slate-600 mb-4">
                  Configure dietary constraints, allergies, and nutrition targets that power the system
                </p>
              </div>
              <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <span className="text-3xl">⚙️</span>
              </div>
            </div>
            <div className="flex items-center text-emerald-600 font-medium">
              Manage settings <span className="ml-2">→</span>
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Today's Calories</div>
            <div className="text-2xl font-bold text-slate-900">1,247</div>
            <div className="text-xs text-slate-400 mt-1">62% of target</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Active Plans</div>
            <div className="text-2xl font-bold text-slate-900">3</div>
            <div className="text-xs text-slate-400 mt-1">This week</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Grocery Items</div>
            <div className="text-2xl font-bold text-slate-900">24</div>
            <div className="text-xs text-slate-400 mt-1">Pending</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">System Status</div>
            <div className="text-2xl font-bold text-slate-900">
              {status === 'ok' ? '✓' : '✗'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {status === 'ok' ? 'Operational' : 'Issue'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const layouts = [
    { name: 'Layout 1: Dashboard-First with Daily Summary', component: Layout1 },
    { name: 'Layout 2: Workflow-Oriented with Sidebar', component: Layout2 },
    { name: 'Layout 3: Card-Based Workflow (Separation of Concerns)', component: Layout3 },
    { name: 'Layout 4: Minimalist with Daily Progress Focus', component: Layout4 },
    { name: 'Layout 5: Modern Dashboard with Workflow Visualization', component: Layout5 },
  ];

  const CurrentLayout = layouts[selectedLayout - 1].component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Layout Selector */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Style Guide - Home Page Layouts</h2>
            <div className="flex space-x-2">
              {layouts.map((layout, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedLayout(idx + 1)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedLayout === idx + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">{layouts[selectedLayout - 1].name}</p>
          </div>
        </div>
      </div>

      {/* Current Layout Preview */}
      <div className="border-4 border-dashed border-blue-300 m-4 rounded-lg">
        <CurrentLayout />
      </div>

      {/* Layout Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Layout {selectedLayout} Details</h3>
          <div className="space-y-2 text-sm text-gray-600">
            {selectedLayout === 1 && (
              <>
                <p>• <strong>Dashboard-First:</strong> Daily summary cards with calorie and macro progress</p>
                <p>• <strong>Main Navigation:</strong> Three primary action cards (Meal Planner, Grocery List, Goals)</p>
                <p>• <strong>UX Focus:</strong> "How am I doing today relative to my goals?"</p>
                <p>• <strong>Design:</strong> Clean cards with light colors and subtle shadows</p>
              </>
            )}
            {selectedLayout === 2 && (
              <>
                <p>• <strong>Workflow-Oriented:</strong> Persistent sidebar navigation (Today vs Planning vs Setup)</p>
                <p>• <strong>Quick Stats:</strong> Gradient cards showing remaining calories, active plans, system status</p>
                <p>• <strong>Action Cards:</strong> Clear CTAs for meal planning and preference management</p>
                <p>• <strong>Design:</strong> Sidebar + main content area with modern gradient accents</p>
              </>
            )}
            {selectedLayout === 3 && (
              <>
                <p>• <strong>Separation of Concerns:</strong> Four distinct workflow cards (Tracking ≠ Planning ≠ Shopping ≠ Setup)</p>
                <p>• <strong>Workflow Visualization:</strong> Clear separation between daily habits and long-term planning</p>
                <p>• <strong>Quick Actions:</strong> Button-based navigation for common tasks</p>
                <p>• <strong>Design:</strong> Light gradient background with colorful icon cards</p>
              </>
            )}
            {selectedLayout === 4 && (
              <>
                <p>• <strong>Minimalist Focus:</strong> Large progress ring showing daily calorie progress</p>
                <p>• <strong>Macro Breakdown:</strong> Simple three-column display of protein, carbs, fat</p>
                <p>• <strong>Question-Based Navigation:</strong> Each link answers a key UX question from the outline</p>
                <p>• <strong>Design:</strong> Maximum whitespace, light typography, subtle borders</p>
              </>
            )}
            {selectedLayout === 5 && (
              <>
                <p>• <strong>Workflow Visualization:</strong> Horizontal flow showing Tracking → Planning → Shopping → Setup</p>
                <p>• <strong>Large Action Cards:</strong> Prominent meal planner and preferences cards</p>
                <p>• <strong>Stats Grid:</strong> Four metric cards at the bottom for quick reference</p>
                <p>• <strong>Design:</strong> Modern dashboard style with workflow visualization</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StyleGuide;
