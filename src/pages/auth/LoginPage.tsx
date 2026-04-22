import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

import Button from '../../template/Button';
import Loader from '../../template/Loader';
import Input from '../../template/Input';
import AuthLayout from '../../template/AuthLayout';
import useFetch from '../../hooks/useFetch';
import { setAuth } from '../../store/authSlice';
import type { AppDispatch } from '../../store/store';
import { sanitizeXss } from '../../utils/security_utils';
import { validateEmail } from '../../utils/validation';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { loading: _loading, fetchData } = useFetch('/v1/users/login', { method: 'POST', autoFetch: false });

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

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
    }

    if (!isValid) return;

    const sanitizedEmail = sanitizeXss(email);

    const response = await fetchData({
      data: { email: sanitizedEmail, password }
    });

    if (response?.success) {
      const { token, refreshToken, user } = response as any;
      if (token) Cookies.set('accessToken', token, { expires: 1 });
      if (refreshToken) Cookies.set('refreshToken', refreshToken, { expires: 7 });

      dispatch(setAuth({
        token: token,
        user: { id: user?.id || 1, email: user?.email || sanitizedEmail, role: user?.role || 'admin' }
      }));
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout title="Log In to Track Your Issues">
      <div className="space-y-6">
        <Input
          label="Email Address"
          id="login-email"
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
          id="login-password"
          showPasswordToggle
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError('');
          }}
          error={passwordError}
          placeholder="Enter your password"
          title="Enter your password"
        />

        <div className="text-right">
          <Link
            to="/forgotpassword"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="flex flex-col space-y-4 pt-4">
          {_loading ? (
            <Loader text="Logging in..." color="#2563eb" className="py-1" />
          ) : (
            <Button
              name="Login"
              onClick={handleLogin}
              color="#2563eb"
              borderRadius="12px"
              className="py-3.5 font-bold shadow-lg shadow-blue-500/20"
            />
          )}

          <div className="flex items-center justify-center space-x-2 text-sm pt-2">
            <span className="text-slate-500">Don't have an account?</span>
            <Link
              to="/signup"
              className="text-blue-600 font-bold hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
