import axiosInstance from './axiosInstance';
import type { LiveSession, ZoomSignatureResponse } from '@/types';
import { mockLiveSessions } from '@/data/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export async function getStudentSessions(studentId: number): Promise<LiveSession[]> {
  if (USE_MOCK) {
    await delay(300);
    return mockLiveSessions;
  }

  const { data } = await axiosInstance.get<LiveSession[]>(`/api/sessions/student/${studentId}`);
  return data;
}

export async function getZoomSignature(meetingNumber: string): Promise<ZoomSignatureResponse> {
  if (USE_MOCK) {
    await delay(400);
    return {
      signature: 'mock_signature_for_demo',
      meetingNumber,
      password: '123456',
    };
  }

  const { data } = await axiosInstance.post<ZoomSignatureResponse>('/api/zoom/signature', {
    meetingNumber,
  });
  return data;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
