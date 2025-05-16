import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Line, Bar } from 'react-chartjs-2';
import {
    Users,
    BookOpen,
    AlertCircle,
    CheckCircle,
    Clock,
    TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatsCard } from '../../components/StatsCard';
import Header from '../../components/Header';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();

    const [users, setUsers] = useState([]);
    const [exams, setExams] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [upcomingExams, setUpcomingExams] = useState([]);
    const [completedExams, setCompletedExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const token = user?.token;

                // Fetch Users
                const usersRes = await fetch('/api/users', {
                    headers: { 'x-access-token': token },
                });
                const usersData = await usersRes.json();
                setUsers(usersData.users);

                // Fetch Exams
                const examsRes = await fetch('/api/exams', {
                    headers: { 'x-access-token': token },
                });
                const examsData = await examsRes.json();
                setExams(examsData);

                // Fetch Security Alerts
                const alertsRes = await fetch('/api/exam/warnings', {
                    headers: { 'x-access-token': token },
                });
                const alertsData = await alertsRes.json();
                setAlerts(alertsData.submittedWarnings);

                // Filter Upcoming Exams
                const now = new Date();
                const filteredUpcoming = examsData.filter(
                    (exam: any) => new Date(exam.startTime) > now
                );
                setUpcomingExams(filteredUpcoming);

                // Fetch Completed Exams
                const completedRes = await fetch('/api/exam/submit', {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token,
                    },
                });
                if (completedRes.ok) {
                    const completedData = await completedRes.json();
                    const formattedCompleted = completedData.submittedExams.map((exam: any) => ({
                        id: exam.examId,
                        title: exam.examTitle,
                        date: new Date(exam.examStartTime).toLocaleDateString('en-US'),
                        avgScore: exam.score.percentage,
                        securityIssues: 0,
                    }));
                    setCompletedExams(formattedCompleted);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin dashboard data:', error);
                setLoading(false);
            }
        };

        fetchAdminStats();
    }, [user]);

    // Calculate Average Exam Score
    const avgScore = completedExams.length
        ? (
            completedExams.reduce((sum, exam) => sum + (exam.avgScore || 0), 0) /
            completedExams.length
        ).toFixed(2)
        : '0';

    if (loading) {
        return <p className="text-center text-lg">Loading...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Header />
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard icon={<Users />} title="Total Users" value={users.length} />
                <StatsCard icon={<BookOpen />} title="Exams Created" value={exams.length} />
                <StatsCard icon={<AlertCircle />} title="Security Alerts" value={alerts.length} />
                <StatsCard icon={<CheckCircle />} title="Completed Exams" value={completedExams.length} />
                <StatsCard icon={<Clock />} title="Upcoming Exams" value={upcomingExams.length} />
                <StatsCard icon={<TrendingUp />} title="Avg. Exam Score" value={`${avgScore}%`} />
            </div>

            {/* Warnings List */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Security Warnings</h2>
                {alerts.length > 0 ? (
                    <ul className="space-y-4">
                        {alerts.map((warning: any, index: number) => (
                            <li key={index} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    <strong>Exam:</strong> {warning.examTitle}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    <strong>Warnings:</strong> {warning.warnings.join(', ')}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    <strong>Submitted At:</strong>{' '}
                                    {new Date(warning.submittedAt).toLocaleString('en-US')}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300">No warnings submitted.</p>
                )}
            </div>

            {/* Users List */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Users</h2>
                {users.length > 0 ? (
                    <ul className="space-y-4">
                        {users.map((user: any) => (
                            <li
                                key={user.id}
                                className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                            >
                                <img
                                    src={user.profileImage}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {user.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Role: {user.role}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;