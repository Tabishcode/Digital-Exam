import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Eye, Users, CheckCircle, Clock } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Mock data for active exams
const mockActiveExams = [
  {
    id: '101',
    title: 'Introduction to Psychology',
    date: '2025-05-10',
    startTime: '10:00 AM',
    duration: 120,
    totalStudents: 45,
    activeStudents: 43,
    securityAlerts: 8,
    status: 'in-progress',
    timeRemaining: '45 minutes',
  },
  {
    id: '102',
    title: 'Calculus I - Final Exam',
    date: '2025-05-10',
    startTime: '2:00 PM',
    duration: 120,
    totalStudents: 30,
    activeStudents: 30,
    securityAlerts: 2,
    status: 'in-progress',
    timeRemaining: '85 minutes',
  },
];

// Mock data for students
const mockStudents = [
  {
    id: '1001',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    progress: 65, // percent of exam completed
    securityStatus: 'warning',
    securityAlerts: [
      { type: 'face_detection', detail: 'Face not visible for 30s', timestamp: '10:25 AM' },
      { type: 'tab_switching', detail: 'Tab switched 2 times', timestamp: '10:32 AM' },
    ],
    lastActive: '2 minutes ago',
    ipAddress: '192.168.1.45',
  },
  {
    id: '1002',
    name: 'Taylor Smith',
    email: 'taylor.smith@example.com',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    progress: 78,
    securityStatus: 'ok',
    securityAlerts: [],
    lastActive: 'Just now',
    ipAddress: '192.168.1.32',
  },
  {
    id: '1003',
    name: 'Morgan Williams',
    email: 'morgan.williams@example.com',
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    progress: 42,
    securityStatus: 'error',
    securityAlerts: [
      { type: 'eye_tracking', detail: 'Looking away from screen', timestamp: '10:15 AM' },
      { type: 'audio_detection', detail: 'Voice detected', timestamp: '10:18 AM' },
      { type: 'tab_switching', detail: 'Tab switched 5 times', timestamp: '10:22 AM' },
    ],
    lastActive: '5 minutes ago',
    ipAddress: '192.168.1.87',
  },
  {
    id: '1004',
    name: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    progress: 95,
    securityStatus: 'ok',
    securityAlerts: [],
    lastActive: '1 minute ago',
    ipAddress: '192.168.1.92',
  },
  {
    id: '1005',
    name: 'Casey Martinez',
    email: 'casey.martinez@example.com',
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    progress: 58,
    securityStatus: 'warning',
    securityAlerts: [
      { type: 'face_detection', detail: 'Multiple faces detected', timestamp: '10:40 AM' },
    ],
    lastActive: 'Just now',
    ipAddress: '192.168.1.103',
  },
];

