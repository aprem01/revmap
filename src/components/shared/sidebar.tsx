import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Lightbulb,
  Building2,
  Users,
  Map,
  FlaskConical,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
  { to: '/accounts', icon: Building2, label: 'Accounts' },
  { to: '/reps', icon: Users, label: 'Reps' },
  { to: '/territories', icon: Map, label: 'Territories' },
  { to: '/scenarios', icon: FlaskConical, label: 'Scenarios' },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
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
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
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
        <p className="text-xs text-gray-400">RevMap v0.1.0</p>
      </div>
    </aside>
  );
}
