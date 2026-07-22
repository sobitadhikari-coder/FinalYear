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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {successMessage && (
          <p className="text-green-600 text-sm text-center mb-4 bg-green-50 p-2 rounded">
            {successMessage}
          </p>
        )}
        {step === 'email' && (
          <ForgotPasswordForm onSuccess={handleEmailSuccess} />
        )}
        {step === 'otp' && (
          <OTPForm email={email} onSuccess={handleOTPSuccess} />
        )}
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;