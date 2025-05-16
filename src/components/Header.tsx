import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determine if we're in an exam room to show a simplified header
  const isExamRoom = location.pathname.includes('/exam/') && !location.pathname.includes('/exam-complete');

  if (!user) return null;

  // Show a minimal header for exam room
  if (isExamRoom) {
    return (
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-lg font-bold text-primary">SecureExam</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Monitoring Active</span>
              <span className="monitoring-indicator monitoring-active">●</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to={user.role === 'teacher' ? '/teacher' : '/student'} className="flex items-center">
                <span className="text-2xl font-bold text-primary">SecureExam</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-4 items-center">
              {user.role === 'admin' ? (
                <>
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin'
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/teachers/add"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin/teachers/add'
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    Add Teachers
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin/manage-users'
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    Manage Users
                  </Link>
                  <Link
                    to="/admin/manage-exams"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin/manage-exams'
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    Manage Exams
                  </Link>
                </>
              ) : user.role === 'teacher' ? (
                <>
                  <Link
                    to="/teacher"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/teacher'
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/teacher/create-exam"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/teacher/create-exam'
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    Create Exam
                  </Link>
                  <Link
                    to="/teacher/monitor-exams"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/teacher/monitor-exams'
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    Manage Exams
                  </Link>
                  <Link
                    to="/teacher/exam-reports"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/teacher/exam-reports'
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    Reports
                  </Link>
                </>
              ) : (
                <Link
                  to="/student"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/student'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="mr-3 text-sm text-right">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                  </div>
                  <img
                    src={user.profileImage || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user.role === 'admin' ? (
              <>
                <Link
                  to="/admin"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/admin/dashboard'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/teachers/add"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/admin/add-teacher'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Add Teachers
                </Link>
                <Link
                  to="/admin/manage-users"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/admin/manage-users'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Manage Users
                </Link>
                <Link
                  to="/admin/manage-exams"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/admin/manage-exams'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Manage Exams
                </Link>
              </>
            ) : user.role === 'teacher' ? (
              <>
                <Link
                  to="/teacher"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/teacher'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/teacher/create-exam"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/teacher/create-exam'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Create Exam
                </Link>
                <Link
                  to="/teacher/monitor-exams"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/teacher/monitor-exams'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Manage Exams
                </Link>
                <Link
                  to="/teacher/exam-reports"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/teacher/exam-reports'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Reports
                </Link>
              </>
            ) : (
              <Link
                to="/student"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/student'
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
