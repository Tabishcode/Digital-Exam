import React from 'react';
import { useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
  const location = useLocation();
  
  // Don't show footer in exam room
  if (location.pathname.includes('/exam/') && !location.pathname.includes('/exam-complete')) {
    return null;
  }
  
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield size={24} className="text-primary mr-2" />
            <span className="font-bold text-lg">SecureExam</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 text-center md:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-0">
              &copy; {new Date().getFullYear()} SecureExam. All rights reserved.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;