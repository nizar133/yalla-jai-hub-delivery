
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/contexts/OrderContext';
import { Order, OrderStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export function OrderList() {
  const { getOrdersByRole, updateOrderStatus } = useOrders();
  const { user } = useAuth();
  const orders = getOrdersByRole();

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    if (!user) return null;
    
    switch (user.role) {
      case 'vendor':
        if (currentStatus === 'pending') return 'confirmed';
        if (currentStatus === 'confirmed') return 'preparing';
        if (currentStatus === 'preparing') return 'ready';
        return null;
      case 'driver':
        if (currentStatus === 'ready') return 'pickup';
        if (currentStatus === 'pickup') return 'delivering';
        if (currentStatus === 'delivering') return 'delivered';
        return null;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    const statusMap: Record<OrderStatus, string> = {
      'pending': 'قيد الانتظار',
      'confirmed': 'تم التأكيد',
      'preparing': 'قيد التحضير',
      'ready': 'جاهز للاستلام',
      'pickup': 'تم الاستلام',
      'delivering': 'قيد التوصيل',
      'delivered': 'تم التوصيل',
      'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-indigo-100 text-indigo-800';
      case 'pickup':
        return 'bg-orange-100 text-orange-800';
      case 'delivering':
        return 'bg-cyan-100 text-cyan-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>الطلبات</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-center py-4 text-gray-500">لا توجد طلبات حالية</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">طلب #{order.id.slice(-4)}</h3>
                    <p className="text-sm text-gray-500">{order.storeName}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString('ar-SA')}
                  </p>
                  <p className="font-medium mt-1">{order.total} ر.س</p>
                </div>
                
                <div className="mt-3 border-t pt-3">
                  <p className="text-sm font-medium">المنتجات:</p>
                  <ul className="text-sm text-gray-600">
                    {order.items.map((item) => (
                      <li key={item.productId} className="flex justify-between">
                        <span>{item.productName}</span>
                        <span>{item.quantity} × {item.price} ر.س</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-3 flex justify-end">
                  {(user?.role === 'vendor' || user?.role === 'driver') && (
                    <>
                      {getNextStatus(order.status) && (
                        <Button
                          onClick={() => 
                            updateOrderStatus(order.id, getNextStatus(order.status)!)
                          }
                          className="bg-primary"
                        >
                          تحديث الحالة
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
