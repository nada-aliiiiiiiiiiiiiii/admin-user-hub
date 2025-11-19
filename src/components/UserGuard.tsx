// import { ReactNode } from 'react';
// import { Navigate } from 'react-router-dom';
// import { authService } from '@/services/api/authService';

// interface UserGuardProps {
//   children: ReactNode;
// }

// export const UserGuard = ({ children }: UserGuardProps) => {
//   const isAuthenticated = authService.isAuthenticated();
//   const user = authService.getCurrentUser();

//   if (!isAuthenticated) {
//     return <Navigate to="/auth" replace />;
//   }

//   if (user && (user.role === 'user' || user.role === 'admin')) {
//     return <>{children}</>;
//   }

//   return <Navigate to="/User/Profile" replace />;
// };




import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/api/authService';

interface UserGuardProps {
  children: ReactNode;
}

export const UserGuard = ({ children }: UserGuardProps) => {
  const user = authService.getCurrentUser();

  // if (!user) return <Navigate to="/auth" replace />;
  // if (user.role !== 'user') return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

