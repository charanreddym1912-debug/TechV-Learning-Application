import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  FileText,
  BarChart3,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';

export interface SidebarNavItem {
  label: string;
  path: string;
  icon: 'dashboard' | 'courses' | 'live' | 'assignments' | 'assessments' | 'progress';
}

interface SidebarProps {
  navItems: SidebarNavItem[];
}

const iconMap = {
  dashboard: LayoutDashboard,
  courses: BookOpen,
  live: Video,
  assignments: FileText,
  assessments: ClipboardList,
  progress: BarChart3,
};

export default function Sidebar({ navItems }: SidebarProps) {
  return (
    <aside className="w-64 glass-dark flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="p-6 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900 dark:text-slate-100">Enterprise LMS</p>
            <p className="text-xs text-primary-600 dark:text-primary-400">Student Module</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border border-primary-100 shadow-sm dark:bg-primary-500/15 dark:text-primary-300 dark:border-primary-500/30'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-slate-800">
        <div className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-100 text-[11px] text-center dark:bg-primary-500/10 dark:text-primary-300 dark:border-primary-500/20">
          TechV Enterprise Learning Portal
        </div>
      </div>
    </aside>
  );
}
