import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard / Today', icon: '📊', path: '/' },
    { name: 'Meal Planner', icon: '🍽️', path: '/meal-plans' },
    { name: 'Grocery List', icon: '🛒', path: '/meal-plans' },
    { name: 'Goals & Preferences', icon: '⚙️', path: '/users' },
    { name: 'Profile', icon: '👤', path: '/users' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 min-h-screen p-6">
          <div className="mb-8">
            <Link to="/">
              <h2 className="text-xl font-bold text-slate-900">Nutrition Planner</h2>
              <p className="text-sm text-slate-500 mt-1">Goal-driven nutrition</p>
            </Link>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;

