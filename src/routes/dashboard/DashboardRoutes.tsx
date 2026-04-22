import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLoader from '../../template/PageLoader';

const DashboardPage = lazy(() =>
  import('../../pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);

const DashboardRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route index element={<DashboardPage />} />
      </Routes>
    </Suspense>
  );
};

export default DashboardRoutes;
