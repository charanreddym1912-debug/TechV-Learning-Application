import React from 'react';
import {
  Video,
  Eye,
  Calendar,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  SecondaryButton,
  StatusBadge,
  ZoomButton,
} from '../../components/trainer/TrainerUI';

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Classes
        </h1>

        <p className="mt-1 text-gray-500">
          View scheduled classes and launch Zoom classrooms.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Scheduled Classes
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead className="bg-primary-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">Topic</th>
                <th className="px-6 py-4 text-left">Course</th>
                <th className="px-6 py-4 text-left">Batch</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Time</th>
                <th className="px-6 py-4 text-left">Duration</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {classes.map((classItem) => (
                <tr
                  key={classItem.id}
                  className="transition hover:bg-primary-50/50"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
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
                      <Calendar
                        size={16}
                        className="text-primary-500"
                      />
                      {classItem.date}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock
                        size={16}
                        className="text-primary-500"
                      />
                      {classItem.time}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {classItem.duration}
                  </td>

                  <td className="px-6 py-4">
                    {classItem.status === 'Scheduled' && (
                      <StatusBadge type="zoom">
                        Zoom Live Session
                      </StatusBadge>
                    )}

                    {classItem.status === 'Completed' && (
                      <StatusBadge type="success">
                        Completed
                      </StatusBadge>
                    )}

                    {classItem.status === 'Cancelled' && (
                      <StatusBadge type="danger">
                        Cancelled
                      </StatusBadge>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <ZoomButton
                        type="button"
                        disabled={
                          classItem.status !== 'Scheduled'
                        }
                        onClick={() =>
                          openZoomMeeting(classItem)
                        }
                      >
                        <Video size={16} />
                        Join Zoom
                        <ExternalLink size={13} />
                      </ZoomButton>

                      <SecondaryButton type="button">
                        <Eye size={16} />
                        Details
                      </SecondaryButton>
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