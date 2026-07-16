export type UserRole = 'COORDINATOR' | 'TRAINER' | 'STUDENT';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  trainerName: string;
  batchName: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  status: 'active' | 'completed' | 'upcoming';
  thumbnailColor: string;
}

export interface LiveSession {
  id: number;
  title: string;
  courseName: string;
  trainerName: string;
  startTime: string;
  endTime: string;
  meetingNumber: string;
  status: 'live' | 'upcoming' | 'ended';
}

export interface Assignment {
  id: number;
  title: string;
  courseName: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  submittedAt?: string;
  grade?: number;
  feedback?: string;
}

export type AssessmentType = 'mcq' | 'truefalse' | 'poll' | 'short';
export type AssessmentStatus = 'draft' | 'live' | 'closed';

export interface Assessment {
  id: number;
  question: string;
  courseName: string;
  type: AssessmentType;
  options: string[];
  correctOption: number | null;
  optionVotes: number[];
  marks: number;
  durationMinutes: number;
  status: AssessmentStatus;
  issuedAt: string | null;
  totalStudents: number;
  responses: number;
}

export interface AttendanceRecord {
  month: string;
  present: number;
  absent: number;
}

export interface GradeRecord {
  courseName: string;
  grade: number;
  maxGrade: number;
}

export interface StudentProgress {
  overallAttendance: number;
  averageGrade: number;
  coursesCompleted: number;
  totalCourses: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  attendanceByMonth: AttendanceRecord[];
  gradesByCourse: GradeRecord[];
}

export interface DashboardStats {
  enrolledCourses: number;
  upcomingSessions: number;
  pendingAssignments: number;
  averageGrade: number;
}

export interface ZoomSignatureResponse {
  signature: string;
  meetingNumber: string;
  password?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
