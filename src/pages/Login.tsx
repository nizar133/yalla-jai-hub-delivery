
import { useState } from 'react';
import RegisterForm from '@/components/RegisterForm';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const [activeTab, setActiveTab] = useState<string>('register');
  const { user } = useAuth();

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">يج</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-4">يلا جاي</h1>
          <p className="text-gray-500 mt-2">منصة توصيل الطلبات الأسرع</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="register">تسجيل جديد</TabsTrigger>
            <TabsTrigger value="login">تسجيل دخول</TabsTrigger>
          </TabsList>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
          <TabsContent value="login">
            <Card>
              <RegisterForm />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
