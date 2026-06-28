import React from 'react';
import { FileText, Plus } from 'lucide-react';

const AssignmentsPage: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
          <p className="text-gray-500 mt-1">Create and manage assignments for your courses</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition">
          <Plus size={18} />
          Create Assignment
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <FileText size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-sm text-gray-400">Assignments will appear here once connected to the backend.</p>
      </div>
    </div>
  );
};

export default AssignmentsPage;
