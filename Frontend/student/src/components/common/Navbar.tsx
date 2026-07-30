import { LogOut, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface NavbarProps {
  userName: string;
  role: string;
  onLogout?: () => void;
}

export default function Navbar({ userName, role, onLogout }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 glass-dark flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Student Portal</h2>
        <p className="text-xs text-gray-500 dark:text-slate-400">Enterprise Learning Management System</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          type="button"
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-700">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-sm font-semibold text-white shadow-lg shadow-primary-500/30">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{userName}</p>
            <p className="text-xs text-gray-500 capitalize dark:text-slate-400">{role.toLowerCase()}</p>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-red-400"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
