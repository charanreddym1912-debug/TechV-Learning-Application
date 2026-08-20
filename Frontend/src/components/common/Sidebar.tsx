import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, GraduationCap, Calendar,ClipboardCheck,
  MessagesSquare,ClipboardList, BarChart3, Video, FileText, CheckSquare,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { Role } from '../../types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: Record<Role, NavItem[]> = {
  COORDINATOR: [
    { label: 'Dashboard',   path: '/coordinator/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Courses',     path: '/coordinator/courses',   icon: <BookOpen size={20} /> },
    { label: 'Batches',     path: '/coordinator/batches',   icon: <Users size={20} /> },
    { label: 'Trainers',    path: '/coordinator/trainers',  icon: <GraduationCap size={20} /> },
    { label: 'Students',    path: '/coordinator/students',  icon: <Users size={20} /> },
    { label: 'Schedule',    path: '/coordinator/schedule',  icon: <Calendar size={20} /> },
  ],
  TRAINER: [
    { label: 'Dashboard',   path: '/trainer/dashboard',    icon: <LayoutDashboard size={20} /> },
    { label: 'My Classes',  path: '/trainer/classes',      icon: <Video size={20} /> },
    { label: 'Attendance',  path: '/trainer/attendance',   icon: <CheckSquare size={20} /> },
    { label: 'Assignments', path: '/trainer/assignments',  icon: <FileText size={20} /> },
    { label: 'Assessments', path: '/trainer/assessment',  icon: <ClipboardCheck size={20} /> },
    { label: 'Mock Interviews', path: '/trainer/mock-interview', icon: <MessagesSquare size={20} /> },
    { label: 'Grades',      path: '/trainer/grades',       icon: <BarChart3 size={20} /> },
  ],
  STUDENT: [
    { label: 'Dashboard',   path: '/student/dashboard',    icon: <LayoutDashboard size={20} /> },
    { label: 'My Courses',  path: '/student/courses',      icon: <BookOpen size={20} /> },
    { label: 'Live Class',  path: '/student/live',         icon: <Video size={20} /> },
    { label: 'Assignments', path: '/student/assignments',  icon: <ClipboardList size={20} /> },
    { label: 'Progress',    path: '/student/progress',     icon: <BarChart3 size={20} /> },
  ],
};

const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const items = role ? navItems[role] : [];

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 min-h-screen flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white tracking-tight">📚 TechV LMS</h2>
        <p className="text-xs text-gray-500 mt-1 capitalize">{role?.toLowerCase()} Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
