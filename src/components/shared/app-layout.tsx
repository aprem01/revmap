import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './sidebar';
import { CommandBar } from './command-bar';
import { ToastProvider } from './toast';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden lg:block" />
            <CommandBar />
            <div className="w-10 lg:hidden" /> {/* Spacer for balance */}
          </div>
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
