import React from 'react';
const ProgressPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Progress & Reports</h1>
        <p className="text-gray-500 mt-1">Track your attendance, grades, and overall progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h2>
          <p className="text-sm text-gray-400">Your attendance percentage and history will appear here.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Summary</h2>
          <p className="text-sm text-gray-400">Your grades and feedback will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
