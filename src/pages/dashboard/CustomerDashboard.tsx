
import { StatCard } from '@/components/dashboard/StatCard';
import { OrderList } from '@/components/dashboard/OrderList';
import { Package, ShoppingCart, Store } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { Statistic } from '@/types';

export default function CustomerDashboard() {
  const { getOrdersByRole } = useOrders();
  const orders = getOrdersByRole();

  const stats: Statistic[] = [
    {
      title: 'إجمالي الطلبات',
      value: orders.length,
      change: 5,
      icon: <Package className="h-5 w-5 text-primary" />,
    },
    {
      title: 'طلبات قيد التوصيل',
      value: orders.filter(order => 
        ['confirmed', 'preparing', 'ready', 'pickup', 'delivering'].includes(order.status)
      ).length,
      icon: <ShoppingCart className="h-5 w-5 text-primary" />,
    },
    {
      title: 'المتاجر المفضلة',
      value: 3,
      icon: <Store className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">لوحة التحكم</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
      
      <OrderList />
    </div>
  );
}
