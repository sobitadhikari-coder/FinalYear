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

  if (user) {
    return null; // Wait for redirect
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {registered === 'true' && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-4 rounded-2xl mb-6 shadow-sm border border-green-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Registration successful! Please log in.
          </div>
        )}
        <LoginForm onSuccess={() => {}} />
      </div>
    </div>
  );
};

export default LoginPage;