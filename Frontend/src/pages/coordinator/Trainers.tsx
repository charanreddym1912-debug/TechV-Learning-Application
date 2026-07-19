import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, GraduationCap, Mail, Phone, Award, Briefcase, CheckCircle2, XCircle, Filter, AlertCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import axiosInstance from '../../api/axiosInstance';
import type { Trainer } from '../../types';
import toast from 'react-hot-toast';

const INITIAL_MOCK_TRAINERS: Trainer[] = [
  {
    trainerId: 301,
    employeeId: '8401',
    firstName: 'Dr. Rajesh',
    lastName: 'Sharma',
    email: 'rajesh.sharma@techv.edu',
    phoneNumber: '+91 98765 43210',
    specialization: 'Java & Spring Boot',
    experienceYears: 12,
    designation: 'Principal Instructor',
    status: 'ACTIVE',
    joiningDate: '2023-01-15'
  },
  {
    trainerId: 302,
    employeeId: '8402',
    firstName: 'Ananya',
    lastName: 'Iyer',
    email: 'ananya.iyer@techv.edu',
    phoneNumber: '+91 98123 45678',
    specialization: 'DevOps & Cloud',
    experienceYears: 8,
    designation: 'Senior Cloud Architect',
    status: 'ACTIVE',
    joiningDate: '2024-03-10'
  },
  {
    trainerId: 303,
    employeeId: '8403',
    firstName: 'Vikram',
    lastName: 'Malhotra',
    email: 'vikram.m@techv.edu',
    phoneNumber: '+91 97654 32109',
    specialization: 'AI & Machine Learning',
    experienceYears: 10,
    designation: 'Lead Data Scientist',
    status: 'ACTIVE',
    joiningDate: '2023-08-20'
  }
];

const SPECIALIZATIONS = [
  'Java & Spring Boot',
  'DevOps & Cloud',
  'AI & Machine Learning',
  'Web Development',
  'Cybersecurity',
  'Data Engineering'
];

