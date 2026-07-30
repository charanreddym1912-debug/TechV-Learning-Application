type BadgeStatus = 'active' | 'inactive' | 'pending' | 'completed' | 'upcoming' | 'live' | 'ended' | 'submitted' | 'graded' | 'overdue';

interface BadgeProps {
  status: BadgeStatus;
  label?: string;
}

const statusStyles: Record<BadgeStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  inactive: 'bg-gray-100 text-gray-700 border-gray-200',
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
  live: 'bg-red-100 text-red-800 border-red-200',
  ended: 'bg-gray-100 text-gray-700 border-gray-200',
  submitted: 'bg-blue-100 text-blue-800 border-blue-200',
  graded: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  overdue: 'bg-red-100 text-red-800 border-red-200',
};

const dotStyles: Record<BadgeStatus, string> = {
  active: 'bg-emerald-600 animate-pulse',
  inactive: 'bg-gray-500',
  pending: 'bg-amber-600',
  completed: 'bg-emerald-600',
  upcoming: 'bg-blue-600',
  live: 'bg-red-600 animate-pulse',
  ended: 'bg-gray-500',
  submitted: 'bg-blue-600',
  graded: 'bg-emerald-600',
  overdue: 'bg-red-600 animate-pulse',
};

const defaultLabels: Record<BadgeStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  completed: 'Completed',
  upcoming: 'Upcoming',
  live: 'Live Now',
  ended: 'Ended',
  submitted: 'Submitted',
  graded: 'Graded',
  overdue: 'Overdue',
};

export default function Badge({ status, label }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status]}`} />
      {label ?? defaultLabels[status]}
    </span>
  );
}
