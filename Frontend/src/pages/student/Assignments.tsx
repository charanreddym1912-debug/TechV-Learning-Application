import React from 'react';
import { ClipboardList } from 'lucide-react';

const StudentAssignmentsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
        <p className="text-gray-500 mt-1">View and submit your assignments</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-sm text-gray-400">Your assignments will appear here once connected to the backend.</p>
      </div>
    </div>
  );
};

export default StudentAssignmentsPage;
