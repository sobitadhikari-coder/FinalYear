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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </div>
    </div>
  );
};

export default RegisterPage;