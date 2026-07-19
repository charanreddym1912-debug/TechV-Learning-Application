import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Users, Mail, Phone, GraduationCap, Calendar, CheckCircle2, XCircle, Filter, AlertCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import axiosInstance from '../../api/axiosInstance';
import type { Student } from '../../types';
import toast from 'react-hot-toast';

const INITIAL_MOCK_STUDENTS: Student[] = [
  {
    studentId: 701,
    employeeId: '511001',
    firstName: 'Aarav',
    lastName: 'Patel',
    email: 'aarav.patel@techv.edu',
    phoneNumber: '+91 91234 56780',
    qualification: 'B.Tech Computer Science',
    status: 'ACTIVE',
    enrollmentDate: '2026-07-01'
  },
  {
    studentId: 702,
    employeeId: '511002',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@techv.edu',
    phoneNumber: '+91 92345 67891',
    qualification: 'MCA (Master of Computer Applications)',
    status: 'ACTIVE',
    enrollmentDate: '2026-07-02'
  },
  {
    studentId: 703,
    employeeId: '511003',
    firstName: 'Rohan',
    lastName: 'Verma',
    email: 'rohan.verma@techv.edu',
    phoneNumber: '+91 93456 78902',
    qualification: 'B.E. Information Technology',
    status: 'ACTIVE',
    enrollmentDate: '2026-07-03'
  },
  {
    studentId: 704,
    employeeId: '511004',
    firstName: 'Sneha',
    lastName: 'Gupta',
    email: 'sneha.gupta@techv.edu',
    phoneNumber: '+91 94567 89013',
    qualification: 'B.Tech Electronics & Comm.',
    status: 'ACTIVE',
    enrollmentDate: '2026-07-04'
  }
];

