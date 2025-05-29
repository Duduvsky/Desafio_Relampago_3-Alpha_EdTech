import { type ComponentType } from 'react';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard';
import AssetsList from '../pages/Asset/AssetsPage';
import AssetDetailPage from '../pages/Asset/AssetDetailPage';
import MaintenancePage from '../pages/Maintenance/MaintenancePage';
import MaintenanceSchedulesPage from '../pages/MaintenanceSchedules/MaintenanceSchedulesPage';

interface Route {
  path: string;
  element: ComponentType;
  protected?: boolean;
}

const routes: Route[] = [
  { path: '/login', element: Login },
  { path: '/register', element: Register },
  { path: '/', element: Dashboard, protected: true },
  { path: '/assets', element: AssetsList, protected: true },
  { path: '/assets/:id', element: AssetDetailPage, protected: true },
  { path: '/maintenances', element: MaintenancePage, protected: true },
  { path: '/maintenance-schedules', element: MaintenanceSchedulesPage, protected: true }
];

export default routes;