import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { Role } from '../../types';
import Loader from '../common/Loader';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    // Redirect to user's own dashboard if they try to access another role's pages
    return <Navigate to={`/${role.toLowerCase()}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
