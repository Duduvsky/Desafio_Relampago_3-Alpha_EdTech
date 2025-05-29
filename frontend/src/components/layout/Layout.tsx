import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedLayout from './AuthenticatedLayout';
import UnauthenticatedLayout from './UnauthenticatedLayout';

export default function Layout() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AuthenticatedLayout />
                       : <UnauthenticatedLayout />;
}