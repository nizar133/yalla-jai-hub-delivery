
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, Store, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const roles = [
    {
      name: 'زبون',
      description: 'اطلب من مجموعة متنوعة من المتاجر',
      icon: <User className="h-10 w-10 text-primary" />,
      role: 'customer'
    },
    {
      name: 'صاحب متجر',
      description: 'أدر متجرك واستقبل الطلبات',
      icon: <Store className="h-10 w-10 text-primary" />,
      role: 'vendor'
    },
    {
      name: 'سائق توصيل',
      description: 'وصل الطلبات واكسب المزيد',
      icon: <Truck className="h-10 w-10 text-primary" />,
      role: 'driver'
    },
    {
      name: 'مدير النظام',
      description: 'تحكم في جميع جوانب النظام',
      icon: <Package className="h-10 w-10 text-primary" />,
      role: 'admin'
    }
  ];

  // If the user is logged in, redirect to their dashboard
  if (user) {
    navigate(`/dashboard/${user.role}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white text-center p-10 md:p-20">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">يلا جاي</h1>
          <p className="text-xl md:text-2xl mb-6">منصة توصيل الطلبات الأسرع والأكثر كفاءة</p>
          <Button 
            onClick={() => navigate('/login')} 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100"
          >
            ابدأ الآن
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">كيف يعمل التطبيق؟</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="rounded-full bg-primary-light p-3 w-fit mb-4">
                  {role.icon}
                </div>
                <CardTitle>{role.name}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {getFeaturesList(role.role).map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="bg-primary w-full"
                >
                  سجل كـ {role.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6">جاهز للإنضمام معنا؟</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            انضم إلى منصة يلا جاي اليوم وكن جزءاً من شبكتنا المتنامية من الزبائن، أصحاب المتاجر، وسائقي التوصيل.
          </p>
          <Button 
            onClick={() => navigate('/login')} 
            size="lg" 
            className="bg-primary"
          >
            سجل الآن
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">يج</span>
            </div>
          </div>
          <p className="text-gray-600">© {new Date().getFullYear()} يلا جاي. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
};

function getFeaturesList(role: string): string[] {
  switch (role) {
    case 'customer':
      return [
        'تصفح المتاجر المختلفة',
        'طلب المنتجات بسهولة',
        'تتبع الطلبات في الوقت الفعلي',
        'تقييم الخدمة والمنتجات'
      ];
    case 'vendor':
      return [
        'إدارة كاملة للمنتجات',
        'استلام الطلبات فوراً',
        'تحديث حالة الطلبات',
        'تحليلات ومبيعات مفصلة'
      ];
    case 'driver':
      return [
        'استلام طلبات التوصيل',
        'تحديث حالة التوصيل',
        'تتبع المسارات بدقة',
        'جدول مرن للعمل'
      ];
    case 'admin':
      return [
        'إدارة كافة المستخدمين',
        'مراقبة المتاجر والسائقين',
        'تقارير وإحصائيات شاملة',
        'إعدادات متقدمة للنظام'
      ];
    default:
      return [];
  }
}

export default Index;
