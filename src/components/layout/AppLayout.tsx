
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from 'lucide-react';

interface AppLayoutProps {
  requireAuth?: boolean;
}

export function AppLayout({ requireAuth = true }: AppLayoutProps) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <img 
          src="/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png" 
          alt="يلا جاي" 
          className="w-24 h-24 mb-6 object-contain animate-pulse" 
        />
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  // If authentication is required but user isn't authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
