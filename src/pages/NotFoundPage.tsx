import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NotFoundPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page not found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to={user ? (user.role === 'teacher' ? '/teacher' : '/student') : '/'}
              className="btn btn-primary flex items-center"
            >
              <Home size={16} className="mr-2" />
              {user ? 'Go to Dashboard' : 'Go to Home'}
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;