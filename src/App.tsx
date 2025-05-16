
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import FaceVerificationPage from './pages/FaceVerificationPage';
import StudentDashboard from './pages/student/StudentDashboard';
import ExamRoom from './pages/student/ExamRoom';
import ExamComplete from './pages/student/ExamComplete';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateExam from './pages/teacher/CreateExam';
import MonitorExams from './pages/teacher/MonitorExams';
import ExamReports from './pages/teacher/ExamReports';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import SignupPage from './pages/SignupPage';
import ActivateAccountPage from './pages/ActivateAccountPage';
import AddTeacherPage from './pages/AddTeacherPage';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/face-verification" element={<FaceVerificationPage />} />
            <Route path="/activate/:token" element={<ActivateAccountPage />} />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute role="admin">
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/teachers/add" element={<ProtectedRoute role="admin">
              < AddTeacherPage />
            </ProtectedRoute>} />
            <Route
              path="/admin/exams"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />



            {/* Student routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam/:examId"
              element={
                <ProtectedRoute role="student">
                  <ExamRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam-complete/:examId"
              element={
                <ProtectedRoute role="student">
                  <ExamComplete />
                </ProtectedRoute>
              }
            />

            {/* teacher routes */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/create-exam"
              element={
                <ProtectedRoute role="teacher">
                  <CreateExam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/monitor-exams"
              element={
                <ProtectedRoute role="teacher">
                  <MonitorExams />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/exam-reports"
              element={
                <ProtectedRoute role="teacher">
                  <ExamReports />
                </ProtectedRoute>
              }
            />

            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;