import { Routes, Route, Navigate } from 'react-router-dom';
import AuthRoutes from './routes/auth/AuthRoutes';
import DashboardRoutes from './routes/dashboard/DashboardRoutes';
import ProtectedRoute from './config/ProtectedRoute';

function App() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Routes>
        <Route path="/*" element={<AuthRoutes />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
