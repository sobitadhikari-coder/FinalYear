// src/components/auth/ForgotPasswordForm.jsx

import { useState } from 'react';
import { forgotPassword } from '../../api/auth';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const ForgotPasswordForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      const responseMessage = response.message || 'If account exists, an OTP has been sent.';
      setMessage(responseMessage);
      if (onSuccess) onSuccess(email, responseMessage);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Enter your email address and we&apos;ll send you an OTP to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send OTP'}
        </Button>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;