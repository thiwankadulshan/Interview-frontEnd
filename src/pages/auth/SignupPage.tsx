import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Button from '../../template/Button';
import Loader from '../../template/Loader';
import Input from '../../template/Input';
import AuthLayout from '../../template/AuthLayout';
import useFetch from '../../hooks/useFetch';
import alert from '../../utils/alert';
import { sanitizeXss } from '../../utils/security_utils';
import { validateEmail, validatePassword } from '../../utils/validation';

export const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const { loading, fetchData } = useFetch('/v1/users/signup', { autoFetch: false });

  const handleSignup = async () => {
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (!isValid) return;

    const sanitizedEmail = sanitizeXss(email);
    const response = await fetchData({ method: 'POST', data: { email: sanitizedEmail, password }, silent: true });

    if (response?.success || response?.status) {
      navigate('/login');
    } else {
      const errorMsg = response?.message || 'Signup failed. Please try again.';
      alert.error(errorMsg);
    }
  };

  return (
    <AuthLayout title="Create Your Account">
      <div className="space-y-6">
        <Input
          label="Email Address"
          id="signup-email"
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

        <Input
          label="Password"
          id="signup-password"
          showPasswordToggle
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError('');
          }}
          error={passwordError}
          placeholder="Create a password"
          title="Create a password"
        />

        <Input
          label="Confirm Password"
          id="signup-confirm-password"
          showPasswordToggle
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmPasswordError) setConfirmPasswordError('');
          }}
          error={confirmPasswordError}
          placeholder="Confirm your password"
          title="Confirm your password"
        />

        <div className="flex flex-col space-y-4 pt-4">
          {loading ? (
            <Loader text="Creating account..." color="#2563eb" className="py-1" />
          ) : (
            <Button
              name="Sign Up"
              onClick={handleSignup}
              color="#2563eb"
              borderRadius="12px"
              className="py-3.5 font-bold shadow-lg shadow-blue-500/20"
            />
          )}

          <div className="flex items-center justify-center space-x-2 text-sm pt-2">
            <span className="text-slate-500">Already have an account?</span>
            <Link
              to="/login"
              className="text-blue-600 font-bold hover:underline"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
