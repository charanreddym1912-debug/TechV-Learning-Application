import React, { useMemo, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Search,
  Users,
} from 'lucide-react';

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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Zoom Attendance Report
        </h1>

        <p className="mt-1 text-gray-500">
          Attendance is automatically generated from Zoom
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Course
            </label>

            <select
              value={selectedCourse}
              onChange={(event) =>
                setSelectedCourse(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            >
              <option>Frontend Development</option>
              <option>Java Full Stack</option>
              <option>Database Development</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Batch
            </label>

            <select
              value={selectedBatch}
              onChange={(event) =>
                setSelectedBatch(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            >
              <option>Batch A</option>
              <option>Batch B</option>
              <option>Batch C</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Zoom Session
            </label>

            <select
              value={selectedSession}
              onChange={(event) =>
                setSelectedSession(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            >
              <option>React Components - 2026-07-15</option>
              <option>React State - 2026-07-16</option>
              <option>React Router - 2026-07-17</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={24} />

            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">
                {attendanceRecords.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />

            <div>
              <p className="text-sm text-gray-500">Present</p>
              <p className="text-2xl font-bold text-gray-800">
                {presentCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-600" size={24} />

            <div>
              <p className="text-sm text-gray-500">Absent</p>
              <p className="text-2xl font-bold text-gray-800">
                {absentCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b p-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Attendance Results
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {selectedCourse} • {selectedBatch}
            </p>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />

            <input
              type="text"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="Search student"
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 md:w-64"
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Student Name</th>
              <th className="px-6 py-3 text-left">Employee ID</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {record.studentName}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {record.employeeId}
                </td>

                <td className="px-6 py-4">
                  {record.status === 'Present' ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      <CheckCircle size={15} />
                      Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                      <XCircle size={15} />
                      Absent
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {filteredRecords.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;