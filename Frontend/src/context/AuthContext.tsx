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

    if (token && userJson && !isTokenExpired(token)) {
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
    const res = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    const { token, role, userId, fullName } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ role, userId, fullName }));

    setState({ token, role, userId, fullName, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ token: null, role: null, userId: null, fullName: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
