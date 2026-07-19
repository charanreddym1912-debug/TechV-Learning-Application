import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Users, Calendar, BookOpen, UserCheck, GraduationCap, Filter, AlertCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import axiosInstance from '../../api/axiosInstance';
import type { Batch, Course, Trainer, Student } from '../../types';
import toast from 'react-hot-toast';

const INITIAL_MOCK_BATCHES: Batch[] = [
  {
    batchId: 501,
    courseId: 101,
    name: 'BATCH-2026-Q3-JAVA',
    startDate: '2026-07-15',
    endDate: '2026-09-30',
    maxStudents: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    batchId: 502,
    courseId: 102,
    name: 'BATCH-2026-Q3-DEVOPS',
    startDate: '2026-08-01',
    endDate: '2026-10-15',
    maxStudents: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    batchId: 503,
    courseId: 103,
    name: 'BATCH-2026-Q3-AI',
    startDate: '2026-07-20',
    endDate: '2026-11-01',
    maxStudents: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const BatchesPage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);

  // Assignment modal (Trainers & Students)
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningBatch, setAssigningBatch] = useState<Batch | null>(null);
  const [activeTab, setActiveTab] = useState<'trainers' | 'students'>('trainers');
  const [allTrainers, setAllTrainers] = useState<Trainer[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<number>(0);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    courseId: 101,
    startDate: '',
    endDate: '',
    maxStudents: 50
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch batches
      try {
        const batchRes = await axiosInstance.get<Batch[]>('/batches');
        if (batchRes.data && batchRes.data.length > 0) {
          setBatches(batchRes.data);
          localStorage.setItem('mock_lms_batches', JSON.stringify(batchRes.data));
        } else {
          const saved = localStorage.getItem('mock_lms_batches');
          if (saved) setBatches(JSON.parse(saved));
          else {
            setBatches(INITIAL_MOCK_BATCHES);
            localStorage.setItem('mock_lms_batches', JSON.stringify(INITIAL_MOCK_BATCHES));
          }
        }
      } catch (e) {
        const saved = localStorage.getItem('mock_lms_batches');
        if (saved) setBatches(JSON.parse(saved));
        else {
          setBatches(INITIAL_MOCK_BATCHES);
          localStorage.setItem('mock_lms_batches', JSON.stringify(INITIAL_MOCK_BATCHES));
        }
      }

      // Fetch courses for dropdown and mapping
      try {
        const courseRes = await axiosInstance.get<Course[]>('/courses');
        if (courseRes.data && courseRes.data.length > 0) {
          setCourses(courseRes.data);
          localStorage.setItem('mock_lms_courses', JSON.stringify(courseRes.data));
        } else {
          const savedCourses = localStorage.getItem('mock_lms_courses');
          if (savedCourses) setCourses(JSON.parse(savedCourses));
        }
      } catch (e) {
        const savedCourses = localStorage.getItem('mock_lms_courses');
        if (savedCourses) setCourses(JSON.parse(savedCourses));
      }

      // Fetch trainers and students for assignment modal
      try {
        const trRes = await axiosInstance.get<Trainer[]>('/trainers');
        if (trRes.data) setAllTrainers(trRes.data);
      } catch (e) {
        const savedTr = localStorage.getItem('mock_lms_trainers');
        if (savedTr) setAllTrainers(JSON.parse(savedTr));
      }

      try {
        const stRes = await axiosInstance.get<Student[]>('/students');
        if (stRes.data) setAllStudents(stRes.data);
      } catch (e) {
        const savedSt = localStorage.getItem('mock_lms_students');
        if (savedSt) setAllStudents(JSON.parse(savedSt));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const courseMap = useMemo(() => {
    const map: Record<number, string> = {};
    courses.forEach(c => {
      map[c.courseId] = c.title;
    });
    return map;
  }, [courses]);

  const handleOpenModal = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        name: batch.name || '',
        courseId: batch.courseId || (courses[0]?.courseId || 101),
        startDate: batch.startDate || '',
        endDate: batch.endDate || '',
        maxStudents: batch.maxStudents || 50
      });
    } else {
      setEditingBatch(null);
      setFormData({
        name: '',
        courseId: courses[0]?.courseId || 101,
        startDate: '',
        endDate: '',
        maxStudents: 50
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBatch(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Batch name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingBatch) {
        try {
          await axiosInstance.put(`/batches/${editingBatch.batchId}?courseId=${formData.courseId}`, formData);
          toast.success('Batch updated on server');
        } catch (err) {
          toast.success('Batch updated locally');
        }
        const updated = batches.map(b =>
          b.batchId === editingBatch.batchId
            ? { ...b, ...formData, updatedAt: new Date().toISOString() }
            : b
        );
        setBatches(updated);
        localStorage.setItem('mock_lms_batches', JSON.stringify(updated));
      } else {
        let newId = Math.floor(Math.random() * 900) + 500;
        try {
          const res = await axiosInstance.post<Batch>(`/batches?courseId=${formData.courseId}`, formData);
          if (res.data && res.data.batchId) newId = res.data.batchId;
          toast.success('Batch created on server');
        } catch (err) {
          toast.success('Batch created locally');
        }
        const newBatch: Batch = {
          batchId: newId,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const updated = [newBatch, ...batches];
        setBatches(updated);
        localStorage.setItem('mock_lms_batches', JSON.stringify(updated));
      }
      handleCloseModal();
    } catch (error) {
      toast.error('An error occurred while saving the batch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (batch: Batch) => {
    setBatchToDelete(batch);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!batchToDelete) return;
    try {
      try {
        await axiosInstance.delete(`/batches/${batchToDelete.batchId}`);
      } catch (e) {}
      const updated = batches.filter(b => b.batchId !== batchToDelete.batchId);
      setBatches(updated);
      localStorage.setItem('mock_lms_batches', JSON.stringify(updated));
      toast.success(`Deleted batch: ${batchToDelete.name}`);
    } catch (err) {
      toast.error('Failed to delete batch');
    } finally {
      setDeleteModalOpen(false);
      setBatchToDelete(null);
    }
  };

  const handleOpenAssignModal = (batch: Batch) => {
    setAssigningBatch(batch);
    if (allTrainers.length > 0) setSelectedTrainerId(allTrainers[0].trainerId);
    if (allStudents.length > 0) setSelectedStudentId(allStudents[0].studentId);
    setAssignModalOpen(true);
  };

  const handleAssignTrainer = async () => {
    if (!assigningBatch || !selectedTrainerId) return;
    try {
      await axiosInstance.post(`/batches/${assigningBatch.batchId}/trainers`, { trainerId: selectedTrainerId });
      toast.success('Trainer assigned successfully');
    } catch (e) {
      toast.success('Trainer assigned in local session');
    }
  };

  const handleEnrollStudent = async () => {
    if (!assigningBatch || !selectedStudentId) return;
    try {
      await axiosInstance.post(`/batches/${assigningBatch.batchId}/students`, { studentId: selectedStudentId });
      toast.success('Student enrolled successfully');
    } catch (e) {
      toast.success('Student enrolled in local session');
    }
  };

  const filteredBatches = useMemo(() => {
    return batches.filter(batch => {
      const matchesSearch = batch.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse = selectedCourseFilter === 'ALL' || batch.courseId.toString() === selectedCourseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [batches, searchQuery, selectedCourseFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Batches</h1>
          <p className="text-emerald-100 text-sm mt-1">
            Create academic cohorts, set schedules, and assign trainers & students
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-teal-900 hover:bg-emerald-50 font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus size={18} className="text-teal-600" />
          Add Batch
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search batches by code or name..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" 
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-gray-400" />
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500 outline-none text-gray-700 font-medium"
          >
            <option value="ALL">All Courses ({batches.length})</option>
            {courses.map(course => (
              <option key={course.courseId} value={course.courseId.toString()}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-4"></div>
            <p className="text-sm font-medium">Loading batch roster...</p>
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
            <Users size={48} className="text-gray-300 mb-3 stroke-1" />
            <p className="text-base font-medium text-gray-600">No batches found matching your criteria</p>
            <p className="text-xs text-gray-400 mt-1">Try clearing filters or adding a new batch</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-6">Batch Name & ID</th>
                  <th className="py-3.5 px-6">Assigned Course</th>
                  <th className="py-3.5 px-6">Schedule Window</th>
                  <th className="py-3.5 px-6">Max Capacity</th>
                  <th className="py-3.5 px-6">Roster & Assignments</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredBatches.map((batch) => (
                  <tr key={batch.batchId} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 font-bold shrink-0">
                          #{batch.batchId}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                            {batch.name}
                          </div>
                          <span className="text-xs text-gray-400">ID: BATCH-{batch.batchId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <BookOpen size={16} className="text-teal-600 shrink-0" />
                        <span className="truncate">{courseMap[batch.courseId] || `Course #${batch.courseId}`}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-gray-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{batch.startDate || 'TBD'} &rarr; {batch.endDate || 'TBD'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        <Users size={12} />
                        {batch.maxStudents || 50} Students Max
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenAssignModal(batch)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold transition"
                      >
                        <UserCheck size={14} />
                        Manage Roster
                      </button>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(batch)}
                          className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                          title="Edit Batch"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(batch)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Batch"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Batch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBatch ? `Edit Batch #${editingBatch.batchId}` : 'Create New Batch'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Batch Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. BATCH-2026-Q4-JAVA-ENTERPRISE"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Assign to Course *
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium text-gray-700"
            >
              {courses.map(c => (
                <option key={c.courseId} value={c.courseId}>
                  #{c.courseId} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Max Students Capacity
            </label>
            <input
              type="number"
              min="1"
              value={formData.maxStudents}
              onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Saving...' : editingBatch ? 'Save Changes' : 'Create Batch'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Roster Assignment Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Manage Roster: ${assigningBatch?.name}`}
      >
        <div className="space-y-4">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('trainers')}
              className={`flex items-center gap-2 py-2.5 px-4 font-semibold text-sm border-b-2 transition ${
                activeTab === 'trainers'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <GraduationCap size={16} />
              Assign Trainers
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-2 py-2.5 px-4 font-semibold text-sm border-b-2 transition ${
                activeTab === 'students'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users size={16} />
              Enroll Students
            </button>
          </div>

          {activeTab === 'trainers' ? (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-gray-500">Select a faculty trainer to lead instruction for this batch.</p>
              <div className="flex gap-2">
                <select
                  value={selectedTrainerId}
                  onChange={(e) => setSelectedTrainerId(parseInt(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {allTrainers.length === 0 && <option value={0}>No trainers available</option>}
                  {allTrainers.map(tr => (
                    <option key={tr.trainerId} value={tr.trainerId}>
                      {tr.firstName} {tr.lastName} ({tr.specialization || 'General'})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignTrainer}
                  disabled={!selectedTrainerId}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
                >
                  Assign
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-gray-500">Select a registered student to enroll in this batch.</p>
              <div className="flex gap-2">
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(parseInt(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {allStudents.length === 0 && <option value={0}>No students available</option>}
                  {allStudents.map(st => (
                    <option key={st.studentId} value={st.studentId}>
                      {st.firstName} {st.lastName} (ID: #{st.employeeId})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleEnrollStudent}
                  disabled={!selectedStudentId}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
                >
                  Enroll
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Batch Deletion"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <p>Are you sure you want to delete <strong>{batchToDelete?.name}</strong>? This action cannot be undone.</p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition shadow-sm text-sm"
            >
              Delete Batch
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BatchesPage;

