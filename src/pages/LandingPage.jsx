// src/pages/LandingPage.jsx

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const LandingPage = () => {
  const { user, role, isVerified } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (role === 'teacher' && !isVerified) {
        navigate('/profile', { replace: true });
      } else if (role === 'teacher') {
        navigate('/tuitions/teacher', { replace: true });
      } else if (role === 'student') {
        navigate('/tuitions/student', { replace: true });
      }
    }
  }, [user, role, isVerified, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Hero illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-blue-600 shadow-xl shadow-blue-200 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
            Tutor Management System
          </h1>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
            Connect with expert teachers and find the perfect tuition for your academic success.
            Start your journey today.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button size="lg" className="px-10 text-lg">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button
              size="lg"
              className="px-10 text-lg bg-green-600 hover:bg-green-700 active:bg-green-800 focus:ring-green-200"
            >
              Register
            </Button>
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Log in</Link> or{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">sign up</Link> in seconds.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;