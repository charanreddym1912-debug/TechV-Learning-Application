import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import type { AxiosRequestConfig } from 'axios';

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (config?: AxiosRequestConfig) => Promise<T | null>;
}

/**
 * Generic hook for API calls.
 * Usage: const { data, loading, error, execute } = useApi<Course[]>('/courses');
 */
export function useApi<T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (config?: AxiosRequestConfig): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.request<T>({
        url,
        method,
        ...config,
      });
      setData(response.data);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, method]);

  return { data, loading, error, execute };
}
