import React, { useState, useEffect } from 'react';
import { BookOpen, Users, GraduationCap, Calendar, Video, ArrowRight, Clock, Award, CheckCircle2, TrendingUp, Sparkles, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import type { Course, Batch, Trainer, Student, ClassSession } from '../../types';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, gradient, onClick }) => (
  <div 
    onClick={onClick}
    className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer bg-gradient-to-br ${gradient}`}
  >
    <div className="absolute right-0 top-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-white/80">{title}</p>
        <p className="text-3xl font-extrabold mt-2 tracking-tight">{value}</p>
        <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-white/90 bg-black/15 w-fit px-2.5 py-0.5 rounded-full">
          <TrendingUp size={12} />
          <span>{subtitle}</span>
        </div>
      </div>
      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0">
        {icon}
      </div>
    </div>
  </div>
);

const CoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [coursesRes, batchesRes, trainersRes, studentsRes, classesRes] = await Promise.allSettled([
        axiosInstance.get<Course[]>('/courses'),
        axiosInstance.get<Batch[]>('/batches'),
        axiosInstance.get<Trainer[]>('/trainers'),
        axiosInstance.get<Student[]>('/students'),
        axiosInstance.get<ClassSession[]>('/classes')
      ]);

      // Courses
      if (coursesRes.status === 'fulfilled' && coursesRes.value.data) {
        setCourses(coursesRes.value.data);
        localStorage.setItem('mock_lms_courses', JSON.stringify(coursesRes.value.data));
      } else {
        const saved = localStorage.getItem('mock_lms_courses');
        if (saved) setCourses(JSON.parse(saved));
      }

      // Batches
      if (batchesRes.status === 'fulfilled' && batchesRes.value.data) {
        setBatches(batchesRes.value.data);
        localStorage.setItem('mock_lms_batches', JSON.stringify(batchesRes.value.data));
      } else {
        const saved = localStorage.getItem('mock_lms_batches');
        if (saved) setBatches(JSON.parse(saved));
      }

      // Trainers
      if (trainersRes.status === 'fulfilled' && trainersRes.value.data) {
        setTrainers(trainersRes.value.data);
        localStorage.setItem('mock_lms_trainers', JSON.stringify(trainersRes.value.data));
      } else {
        const saved = localStorage.getItem('mock_lms_trainers');
        if (saved) setTrainers(JSON.parse(saved));
      }

      // Students
      if (studentsRes.status === 'fulfilled' && studentsRes.value.data) {
        setStudents(studentsRes.value.data);
        localStorage.setItem('mock_lms_students', JSON.stringify(studentsRes.value.data));
      } else {
        const saved = localStorage.getItem('mock_lms_students');
        if (saved) setStudents(JSON.parse(saved));
      }

      // Classes
      if (classesRes.status === 'fulfilled' && classesRes.value.data) {
        setSessions(classesRes.value.data);
        localStorage.setItem('mock_lms_classes', JSON.stringify(classesRes.value.data));
      } else {
        const saved = localStorage.getItem('mock_lms_classes');
        if (saved) setSessions(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const batchMap = React.useMemo(() => {
    const map: Record<number, string> = {};
    batches.forEach(b => { map[b.batchId] = b.name; });
    return map;
  }, [batches]);

  const trainerMap = React.useMemo(() => {
    const map: Record<number, string> = {};
    trainers.forEach(t => { map[t.trainerId] = `${t.firstName} ${t.lastName}`; });
    return map;
  }, [trainers]);

  // Generate dynamic recent activity from createdAt timestamps
  const recentActivity = React.useMemo(() => {
    const list: Array<{ id: string; type: string; title: string; time: string; icon: React.ReactNode; color: string }> = [];

    courses.slice(0, 3).forEach(c => {
      list.push({
        id: `course-${c.courseId}`,
        type: 'New Course Added',
        title: c.title,
        time: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recently',
        icon: <BookOpen size={16} className="text-blue-600" />,
        color: 'bg-blue-50 border-blue-100'
      });
    });

    batches.slice(0, 3).forEach(b => {
      list.push({
        id: `batch-${b.batchId}`,
        type: 'Cohort Created',
        title: b.name,
        time: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recently',
        icon: <Users size={16} className="text-emerald-600" />,
        color: 'bg-emerald-50 border-emerald-100'
      });
    });

    trainers.slice(0, 2).forEach(t => {
      list.push({
        id: `trainer-${t.trainerId}`,
        type: 'Faculty Onboarded',
        title: `${t.firstName} ${t.lastName} (${t.specialization || 'Instructor'})`,
        time: t.joiningDate || 'Recently',
        icon: <GraduationCap size={16} className="text-purple-600" />,
        color: 'bg-purple-50 border-purple-100'
      });
    });

    return list.slice(0, 5);
  }, [courses, batches, trainers]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-3 border border-white/15">
              <Sparkles size={14} className="text-yellow-400" />
              <span>TechV Enterprise Learning Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Coordinator Dashboard</h1>
            <p className="text-indigo-100 text-sm mt-2 max-w-xl leading-relaxed">
              Welcome back! Here is the live operational overview of curriculum catalogs, active academic batches, instructor allocations, and student enrollments.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/coordinator/courses')}
              className="px-4 py-2.5 bg-white text-indigo-950 hover:bg-indigo-50 font-bold rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
            >
              <PlusCircle size={15} className="text-indigo-600" />
              New Course
            </button>
            <button
              onClick={() => navigate('/coordinator/schedule')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-1.5 border border-indigo-500"
            >
              <Calendar size={15} />
              Schedule Class
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={loading ? '...' : courses.length}
          subtitle={`${courses.length} Active curricula`}
          icon={<BookOpen size={28} className="text-white" />}
          gradient="from-blue-600 via-indigo-600 to-indigo-800"
          onClick={() => navigate('/coordinator/courses')}
        />
        <StatCard
          title="Active Batches"
          value={loading ? '...' : batches.length}
          subtitle="Ongoing study cohorts"
          icon={<Users size={28} className="text-white" />}
          gradient="from-emerald-600 via-teal-600 to-teal-800"
          onClick={() => navigate('/coordinator/batches')}
        />
        <StatCard
          title="Faculty Trainers"
          value={loading ? '...' : trainers.length}
          subtitle="Onboarded instructors"
          icon={<GraduationCap size={28} className="text-white" />}
          gradient="from-purple-600 via-fuchsia-600 to-purple-800"
          onClick={() => navigate('/coordinator/trainers')}
        />
        <StatCard
          title="Enrolled Students"
          value={loading ? '...' : students.length}
          subtitle="Active academic learners"
          icon={<Award size={28} className="text-white" />}
          gradient="from-amber-600 via-orange-600 to-red-700"
          onClick={() => navigate('/coordinator/students')}
        />
      </div>

      {/* Main Content Split: Upcoming Sessions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Sessions (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <Calendar size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Upcoming Live Sessions</h2>
                <p className="text-xs text-gray-400">Scheduled classroom lectures and lab tutorials</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/coordinator/schedule')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View Full Timetable <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
              <p className="text-xs">Loading upcoming sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Calendar size={36} className="mx-auto text-gray-300 mb-2 stroke-1" />
              <p className="text-sm font-medium text-gray-600">No upcoming sessions scheduled</p>
              <p className="text-xs text-gray-400 mt-1">Use the Schedule Class button to set up live meetings</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {sessions.slice(0, 4).map((session) => (
                <div
                  key={session.classId}
                  className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800">
                        {batchMap[session.batchId] || `Batch #${session.batchId}`}
                      </span>
                      <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Clock size={12} className="text-gray-400" />
                        {session.sessionDate} ({session.startTime} - {session.endTime})
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors text-sm">
                      {session.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Instructor: <strong className="text-gray-700">{trainerMap[session.trainerId] || `Trainer #${session.trainerId}`}</strong>
                    </p>
                  </div>

                  {session.zoomJoinUrl || session.meetingLink ? (
                    <a
                      href={session.zoomJoinUrl || session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#0E71EB] hover:bg-[#0051C3] text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Video size={14} />
                      Launch Zoom
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">No Zoom Link</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Feed (1 Column) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <TrendingUp size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
              <p className="text-xs text-gray-400">Latest LMS administrative updates</p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
              <p className="text-xs">Loading activity feed...</p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <CheckCircle2 size={36} className="mx-auto text-gray-300 mb-2 stroke-1" />
              <p className="text-sm font-medium text-gray-600">No recent activity recorded</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-gray-900 truncate">{item.type}</span>
                      <span className="text-[10px] text-gray-400 shrink-0 font-medium">{item.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate mt-0.5 font-medium">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;

