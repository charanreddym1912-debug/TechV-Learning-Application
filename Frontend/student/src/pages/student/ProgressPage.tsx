import {
  TrendingUp,
  CalendarCheck,
  BookCheck,
  ClipboardCheck,
  Download,
} from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import ProgressChart from '@/components/student/ProgressChart';
import { mockProgress } from '@/data/mockData';

export default function ProgressPage() {
  const progress = mockProgress;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Progress &amp; Reports</h1>
          <p className="text-gray-500 mt-1 dark:text-slate-400">
            Track your attendance, grades, and overall academic performance.
          </p>
        </div>
        <button type="button" className="btn-secondary shrink-0">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${progress.overallAttendance}%`}
          icon={<CalendarCheck className="w-6 h-6" />}
          color="green"
          subtitle="Across all courses"
        />
        <StatCard
          title="Average Grade"
          value={`${progress.averageGrade}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="indigo"
          subtitle="Weighted average"
        />
        <StatCard
          title="Courses Completed"
          value={`${progress.coursesCompleted}/${progress.totalCourses}`}
          icon={<BookCheck className="w-6 h-6" />}
          color="cyan"
        />
        <StatCard
          title="Assignments Submitted"
          value={`${progress.assignmentsSubmitted}/${progress.totalAssignments}`}
          icon={<ClipboardCheck className="w-6 h-6" />}
          color="amber"
        />
      </div>

      <ProgressChart
        attendanceData={progress.attendanceByMonth}
        gradeData={progress.gradesByCourse}
      />

      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-slate-100">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryItem
            label="Attendance Rate"
            value={`${progress.overallAttendance}%`}
            description={
              progress.overallAttendance >= 80
                ? 'Excellent attendance record'
                : 'Consider improving attendance'
            }
            positive={progress.overallAttendance >= 80}
          />
          <SummaryItem
            label="Academic Standing"
            value={progress.averageGrade >= 80 ? 'Good Standing' : 'Needs Improvement'}
            description={`Average grade of ${progress.averageGrade}%`}
            positive={progress.averageGrade >= 80}
          />
          <SummaryItem
            label="Assignment Completion"
            value={`${Math.round((progress.assignmentsSubmitted / progress.totalAssignments) * 100)}%`}
            description={`${progress.assignmentsSubmitted} of ${progress.totalAssignments} submitted`}
            positive={progress.assignmentsSubmitted / progress.totalAssignments >= 0.8}
          />
        </div>
      </div>
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value: string;
  description: string;
  positive: boolean;
}

function SummaryItem({ label, value, description, positive }: SummaryItemProps) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 dark:bg-slate-800/60 dark:border-slate-800">
      <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
      <p className={`text-xl font-bold mt-1 ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-1 dark:text-slate-500">{description}</p>
    </div>
  );
}
