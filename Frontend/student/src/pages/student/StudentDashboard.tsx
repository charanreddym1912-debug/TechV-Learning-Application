import { Link } from 'react-router-dom';
import {
  BookOpen,
  Video,
  FileText,
  TrendingUp,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import Badge from '@/components/common/Badge';
import {
  mockDashboardStats,
  mockCourses,
  mockLiveSessions,
  mockAssignments,
  mockStudent,
} from '@/data/mockData';
import { formatDateTime, getRelativeTime } from '@/utils/formatDate';

export default function StudentDashboard() {
  const liveSession = mockLiveSessions.find((s) => s.status === 'live');
  const upcomingSessions = mockLiveSessions.filter((s) => s.status === 'upcoming');
  const pendingAssignments = mockAssignments.filter(
    (a) => a.status === 'pending' || a.status === 'overdue'
  );
  const activeCourses = mockCourses.filter((c) => c.status === 'active');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Welcome back, {mockStudent.name.split(' ')[0]}!</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Here&apos;s an overview of your learning progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Courses"
          value={mockDashboardStats.enrolledCourses}
          icon={<BookOpen className="w-6 h-6" />}
          color="indigo"
        />
        <StatCard
          title="Upcoming Sessions"
          value={mockDashboardStats.upcomingSessions}
          icon={<Video className="w-6 h-6" />}
          color="cyan"
        />
        <StatCard
          title="Pending Assignments"
          value={mockDashboardStats.pendingAssignments}
          icon={<FileText className="w-6 h-6" />}
          color="amber"
        />
        <StatCard
          title="Average Grade"
          value={`${mockDashboardStats.averageGrade}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
        />
      </div>

      {liveSession && (
        <div className="card card-interactive border-red-200 ring-1 ring-red-200 dark:border-red-500/30 dark:ring-red-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-500/20">
                <Video className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{liveSession.title}</h2>
                  <Badge status="live" />
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{liveSession.courseName}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                  {liveSession.trainerName} · Ends {formatDateTime(liveSession.endTime)}
                </p>
              </div>
            </div>
            <Link to="/student/live" className="btn-primary shrink-0">
              Join Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Upcoming Sessions</h2>
            <Link to="/student/live" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingSessions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400">No upcoming sessions scheduled.</p>
            ) : (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-colors dark:bg-slate-800/60 dark:border-slate-800 dark:hover:border-primary-500/40"
                >
                  <Calendar className="w-5 h-5 text-primary-600 shrink-0 dark:text-primary-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{session.title}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {formatDateTime(session.startTime)} · {getRelativeTime(session.startTime)}
                    </p>
                  </div>
                  <Badge status="upcoming" />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Pending Assignments</h2>
            <Link to="/student/assignments" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {pendingAssignments.slice(0, 3).map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-colors dark:bg-slate-800/60 dark:border-slate-800 dark:hover:border-primary-500/40"
              >
                <FileText className="w-5 h-5 text-amber-600 shrink-0 dark:text-amber-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{assignment.title}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{assignment.courseName}</p>
                </div>
                <Badge status={assignment.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Active Courses</h2>
          <Link to="/student/courses" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            View all courses
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCourses.map((course) => (
            <div key={course.id} className="card card-interactive">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-slate-100">{course.title}</h3>
                <Badge status="active" />
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{course.trainerName}</p>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-slate-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-slate-100">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-slate-700">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-indigo-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
