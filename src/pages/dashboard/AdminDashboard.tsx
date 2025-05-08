
import { StatCard } from '@/components/dashboard/StatCard';
import { OrderList } from '@/components/dashboard/OrderList';
import { Package, Store, Truck, Users } from 'lucide-react';
import { Statistic } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const stats: Statistic[] = [
    {
      title: 'إجمالي المستخدمين',
      value: 245,
      change: 10,
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      title: 'المتاجر النشطة',
      value: 18,
      change: 5,
      icon: <Store className="h-5 w-5 text-primary" />,
    },
    {
      title: 'إجمالي الطلبات',
      value: 324,
      change: 15,
      icon: <Package className="h-5 w-5 text-primary" />,
    },
    {
      title: 'سائقي التوصيل',
      value: 32,
      change: 8,
      icon: <Truck className="h-5 w-5 text-primary" />,
    },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">لوحة تحكم المدير</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderList />
        
        <Card>
          <CardHeader>
            <CardTitle>ملخص النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">المستخدمين</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>زبائن:</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>أصحاب متاجر:</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>سائقين:</span>
                    <span className="font-medium">32</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مدراء:</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">إحصائيات اليوم</h3>
                <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>طلبات جديدة:</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>طلبات مكتملة:</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>إجمالي المبيعات:</span>
                    <span className="font-medium">2,450 ر.س</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
