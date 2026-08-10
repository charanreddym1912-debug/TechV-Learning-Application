import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: 'indigo' | 'cyan' | 'amber' | 'green';
  subtitle?: string;
}

// Functional gradient palette per the enterprise design system.
const gradientMap: Record<NonNullable<StatCardProps['color']>, string> = {
  indigo: 'from-blue-600 via-indigo-600 to-indigo-800',
  green: 'from-emerald-600 via-teal-600 to-teal-800',
  cyan: 'from-purple-600 via-fuchsia-600 to-purple-800',
  amber: 'from-amber-600 via-orange-600 to-red-700',
};

export default function StatCard({ title, value, icon, color = 'indigo', subtitle }: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradientMap[color]} text-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
    >
      <div className="absolute right-0 top-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="relative flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-white/70 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
