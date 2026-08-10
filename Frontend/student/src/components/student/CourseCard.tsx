import { Link } from 'react-router-dom';
import {
  User,
  ChevronDown,
  Video,
  Clock,
  FileText,
  CheckCircle2,
  Award,
  CalendarClock,
} from 'lucide-react';
import Badge from '@/components/common/Badge';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import type { Assignment, Course, LiveSession } from '@/types';

interface CourseCardProps {
  course: Course;
  sessions: LiveSession[];
  assignments: Assignment[];
  expanded: boolean;
  onToggle: () => void;
}

export default function CourseCard({
  course,
  sessions,
  assignments,
  expanded,
  onToggle,
}: CourseCardProps) {
  const upcomingSessions = sessions.filter(
    (s) => s.status === 'live' || s.status === 'upcoming'
  );
  const pendingAssignments = assignments.filter(
    (a) => a.status === 'pending' || a.status === 'overdue'
  );
  const submittedAssignments = assignments.filter(
    (a) => a.status === 'submitted' || a.status === 'graded'
  );

  return (
    <div
      className={`card group flex flex-col transition-all duration-300 ${
        expanded ? 'ring-1 ring-primary-200 shadow-2xl dark:ring-primary-500/40' : 'hover:-translate-y-1 hover:shadow-2xl'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="text-left cursor-pointer"
        aria-expanded={expanded}
      >
        <div className={`h-32 -mx-6 -mt-6 mb-4 rounded-t-3xl bg-gradient-to-br ${course.thumbnailColor} flex items-end justify-between p-4`}>
          <Badge status={course.status} />
          <ChevronDown
            className={`w-6 h-6 text-white/90 transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors dark:text-slate-100 dark:group-hover:text-primary-400">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-300 mt-2 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-slate-400">
          <User className="w-4 h-4" />
          <span>{course.trainerName}</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{course.batchName}</p>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-slate-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-slate-100">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-slate-700">
            <div
              className="bg-gradient-to-r from-primary-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            {course.completedModules} of {course.totalModules} modules completed
          </p>
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 gap-5 dark:border-slate-800">
          <DetailSection
            title="Upcoming & Live"
            icon={<Video className="w-4 h-4 text-primary-600" />}
            count={upcomingSessions.length}
            emptyText="No upcoming sessions."
          >
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 dark:bg-slate-800/60 dark:border-slate-800"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{session.title}</p>
                  <Badge status={session.status} />
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDateTime(session.startTime)}</span>
                </div>
                {session.status === 'live' && (
                  <Link
                    to="/student/live"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Join now
                  </Link>
                )}
              </div>
            ))}
          </DetailSection>

          <DetailSection
            title="Pending Assignments"
            icon={<FileText className="w-4 h-4 text-amber-600" />}
            count={pendingAssignments.length}
            emptyText="Nothing pending. Great job!"
          >
            {pendingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 dark:bg-slate-800/60 dark:border-slate-800"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{assignment.title}</p>
                  <Badge status={assignment.status} />
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500 dark:text-slate-400">
                  <CalendarClock className="w-3.5 h-3.5" />
                  <span>Due {formatDate(assignment.dueDate)}</span>
                </div>
              </div>
            ))}
          </DetailSection>

          <DetailSection
            title="Submitted"
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            count={submittedAssignments.length}
            emptyText="No submissions yet."
          >
            {submittedAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 dark:bg-slate-800/60 dark:border-slate-800"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{assignment.title}</p>
                  <Badge status={assignment.status} />
                </div>
                {assignment.status === 'graded' ? (
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <Award className="w-3.5 h-3.5" />
                    <span>
                      {assignment.grade}/{assignment.maxMarks} marks
                    </span>
                  </div>
                ) : (
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">
                    {assignment.submittedAt
                      ? `Submitted ${formatDate(assignment.submittedAt)}`
                      : 'Awaiting grading'}
                  </p>
                )}
              </div>
            ))}
          </DetailSection>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors cursor-pointer"
      >
        {expanded ? 'Hide details' : 'View details'}
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}

interface DetailSectionProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  emptyText: string;
  children: React.ReactNode;
}

function DetailSection({ title, icon, count, emptyText, children }: DetailSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">{title}</h4>
        <span className="ml-auto text-xs font-semibold text-gray-500 dark:text-slate-400 bg-gray-100 rounded-full px-2 py-0.5 dark:text-slate-400 dark:bg-slate-800">
          {count}
        </span>
      </div>
      {count === 0 ? (
        <p className="text-xs text-gray-400 dark:text-slate-500">{emptyText}</p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </div>
  );
}
