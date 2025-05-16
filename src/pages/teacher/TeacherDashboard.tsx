import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, AlertCircle, CheckCircle, BarChart2, Clock, Plus, Calendar } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for teacher dashboard
const activeExams = [
  {
    id: '101',
    title: 'Introduction to Psychology',
    students: 45,
    activeNow: 32,
    startTime: '10:00 AM',
    duration: 120,
    securityAlerts: 5,
  },
  {
    id: '102',
    title: 'Calculus I - Final Exam',
    students: 30,
    activeNow: 28,
    startTime: '2:00 PM',
    duration: 120,
    securityAlerts: 2,
  },
];


const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [completedExams, setCompletedExams] = useState<any[]>([]);
  // Format date string
  // Fetch data from APIs
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = user?.token;

        // Fetch upcoming exams
        const examsResponse = await fetch('/api/exams', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });
        // console.log('Token:', token); // Log the token to ensure it's being sent
        console.log('Response:', examsResponse); // Log the response status
        if (examsResponse.ok) {
          const examsData = await examsResponse.json();
          console.log('Exams Data:', examsData);

          const now = new Date();
          console.log('Current Date:', now.toISOString());

          const filteredUpcomingExams = examsData.filter((exam: any) => {
            const startTime = new Date(exam.startTime);
            console.log(`Exam "${exam.title}" starts at:`, startTime.toISOString());
            return startTime > now;
          });
          console.log('Filtered Upcoming Exams:', filteredUpcomingExams);
          setUpcomingExams(filteredUpcomingExams);
        } else {
          console.error('Failed to fetch exams');
        }

        // Fetch completed exams
        const completedResponse = await fetch('/api/exam/submit', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });

        if (completedResponse.ok) {
          const completedData = await completedResponse.json();
          console.log('Completed Exams Data:', completedData);
          // Map completed exams to the required format
          const formattedCompletedExams = completedData.submittedExams.map((exam: any) => ({
            id: exam.examId,
            title: exam.examTitle,
            date: new Date(exam.examStartTime).toLocaleDateString('en-US'),
            avgScore: exam.score.percentage,
            securityIssues: 0, // Assuming no security issues data in the response
          }));
          console.log('Formatted Completed Exams:', formattedCompletedExams);
          setCompletedExams(formattedCompletedExams);
        } else {
          console.error('Failed to fetch completed exams');
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, [user]);
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      console.error('Date string is undefined or missing:', dateString);
      return 'Invalid Date';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date format:', dateString);
      return 'Invalid Date';
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  // Chart data for exam statistics
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Exams Conducted',
        data: [12, 19, 15, 22, 18, 25],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Security Incidents',
        data: [5, 7, 4, 8, 6, 11],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              teacher Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage exams, monitor students, and review reports
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-md p-3 mr-4">
                  <BookOpen size={24} className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeExams.length + upcomingExams.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Upcoming Exams
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-success/10 rounded-md p-3 mr-4">
                  <Users size={24} className="text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeExams.reduce((sum, exam) => sum + exam.activeNow, 0)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Students Registered
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-warning/10 rounded-md p-3 mr-4">
                  <AlertCircle size={24} className="text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeExams.reduce((sum, exam) => sum + exam.securityAlerts, 0)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Security Alerts
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-secondary/10 rounded-md p-3 mr-4">
                  <CheckCircle size={24} className="text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completedExams.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Completed Exams
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Active Exams */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden h-full">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Active Exams
                  </h2>
                  <Link
                    to="/teacher/monitor-exams"
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    View All
                  </Link>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {activeExams.length > 0 ? (
                    activeExams.map((exam) => (
                      <div key={exam.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">
                              {exam.title}
                            </h3>
                            <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Clock size={16} className="mr-1.5 flex-shrink-0" />
                              Started at {exam.startTime} ({exam.duration} min)
                            </div>
                          </div>

                          <Link
                            to={`/teacher/monitor-exams?exam=${exam.id}`}
                            className="btn btn-primary mt-3 md:mt-0"
                          >
                            Monitor Exam
                          </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-md">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Enrolled Students
                            </div>
                            <div className="flex items-center">
                              <Users size={16} className="text-gray-700 dark:text-gray-300 mr-1.5" />
                              <span className="font-medium">{exam.students}</span>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-md">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Currently Active
                            </div>
                            <div className="flex items-center">
                              <Users size={16} className="text-success mr-1.5" />
                              <span className="font-medium">{exam.activeNow} ({Math.round((exam.activeNow / exam.students) * 100)}%)</span>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-md">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Security Alerts
                            </div>
                            <div className="flex items-center">
                              <AlertCircle size={16} className={`mr-1.5 ${exam.securityAlerts > 0 ? 'text-warning' : 'text-success'}`} />
                              <span className={`font-medium ${exam.securityAlerts > 0 ? 'text-warning' : 'text-success'}`}>
                                {exam.securityAlerts}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      No active exams at the moment.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Quick Actions
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <Link
                    to="/teacher/create-exam"
                    className="flex items-center p-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                  >
                    <Plus size={20} className="mr-3" />
                    <span className="font-medium">Create New Exam</span>
                  </Link>

                  <Link
                    to="/teacher/monitor-exams"
                    className="flex items-center p-4 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-md transition-colors"
                  >
                    <Users size={20} className="mr-3" />
                    <span className="font-medium">Monitor Active Exams</span>
                  </Link>

                  <Link
                    to="/teacher/exam-reports"
                    className="flex items-center p-4 bg-success/10 hover:bg-success/20 text-success rounded-md transition-colors"
                  >
                    <BarChart2 size={20} className="mr-3" />
                    <span className="font-medium">View Exam Reports</span>
                  </Link>
                </div>
              </div>

              {/* Chart */}
              <div className="mt-6 bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Exam Statistics
                  </h2>
                </div>

                <div className="p-6">
                  <div style={{ height: '240px' }}>
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Exams */}
            <div>
              <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Upcoming Exams
                  </h2>
                  <Link
                    to="/teacher/create-exam"
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    Create Exam
                  </Link>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {upcomingExams.length > 0 ? (
                    upcomingExams.map((exam) => (
                      <div key={exam.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {exam.title}
                            </h3>
                            <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Calendar size={14} className="mr-1 flex-shrink-0" />
                              {formatDate(exam.startTime)} at {exam.time}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {exam.enrolledStudents} Students
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      No upcoming exams scheduled.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Exams */}
            <div>
              <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Recently Completed
                  </h2>
                  <Link
                    to="/teacher/exam-reports"
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    View All Reports
                  </Link>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {completedExams.length > 0 ? (
                    completedExams.map((exam) => (
                      <div key={exam.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {exam.title}
                            </h3>
                            <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Calendar size={14} className="mr-1 flex-shrink-0" />
                              {formatDate(exam.date)}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-medium">
                              Avg: {exam.avgScore.toFixed(1)}%
                            </div>
                            <div className="mt-1 flex items-center justify-end text-xs">
                              <AlertCircle size={14} className={`mr-1 ${exam.securityIssues > 0 ? 'text-warning' : 'text-success'}`} />
                              <span className={exam.securityIssues > 0 ? 'text-warning' : 'text-success'}>
                                {exam.securityIssues} flags
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      No recent exam data available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeacherDashboard;