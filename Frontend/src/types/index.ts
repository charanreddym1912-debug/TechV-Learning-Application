// ── User & Auth ─────────────────────────────────────────────────────────
export type Role = 'COORDINATOR' | 'TRAINER' | 'STUDENT';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: Role;
  userId: number;
  fullName: string;
}

// ── Course ──────────────────────────────────────────────────────────────
export interface Course {
  courseId: number;
  title: string;
  description?: string;
  category?: string;
  duration?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Batch ───────────────────────────────────────────────────────────────
export interface Batch {
  batchId: number;
  courseId: number;
  name: string;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  createdAt: string;
  updatedAt: string;
}

// ── Trainer ─────────────────────────────────────────────────────────────
export interface Trainer {
  trainerId: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  specialization?: string;
  experienceYears?: number;
  designation?: string;
  status: 'ACTIVE' | 'INACTIVE';
  joiningDate?: string;
}

// ── Student ─────────────────────────────────────────────────────────────
export interface Student {
  studentId: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  qualification?: string;
  status: 'ACTIVE' | 'INACTIVE';
  enrollmentDate?: string;
}

// ── Session / Virtual Classroom ─────────────────────────────────────────
export interface Session {
  classId: number;
  batchId: number;
  trainerId: number;
  topic?: string;
  startTime: string;
  durationMinutes: number;
  zoomMeetingId?: string;
  zoomPasscode?: string;
  zoomJoinUrl?: string;
  createdAt: string;
}

export interface ClassSession {
  classId: number;
  batchId: number;
  trainerId: number;
  title: string;
  description?: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  zoomMeetingId?: string;
  zoomPasscode?: string;
  zoomJoinUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Attendance ──────────────────────────────────────────────────────────
export interface Attendance {
  attendanceId: number;
  classId: number;
  studentId: number;
  status: 'PRESENT' | 'ABSENT';
  timestamp?: string;
}

// ── Assignment ──────────────────────────────────────────────────────────
export interface Assignment {
  assignmentId: number;
  courseId: number;
  title: string;
  description?: string;
  dueDate: string;
  maxScore?: number;
  fileUrl?: string;
  createdAt: string;
}

// ── Submission ──────────────────────────────────────────────────────────
export interface Submission {
  submissionId: number;
  assignmentId: number;
  studentId: number;
  fileUrl: string;
  submittedAt: string;
}

// ── Grade ───────────────────────────────────────────────────────────────
export interface Grade {
  gradeId: number;
  assignmentId: number;
  studentId: number;
  graderId: number;
  score: number;
  feedback?: string;
  createdAt: string;
}
