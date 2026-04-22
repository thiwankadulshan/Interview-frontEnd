import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isTokenValid } from './auth.config';
import Cookies from 'js-cookie';
import type { RootState } from '../store/store';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const reduxToken = useSelector((state: RootState) => state.auth.token);
  const cookieToken = Cookies.get('accessToken') || null;
  const token = reduxToken || cookieToken;
  const isAuthenticated = isTokenValid(token);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
