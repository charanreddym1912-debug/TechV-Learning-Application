import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth
import ProtectedRoute from '../components/auth/ProtectedRoute';
import DashboardLayout from '../components/common/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';

// Coordinator Pages
import CoordinatorDashboard from '../pages/coordinator/Dashboard';
import CoursesPage from '../pages/coordinator/Courses';
import BatchesPage from '../pages/coordinator/Batches';
import TrainersPage from '../pages/coordinator/Trainers';
import StudentsPage from '../pages/coordinator/Students';
import SchedulePage from '../pages/coordinator/Schedule';

// Trainer Pages
import TrainerDashboard from '../pages/trainer/Dashboard';
import MyClassesPage from '../pages/trainer/MyClasses';
import AttendancePage from '../pages/trainer/Attendance';
import TrainerAssignmentsPage from '../pages/trainer/Assignments';
import AssessmentPage from '../pages/trainer/Assessment';
import MockInterviewPage from '../pages/trainer/MockInterview';
import GradesPage from '../pages/trainer/Grades';

// Student Pages
import StudentDashboard from '../pages/student/Dashboard';
import MyCoursesPage from '../pages/student/MyCourses';
import LiveClassPage from '../pages/student/LiveClass';
import StudentAssignmentsPage from '../pages/student/Assignments';
import ProgressPage from '../pages/student/Progress';
import StudentAssessmentsPage from '../pages/student/Assessments';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ── Coordinator Routes ─────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={['COORDINATOR']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
            <Route path="/coordinator/courses"   element={<CoursesPage />} />
            <Route path="/coordinator/batches"    element={<BatchesPage />} />
            <Route path="/coordinator/trainers"   element={<TrainersPage />} />
            <Route path="/coordinator/students"   element={<StudentsPage />} />
            <Route path="/coordinator/schedule"   element={<SchedulePage />} />
          </Route>
        </Route>

        {/* ── Trainer Routes ─────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={['TRAINER']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/trainer/dashboard"   element={<TrainerDashboard />} />
            <Route path="/trainer/classes"     element={<MyClassesPage />} />
            <Route path="/trainer/attendance"  element={<AttendancePage />} />
            <Route path="/trainer/assignments" element={<TrainerAssignmentsPage />} />
            <Route path="/trainer/assessment"  element={<AssessmentPage />}/>
            <Route path="/trainer/mock-interview"  element={<MockInterviewPage />}/>
            <Route path="/trainer/grades"      element={<GradesPage />} />
          </Route>
        </Route>

        {/* ── Student Routes ─────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/student/dashboard"   element={<StudentDashboard />} />
            <Route path="/student/courses"     element={<MyCoursesPage />} />
            <Route path="/student/live"        element={<LiveClassPage />} />
            <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
            <Route path="/student/assessments" element={<StudentAssessmentsPage />} />
            <Route path="/student/progress"    element={<ProgressPage />} />
          </Route>
        </Route>

        {/* ── Fallbacks ──────────────────────────────────────────────── */}
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
              <p className="text-gray-500 mt-2">Page not found</p>
              <a href="/signup" className="text-primary-600 hover:underline text-sm mt-4 inline-block font-medium">
                Go to Sign Up
              </a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
