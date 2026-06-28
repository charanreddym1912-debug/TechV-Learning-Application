import React from 'react';
import { BookOpen } from 'lucide-react';

const MyCoursesPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-500 mt-1">View your enrolled courses and learning materials</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-sm text-gray-400">Your enrolled courses will appear here once connected to the backend.</p>
      </div>
    </div>
  );
};

export default MyCoursesPage;
