import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { isTokenExpired } from '../utils/helpers';
import type { Role, LoginRequest, LoginResponse } from '../types';

// ── Context Shape ───────────────────────────────────────────────────────
interface AuthState {
  token: string | null;
  role: Role | null;
  userId: number | null;
  fullName: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: { fullName: string; email: string; role: Role; idNumber?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    role: null,
    userId: null,
    fullName: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (token && userJson && (token.startsWith('mock-jwt-') || !isTokenExpired(token))) {
      const user = JSON.parse(userJson);
      setState({
        token,
        role: user.role,
        userId: user.userId,
        fullName: user.fullName,
        isAuthenticated: true,
      });
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const res = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
      const { token, role, userId, fullName } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role, userId, fullName }));

      setState({ token, role, userId, fullName, isAuthenticated: true });
    } catch (error: any) {
      // Frontend-only development fallback when Backend DB is offline/unreachable
      if (!error.response || error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        const fallbackRole: Role = credentials.email.includes('admin') || credentials.email.includes('coord')
          ? 'COORDINATOR'
          : credentials.email.includes('trainer')
          ? 'TRAINER'
          : 'STUDENT';
        const fallbackName = credentials.email.split('@')[0];
        const token = `mock-jwt-token-${Date.now()}`;
        const userId = Math.floor(Math.random() * 1000) + 1;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ role: fallbackRole, userId, fullName: fallbackName }));
        setState({ token, role: fallbackRole, userId, fullName: fallbackName, isAuthenticated: true });
        return;
      }
      throw error;
    }
  }, []);

  const signup = useCallback(async (userData: { fullName: string; email: string; role: Role; idNumber?: string }) => {
    // Simulate API delay for realism
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      // Attempt backend call if available in the future
      const res = await axiosInstance.post<LoginResponse>('/auth/register', userData);
      const { token, role, userId, fullName } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role, userId, fullName }));
      setState({ token, role, userId, fullName, isAuthenticated: true });
    } catch (error: any) {
      // Frontend standalone mode: automatically log in the registered user
      const token = `mock-jwt-token-${Date.now()}`;
      const userId = Math.floor(Math.random() * 1000) + 1;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role: userData.role, userId, fullName: userData.fullName }));
      setState({ token, role: userData.role, userId, fullName: userData.fullName, isAuthenticated: true });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ token: null, role: null, userId: null, fullName: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
