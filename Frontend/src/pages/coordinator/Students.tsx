import React from 'react';
import { Plus, Search } from 'lucide-react';

const StudentsPage: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
          <p className="text-gray-500 mt-1">Add and manage student profiles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition">
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search students..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
          </div>
        </div>

        <div className="p-8 text-center text-gray-400">
          <p className="text-sm">Student data will appear here once connected to the backend.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
