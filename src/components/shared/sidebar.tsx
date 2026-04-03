import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Workflow,
  Lightbulb,
  Building2,
  Users,
  GitBranch,
  FlaskConical,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/pipeline', icon: Workflow, label: 'Pipeline' },
  { to: '/app/recommendations', icon: Lightbulb, label: 'Recommendations' },
  { to: '/app/accounts', icon: Building2, label: 'Accounts' },
  { to: '/app/reps', icon: Users, label: 'Reps' },
  { to: '/app/territories', icon: GitBranch, label: 'Territories' },
  { to: '/app/scenarios', icon: FlaskConical, label: 'Scenarios' },
  { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-500/20">
              R
            </div>
            <span className="text-lg font-bold text-gray-900">RevMap</span>
          </div>
          <button onClick={onClose} className="lg:hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Main</p>
          <ul className="space-y-0.5">
            {navItems.slice(0, 3).map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/app'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <p className="px-3 mt-6 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Data</p>
          <ul className="space-y-0.5">
            {navItems.slice(3, 6).map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <p className="px-3 mt-6 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Intelligence</p>
          <ul className="space-y-0.5">
            {navItems.slice(6).map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-3 space-y-0.5">
          <NavLink
            to="/app/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Settings className="h-[18px] w-[18px]" />
            Settings
          </NavLink>
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back to site
          </NavLink>
        </div>
      </aside>
    </>
  );
}
