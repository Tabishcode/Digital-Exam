import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const req =  await login(email, password);
      // localStorage.setItem('token', req.token);
      // localStorage.setItem('user', JSON.stringify(req.user));

      // // Read role from localStorage
      // const user = JSON.parse(localStorage.getItem('user') || '{}');
      // const role = user.role;
      // console.log('role:', role);
      navigate('/face-verification');
    } catch (err) {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <header className="px-4 py-4 sm:px-6 flex justify-end">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <Shield size={40} className="text-primary" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              SecureExam
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              AI-Powered Secure Online Examination Platform
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 py-8 px-6 shadow rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Sign in to your account
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-center p-3 bg-error/10 text-error rounded-md">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="inline-block animate-pulse">Signing in...</span>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Create account
              </Link>
            </div>


            
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} SecureExam. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;