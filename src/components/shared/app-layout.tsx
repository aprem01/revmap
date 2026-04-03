import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { CommandBar } from './command-bar';

export function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with command bar */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-3">
          <div />
          <CommandBar />
          <div />
        </div>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
