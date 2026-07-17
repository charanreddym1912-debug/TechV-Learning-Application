import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  Plus,
  Trash2,
  User,
  Video,
} from 'lucide-react';
import {
  DangerButton,
  GlassSurface,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  ZoomButton,
  inputClassName,
} from '../../components/trainer/TrainerUI';

interface MockInterview {
  id: number;
  student: string;
  course: string;
  interviewDate: string;
  interviewTime: string;
  duration: number;
  technology: string;
  meetingUrl: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

const MockInterview: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [student, setStudent] = useState('');
  const [course, setCourse] =
    useState('Frontend Development');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [duration, setDuration] = useState(45);
  const [technology, setTechnology] = useState('');
  const [meetingUrl, setMeetingUrl] =
    useState('https://zoom.us/');
  const [notes, setNotes] = useState('');

  const [interviews, setInterviews] =
    useState<MockInterview[]>([
      {
        id: 1,
        student: 'John Smith',
        course: 'Frontend Development',
        interviewDate: '2026-07-24',
        interviewTime: '10:00 AM',
        duration: 45,
        technology: 'React and TypeScript',
        meetingUrl: 'https://zoom.us/',
        status: 'Scheduled',
      },
      {
        id: 2,
        student: 'Priya Sharma',
        course: 'Java Full Stack',
        interviewDate: '2026-07-22',
        interviewTime: '02:00 PM',
        duration: 60,
        technology: 'Java and Spring Boot',
        meetingUrl: 'https://zoom.us/',
        status: 'Completed',
      },
    ]);

  const resetForm = () => {
    setStudent('');
    setCourse('Frontend Development');
    setInterviewDate('');
    setInterviewTime('');
    setDuration(45);
    setTechnology('');
    setMeetingUrl('https://zoom.us/');
    setNotes('');
    setShowForm(false);
  };

  const scheduleInterview = () => {
    if (
      !student.trim() ||
      !interviewDate ||
      !interviewTime ||
      !technology.trim()
    ) {
      window.alert(
        'Please complete the required interview details.',
      );
      return;
    }

    const newInterview: MockInterview = {
      id: Date.now(),
      student: student.trim(),
      course,
      interviewDate,
      interviewTime,
      duration,
      technology: technology.trim(),
      meetingUrl,
      status: 'Scheduled',
    };

    setInterviews((currentInterviews) => [
      newInterview,
      ...currentInterviews,
    ]);

    window.alert('Mock interview scheduled successfully.');
    resetForm();
  };

  const openMeeting = (interview: MockInterview) => {
    if (interview.status !== 'Scheduled') {
      return;
    }

    window.open(
      interview.meetingUrl,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const deleteInterview = (interviewId: number) => {
    setInterviews((currentInterviews) =>
      currentInterviews.filter(
        (interview) => interview.id !== interviewId,
      ),
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Mock Interviews
          </h1>

          <p className="mt-1 text-gray-500">
            Schedule technical mock interviews and launch the
            interview session through Zoom.
          </p>
        </div>

        <PrimaryButton
          type="button"
          onClick={() => setShowForm((current) => !current)}
        >
          <Plus size={18} />
          {showForm
            ? 'Close Form'
            : 'Schedule Mock Interview'}
        </PrimaryButton>
      </div>

      {showForm && (
        <GlassSurface className="p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-800">
            Interview Details
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Student
              </label>

              <input
                value={student}
                onChange={(event) =>
                  setStudent(event.target.value)
                }
                placeholder="Enter student name"
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Course
              </label>

              <select
                value={course}
                onChange={(event) =>
                  setCourse(event.target.value)
                }
                className={inputClassName}
              >
                <option>Frontend Development</option>
                <option>Java Full Stack</option>
                <option>Database Development</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Interview Date
              </label>

              <input
                type="date"
                value={interviewDate}
                onChange={(event) =>
                  setInterviewDate(event.target.value)
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Interview Time
              </label>

              <input
                type="time"
                value={interviewTime}
                onChange={(event) =>
                  setInterviewTime(event.target.value)
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Duration in Minutes
              </label>

              <input
                type="number"
                min="15"
                value={duration}
                onChange={(event) =>
                  setDuration(Number(event.target.value))
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Technology / Interview Topic
              </label>

              <input
                value={technology}
                onChange={(event) =>
                  setTechnology(event.target.value)
                }
                placeholder="React, Java, SQL..."
                className={inputClassName}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Zoom Meeting URL
              </label>

              <input
                value={meetingUrl}
                onChange={(event) =>
                  setMeetingUrl(event.target.value)
                }
                placeholder="Enter Zoom meeting link"
                className={inputClassName}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Interview Notes
              </label>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Add interview instructions or focus areas"
                rows={4}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <PrimaryButton
              type="button"
              onClick={scheduleInterview}
            >
              <Calendar size={18} />
              Schedule Interview
            </PrimaryButton>
          </div>
        </GlassSurface>
      )}

      <GlassSurface className="overflow-hidden">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Interview Schedule
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-primary-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">
                  Student
                </th>
                <th className="px-6 py-4 text-left">
                  Course
                </th>
                <th className="px-6 py-4 text-left">
                  Technology
                </th>
                <th className="px-6 py-4 text-left">
                  Date
                </th>
                <th className="px-6 py-4 text-left">
                  Time
                </th>
                <th className="px-6 py-4 text-left">
                  Duration
                </th>
                <th className="px-6 py-4 text-left">
                  Status
                </th>
                <th className="px-6 py-4 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {interviews.map((interview) => (
                <tr
                  key={interview.id}
                  className="transition hover:bg-primary-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-semibold text-gray-800">
                      <User
                        size={16}
                        className="text-primary-500"
                      />
                      {interview.student}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {interview.course}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {interview.technology}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={16}
                        className="text-primary-500"
                      />
                      {interview.interviewDate}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock
                        size={16}
                        className="text-primary-500"
                      />
                      {interview.interviewTime}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {interview.duration} minutes
                  </td>

                  <td className="px-6 py-4">
                    {interview.status === 'Scheduled' && (
                      <StatusBadge type="zoom">
                        Scheduled
                      </StatusBadge>
                    )}

                    {interview.status === 'Completed' && (
                      <StatusBadge type="success">
                        Completed
                      </StatusBadge>
                    )}

                    {interview.status === 'Cancelled' && (
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
                          interview.status !== 'Scheduled'
                        }
                        onClick={() =>
                          openMeeting(interview)
                        }
                      >
                        <Video size={16} />
                        Join
                        <ExternalLink size={13} />
                      </ZoomButton>

                      <SecondaryButton
                        type="button"
                        className="p-2.5"
                      >
                        <Edit size={16} />
                      </SecondaryButton>

                      <DangerButton
                        type="button"
                        className="p-2.5"
                        onClick={() =>
                          deleteInterview(interview.id)
                        }
                      >
                        <Trash2 size={16} />
                      </DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassSurface>
    </div>
  );
};

export default MockInterview;