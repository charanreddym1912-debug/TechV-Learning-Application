import { useState, useRef, type ChangeEvent } from 'react';
import { Upload, FileText, Calendar, Award, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '@/components/common/Loader';
import Badge from '@/components/common/Badge';
import { useFetch } from '@/hooks/useFetch';
import { getStudentAssignments, submitAssignment } from '@/api/assignmentApi';
import { formatDate, isOverdue } from '@/utils/formatDate';
import type { Assignment } from '@/types';

export default function StudentAssignmentsPage() {
  const { data: assignments, loading, error, refetch } = useFetch(
    () => getStudentAssignments(101),
    []
  );
  const [filter, setFilter] = useState<'all' | Assignment['status']>('all');
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const filtered = (assignments ?? []).filter(
    (a) => filter === 'all' || a.status === filter
  );

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAssignment) return;

    setSubmittingId(selectedAssignment.id);
    try {
      await submitAssignment(selectedAssignment.id, file);
      toast.success(`"${file.name}" submitted successfully!`);
      refetch();
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setSubmittingId(null);
      setSelectedAssignment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openFilePicker = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    fileInputRef.current?.click();
  };

  if (loading) return <Loader message="Loading assignments..." />;
  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const statusCounts = {
    all: assignments?.length ?? 0,
    pending: assignments?.filter((a) => a.status === 'pending').length ?? 0,
    submitted: assignments?.filter((a) => a.status === 'submitted').length ?? 0,
    graded: assignments?.filter((a) => a.status === 'graded').length ?? 0,
    overdue: assignments?.filter((a) => a.status === 'overdue').length ?? 0,
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.zip,.txt"
        onChange={handleFileSelect}
      />

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Assignments</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          View, submit, and track your assignment grades.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'submitted', 'graded', 'overdue'] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
              filter === status
                ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white text-gray-600 dark:text-slate-300 border border-gray-200 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-slate-400">No assignments in this category.</p>
          </div>
        ) : (
          filtered.map((assignment) => (
            <div key={assignment.id} className="card card-interactive">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{assignment.title}</h3>
                    <Badge status={assignment.status} />
                  </div>
                  <p className="text-sm font-medium text-primary-600 mt-1 dark:text-primary-400">{assignment.courseName}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-300 mt-2">{assignment.description}</p>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span className={isOverdue(assignment.dueDate) && assignment.status === 'pending' ? 'text-red-600 font-medium dark:text-red-400' : ''}>
                        Due: {formatDate(assignment.dueDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>Max: {assignment.maxMarks} marks</span>
                    </div>
                    {assignment.submittedAt && (
                      <div className="flex items-center gap-1.5">
                        <Upload className="w-4 h-4" />
                        <span>Submitted: {formatDate(assignment.submittedAt)}</span>
                      </div>
                    )}
                  </div>

                  {assignment.grade !== undefined && (
                    <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 font-semibold dark:text-emerald-300">
                          Grade: {assignment.grade}/{assignment.maxMarks}
                        </span>
                      </div>
                      {assignment.feedback && (
                        <div className="flex items-start gap-2 mt-2 text-sm text-gray-600 dark:text-slate-300">
                          <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{assignment.feedback}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {(assignment.status === 'pending' || assignment.status === 'overdue') && (
                  <button
                    type="button"
                    onClick={() => openFilePicker(assignment)}
                    disabled={submittingId === assignment.id}
                    className="btn-primary shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    {submittingId === assignment.id ? 'Uploading...' : 'Submit File'}
                  </button>
                )}

                {assignment.status === 'submitted' && (
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-600 shrink-0 dark:text-blue-400">
                    <FileText className="w-4 h-4" />
                    Awaiting grading
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
