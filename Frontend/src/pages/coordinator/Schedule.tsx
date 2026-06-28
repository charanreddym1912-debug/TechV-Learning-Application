import React from 'react';
import { Plus, Search } from 'lucide-react';

const SchedulePage: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Schedule Sessions</h1>
          <p className="text-gray-500 mt-1">Schedule live class sessions for batches</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition">
          <Plus size={18} />
          Schedule Session
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search sessions..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
          </div>
        </div>

        <div className="p-8 text-center text-gray-400">
          <p className="text-sm">Session schedule will appear here once connected to the backend.</p>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
