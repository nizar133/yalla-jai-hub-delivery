
import { StatCard } from '@/components/dashboard/StatCard';
import { OrderList } from '@/components/dashboard/OrderList';
import { Package, TrendingUp, Truck } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { Statistic } from '@/types';

export default function DriverDashboard() {
  const { getOrdersByRole } = useOrders();
  const orders = getOrdersByRole();
  
  const availableOrders = orders.filter(order => 
    order.status === 'ready'
  ).length;
  
  const activeDeliveries = orders.filter(order => 
    ['pickup', 'delivering'].includes(order.status)
  ).length;
  
  const completedDeliveries = orders.filter(order => 
    order.status === 'delivered'
  ).length;
  
  const stats: Statistic[] = [
    {
      title: 'طلبات متاحة',
      value: availableOrders,
      icon: <Package className="h-5 w-5 text-primary" />,
    },
    {
      title: 'توصيلات نشطة',
      value: activeDeliveries,
      icon: <Truck className="h-5 w-5 text-primary" />,
    },
    {
      title: 'توصيلات مكتملة',
      value: completedDeliveries,
      change: 20,
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
    },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">لوحة تحكم السائق</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
      
      <OrderList />
    </div>
  );
}