const TrainersPage: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState<string>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState<Trainer | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    specialization: 'Java & Spring Boot',
    experienceYears: 5,
    designation: 'Senior Instructor',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Trainer[]>('/trainers');
      if (response.data && response.data.length > 0) {
        setTrainers(response.data);
        localStorage.setItem('mock_lms_trainers', JSON.stringify(response.data));
      } else {
        const saved = localStorage.getItem('mock_lms_trainers');
        if (saved) setTrainers(JSON.parse(saved));
        else {
          setTrainers(INITIAL_MOCK_TRAINERS);
          localStorage.setItem('mock_lms_trainers', JSON.stringify(INITIAL_MOCK_TRAINERS));
        }
      }
    } catch (error) {
      const saved = localStorage.getItem('mock_lms_trainers');
      if (saved) setTrainers(JSON.parse(saved));
      else {
        setTrainers(INITIAL_MOCK_TRAINERS);
        localStorage.setItem('mock_lms_trainers', JSON.stringify(INITIAL_MOCK_TRAINERS));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleOpenModal = (trainer?: Trainer) => {
    if (trainer) {
      setEditingTrainer(trainer);
      setFormData({
        employeeId: trainer.employeeId || '',
        firstName: trainer.firstName || '',
        lastName: trainer.lastName || '',
        email: trainer.email || '',
        phoneNumber: trainer.phoneNumber || '',
        password: '',
        specialization: trainer.specialization || 'Java & Spring Boot',
        experienceYears: trainer.experienceYears || 5,
        designation: trainer.designation || 'Senior Instructor',
        status: trainer.status || 'ACTIVE'
      });
    } else {
      setEditingTrainer(null);
      setFormData({
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        specialization: 'Java & Spring Boot',
        experienceYears: 5,
        designation: 'Senior Instructor',
        status: 'ACTIVE'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrainer(null);
  };

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData({ ...formData, employeeId: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.employeeId.length !== 4) {
      toast.error('Trainer Employee ID must be exactly 4 numeric digits (e.g. 8402)');
      return;
    }
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First and Last name are required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTrainer) {
        try {
          await axiosInstance.put(`/trainers/${editingTrainer.trainerId}`, formData);
          toast.success('Trainer updated on server');
        } catch (err) {
          toast.success('Trainer updated locally');
        }
        const updated = trainers.map(t =>
          t.trainerId === editingTrainer.trainerId
            ? { ...t, ...formData }
            : t
        );
        setTrainers(updated);
        localStorage.setItem('mock_lms_trainers', JSON.stringify(updated));
      } else {
        let newId = Math.floor(Math.random() * 900) + 300;
        try {
          const res = await axiosInstance.post<Trainer>('/trainers', formData);
          if (res.data && res.data.trainerId) newId = res.data.trainerId;
          toast.success('Trainer registered on server');
        } catch (err) {
          toast.success('Trainer registered locally');
        }
        const newTrainer: Trainer = {
          trainerId: newId,
          ...formData,
          joiningDate: new Date().toISOString().split('T')[0]
        };
        const updated = [newTrainer, ...trainers];
        setTrainers(updated);
        localStorage.setItem('mock_lms_trainers', JSON.stringify(updated));
      }
      handleCloseModal();
    } catch (error) {
      toast.error('An error occurred while saving trainer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (trainer: Trainer) => {
    setTrainerToDelete(trainer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!trainerToDelete) return;
    try {
      try {
        await axiosInstance.delete(`/trainers/${trainerToDelete.trainerId}`);
      } catch (e) {}
      const updated = trainers.filter(t => t.trainerId !== trainerToDelete.trainerId);
      setTrainers(updated);
      localStorage.setItem('mock_lms_trainers', JSON.stringify(updated));
      toast.success(`Deleted trainer: ${trainerToDelete.firstName} ${trainerToDelete.lastName}`);
    } catch (err) {
      toast.error('Failed to delete trainer');
    } finally {
      setDeleteModalOpen(false);
      setTrainerToDelete(null);
    }
  };

  const toggleStatus = (trainer: Trainer) => {
    const newStatus = trainer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = trainers.map(t =>
      t.trainerId === trainer.trainerId ? { ...t, status: newStatus as 'ACTIVE' | 'INACTIVE' } : t
    );
    setTrainers(updated);
    localStorage.setItem('mock_lms_trainers', JSON.stringify(updated));
    toast.success(`Status updated to ${newStatus}`);
  };

  const filteredTrainers = useMemo(() => {
    return trainers.filter(trainer => {
      const fullName = `${trainer.firstName} ${trainer.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                            trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            trainer.employeeId.includes(searchQuery);
      const matchesSpec = selectedSpec === 'ALL' || trainer.specialization === selectedSpec;
      return matchesSearch && matchesSpec;
    });
  }, [trainers, searchQuery, selectedSpec]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Trainers</h1>
          <p className="text-purple-100 text-sm mt-1">
            Onboard faculty, assign teaching specializations, and manage instructor profiles
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-purple-900 hover:bg-purple-50 font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus size={18} className="text-purple-600" />
          Add Trainer
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
            placeholder="Search trainers by name, email, or ID..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" 
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-gray-400" />
          <select
            value={selectedSpec}
            onChange={(e) => setSelectedSpec(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none text-gray-700 font-medium"
          >
            <option value="ALL">All Specializations ({trainers.length})</option>
            {SPECIALIZATIONS.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Trainers Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-sm font-medium">Loading faculty directory...</p>
          </div>
        ) : filteredTrainers.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
            <GraduationCap size={48} className="text-gray-300 mb-3 stroke-1" />
            <p className="text-base font-medium text-gray-600">No trainers found matching your criteria</p>
            <p className="text-xs text-gray-400 mt-1">Try clearing filters or onboarding a new instructor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-6">Trainer Profile</th>
                  <th className="py-3.5 px-6">Specialization</th>
                  <th className="py-3.5 px-6">Experience & Role</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredTrainers.map((trainer) => (
                  <tr key={trainer.trainerId} className="hover:bg-purple-50/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                          {trainer.firstName[0]}{trainer.lastName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors flex items-center gap-1.5">
                            {trainer.firstName} {trainer.lastName}
                            <span className="text-xs font-mono font-normal px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                              ID: {trainer.employeeId}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><Mail size={12} /> {trainer.email}</span>
                            {trainer.phoneNumber && (
                              <span className="flex items-center gap-1"><Phone size={12} /> {trainer.phoneNumber}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        <Award size={12} />
                        {trainer.specialization || 'General Instruction'}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{trainer.designation || 'Instructor'}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Briefcase size={12} /> {trainer.experienceYears || 0} Years Experience
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(trainer)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                          trainer.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {trainer.status === 'ACTIVE' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {trainer.status}
                      </button>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(trainer)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title="Edit Trainer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(trainer)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Trainer"
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

      {/* Onboarding / Edit Trainer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTrainer ? `Edit Instructor Profile (#${editingTrainer.employeeId})` : 'Onboard New Faculty Trainer'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Employee ID (4 Digits) *
              </label>
              <input
                type="text"
                required
                maxLength={4}
                value={formData.employeeId}
                onChange={handleEmployeeIdChange}
                placeholder="e.g. 8402"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-mono tracking-widest text-center text-base font-bold"
              />
              <span className="text-[11px] text-gray-400 mt-0.5 block">Strict 4 numeric digits required</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white font-medium"
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
                placeholder="e.g. Ananya"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
                placeholder="e.g. Iyer"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
                placeholder="e.g. ananya.i@techv.edu"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
                placeholder="+91 98123 45678"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Specialization *
              </label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white font-medium text-gray-700"
              >
                {SPECIALIZATIONS.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Experience (Years) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Designation / Role Title *
            </label>
            <input
              type="text"
              required
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              placeholder="e.g. Senior Cloud Architect & Instructor"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {!editingTrainer && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Initial Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Set temporary login password..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Saving...' : editingTrainer ? 'Save Changes' : 'Onboard Trainer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Trainer Removal"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <p>Are you sure you want to remove <strong>{trainerToDelete?.firstName} {trainerToDelete?.lastName}</strong>? Their class schedules and grading assignments may be affected.</p>
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
              Remove Trainer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TrainersPage;

