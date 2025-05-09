
import { StatCard } from '@/components/dashboard/StatCard';
import { OrderList } from '@/components/dashboard/OrderList';
import { Package, Store, Users } from 'lucide-react';
import { Statistic } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function StaffDashboard() {
  const { user, hasPermission } = useAuth();
  
  const stats: Statistic[] = [
    {
      title: 'الطلبات النشطة',
      value: 12,
      change: 5,
      icon: <Package className="h-5 w-5 text-primary" />,
    },
    {
      title: 'المتاجر',
      value: 8,
      change: 2,
      icon: <Store className="h-5 w-5 text-primary" />,
    },
    {
      title: 'المستخدمين',
      value: 45,
      change: 10,
      icon: <Users className="h-5 w-5 text-primary" />,
    },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">لوحة تحكم {user?.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
      
      {hasPermission('manage_orders') && <OrderList />}
    </div>
  );
}