const MonitorExams: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState(mockActiveExams[0].id);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'warning' | 'error'>('all');
  
  // Get details of the selected exam
  const getSelectedExam = () => {
    return mockActiveExams.find(exam => exam.id === selectedExam);
  };
  
  // Get student details
  const getStudentDetails = (studentId: string) => {
    return mockStudents.find(student => student.id === studentId);
  };
  
  // Filter students based on selected status
  const getFilteredStudents = () => {
    if (filterStatus === 'all') {
      return mockStudents;
    } else if (filterStatus === 'warning') {
      return mockStudents.filter(student => 
        student.securityStatus === 'warning' || student.securityStatus === 'error'
      );
    } else {
      return mockStudents.filter(student => student.securityStatus === 'error');
    }
  };
  
  // Get security status color
  const getSecurityStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-gray-500';
    }
  };
  
  // Get security status indicator
  const getSecurityStatusIndicator = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle size={16} className="text-success" />;
      case 'warning':
        return <AlertCircle size={16} className="text-warning" />;
      case 'error':
        return <AlertCircle size={16} className="text-error" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Monitor Active Exams
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time monitoring and security alerts for ongoing exams
            </p>
          </div>
          
          {/* Exam selector */}
          <div className="mb-6">
            <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockActiveExams.map(exam => (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExam(exam.id)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      selectedExam === exam.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/30'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {exam.title}
                    </h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Clock size={14} className="mr-1" />
                        {exam.timeRemaining} left
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Users size={14} className="mr-1" />
                        {exam.activeStudents}/{exam.totalStudents}
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <span>{exam.startTime}</span>
                      </div>
                      <div className={`flex items-center ${
                        exam.securityAlerts > 0 ? 'text-warning' : 'text-success'
                      }`}>
                        <AlertCircle size={14} className="mr-1" />
                        {exam.securityAlerts} alerts
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student list */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Students ({getFilteredStudents().length})
                  </h2>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-3 py-1 text-xs rounded-full ${
                        filterStatus === 'all' 
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterStatus('warning')}
                      className={`px-3 py-1 text-xs rounded-full ${
                        filterStatus === 'warning' 
                          ? 'bg-warning/20 text-warning' 
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      Warnings
                    </button>
                    <button
                      onClick={() => setFilterStatus('error')}
                      className={`px-3 py-1 text-xs rounded-full ${
                        filterStatus === 'error' 
                          ? 'bg-error/20 text-error' 
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      Critical
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {getFilteredStudents().map(student => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student.id)}
                      className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                        selectedStudent === student.id ? 'bg-gray-50 dark:bg-slate-700' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={student.profileImage}
                            alt={student.name}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                              {student.name}
                              <span className="ml-2">
                                {getSecurityStatusIndicator(student.securityStatus)}
                              </span>
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Active {student.lastActive}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Progress: {student.progress}%
                          </div>
                          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {student.securityAlerts.length > 0 && (
                        <div className="mt-3 text-xs">
                          <span className={`${
                            student.securityStatus === 'error' ? 'text-error' : 'text-warning'
                          }`}>
                            {student.securityAlerts.length} security {student.securityAlerts.length === 1 ? 'alert' : 'alerts'}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Student details */}
            <div>
              {selectedStudent ? (
                <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                  {(() => {
                    const student = getStudentDetails(selectedStudent);
                    if (!student) return null;
                    
                    return (
                      <>
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                            Student Details
                          </h2>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center mb-6">
                            <img
                              src={student.profileImage}
                              alt={student.name}
                              className="h-16 w-16 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                {student.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {student.email}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-md">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Exam Progress
                                </div>
                                <div className="flex items-center">
                                  <span className="font-medium">{student.progress}%</span>
                                  <div className="ml-2 flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary rounded-full"
                                      style={{ width: `${student.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-md">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Security Status
                                </div>
                                <div className={`font-medium flex items-center ${getSecurityStatusColor(student.securityStatus)}`}>
                                  {getSecurityStatusIndicator(student.securityStatus)}
                                  <span className="ml-1 capitalize">
                                    {student.securityStatus === 'ok' ? 'Normal' : student.securityStatus}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-md">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Last Active
                                </div>
                                <div className="font-medium">
                                  {student.lastActive}
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-md">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  IP Address
                                </div>
                                <div className="font-medium">
                                  {student.ipAddress}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                              Security Alerts
                            </h4>
                            
                            {student.securityAlerts.length > 0 ? (
                              <div className="space-y-3">
                                {student.securityAlerts.map((alert, index) => (
                                  <div 
                                    key={index} 
                                    className="p-3 bg-warning/10 text-warning rounded-md flex items-start"
                                  >
                                    <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <div className="flex justify-between w-full">
                                        <p className="text-xs font-medium">
                                          {alert.type === 'face_detection' && 'Face Detection Alert'}
                                          {alert.type === 'eye_tracking' && 'Eye Tracking Alert'}
                                          {alert.type === 'tab_switching' && 'Tab Switching Alert'}
                                          {alert.type === 'audio_detection' && 'Audio Alert'}
                                        </p>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {alert.timestamp}
                                        </span>
                                      </div>
                                      <p className="text-xs mt-1">
                                        {alert.detail}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-3 bg-success/10 text-success rounded-md flex items-center">
                                <CheckCircle size={16} className="mr-2" />
                                <p className="text-xs">No security alerts detected</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-6 space-y-2">
                            <button className="btn btn-primary w-full">
                              <Eye size={16} className="mr-2" />
                              View Live Feed
                            </button>
                            <button className="btn btn-outline w-full">
                              Send Message
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <Users size={48} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select a Student
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                    Select a student from the list to view their exam progress and security status.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MonitorExams;