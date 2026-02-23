import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/src/context/auth-context';
import ParseJwt from './ParseJwt';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('token');

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  const decodedToken = ParseJwt(token);
  const userRole = decodedToken?.role;

  if (!allowedRoles.includes(userRole)) {
    if (userRole === 'ROLE_USER' || userRole === 'USER') {
      return <Navigate to="/user" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;