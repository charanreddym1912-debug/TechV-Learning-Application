import React from 'react';
import { Video, CheckSquare, FileText, BarChart3 } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const TrainerDashboard: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Trainer Dashboard</h1>
        <p className="text-gray-500 mt-1">Your classes, assignments, and grading overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Upcoming Classes" value="--" icon={<Video size={24} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Pending Attendance" value="--" icon={<CheckSquare size={24} className="text-green-600" />} color="bg-green-50" />
        <StatCard title="Active Assignments" value="--" icon={<FileText size={24} className="text-purple-600" />} color="bg-purple-50" />
        <StatCard title="To Grade" value="--" icon={<BarChart3 size={24} className="text-orange-600" />} color="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Classes</h2>
          <p className="text-sm text-gray-400">Your scheduled classes will appear here.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Submissions</h2>
          <p className="text-sm text-gray-400">Student submissions awaiting review will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
