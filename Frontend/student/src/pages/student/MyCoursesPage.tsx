import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Loader from '@/components/common/Loader';
import CourseCard from '@/components/student/CourseCard';
import { useFetch } from '@/hooks/useFetch';
import { getStudentCourses } from '@/api/courseApi';
import { getStudentSessions } from '@/api/zoomApi';
import { getStudentAssignments } from '@/api/assignmentApi';
import { mockStudent } from '@/data/mockData';
import type { Course } from '@/types';

type FilterStatus = 'all' | Course['status'];

export default function MyCoursesPage() {
  const { data: courses, loading, error } = useFetch(
    () => getStudentCourses(mockStudent.id),
    [mockStudent.id]
  );
  const { data: sessions } = useFetch(
    () => getStudentSessions(mockStudent.id),
    [mockStudent.id]
  );
  const { data: assignments } = useFetch(
    () => getStudentAssignments(mockStudent.id),
    [mockStudent.id]
  );
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredCourses = (courses ?? []).filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.trainerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loader message="Loading your courses..." />;
  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">My Courses</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          View all enrolled courses and track your learning progress.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 z-10" />
          <input
            type="text"
            placeholder="Search courses or trainers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 z-10" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="input-field pl-10 pr-8 appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-slate-400">No courses found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              sessions={(sessions ?? []).filter((s) => s.courseName === course.title)}
              assignments={(assignments ?? []).filter((a) => a.courseName === course.title)}
              expanded={expandedId === course.id}
              onToggle={() =>
                setExpandedId((prev) => (prev === course.id ? null : course.id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
