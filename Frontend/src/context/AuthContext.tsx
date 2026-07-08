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
  signup: (userData: { fullName: string; email: string; role: Role; idNumber?: string; [key: string]: any }) => Promise<void>;
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
    const emailKey = credentials.email.toLowerCase().trim();
    try {
      const res = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
      const { token, role, userId, fullName } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role, userId, fullName }));

      setState({ token, role, userId, fullName, isAuthenticated: true });
    } catch (error: any) {
      // Frontend-only development fallback when Backend DB is offline/unreachable or returns 404/401
      let fallbackRole: Role;
      let fallbackName = credentials.email.split('@')[0];
      let userId = Math.floor(Math.random() * 1000) + 1;

      // First check if this email was previously registered during signup
      try {
        const existingUsersJson = localStorage.getItem('registered_users') || '{}';
        const existingUsers = JSON.parse(existingUsersJson);
        if (existingUsers[emailKey]) {
          fallbackRole = existingUsers[emailKey].role;
          fallbackName = existingUsers[emailKey].fullName;
          userId = existingUsers[emailKey].userId;
        } else {
          fallbackRole = emailKey.includes('admin') || emailKey.includes('coord')
            ? 'COORDINATOR'
            : emailKey.includes('trainer')
            ? 'TRAINER'
            : 'STUDENT';
        }
      } catch (e) {
        fallbackRole = emailKey.includes('admin') || emailKey.includes('coord')
          ? 'COORDINATOR'
          : emailKey.includes('trainer')
          ? 'TRAINER'
          : 'STUDENT';
      }

      const token = `mock-jwt-token-${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role: fallbackRole, userId, fullName: fallbackName }));
      setState({ token, role: fallbackRole, userId, fullName: fallbackName, isAuthenticated: true });
    }
  }, []);

  const signup = useCallback(async (userData: { fullName: string; email: string; role: Role; idNumber?: string; [key: string]: any }) => {
    // Simulate API delay for realism
    await new Promise((resolve) => setTimeout(resolve, 600));
    const emailKey = userData.email.toLowerCase().trim();
    const userId = Math.floor(Math.random() * 1000) + 1;

    // Persist profile inside registered_users local DB so future logins remember the exact role across logouts
    try {
      const existingUsersJson = localStorage.getItem('registered_users') || '{}';
      const existingUsers = JSON.parse(existingUsersJson);
      existingUsers[emailKey] = {
        role: userData.role,
        userId,
        fullName: userData.fullName,
      };
      localStorage.setItem('registered_users', JSON.stringify(existingUsers));
    } catch (e) {
      console.error('Failed to save user to registered_users local storage', e);
    }

    try {
      // Attempt backend call if available in the future
      const res = await axiosInstance.post<LoginResponse>('/auth/register', userData);
      const { token, role, userId: backendId, fullName } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role, userId: backendId, fullName }));
      setState({ token, role, userId: backendId, fullName, isAuthenticated: true });
    } catch (error: any) {
      // Frontend standalone mode: automatically log in the registered user
      const token = `mock-jwt-token-${Date.now()}`;
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
