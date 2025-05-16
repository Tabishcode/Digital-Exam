import React, { useState, useEffect } from 'react';
import { BarChart2, Download, Search, Calendar, AlertCircle, Users, Filter } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../../contexts/AuthContext';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExamReports: React.FC = () => {
      const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [submittedExams, setSubmittedExams] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from APIs
  useEffect(() => {
    const fetchExamReports = async () => {
      try {
        const token = user?.token;
        setLoading(true);

        // Fetch submitted exams
        const examsRes = await fetch('/api/exam/submit', {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });
        console.log('Exams Response:', examsRes);

        const warningsRes = await fetch('/api/exam/warnings', {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });
        console.log('Warnings Response:', warningsRes);
        
        const examsData = await examsRes.json();
        setSubmittedExams(examsData.submittedExams);


        const warningsData = await warningsRes.json();
        setWarnings(warningsData.submittedWarnings);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching exam reports:', error);
        setLoading(false);
      }
    };

    fetchExamReports();
  }, []);

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

  // Filter exams based on search query
  const filteredExams = submittedExams.filter((exam: any) =>
    exam.examTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get details of selected exam
  const getSelectedExamDetails = () => {
    return submittedExams.find((exam: any) => exam.examId === selectedExam);
  };

  // Get warnings for the selected exam
  const getExamWarnings = (examId: string) => {
    return warnings.filter((warning: any) => warning.examId === examId);
  };

  // Bar chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View detailed reports and analytics for completed exams
            </p>
          </div>

          {/* Search and filters */}
          <div className="mb-6">
            <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10"
                    placeholder="Search by exam title"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Exam list */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Completed Exams</h2>
                </div>

                <div className="max-h-[600px] overflow-y-auto">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredExams.length > 0 ? (
                      filteredExams.map((exam: any) => (
                        <button
                          key={exam.examId}
                          onClick={() => setSelectedExam(exam.examId)}
                          className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${selectedExam === exam.examId ? 'bg-gray-50 dark:bg-slate-700' : ''
                            }`}
                        >
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {exam.examTitle}
                          </h3>
                          <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Calendar size={14} className="mr-1 flex-shrink-0" />
                            {formatDate(exam.examStartTime.$date)}
                          </div>
                          <div className="mt-2 flex justify-between">
                            <div className="flex items-center text-xs">
                              <Users size={14} className="mr-1" />
                              <span>{exam.score.total} questions</span>
                            </div>
                            <div className="text-xs font-medium">
                              Avg: {exam.score.percentage.toFixed(1)}%
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        No exams found matching your search.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Exam details */}
            <div className="lg:col-span-2">
              {selectedExam ? (
                <div className="space-y-6">
                  {(() => {
                    const exam = getSelectedExamDetails();
                    if (!exam) return null;

                    const examWarnings = getExamWarnings(exam.examId);

                    return (
                      <>
                        {/* Exam overview */}
                        <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                              Exam Overview
                            </h2>
                            <button className="btn btn-outline flex items-center">
                              <Download size={16} className="mr-2" />
                              Export Report
                            </button>
                          </div>

                          <div className="p-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                              {exam.examTitle}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-md">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</div>
                                <div className="font-medium">
                                  {formatDate(exam.examStartTime.$date)}
                                </div>
                              </div>

                              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-md">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Student</div>
                                <div className="font-medium">{exam.student.name}</div>
                              </div>

                              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-md">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Score</div>
                                <div className="font-medium">{exam.score.percentage.toFixed(1)}%</div>
                              </div>
                            </div>

                            {/* Warnings */}
                            <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                  Security Warnings
                                </h2>
                              </div>
                              <div className="p-6">
                                {examWarnings.length > 0 ? (
                                  <ul className="space-y-4">
                                    {examWarnings.map((warning: any, index: number) => (
                                      <li key={index} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-md">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                          <strong>Warnings:</strong> {warning.warnings.join(', ')}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                          <strong>Submitted At:</strong>{' '}
                                          {formatDate(warning.submittedAt)}
                                        </p>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    No warnings for this exam.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <BarChart2 size={48} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select an Exam
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Select an exam from the list to view detailed reports, analytics, and security logs.
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

export default ExamReports;