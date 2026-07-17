import React, { useMemo, useState } from 'react';
import {
  CheckCircle,
  Search,
  Users,
  XCircle,
} from 'lucide-react';
import {
  GlassSurface,
  StatusBadge,
  inputClassName,
} from '../../components/trainer/TrainerUI';

interface AttendanceRecord {
  id: number;
  studentName: string;
  employeeId: string;
  status: 'Present' | 'Absent';
}

const Attendance: React.FC = () => {
  const [selectedCourse, setSelectedCourse] =
    useState('Frontend Development');
  const [selectedBatch, setSelectedBatch] =
    useState('Batch A');
  const [selectedSession, setSelectedSession] =
    useState('React Components - 2026-07-15');
  const [searchText, setSearchText] = useState('');

  const attendanceRecords: AttendanceRecord[] = [
    {
      id: 1,
      studentName: 'John Smith',
      employeeId: 'EMP-1001',
      status: 'Present',
    },
    {
      id: 2,
      studentName: 'Priya Sharma',
      employeeId: 'EMP-1002',
      status: 'Present',
    },
    {
      id: 3,
      studentName: 'Rahul Reddy',
      employeeId: 'EMP-1003',
      status: 'Absent',
    },
    {
      id: 4,
      studentName: 'Ananya Patel',
      employeeId: 'EMP-1004',
      status: 'Present',
    },
  ];

  const filteredRecords = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    if (!search) {
      return attendanceRecords;
    }

    return attendanceRecords.filter(
      (record) =>
        record.studentName.toLowerCase().includes(search) ||
        record.employeeId.toLowerCase().includes(search),
    );
  }, [searchText]);

  const presentCount = attendanceRecords.filter(
    (record) => record.status === 'Present',
  ).length;

  const absentCount = attendanceRecords.filter(
    (record) => record.status === 'Absent',
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Zoom Attendance Report
        </h1>

        <p className="mt-1 text-gray-500">
          Attendance is automatically generated from Zoom and
          displayed as Present or Absent.
        </p>
      </div>

      <GlassSurface className="p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Course
            </label>

            <select
              value={selectedCourse}
              onChange={(event) =>
                setSelectedCourse(event.target.value)
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
              Batch
            </label>

            <select
              value={selectedBatch}
              onChange={(event) =>
                setSelectedBatch(event.target.value)
              }
              className={inputClassName}
            >
              <option>Batch A</option>
              <option>Batch B</option>
              <option>Batch C</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Zoom Session
            </label>

            <select
              value={selectedSession}
              onChange={(event) =>
                setSelectedSession(event.target.value)
              }
              className={inputClassName}
            >
              <option>React Components - 2026-07-15</option>
              <option>React State - 2026-07-16</option>
              <option>React Router - 2026-07-17</option>
            </select>
          </div>
        </div>
      </GlassSurface>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md">
              <Users size={24} />
            </div>

            <div>
              <p className="text-sm text-white/80">
                Total Students
              </p>
              <p className="text-2xl font-bold">
                {attendanceRecords.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-800 p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md">
              <CheckCircle size={24} />
            </div>

            <div>
              <p className="text-sm text-white/80">Present</p>
              <p className="text-2xl font-bold">
                {presentCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-red-800 p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md">
              <XCircle size={24} />
            </div>

            <div>
              <p className="text-sm text-white/80">Absent</p>
              <p className="text-2xl font-bold">
                {absentCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <GlassSurface className="overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Attendance Results
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {selectedCourse} • {selectedBatch} •{' '}
              {selectedSession}
            </p>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="Search student"
              className={`${inputClassName} pl-10 md:w-64`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left">
                  Employee ID
                </th>
                <th className="px-6 py-4 text-left">
                  Attendance Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="transition hover:bg-primary-50/50"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {record.studentName}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {record.employeeId}
                  </td>

                  <td className="px-6 py-4">
                    {record.status === 'Present' ? (
                      <StatusBadge type="success">
                        <CheckCircle size={15} />
                        Present
                      </StatusBadge>
                    ) : (
                      <StatusBadge type="danger">
                        <XCircle size={15} />
                        Absent
                      </StatusBadge>
                    )}
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassSurface>
    </div>
  );
};

export default Attendance;