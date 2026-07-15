import React from 'react';
import {
  Video,
  Users,
  FileText,
  ClipboardCheck,
  ExternalLink,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
}) => (
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      </div>

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const todayClasses = [
    {
      id: 1,
      topic: 'React Components and Props',
      batch: 'Batch A',
      time: '10:00 AM',
      status: 'Scheduled',
      zoomUrl: 'https://zoom.us/',
    },
    {
      id: 2,
      topic: 'Spring Boot REST APIs',
      batch: 'Batch B',
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Trainer Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          View classes, attendance, assignments and reviews
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Upcoming Classes"
          value="5"
          subtitle="Scheduled sessions"
          icon={<Video size={24} className="text-blue-600" />}
          color="bg-blue-50"
        />

        <StatCard
          title="Students Present"
          value="28/30"
          subtitle="Latest Zoom session"
          icon={<Users size={24} className="text-green-600" />}
          color="bg-green-50"
        />

        <StatCard
          title="Active Assignments"
          value="8"
          subtitle="Published assignments"
          icon={<FileText size={24} className="text-purple-600" />}
          color="bg-purple-50"
        />

        <StatCard
          title="Assignments to Review"
          value="12"
          subtitle="Auto-graded submissions"
          icon={<ClipboardCheck size={24} className="text-orange-600" />}
          color="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Today's Classes
          </h2>

          <div className="space-y-3">
            {todayClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="flex flex-col justify-between gap-4 rounded-lg border border-gray-100 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-800">
                    {classItem.topic}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {classItem.batch} • {classItem.time}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
                    {classItem.status}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openZoomMeeting(classItem.zoomUrl)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  <Video size={17} />
                  Join Zoom
                  <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Recent Auto-Graded Submissions
          </h2>

          <div className="space-y-3">
            {recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex flex-col justify-between gap-3 rounded-lg border border-gray-100 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-800">
                    {submission.student}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {submission.assignment}
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    Generated Grade: {submission.grade}
                  </p>
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-600">
                  {submission.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;