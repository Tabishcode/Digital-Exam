import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for upcoming and past exams
const upcomingExams = [
  {
    id: '101',
    title: 'Introduction to Psychology',
    date: '2025-05-15',
    time: '10:00 AM - 12:00 PM',
    duration: 120,
    status: 'upcoming',
  },
  {
    id: '102',
    title: 'Calculus I - Final Exam',
    date: '2025-05-18',
    time: '2:00 PM - 4:00 PM',
    duration: 120,
    status: 'upcoming',
  },
  {
    id: '103',
    title: 'Data Structures and Algorithms',
    date: '2025-05-20',
    time: '9:00 AM - 11:30 AM',
    duration: 150,
    status: 'upcoming',
  },
];

const pastExams = [
  {
    id: '201',
    title: 'Computer Networks - Midterm',
    date: '2025-04-10',
    score: 85,
    maxScore: 100,
    status: 'completed',
  },
  {
    id: '202',
    title: 'Database Systems',
    date: '2025-04-05',
    score: 92,
    maxScore: 100,
    status: 'completed',
  },
  {
    id: '203',
    title: 'Introduction to AI',
    date: '2025-03-20',
    score: 78,
    maxScore: 100,
    status: 'completed',
  },
];



const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pastExams, setPastExams] = useState<any[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);

  // Fetch upcoming exams from the API
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = user?.token;

        const response = await fetch('/api/exams', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });

        if (response.ok) {
          const examsData = await response.json();
          console.log('All exams from API:', examsData); // Debug log

          // Filter upcoming exams
          const now = new Date();
          console.log('Current Date:', now.toISOString());

          const filteredUpcomingExams = examsData.filter((exam: any) => {
            const startTime = new Date(exam.startTime);
            console.log(`Exam "${exam.title}" starts at:`, startTime.toISOString());
            return startTime > now;
          });
          // Format the filtered exams
          const formattedExams = filteredUpcomingExams.map((exam: any) => {
            const start = new Date(exam.startTime.$date);
            const end = new Date(exam.endTime.$date);

            return {
              id: exam._id,
              title: exam.title,
              date: start.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }),
              time: `${start.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })} - ${end.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}`,
              duration: Math.round((end.getTime() - start.getTime()) / 60000), // in minutes
              status: exam.status,
            };
          });

          setUpcomingExams(formattedExams);
        } else {
          console.error('Failed to fetch exams');
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, [user]);
  useEffect(() => {
    const fetchPastExams = async () => {
      try {
        const token = user?.token;

        const response = await fetch('/api/exam/submit', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });

        if (response.ok) {
          const data = await response.json();

          const formattedExams = data.submittedExams.map((exam: any) => {
            const rawDate = exam?.examStartTime;
            const date = rawDate ? new Date(rawDate) : null;

            return {
              id: exam.examId,
              title: exam.examTitle,
              date: rawDate ? date.toLocaleDateString('en-US') : 'N/A',
              score: exam.score?.correct ?? 0,
              maxScore: exam.score?.total ?? 0,
              status: 'completed', // or determine dynamically based on current date
            };
          });

          setPastExams(formattedExams);
        } else {
          console.error('Failed to fetch past exams');
        }
      } catch (error) {
        console.error('Error fetching past exams:', error);
      }
    };


    fetchPastExams();
  }, [user]);

  // Format date string to display in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome, {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View your upcoming exams and past results
            </p>
          </div>
          
         
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Upcoming exams */}
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Upcoming Exams
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {upcomingExams.length > 0 ? (
                    upcomingExams.map((exam) => (
                      <div key={exam.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="mb-4 sm:mb-0">
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">
                              {exam.title}
                            </h3>
                            <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0 sm:space-x-4">
                              <div className="flex items-center">
                                <Calendar size={16} className="mr-1.5 flex-shrink-0" />
                                {exam.date}
                              </div>
                              <div className="flex items-center">
                                <Clock size={16} className="mr-1.5 flex-shrink-0" />
                                {exam.time}
                              </div>
                              <div>
                                Duration: {exam.duration} min
                              </div>
                            </div>
                          </div>
                          <Link
                            to={`/exam/${exam.id}`}
                            className="btn btn-primary whitespace-nowrap"
                          >
                            Start Exam
                          </Link>
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
            
            {/* Student profile */}
            <div>
              <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Student Profile
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <img
                      src={user?.profileImage || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'}
                      alt={user?.name}
                      className="h-16 w-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        {user?.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-md">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Upcoming Exams
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {upcomingExams.length}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-md">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Completed Exams
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {pastExams.length}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-md">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Average Score
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {pastExams.reduce((acc, exam) => acc + (exam.score / exam.maxScore) * 100, 0) / pastExams.length}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Past exams */}
          <div className="mt-8">
            <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Past Exam Results
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {pastExams.length > 0 ? (
                  pastExams.map((exam) => (
                    <div key={exam.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">
                            {exam.title}
                          </h3>
                          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar size={16} className="mr-1.5 flex-shrink-0" />
                            {exam.date}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <CheckCircle size={16} className="text-success mr-1.5 flex-shrink-0" />
                            <span className="font-medium">
                              Score: {exam.score}/{exam.maxScore} ({Math.round((exam.score / exam.maxScore) * 100)}%)
                            </span>
                          </div>

                          <Link
                            to={`/exam-complete/${exam.id}`}
                            className="btn btn-outline"
                          >
                            View Report
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No past exams found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;