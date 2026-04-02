import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Workflow,
  Lightbulb,
  Building2,
  Users,
  GitBranch,
  FlaskConical,
} from 'lucide-react';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/pipeline', icon: Workflow, label: 'Pipeline' },
  { to: '/app/recommendations', icon: Lightbulb, label: 'Recommendations' },
  { to: '/app/accounts', icon: Building2, label: 'Accounts' },
  { to: '/app/reps', icon: Users, label: 'Reps' },
  { to: '/app/territories', icon: GitBranch, label: 'Territories' },
  { to: '/app/scenarios', icon: FlaskConical, label: 'Scenarios' },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-bold">
          R
        </div>
        <span className="text-lg font-semibold text-gray-900">RevMap</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/app'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <NavLink to="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          ← Back to site
        </NavLink>
      </div>
    </aside>
  );
}
