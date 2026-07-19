import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Sidebar, { type SidebarNavItem } from '@/components/common/Sidebar';
import { mockStudent } from '@/data/mockData';

const studentNavItems: SidebarNavItem[] = [
  { label: 'Dashboard', path: '/student/dashboard', icon: 'dashboard' },
  { label: 'My Courses', path: '/student/courses', icon: 'courses' },
  { label: 'Live Class', path: '/student/live', icon: 'live' },
  { label: 'Assignments', path: '/student/assignments', icon: 'assignments' },
  { label: 'Assessments', path: '/student/assessments', icon: 'assessments' },
  { label: 'Progress / Reports', path: '/student/progress', icon: 'progress' },
];

export default function StudentLayout() {
  return (
    <div className="relative min-h-screen app-gradient overflow-hidden">
      <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-primary-200/30 blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-primary-100/40 blur-3xl pointer-events-none" />
      <div className="relative">
        <Navbar userName={mockStudent.name} role={mockStudent.role} />
        <div className="flex">
          <Sidebar navItems={studentNavItems} />
          <main className="flex-1 px-6 py-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