const QUALIFICATIONS = [
  'B.Tech Computer Science',
  'MCA (Master of Computer Applications)',
  'B.E. Information Technology',
  'B.Tech Electronics & Comm.',
  'M.Tech Software Engineering',
  'B.Sc Computer Science',
  'Other / Professional Degree'
];

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQual, setSelectedQual] = useState<string>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    qualification: 'B.Tech Computer Science',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Student[]>('/students');
      if (response.data && response.data.length > 0) {
        setStudents(response.data);
        localStorage.setItem('mock_lms_students', JSON.stringify(response.data));
      } else {
        const saved = localStorage.getItem('mock_lms_students');
        if (saved) setStudents(JSON.parse(saved));
        else {
          setStudents(INITIAL_MOCK_STUDENTS);
          localStorage.setItem('mock_lms_students', JSON.stringify(INITIAL_MOCK_STUDENTS));
        }
      }
    } catch (error) {
      const saved = localStorage.getItem('mock_lms_students');
      if (saved) setStudents(JSON.parse(saved));
      else {
        setStudents(INITIAL_MOCK_STUDENTS);
        localStorage.setItem('mock_lms_students', JSON.stringify(INITIAL_MOCK_STUDENTS));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        employeeId: student.employeeId || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        phoneNumber: student.phoneNumber || '',
        password: '',
        qualification: student.qualification || 'B.Tech Computer Science',
        status: student.status || 'ACTIVE'
      });
    } else {
      setEditingStudent(null);
      setFormData({
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        qualification: 'B.Tech Computer Science',
        status: 'ACTIVE'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData({ ...formData, employeeId: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.employeeId.length !== 6) {
      toast.error('Student Enrollment / Employee ID must be exactly 6 numeric digits (e.g. 511001)');
      return;
    }
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First and Last name are required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingStudent) {
        try {
          await axiosInstance.put(`/students/${editingStudent.studentId}`, formData);
          toast.success('Student updated on server');
        } catch (err) {
          toast.success('Student updated locally');
        }
        const updated = students.map(s =>
          s.studentId === editingStudent.studentId
            ? { ...s, ...formData }
            : s
        );
        setStudents(updated);
        localStorage.setItem('mock_lms_students', JSON.stringify(updated));
      } else {
        let newId = Math.floor(Math.random() * 900) + 700;
        try {
          const res = await axiosInstance.post<Student>('/students', formData);
          if (res.data && res.data.studentId) newId = res.data.studentId;
          toast.success('Student enrolled on server');
        } catch (err) {
          toast.success('Student enrolled locally');
        }
        const newStudent: Student = {
          studentId: newId,
          ...formData,
          enrollmentDate: new Date().toISOString().split('T')[0]
        };
        const updated = [newStudent, ...students];
        setStudents(updated);
        localStorage.setItem('mock_lms_students', JSON.stringify(updated));
      }
      handleCloseModal();
    } catch (error) {
      toast.error('An error occurred while saving student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      try {
        await axiosInstance.delete(`/students/${studentToDelete.studentId}`);
      } catch (e) {}
      const updated = students.filter(s => s.studentId !== studentToDelete.studentId);
      setStudents(updated);
      localStorage.setItem('mock_lms_students', JSON.stringify(updated));
      toast.success(`Deleted student: ${studentToDelete.firstName} ${studentToDelete.lastName}`);
    } catch (err) {
      toast.error('Failed to delete student');
    } finally {
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const toggleStatus = (student: Student) => {
    const newStatus = student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = students.map(s =>
      s.studentId === student.studentId ? { ...s, status: newStatus as 'ACTIVE' | 'INACTIVE' } : s
    );
    setStudents(updated);
    localStorage.setItem('mock_lms_students', JSON.stringify(updated));
    toast.success(`Status updated to ${newStatus}`);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            student.employeeId.includes(searchQuery);
      const matchesQual = selectedQual === 'ALL' || student.qualification === selectedQual;
      return matchesSearch && matchesQual;
    });
  }, [students, searchQuery, selectedQual]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-800 via-sky-800 to-cyan-900 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Students</h1>
          <p className="text-sky-100 text-sm mt-1">
            Enroll academic candidates, oversee qualifications, and maintain student records
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-900 hover:bg-sky-50 font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus size={18} className="text-blue-600" />
          Enroll Student
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
            placeholder="Search students by name, email, or 6-digit ID..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-gray-400" />
          <select
            value={selectedQual}
            onChange={(e) => setSelectedQual(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium"
          >
            <option value="ALL">All Qualifications ({students.length})</option>
            {QUALIFICATIONS.map(qual => (
              <option key={qual} value={qual}>{qual}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm font-medium">Loading student roster...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
            <Users size={48} className="text-gray-300 mb-3 stroke-1" />
            <p className="text-base font-medium text-gray-600">No students found matching your criteria</p>
            <p className="text-xs text-gray-400 mt-1">Try clearing filters or enrolling a new student</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-6">Student Profile</th>
                  <th className="py-3.5 px-6">Academic Qualification</th>
                  <th className="py-3.5 px-6">Enrollment Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredStudents.map((student) => (
                  <tr key={student.studentId} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                            {student.firstName} {student.lastName}
                            <span className="text-xs font-mono font-normal px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                              ID: {student.employeeId}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><Mail size={12} /> {student.email}</span>
                            {student.phoneNumber && (
                              <span className="flex items-center gap-1"><Phone size={12} /> {student.phoneNumber}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                        <GraduationCap size={14} />
                        {student.qualification || 'General Degree'}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-gray-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{student.enrollmentDate || 'Recent'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(student)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                          student.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {student.status === 'ACTIVE' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {student.status}
                      </button>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(student)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Student"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Student"
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

      {/* Enrollment / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStudent ? `Edit Student Profile (#${editingStudent.employeeId})` : 'Enroll New Academic Student'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Enrollment / Employee ID (6 Digits) *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={formData.employeeId}
                onChange={handleEmployeeIdChange}
                placeholder="e.g. 511001"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono tracking-widest text-center text-base font-bold"
              />
              <span className="text-[11px] text-gray-400 mt-0.5 block">Strict 6 numeric digits required</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Aarav"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Patel"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. aarav.p@techv.edu"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+91 91234 56780"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Academic Qualification *
            </label>
            <select
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-700"
            >
              {QUALIFICATIONS.map(qual => (
                <option key={qual} value={qual}>{qual}</option>
              ))}
            </select>
          </div>

          {!editingStudent && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Initial Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Set temporary student login password..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Saving...' : editingStudent ? 'Save Changes' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Student Removal"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <p>Are you sure you want to remove <strong>{studentToDelete?.firstName} {studentToDelete?.lastName}</strong>? Their attendance records and course enrollments will be deleted.</p>
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
              Remove Student
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentsPage;
