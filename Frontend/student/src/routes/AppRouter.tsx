import { Navigate, Route, Routes } from 'react-router-dom';
import StudentLayout from '@/layouts/StudentLayout';
import StudentDashboard from '@/pages/student/StudentDashboard';
import MyCoursesPage from '@/pages/student/MyCoursesPage';
import LiveClassPage from '@/pages/student/LiveClassPage';
import StudentAssignmentsPage from '@/pages/student/StudentAssignmentsPage';
import AssessmentsPage from '@/pages/student/AssessmentsPage';
import ProgressPage from '@/pages/student/ProgressPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<MyCoursesPage />} />
        <Route path="live" element={<LiveClassPage />} />
        <Route path="assignments" element={<StudentAssignmentsPage />} />
        <Route path="assessments" element={<AssessmentsPage />} />
        <Route path="progress" element={<ProgressPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function NotFoundPage() {
  return (
    <div className="relative min-h-screen app-gradient flex items-center justify-center overflow-hidden">
      <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-primary-200/30 blur-3xl pointer-events-none" />
      <div className="relative text-center card max-w-md">
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-gray-600 mt-2 dark:text-slate-300">Page not found</p>
        <a href="/student/dashboard" className="btn-primary mt-6">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
