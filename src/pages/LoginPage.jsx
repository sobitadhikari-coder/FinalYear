// src/pages/LoginPage.jsx

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import { ROUTES } from '../utils/constants';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, role, isVerified } = useAuth();

  const registered = searchParams.get('registered');

  // Redirect if already logged in
  useEffect(() => {
    if (role) {
      if (role === 'teacher' && !isVerified) {
        navigate(ROUTES.PROFILE, { replace: true });
      } else if (role === 'teacher') {
        navigate(ROUTES.TEACHER_TUITIONS, { replace: true });
      } else {
        navigate(ROUTES.STUDENT_TUITIONS, { replace: true });
      }
    }
  }, [role, isVerified, navigate]);

  const handleLoginSuccess = () => {
    // The role and isVerified will update, triggering the useEffect above
  };

  if (user) {
    return null; // Wait for redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {registered === 'true' && (
          <p className="text-green-600 text-center mb-4 bg-green-50 p-2 rounded">
            Registration successful! Please log in.
          </p>
        )}
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;