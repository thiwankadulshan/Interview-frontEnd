import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Button from '../../template/Button';
import Loader from '../../template/Loader';
import Input from '../../template/Input';
import AuthLayout from '../../template/AuthLayout';
import useFetch from '../../hooks/useFetch';
import alert from '../../utils/alert';
import { validatePassword } from '../../utils/validation';

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const otp = location.state?.otp || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { loading, fetchData } = useFetch('/api/auth/change-password', { autoFetch: false });

  useEffect(() => {
    if (!email || !otp) {
      alert.error('Session expired. Please try again.');
      navigate('/forgotpassword');
    }
  }, [email, otp, navigate]);

  const handleChangePassword = async () => {
    setPasswordError('');

    let isValid = true;

    if (!newPassword) {
      setPasswordError('New password is required');
      isValid = false;
    } else if (!validatePassword(newPassword)) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!confirmPassword) {
      alert.error('Please confirm your new password');
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      alert.error('Passwords do not match');
      isValid = false;
    }

    if (!isValid) return;

    const response = await fetchData({ 
      method: 'POST', 
      data: { email, otp, newPassword, confirmPassword }, 
      silent: true 
    });

    if (response?.success || response?.status) {
      alert.success('Password changed successfully! Please log in.');
      navigate('/login');
    } else {
      const errorMsg = response?.message || 'Failed to change password. Please try again.';
      alert.error(errorMsg);
      // For testing
      navigate('/login');
    }
  };

  return (
    <AuthLayout title="Create New Password">
      <div className="space-y-6">
        <p className="text-sm text-slate-500 text-center mb-4">
          Please enter a strong new password for your account.
        </p>

        <Input
          label="New Password"
          id="change-password"
          showPasswordToggle
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (passwordError) setPasswordError('');
          }}
          error={passwordError}
          placeholder="Enter new password"
          title="Enter new password"
        />

        <Input
          label="Confirm New Password"
          id="confirm-change-password"
          showPasswordToggle
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          title="Confirm new password"
        />

        <div className="flex flex-col space-y-4 pt-4">
          {loading ? (
            <Loader text="Updating password..." color="#2563eb" className="py-1" />
          ) : (
            <Button
              name="Change Password"
              onClick={handleChangePassword}
              color="#2563eb"
              borderRadius="12px"
              className="py-3.5 font-bold shadow-lg shadow-blue-500/20"
            />
          )}
        </div>
      </div>
    </AuthLayout>
  );
};
