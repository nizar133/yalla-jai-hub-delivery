
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { LoginForm } from '@/components/LoginForm';
import { Button } from '@/components/ui/button';

export default function Login() {
  const { user } = useAuth();

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Link to="/">
              <img 
                src="/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png" 
                alt="يلا جاي" 
                className="w-24 h-24 object-contain bg-white p-2 rounded-full shadow-lg" 
              />
            </Link>
          </div>
          <h1 className="text-3xl font-bold mt-4 text-primary">يلا جاي</h1>
          <p className="text-gray-500 mt-2">منصة توصيل الطلبات الأسرع</p>
        </div>

        <LoginForm />
        
        <div className="text-center mt-6">
          <p className="text-gray-600 mb-2">ليس لديك حساب؟</p>
          <Button variant="outline" asChild className="w-full">
            <Link to="/register">إنشاء حساب جديد</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
