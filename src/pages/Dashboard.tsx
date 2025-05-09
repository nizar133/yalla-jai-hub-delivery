
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './dashboard/AdminDashboard';
import VendorDashboard from './dashboard/VendorDashboard';
import CustomerDashboard from './dashboard/CustomerDashboard';
import DriverDashboard from './dashboard/DriverDashboard';
import StaffDashboard from './dashboard/StaffDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'vendor':
      return <VendorDashboard />;
    case 'driver':
      return <DriverDashboard />;
    case 'customer':
      return <CustomerDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}
