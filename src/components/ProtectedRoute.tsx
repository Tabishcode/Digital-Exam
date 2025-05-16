import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'teacher' | 'student' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    // Redirect to the appropriate dashboard based on actual user role
    const roleRedirectMap: Record<string, string> = {
      teacher: '/teacher',
      student: '/student',
      admin: '/admin',
    };

    return <Navigate to={roleRedirectMap[user.role] || '/'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
