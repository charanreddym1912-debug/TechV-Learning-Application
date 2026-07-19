import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, Clock, Video, Users, GraduationCap, ExternalLink, Filter, AlertCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import axiosInstance from '../../api/axiosInstance';
import type { ClassSession, Batch, Trainer } from '../../types';
import toast from 'react-hot-toast';

const INITIAL_MOCK_CLASSES: ClassSession[] = [
  {
    classId: 901,
    batchId: 501,
    trainerId: 301,
    title: 'Spring Boot 3 REST API Architecture & Microservices',
    description: 'Deep dive into Spring MVC controllers, DTO patterns, exception handling, and JPA Hibernate mapping.',
    sessionDate: '2026-07-16',
    startTime: '10:00',
    endTime: '12:00',
    zoomMeetingId: '881 2345 6789',
    zoomPasscode: 'SPRING26',
    zoomJoinUrl: 'https://zoom.us/j/88123456789?pwd=SPRING26',
    meetingLink: 'https://zoom.us/j/88123456789?pwd=SPRING26',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    classId: 902,
    batchId: 502,
    trainerId: 302,
    title: 'Kubernetes Cluster Setup & Docker Compose Workflows',
    description: 'Hands-on lab deploying containerized microservices to AWS EKS and configuring ingress controllers.',
    sessionDate: '2026-07-17',
    startTime: '14:00',
    endTime: '16:30',
    zoomMeetingId: '892 3456 7890',
    zoomPasscode: 'KUBE2026',
    zoomJoinUrl: 'https://zoom.us/j/89234567890?pwd=KUBE2026',
    meetingLink: 'https://zoom.us/j/89234567890?pwd=KUBE2026',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    classId: 903,
    batchId: 503,
    trainerId: 303,
    title: 'Neural Network Fundamentals with TensorFlow & Keras',
    description: 'Building and evaluating convolutional neural networks (CNNs) for image classification.',
    sessionDate: '2026-07-18',
    startTime: '11:00',
    endTime: '13:00',
    zoomMeetingId: '873 4567 8901',
    zoomPasscode: 'AI2026LAB',
    zoomJoinUrl: 'https://zoom.us/j/87345678901?pwd=AI2026LAB',
    meetingLink: 'https://zoom.us/j/87345678901?pwd=AI2026LAB',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SchedulePage: React.FC = () => {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<ClassSession | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    batchId: 501,
    trainerId: 301,
    sessionDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '12:00',
    zoomMeetingId: '881 2345 6789',
    zoomPasscode: 'TECHV2026',
    zoomJoinUrl: 'https://zoom.us/j/88123456789?pwd=TECHV2026',
    meetingLink: 'https://zoom.us/j/88123456789?pwd=TECHV2026'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch classes
      try {
        const classRes = await axiosInstance.get<ClassSession[]>('/classes');
        if (classRes.data && classRes.data.length > 0) {
          setSessions(classRes.data);
          localStorage.setItem('mock_lms_classes', JSON.stringify(classRes.data));
        } else {
          const saved = localStorage.getItem('mock_lms_classes');
          if (saved) setSessions(JSON.parse(saved));
          else {
            setSessions(INITIAL_MOCK_CLASSES);
            localStorage.setItem('mock_lms_classes', JSON.stringify(INITIAL_MOCK_CLASSES));
          }
        }
      } catch (e) {
        const saved = localStorage.getItem('mock_lms_classes');
        if (saved) setSessions(JSON.parse(saved));
        else {
          setSessions(INITIAL_MOCK_CLASSES);
          localStorage.setItem('mock_lms_classes', JSON.stringify(INITIAL_MOCK_CLASSES));
        }
      }

      // Fetch batches
      try {
        const batchRes = await axiosInstance.get<Batch[]>('/batches');
        if (batchRes.data && batchRes.data.length > 0) {
          setBatches(batchRes.data);
        } else {
          const savedB = localStorage.getItem('mock_lms_batches');
          if (savedB) setBatches(JSON.parse(savedB));
        }
      } catch (e) {
        const savedB = localStorage.getItem('mock_lms_batches');
        if (savedB) setBatches(JSON.parse(savedB));
      }

      // Fetch trainers
      try {
        const trRes = await axiosInstance.get<Trainer[]>('/trainers');
        if (trRes.data && trRes.data.length > 0) {
          setTrainers(trRes.data);
        } else {
          const savedTr = localStorage.getItem('mock_lms_trainers');
          if (savedTr) setTrainers(JSON.parse(savedTr));
        }
      } catch (e) {
        const savedTr = localStorage.getItem('mock_lms_trainers');
        if (savedTr) setTrainers(JSON.parse(savedTr));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const batchMap = useMemo(() => {
    const map: Record<number, string> = {};
    batches.forEach(b => {
      map[b.batchId] = b.name;
    });
    return map;
  }, [batches]);

  const trainerMap = useMemo(() => {
    const map: Record<number, string> = {};
    trainers.forEach(t => {
      map[t.trainerId] = `${t.firstName} ${t.lastName}`;
    });
    return map;
  }, [trainers]);

  const handleOpenModal = (session?: ClassSession) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        title: session.title || '',
        description: session.description || '',
        batchId: session.batchId || (batches[0]?.batchId || 501),
        trainerId: session.trainerId || (trainers[0]?.trainerId || 301),
        sessionDate: session.sessionDate || '',
        startTime: session.startTime || '10:00',
        endTime: session.endTime || '12:00',
        zoomMeetingId: session.zoomMeetingId || '',
        zoomPasscode: session.zoomPasscode || '',
        zoomJoinUrl: session.zoomJoinUrl || session.meetingLink || '',
        meetingLink: session.meetingLink || session.zoomJoinUrl || ''
      });
    } else {
      setEditingSession(null);
      setFormData({
        title: '',
        description: '',
        batchId: batches[0]?.batchId || 501,
        trainerId: trainers[0]?.trainerId || 301,
        sessionDate: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '12:00',
        zoomMeetingId: '881 2345 6789',
        zoomPasscode: 'TECHV2026',
        zoomJoinUrl: 'https://zoom.us/j/88123456789?pwd=TECHV2026',
        meetingLink: 'https://zoom.us/j/88123456789?pwd=TECHV2026'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSession(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Session title is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingSession) {
        try {
          await axiosInstance.put(`/classes/${editingSession.classId}?batchId=${formData.batchId}&trainerId=${formData.trainerId}`, formData);
          toast.success('Session updated on server');
        } catch (err) {
          toast.success('Session updated locally');
        }
        const updated = sessions.map(s =>
          s.classId === editingSession.classId
            ? { ...s, ...formData, updatedAt: new Date().toISOString() }
            : s
        );
        setSessions(updated);
        localStorage.setItem('mock_lms_classes', JSON.stringify(updated));
      } else {
        let newId = Math.floor(Math.random() * 900) + 900;
        try {
          const res = await axiosInstance.post<ClassSession>(`/classes?batchId=${formData.batchId}&trainerId=${formData.trainerId}`, formData);
          if (res.data && res.data.classId) newId = res.data.classId;
          toast.success('Session scheduled on server');
        } catch (err) {
          toast.success('Session scheduled locally');
        }
        const newSession: ClassSession = {
          classId: newId,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const updated = [newSession, ...sessions];
        setSessions(updated);
        localStorage.setItem('mock_lms_classes', JSON.stringify(updated));
      }
      handleCloseModal();
    } catch (error) {
      toast.error('An error occurred while scheduling session');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (session: ClassSession) => {
    setSessionToDelete(session);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;
    try {
      try {
        await axiosInstance.delete(`/classes/${sessionToDelete.classId}`);
      } catch (e) {}
      const updated = sessions.filter(s => s.classId !== sessionToDelete.classId);
      setSessions(updated);
      localStorage.setItem('mock_lms_classes', JSON.stringify(updated));
      toast.success(`Cancelled session: ${sessionToDelete.title}`);
    } catch (err) {
      toast.error('Failed to cancel session');
    } finally {
      setDeleteModalOpen(false);
      setSessionToDelete(null);
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (session.description && session.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesBatch = selectedBatchFilter === 'ALL' || session.batchId.toString() === selectedBatchFilter;
      return matchesSearch && matchesBatch;
    });
  }, [sessions, searchQuery, selectedBatchFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-700 via-orange-700 to-red-800 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedule Sessions</h1>
          <p className="text-amber-100 text-sm mt-1">
            Organize timetable, assign faculty lectures, and generate video meeting links
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-900 hover:bg-amber-50 font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus size={18} className="text-orange-600" />
          Schedule Session
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
            placeholder="Search sessions by title or curriculum topics..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition" 
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-gray-400" />
          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none text-gray-700 font-medium"
          >
            <option value="ALL">All Batches ({sessions.length})</option>
            {batches.map(b => (
              <option key={b.batchId} value={b.batchId.toString()}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timetable / Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-500 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-sm font-medium">Loading session timetable...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 flex flex-col items-center justify-center">
          <Calendar size={48} className="text-gray-300 mb-3 stroke-1" />
          <p className="text-base font-medium text-gray-600">No sessions found matching your criteria</p>
          <p className="text-xs text-gray-400 mt-1">Try clearing filters or scheduling a new class lecture</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div 
              key={session.classId} 
              className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-orange-50/30 flex justify-between items-start gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 mb-2">
                    <Users size={12} />
                    {batchMap[session.batchId] || `Batch #${session.batchId}`}
                  </span>
                  <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 text-base leading-snug">
                    {session.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenModal(session)}
                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                    title="Edit Session"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(session)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Cancel Session"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 text-sm text-gray-600">
                {session.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {session.description}
                  </p>
                )}

                <div className="pt-2 space-y-2 border-t border-gray-100/80 text-xs">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <GraduationCap size={16} className="text-orange-500 shrink-0" />
                    <span>Instructor: <strong>{trainerMap[session.trainerId] || `Trainer #${session.trainerId}`}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Calendar size={16} className="text-orange-500 shrink-0" />
                    <span>Date: <strong>{session.sessionDate || 'Today'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Clock size={16} className="text-orange-500 shrink-0" />
                    <span>Time: <strong>{session.startTime} &rarr; {session.endTime}</strong></span>
                  </div>
                </div>
              </div>

              {/* Zoom Classroom & Footer */}
              <div className="p-4 bg-blue-50/50 border-t border-blue-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-bold text-[#0E71EB]">
                    <Video size={14} />
                    Zoom Classroom
                  </span>
                  {session.zoomMeetingId && (
                    <span className="font-mono text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                      ID: {session.zoomMeetingId}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] font-mono text-gray-400">Class #{session.classId}</span>
                  <div className="flex items-center gap-2">
                    {session.zoomMeetingId && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`Zoom Meeting ID: ${session.zoomMeetingId} | Passcode: ${session.zoomPasscode || 'N/A'} | Link: ${session.zoomJoinUrl || session.meetingLink || ''}`);
                          toast.success('Zoom Meeting credentials copied to clipboard!');
                        }}
                        className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold transition shadow-2xs"
                      >
                        Copy Info
                      </button>
                    )}
                    {session.zoomJoinUrl || session.meetingLink ? (
                      <a
                        href={session.zoomJoinUrl || session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0E71EB] hover:bg-[#0051C3] text-white rounded-lg text-xs font-bold shadow-sm transition"
                      >
                        <Video size={14} />
                        Launch Zoom
                        <ExternalLink size={12} className="ml-0.5 opacity-80" />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">No Zoom Link</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule / Edit Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSession ? `Edit Session #${editingSession.classId}` : 'Schedule New Live Class Session'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Class Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Microservices Architecture & API Gateway Lab"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Assign Batch *
              </label>
              <select
                value={formData.batchId}
                onChange={(e) => setFormData({ ...formData, batchId: parseInt(e.target.value) })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium text-gray-700"
              >
                {batches.map(b => (
                  <option key={b.batchId} value={b.batchId}>
                    {b.name} (ID: #{b.batchId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Faculty Instructor *
              </label>
              <select
                value={formData.trainerId}
                onChange={(e) => setFormData({ ...formData, trainerId: parseInt(e.target.value) })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium text-gray-700"
              >
                {trainers.map(tr => (
                  <option key={tr.trainerId} value={tr.trainerId}>
                    {tr.firstName} {tr.lastName} ({tr.specialization || 'Instructor'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Session Date *
              </label>
              <input
                type="date"
                required
                value={formData.sessionDate}
                onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                End Time *
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-700"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0E71EB] uppercase tracking-wider flex items-center gap-1.5">
                <Video size={16} /> Zoom Virtual Classroom Integration
              </span>
              <button
                type="button"
                onClick={() => {
                  const randomId = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
                  const randomPass = Math.random().toString(36).substring(2, 8).toUpperCase();
                  const joinUrl = `https://zoom.us/j/${randomId.replace(/\s/g, '')}?pwd=${randomPass}`;
                  setFormData({
                    ...formData,
                    zoomMeetingId: randomId,
                    zoomPasscode: randomPass,
                    zoomJoinUrl: joinUrl,
                    meetingLink: joinUrl
                  });
                  toast.success('Generated Zoom Meeting ID and Passcode');
                }}
                className="px-2.5 py-1 bg-[#0E71EB] hover:bg-[#0051C3] text-white rounded-md text-[11px] font-bold shadow-2xs transition"
              >
                + Auto-Generate Zoom Link
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Zoom Meeting ID
                </label>
                <input
                  type="text"
                  value={formData.zoomMeetingId}
                  onChange={(e) => setFormData({ ...formData, zoomMeetingId: e.target.value })}
                  placeholder="e.g. 881 2345 6789"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E71EB] outline-none font-mono text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Zoom Passcode
                </label>
                <input
                  type="text"
                  value={formData.zoomPasscode}
                  onChange={(e) => setFormData({ ...formData, zoomPasscode: e.target.value })}
                  placeholder="e.g. TECHV26"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E71EB] outline-none font-mono text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Zoom Join URL / Meeting Link *
              </label>
              <input
                type="url"
                value={formData.zoomJoinUrl || formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, zoomJoinUrl: e.target.value, meetingLink: e.target.value })}
                placeholder="https://zoom.us/j/88123456789?pwd=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E71EB] outline-none font-mono text-xs bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Session Agenda & Notes
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline topics covered, required software tools, lab instructions, and reading materials..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
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
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Saving...' : editingSession ? 'Save Changes' : 'Schedule Session'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Session Cancellation"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <p>Are you sure you want to cancel session <strong>{sessionToDelete?.title}</strong>? Students and faculty will no longer see this in their timetable.</p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition text-sm"
            >
              Keep Session
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition shadow-sm text-sm"
            >
              Cancel Session
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SchedulePage;
