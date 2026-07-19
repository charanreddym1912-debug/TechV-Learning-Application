import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, BookOpen, Clock, Calendar, Tag, Filter, AlertCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import axiosInstance from '../../api/axiosInstance';
import type { Course } from '../../types';
import toast from 'react-hot-toast';

const INITIAL_MOCK_COURSES: Course[] = [
  {
    courseId: 101,
    title: 'Full-Stack Spring Boot & React Mastery',
    description: 'Comprehensive enterprise application development covering Java 17, Spring Boot 3, React 18, TypeScript, and Docker containerization.',
    category: 'Web Development',
    duration: 80,
    startDate: '2026-07-15',
    endDate: '2026-09-30',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    courseId: 102,
    title: 'Cloud-Native DevOps & Kubernetes Automation',
    description: 'Master CI/CD pipelines, Docker swarm, Kubernetes orchestration, AWS cloud infrastructure, and Prometheus monitoring.',
    category: 'DevOps & Cloud',
    duration: 60,
    startDate: '2026-08-01',
    endDate: '2026-10-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    courseId: 103,
    title: 'Applied Data Science & Machine Learning',
    description: 'Deep dive into Python, Pandas, Scikit-Learn, TensorFlow, and neural networks with real-world enterprise datasets.',
    category: 'AI & Data Science',
    duration: 90,
    startDate: '2026-07-20',
    endDate: '2026-11-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    courseId: 104,
    title: 'Enterprise Cybersecurity & Ethical Hacking',
    description: 'Advanced network defense, penetration testing, vulnerability assessment, and OWASP Top 10 mitigation strategies.',
    category: 'Cybersecurity',
    duration: 50,
    startDate: '2026-08-10',
    endDate: '2026-09-25',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const CATEGORIES = [
  'Web Development',
  'DevOps & Cloud',
  'AI & Data Science',
  'Cybersecurity',
  'Mobile Development',
  'Software Engineering'
];

const getCategoryBadgeStyle = (category?: string) => {
  switch (category) {
    case 'Web Development':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'DevOps & Cloud':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'AI & Data Science':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Cybersecurity':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    duration: 40,
    startDate: '',
    endDate: ''
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Course[]>('/courses');
      if (response.data && response.data.length > 0) {
        setCourses(response.data);
        localStorage.setItem('mock_lms_courses', JSON.stringify(response.data));
      } else {
        // Check local storage fallback
        const saved = localStorage.getItem('mock_lms_courses');
        if (saved) {
          setCourses(JSON.parse(saved));
        } else {
          setCourses(INITIAL_MOCK_COURSES);
          localStorage.setItem('mock_lms_courses', JSON.stringify(INITIAL_MOCK_COURSES));
        }
      }
    } catch (error) {
      // Offline fallback
      const saved = localStorage.getItem('mock_lms_courses');
      if (saved) {
        setCourses(JSON.parse(saved));
      } else {
        setCourses(INITIAL_MOCK_COURSES);
        localStorage.setItem('mock_lms_courses', JSON.stringify(INITIAL_MOCK_COURSES));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || 'Web Development',
        duration: course.duration || 40,
        startDate: course.startDate || '',
        endDate: course.endDate || ''
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        category: 'Web Development',
        duration: 40,
        startDate: '',
        endDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Course title is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCourse) {
        // Try PUT to API
        try {
          await axiosInstance.put(`/courses/${editingCourse.courseId}`, formData);
          toast.success('Course updated on server');
        } catch (err) {
          toast.success('Course updated locally');
        }
        // Update local state
        const updated = courses.map(c => 
          c.courseId === editingCourse.courseId 
            ? { ...c, ...formData, updatedAt: new Date().toISOString() } 
            : c
        );
        setCourses(updated);
        localStorage.setItem('mock_lms_courses', JSON.stringify(updated));
      } else {
        // Try POST to API
        let newId = Math.floor(Math.random() * 900) + 100;
        try {
          const res = await axiosInstance.post<Course>('/courses', formData);
          if (res.data && res.data.courseId) {
            newId = res.data.courseId;
          }
          toast.success('Course created on server');
        } catch (err) {
          toast.success('Course created locally');
        }
        const newCourse: Course = {
          courseId: newId,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const updated = [newCourse, ...courses];
        setCourses(updated);
        localStorage.setItem('mock_lms_courses', JSON.stringify(updated));
      }
      handleCloseModal();
    } catch (error) {
      toast.error('An error occurred while saving the course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      try {
        await axiosInstance.delete(`/courses/${courseToDelete.courseId}`);
      } catch (e) {
        // fallback local
      }
      const updated = courses.filter(c => c.courseId !== courseToDelete.courseId);
      setCourses(updated);
      localStorage.setItem('mock_lms_courses', JSON.stringify(updated));
      toast.success(`Deleted course: ${courseToDelete.title}`);
    } catch (err) {
      toast.error('Failed to delete course');
    } finally {
      setDeleteModalOpen(false);
      setCourseToDelete(null);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'ALL' || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Courses</h1>
          <p className="text-blue-100 text-sm mt-1">
            Create, categorize, and oversee curriculum offerings for TechV Enterprise LMS
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-indigo-900 hover:bg-blue-50 font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus size={18} className="text-indigo-600" />
          Add Course
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
            placeholder="Search by course title or keywords..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" 
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 font-medium"
          >
            <option value="ALL">All Categories ({courses.length})</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Table / Grid */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-sm font-medium">Loading course directory...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
            <BookOpen size={48} className="text-gray-300 mb-3 stroke-1" />
            <p className="text-base font-medium text-gray-600">No courses found matching your criteria</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search query or category filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-6">Course Details</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Schedule Window</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredCourses.map((course) => (
                  <tr key={course.courseId} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="py-4 px-6 max-w-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0 mt-0.5">
                          #{course.courseId}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {course.title}
                          </div>
                          {course.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                              {course.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeStyle(course.category)}`}>
                        <Tag size={12} />
                        {course.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-gray-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-gray-400" />
                        <span>{course.duration ? `${course.duration} Hours` : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-gray-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{course.startDate || 'TBD'} &rarr; {course.endDate || 'TBD'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(course)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Edit Course"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(course)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Course"
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

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCourse ? `Edit Course #${editingCourse.courseId}` : 'Create New Course'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Advanced Microservices with Java Spring Boot"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium text-gray-700"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Duration (Hours) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
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
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
              >
              </input>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Course Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide an overview of curriculum topics, prerequisites, and learning outcomes..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Course Deletion"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <p>Are you sure you want to delete <strong>{courseToDelete?.title}</strong>? This action cannot be undone.</p>
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
              Delete Course
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CoursesPage;

