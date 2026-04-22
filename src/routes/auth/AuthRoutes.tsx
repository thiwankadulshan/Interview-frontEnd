import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageLoader from '../../template/PageLoader';

const LoginPage = lazy(() =>
  import('../../pages/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const SignupPage = lazy(() =>
  import('../../pages/auth/SignupPage').then((m) => ({ default: m.SignupPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('../../pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const ResetPasswordPage = lazy(() =>
  import('../../pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
);
const ChangePasswordPage = lazy(() =>
  import('../../pages/auth/ChangePasswordPage').then((m) => ({ default: m.ChangePasswordPage }))
);

const AuthRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AuthRoutes;
