
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { RegisterForm } from '@/components/RegisterForm';

export default function Register() {
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
          <p className="text-gray-500 mt-2">إنشاء حساب جديد</p>
        </div>

        <RegisterForm />

        <div className="text-center mt-6">
          <p className="text-gray-600 mb-2">لديك حساب بالفعل؟</p>
          <Link to="/login" className="text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
