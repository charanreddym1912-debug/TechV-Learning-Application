import React from 'react';
import {
  Video,
  Eye,
  Calendar,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface TrainerClass {
  id: number;
  topic: string;
  course: string;
  batch: string;
  date: string;
  time: string;
  duration: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  zoomUrl: string;
}

const MyClasses: React.FC = () => {
  const classes: TrainerClass[] = [
    {
      id: 1,
      topic: 'React Components and Props',
      course: 'Frontend Development',
      batch: 'Batch A',
      date: '2026-07-15',
      time: '10:00 AM',
      duration: '60 minutes',
      status: 'Scheduled',
      zoomUrl: 'https://zoom.us/',
    },
    {
      id: 2,
      topic: 'React State and Events',
      course: 'Frontend Development',
      batch: 'Batch A',
      date: '2026-07-16',
      time: '10:00 AM',
      duration: '60 minutes',
      status: 'Scheduled',
      zoomUrl: 'https://zoom.us/',
    },
    {
      id: 3,
      topic: 'Spring Boot REST APIs',
      course: 'Java Full Stack',
      batch: 'Batch B',
      date: '2026-07-14',
      time: '02:00 PM',
      duration: '90 minutes',
      status: 'Completed',
      zoomUrl: 'https://zoom.us/',
    },
  ];

  const openZoomMeeting = (classItem: TrainerClass) => {
    if (classItem.status !== 'Scheduled') {
      return;
    }

    window.open(
      classItem.zoomUrl,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const getStatusStyle = (status: TrainerClass['status']) => {
    if (status === 'Scheduled') {
      return 'bg-blue-50 text-blue-600';
    }

    if (status === 'Completed') {
      return 'bg-green-50 text-green-600';
    }

    return 'bg-red-50 text-red-600';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          My Classes
        </h1>

        <p className="mt-1 text-gray-500">
          View scheduled classes and join Zoom meetings
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Scheduled Classes
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Topic</th>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Batch</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Time</th>
                <th className="px-6 py-3 text-left">Duration</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {classes.map((classItem) => (
                <tr key={classItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {classItem.topic}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {classItem.course}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {classItem.batch}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {classItem.date}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {classItem.time}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {classItem.duration}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${getStatusStyle(
                        classItem.status,
                      )}`}
                    >
                      {classItem.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={classItem.status !== 'Scheduled'}
                        onClick={() => openZoomMeeting(classItem)}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                          classItem.status === 'Scheduled'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'cursor-not-allowed bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Video size={16} />
                        Join Zoom
                        <ExternalLink size={13} />
                      </button>

                      <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Eye size={16} />
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyClasses;