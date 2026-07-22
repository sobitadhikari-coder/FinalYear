// src/pages/LandingPage.jsx

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-white p-4">
      <Card className="max-w-lg text-center space-y-6 shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600">Tutor Management System</h1>
        <p className="text-gray-600">
          Connect with expert teachers and find the perfect tuition for your academic success.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/login">
            <Button className="w-full sm:w-auto px-8">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="w-full sm:w-auto px-8 bg-green-600 hover:bg-green-700">Register</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LandingPage;