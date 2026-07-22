// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/common/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import TeacherTuitionsPage from './pages/TeacherTuitionsPage';
import StudentTuitionsPage from './pages/StudentTuitionsPage';
import TuitionDetailPage from './pages/TuitionDetailPage';
import TeacherApplicationsPage from './pages/TeacherApplicationsPage';
import StudentApplicationsPage from './pages/StudentApplicationsPage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { ROUTES } from './utils/constants';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TEACHER_TUITIONS}
          element={
            <ProtectedRoute>
              <TeacherTuitionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.STUDENT_TUITIONS}
          element={
            <ProtectedRoute>
              <StudentTuitionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TUITION_DETAIL}
          element={
            <ProtectedRoute>
              <TuitionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TEACHER_APPLICATIONS}
          element={
            <ProtectedRoute>
              <TeacherApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.STUDENT_APPLICATIONS}
          element={
            <ProtectedRoute>
              <StudentApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.GROUPS}
          element={
            <ProtectedRoute>
              <GroupsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.GROUP_DETAIL}
          element={
            <ProtectedRoute>
              <GroupDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;