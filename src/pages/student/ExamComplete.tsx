import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, User, Clock, CalendarDays, Flag } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Mock exam result data
const mockExamResults = {
  id: '101',
  title: 'Introduction to Psychology',
  date: '2025-05-10',
  duration: 120,
  timeSpent: 105,
  score: 85,
  maxScore: 100,
  aiReports: [
    {
      type: 'face_detection',
      status: 'warning',
      details: 'Face not visible for 45 seconds at 10:15 AM',
      timestamp: '10:15 AM',
    },
    {
      type: 'eye_tracking',
      status: 'error',
      details: 'Looking away from screen detected multiple times',
      timestamp: '10:28 AM',
    },
    {
      type: 'tab_switching',
      status: 'error',
      details: 'Browser tab changed 3 times during exam',
      timestamp: '10:35 AM',
    },
  ],
  questions: [
    {
      id: 1,
      text: 'Which of the following is NOT a perspective in psychology?',
      type: 'multiple-choice',
      userAnswer: 2,
      correctAnswer: 2,
      isCorrect: true,
    },
    {
      id: 2,
      text: 'The study of how people think, learn, and remember is known as:',
      type: 'multiple-choice',
      userAnswer: 1,
      correctAnswer: 0,
      isCorrect: false,
    },
    {
      id: 3,
      text: 'Sigmund Freud is most associated with which perspective?',
      type: 'multiple-choice',
      userAnswer: 2,
      correctAnswer: 2,
      isCorrect: true,
    },
    {
      id: 4,
      text: 'Explain the difference between classical and operant conditioning, providing examples of each.',
      type: 'essay',
      userAnswer: 'Classical conditioning involves learning through association between a stimulus and response, like Pavlov\'s dogs. Operant conditioning involves learning through rewards and punishments, like Skinner\'s experiments with rats.',
      score: 8,
      maxScore: 10,
    },
    {
      id: 5,
      text: 'Which brain structure is primarily responsible for regulating basic life functions like breathing and heart rate?',
      type: 'multiple-choice',
      userAnswer: 2,
      correctAnswer: 2,
      isCorrect: true,
    },
  ],
};

const ExamComplete: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const [results, setResults] = useState(mockExamResults);
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Calculate percentage score
  const calculatePercentage = (score: number, maxScore: number) => {
    return Math.round((score / maxScore) * 100);
  };
  
  // Determine result status
  const getResultStatus = () => {
    const percentage = calculatePercentage(results.score, results.maxScore);
    
    if (percentage >= 80) {
      return {
        label: 'Excellent',
        color: 'text-success',
        bg: 'bg-success/10',
        border: 'border-success/20',
      };
    } else if (percentage >= 60) {
      return {
        label: 'Good',
        color: 'text-primary',
        bg: 'bg-primary/10',
        border: 'border-primary/20',
      };
    } else if (percentage >= 40) {
      return {
        label: 'Average',
        color: 'text-warning',
        bg: 'bg-warning/10',
        border: 'border-warning/20',
      };
    } else {
      return {
        label: 'Needs Improvement',
        color: 'text-error',
        bg: 'bg-error/10',
        border: 'border-error/20',
      };
    }
  };
  
  // Get security flag count
  const getSecurityFlagCount = () => {
    return results.aiReports.filter(report => report.status === 'error').length;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Exam Results
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {results.title}
              </p>
            </div>
            
            <Link to="/student" className="btn btn-outline mt-4 sm:mt-0">
              Return to Dashboard
            </Link>
          </div>
          
          {/* Results summary card */}
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Exam Summary
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CalendarDays size={18} className="text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Date
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(results.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock size={18} className="text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Duration
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {results.duration} minutes (Time spent: {results.timeSpent} minutes)
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <User size={18} className="text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Questions
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {results.questions.length} questions ({results.questions.filter(q => 
                            q.type === 'multiple-choice' ? q.isCorrect : (q.score / q.maxScore) >= 0.5
                          ).length} correct)
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Flag size={18} className="text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Security Flags
                        </p>
                        <p className={`text-sm ${
                          getSecurityFlagCount() > 0 ? 'text-warning' : 'text-success'
                        }`}>
                          {getSecurityFlagCount()} major issues detected
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <div className={`w-36 h-36 rounded-full flex items-center justify-center ${getResultStatus().bg} mb-3`}>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getResultStatus().color}`}>
                        {calculatePercentage(results.score, results.maxScore)}%
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {results.score}/{results.maxScore}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-center px-4 py-1 rounded-full ${getResultStatus().bg} ${getResultStatus().color} border ${getResultStatus().border}`}>
                    {getResultStatus().label}
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI monitoring alerts */}
            {results.aiReports.length > 0 && (
              <div className="p-6 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                  AI Monitoring Alerts
                </h3>
                
                <div className="space-y-3">
                  {results.aiReports.map((report, index) => (
                    <div 
                      key={index} 
                      className={`flex p-3 rounded-md ${
                        report.status === 'error' 
                          ? 'bg-error/10 border border-error/20' 
                          : report.status === 'warning'
                            ? 'bg-warning/10 border border-warning/20'
                            : 'bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {report.status === 'error' ? (
                        <AlertCircle size={18} className="text-error mr-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle size={18} className="text-warning mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className={`text-sm font-medium ${
                            report.status === 'error' ? 'text-error' : 'text-warning'
                          }`}>
                            {report.type === 'face_detection' && 'Face Detection Alert'}
                            {report.type === 'eye_tracking' && 'Eye Tracking Alert'}
                            {report.type === 'tab_switching' && 'Tab Switching Alert'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {report.timestamp}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {report.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Question results */}
            <div className="p-6">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                Question Results
              </h3>
              
              <div className="space-y-6">
                {results.questions.map((question, index) => (
                  <div 
                    key={question.id} 
                    className={`p-4 rounded-md border ${
                      question.type === 'multiple-choice'
                        ? question.isCorrect
                          ? 'border-success/30 bg-success/5'
                          : 'border-error/30 bg-error/5'
                        : (question.score / question.maxScore) >= 0.8
                          ? 'border-success/30 bg-success/5'
                          : (question.score / question.maxScore) >= 0.5
                            ? 'border-warning/30 bg-warning/5'
                            : 'border-error/30 bg-error/5'
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Question {index + 1}
                      </h4>
                      
                      {question.type === 'multiple-choice' ? (
                        <div className="flex items-center">
                          {question.isCorrect ? (
                            <CheckCircle size={16} className="text-success mr-1" />
                          ) : (
                            <AlertCircle size={16} className="text-error mr-1" />
                          )}
                          <span className={question.isCorrect ? 'text-success' : 'text-error'}>
                            {question.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm font-medium">
                          Score: {question.score}/{question.maxScore}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {question.text}
                    </p>
                    
                    {question.type === 'essay' ? (
                      <div>
                        <div className="mb-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Your Answer:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                            {question.userAnswer}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Your answer:</span> Option {question.userAnswer + 1}
                        </div>
                        {!question.isCorrect && (
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Correct answer:</span> Option {question.correctAnswer + 1}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExamComplete;