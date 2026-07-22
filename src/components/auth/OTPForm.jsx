// src/components/auth/OTPForm.jsx

import { useState } from 'react';
import { verifyOTPAndResetPassword } from '../../api/auth';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const OTPForm = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const response = await verifyOTPAndResetPassword(email, otp, newPassword);
      setMessage(response.message || 'Password reset successful.');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Enter the OTP sent to {email} and your new password.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="OTP"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          required
        />
        <Input
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </Card>
  );
};

export default OTPForm;