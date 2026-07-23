// src/pages/RegisterPage.jsx

import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { ROUTES } from '../utils/constants';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate(`${ROUTES.LOGIN}?registered=true`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </div>
    </div>
  );
};

export default RegisterPage;