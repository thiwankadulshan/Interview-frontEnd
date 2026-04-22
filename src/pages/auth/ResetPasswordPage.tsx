import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Button from '../../template/Button';
import Loader from '../../template/Loader';
import AuthLayout from '../../template/AuthLayout';
import useFetch from '../../hooks/useFetch';
import alert from '../../utils/alert';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const { loading, fetchData } = useFetch('/api/auth/verify-otp', { autoFetch: false });

  useEffect(() => {
    if (!email) {
      alert.error('Email missing. Please try again.');
      navigate('/forgotpassword');
    }
  }, [email, navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < 4) {
      setOtpError(true);
      alert.error('Please enter the 4-digit code');
      return;
    }

    setOtpError(false);
    const response = await fetchData({ method: 'POST', data: { email, otp: otpString }, silent: true });

    if (response?.success || response?.status) {
      navigate('/change-password', { state: { email, otp: otpString } });
    } else {
      const errorMsg = response?.message || 'Verification failed. Please try again.';
      alert.error(errorMsg);
      // For testing
      navigate('/change-password', { state: { email, otp: otpString } });
    }
  };

  return (
    <AuthLayout title="Verify Reset Code">
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-sm text-slate-500">
            We've sent a verification code to
          </p>
          <p className="text-sm font-bold text-black mt-1">{email}</p>
        </div>

        <div className="flex justify-center gap-4">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              aria-label={`OTP digit ${idx + 1}`}
              title={`OTP digit ${idx + 1}`}
              placeholder="-"
              className={`w-14 h-16 text-center text-3xl font-bold bg-slate-100 text-black border-none rounded-xl focus:ring-2 ${
                otpError ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
              } outline-none transition-all shadow-sm`}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        <div className="flex flex-col space-y-4 pt-4">
          {loading ? (
            <Loader text="Verifying..." color="#2563eb" className="py-1" />
          ) : (
            <Button
              name="Verify Code"
              onClick={handleVerify}
              color="#2563eb"
              borderRadius="12px"
              className="py-3.5 font-bold shadow-lg shadow-blue-500/20"
            />
          )}

          <div className="text-center">
            <button
              onClick={() => navigate('/forgotpassword')}
              className="text-sm text-slate-500 font-bold hover:text-blue-600 transition-colors"
            >
              Resend Code
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
