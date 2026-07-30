import type { AttendanceRecord, GradeRecord } from '@/types';

interface ProgressChartProps {
  attendanceData: AttendanceRecord[];
  gradeData: GradeRecord[];
}

export default function ProgressChart({ attendanceData, gradeData }: ProgressChartProps) {
  const maxAttendance = Math.max(
    ...attendanceData.map((d) => d.present + d.absent),
    1
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-slate-100">Monthly Attendance</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Present vs absent days per month</p>

        <div className="flex items-end gap-3 h-48">
          {attendanceData.map((record) => {
            const total = record.present + record.absent;
            const presentHeight = (record.present / maxAttendance) * 100;
            const absentHeight = (record.absent / maxAttendance) * 100;

            return (
              <div key={record.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end h-40 gap-0.5">
                  <div
                    className="w-full bg-red-400 rounded-t"
                    style={{ height: `${absentHeight}%`, minHeight: record.absent > 0 ? '4px' : '0' }}
                    title={`Absent: ${record.absent}`}
                  />
                  <div
                    className="w-full bg-emerald-500 rounded-b"
                    style={{ height: `${presentHeight}%`, minHeight: record.present > 0 ? '4px' : '0' }}
                    title={`Present: ${record.present}`}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400">{record.month}</span>
                <span className="text-xs text-gray-400 dark:text-slate-500">
                  {total > 0 ? Math.round((record.present / total) * 100) : 0}%
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-gray-500 dark:text-slate-400">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-400" />
            <span className="text-gray-500 dark:text-slate-400">Absent</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-slate-100">Grades by Course</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Current scores across enrolled courses</p>

        <div className="space-y-4">
          {gradeData.map((record) => {
            const percentage = record.maxGrade > 0 ? (record.grade / record.maxGrade) * 100 : 0;
            const barColor =
              percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-amber-500' : percentage > 0 ? 'bg-red-500' : 'bg-gray-300';

            return (
              <div key={record.courseName}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-slate-300 truncate mr-2">{record.courseName}</span>
                  <span className="font-medium text-gray-900 dark:text-slate-100 shrink-0">
                    {record.grade > 0 ? `${record.grade}/${record.maxGrade}` : 'N/A'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-slate-700">
                  <div
                    className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
