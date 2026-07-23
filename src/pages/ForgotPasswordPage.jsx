// src/pages/ForgotPasswordPage.jsx

import { useState } from 'react';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import OTPForm from '../components/auth/OTPForm';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailSuccess = (submittedEmail, message) => {
    setEmail(submittedEmail);
    setSuccessMessage(message);
    setStep('otp');
  };

  const handleOTPSuccess = () => {
    // Optionally show a final message, but the OTP form already shows its own success
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {successMessage && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-4 rounded-2xl mb-6 shadow-sm border border-green-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}
        {step === 'email' && (
          <ForgotPasswordForm onSuccess={handleEmailSuccess} />
        )}
        {step === 'otp' && (
          <OTPForm email={email} onSuccess={handleOTPSuccess} />
        )}
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;