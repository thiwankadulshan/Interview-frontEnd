import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../template/Button';
import Loader from '../../template/Loader';
import Input from '../../template/Input';
import AuthLayout from '../../template/AuthLayout';
import useFetch from '../../hooks/useFetch';
import alert from '../../utils/alert';
import { validateEmail } from '../../utils/validation';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const { loading, fetchData } = useFetch('/api/auth/forgot-password', { autoFetch: false });

  const handleResetRequest = async () => {
    setEmailError('');

    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    const response = await fetchData({ method: 'POST', data: { email }, silent: true });

    if (response?.success || response?.status) {
      navigate('/reset-password', { state: { email } });
    } else {
      const errorMsg = response?.message || 'Request failed. Please try again.';
      alert.error(errorMsg);
      // For testing, allowing navigation
      navigate('/reset-password', { state: { email } });
    }
  };

  return (
    <AuthLayout title="Reset Your Password">
      <div className="space-y-6">
        <p className="text-sm text-slate-500 text-center px-4">
          Enter your email address and we'll send you a 4-digit code to reset your password.
        </p>

        <Input
          label="Email Address"
          id="forgot-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          error={emailError}
          placeholder="Enter your email"
          title="Enter your email address"
        />

        <div className="flex flex-col space-y-4 pt-4">
          {loading ? (
            <Loader text="Sending code..." color="#2563eb" className="py-1" />
          ) : (
            <Button
              name="Send Reset Code"
              onClick={handleResetRequest}
              color="#2563eb"
              borderRadius="12px"
              className="py-3.5 font-bold shadow-lg shadow-blue-500/20"
            />
          )}

          <button
            onClick={() => navigate('/login')}
            className="text-sm text-slate-500 font-bold hover:text-blue-600 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
