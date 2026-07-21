import React from 'react';
import {
  Video,
  Users,
  FileText,
  ClipboardCheck,
  ExternalLink,
} from 'lucide-react';
import {
  StatusBadge,
  ZoomButton,
} from '../../components/trainer/TrainerUI';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gradient,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${gradient}`}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-white/70">
            {subtitle}
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-md">
          {icon}
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const todayClasses = [
    {
      id: 1,
      topic: 'React Components and Props',
      batch: 'Frontend Batch A',
      time: '10:00 AM',
      status: 'Scheduled',
      zoomUrl: 'https://zoom.us/',
    },
    {
      id: 2,
      topic: 'Spring Boot REST APIs',
      batch: 'Java Batch B',
      time: '02:00 PM',
      status: 'Scheduled',
      zoomUrl: 'https://zoom.us/',
    },
  ];

  const recentSubmissions = [
    {
      id: 1,
      student: 'John Smith',
      assignment: 'React Fundamentals',
      grade: '18/20',
      status: 'Awaiting Review',
    },
    {
      id: 2,
      student: 'Priya Sharma',
      assignment: 'REST API Fundamentals',
      grade: '19/20',
      status: 'Awaiting Review',
    },
  ];

  const openZoomMeeting = (zoomUrl: string) => {
    window.open(zoomUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-primary-950 p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md">
            TechV Enterprise Learning Portal
          </span>

          <h1 className="mt-4 text-3xl font-bold">
            Trainer Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-primary-200">
            Manage classes, monitor automatic attendance, create
            assignments, and review generated grades.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Upcoming Classes"
          value="5"
          subtitle="Scheduled sessions"
          icon={<Video size={26} />}
          gradient="from-blue-600 via-indigo-600 to-indigo-800"
        />

        <StatCard
          title="Students Present"
          value="28/30"
          subtitle="Latest Zoom session"
          icon={<Users size={26} />}
          gradient="from-emerald-600 via-teal-600 to-teal-800"
        />

        <StatCard
          title="Active Assignments"
          value="8"
          subtitle="Currently published"
          icon={<FileText size={26} />}
          gradient="from-purple-600 via-fuchsia-600 to-purple-800"
        />

        <StatCard
          title="Assignments to Review"
          value="12"
          subtitle="Auto-graded submissions"
          icon={<ClipboardCheck size={26} />}
          gradient="from-amber-600 via-orange-600 to-red-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-5 text-lg font-semibold text-gray-800">
            Today's Classes
          </h2>

          <div className="space-y-4">
            {todayClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {classItem.topic}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {classItem.batch} • {classItem.time}
                  </p>

                  <div className="mt-3">
                    <StatusBadge type="zoom">
                      Zoom Live Session
                    </StatusBadge>
                  </div>
                </div>

                <ZoomButton
                  type="button"
                  onClick={() =>
                    openZoomMeeting(classItem.zoomUrl)
                  }
                >
                  <Video size={17} />
                  Join Zoom
                  <ExternalLink size={14} />
                </ZoomButton>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-5 text-lg font-semibold text-gray-800">
            Recent Auto-Graded Submissions
          </h2>

          <div className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {submission.student}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {submission.assignment}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-primary-700">
                    Generated Grade: {submission.grade}
                  </p>
                </div>

                <StatusBadge type="warning">
                  {submission.status}
                </StatusBadge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;