import axiosInstance from './axiosInstance';
import type { Course } from '@/types';
import { mockCourses } from '@/data/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export async function getStudentCourses(studentId: number): Promise<Course[]> {
  if (USE_MOCK) {
    await delay(300);
    return mockCourses;
  }

  const { data } = await axiosInstance.get<Course[]>(`/api/courses/student/${studentId}`);
  return data;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
