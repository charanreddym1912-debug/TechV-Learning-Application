import axiosInstance from './axiosInstance';
import type { Assignment } from '@/types';
import { mockAssignments } from '@/data/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export async function getStudentAssignments(_studentId: number): Promise<Assignment[]> {
  if (USE_MOCK) {
    await delay(300);
    return mockAssignments;
  }

  const { data } = await axiosInstance.get<Assignment[]>('/api/assignments/student');
  return data;
}

export async function submitAssignment(
  assignmentId: number,
  file: File
): Promise<{ message: string }> {
  if (USE_MOCK) {
    await delay(500);
    return { message: `Submitted ${file.name} successfully` };
  }

  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axiosInstance.post<{ message: string }>(
    `/api/assignments/${assignmentId}/submit`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
