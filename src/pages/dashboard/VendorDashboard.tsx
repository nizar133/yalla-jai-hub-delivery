
import { StatCard } from '@/components/dashboard/StatCard';
import { OrderList } from '@/components/dashboard/OrderList';
import { Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { Statistic } from '@/types';

export default function VendorDashboard() {
  const { getOrdersByRole } = useOrders();
  const orders = getOrdersByRole();
  
  const totalSales = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);
  
  const pendingOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing'].includes(order.status)
  ).length;
  
  const stats: Statistic[] = [
    {
      title: 'إجمالي المبيعات',
      value: `${totalSales} ر.س`,
      change: 12,
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
    },
    {
      title: 'طلبات جديدة',
      value: pendingOrders,
      change: 8,
      icon: <ShoppingCart className="h-5 w-5 text-primary" />,
    },
    {
      title: 'إجمالي الطلبات',
      value: orders.length,
      change: 15,
      icon: <Package className="h-5 w-5 text-primary" />,
    },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">لوحة تحكم المتجر</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
      
      <OrderList />
    </div>
  );
}
