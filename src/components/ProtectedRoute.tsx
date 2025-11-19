// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requiredRole?: 'admin' | 'user';
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   children,
//   requiredRole,
// }) => {
//   const { isAuthenticated, user, isLoading } = useAuth();
//   const location = useLocation();

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="text-center">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/auth" state={{ from: location }} replace />;
//   }

//   if (requiredRole && user?.role !== requiredRole) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <>{children}</>;
// };


import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/api/authService';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = authService.getCurrentUser();

  // if (!user) return <Navigate to="/auth" replace />;
  // if (user.role !== 'admin') return <Navigate to="/user/feed" replace />;

  return <>{children}</>;
};
