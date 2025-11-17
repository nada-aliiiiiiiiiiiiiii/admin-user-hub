import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/api/authService';

interface UserGuardProps {
  children: ReactNode;
}

export const UserGuard = ({ children }: UserGuardProps) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Allow both admin and user roles to access user panel
  if (user && (user.role === 'user' || user.role === 'admin')) {
    return <>{children}</>;
  }

  return <Navigate to="/dashboard" replace />;
};
