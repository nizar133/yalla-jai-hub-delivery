
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrdersByRole: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // In a real app, this would load orders from an API
    // For now we'll just use some mock orders
    const mockOrders: Order[] = [
      {
        id: 'order-1',
        customerId: 'customer-1',
        storeId: 'store-1',
        storeName: 'مطعم الشرق',
        driverId: 'driver-1',
        items: [
          { productId: 'p1', productName: 'شاورما دجاج', quantity: 2, price: 25 },
          { productId: 'p2', productName: 'بطاطس مقلية', quantity: 1, price: 10 },
        ],
        status: 'confirmed',
        total: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: 'شارع الملك فهد، الرياض',
      },
      {
        id: 'order-2',
        customerId: 'customer-2',
        storeId: 'store-2',
        storeName: 'مطعم البيت',
        items: [
          { productId: 'p3', productName: 'برجر لحم', quantity: 1, price: 35 },
          { productId: 'p4', productName: 'عصير برتقال', quantity: 2, price: 8 },
        ],
        status: 'pending',
        total: 51,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: 'شارع التحلية، جدة',
      },
    ];
    setOrders(mockOrders);
  }, []);

  const addOrder = (order: Order) => {
    setOrders((prev) => [...prev, order]);
    toast({
      title: "تم إنشاء الطلب",
      description: `تم إنشاء الطلب برقم ${order.id} بنجاح`,
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => 
      prev.map((order) => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date() } 
          : order
      )
    );
    
    toast({
      title: "تم تحديث حالة الطلب",
      description: `تم تحديث حالة الطلب إلى ${getStatusInArabic(status)}`,
    });
  };

  const getOrdersByRole = () => {
    if (!user) return [];

    switch (user.role) {
      case 'customer':
        return orders.filter((order) => order.customerId === user.id);
      case 'vendor':
        return orders.filter((order) => order.storeId === 'store-1'); // Mock vendor ID
      case 'driver':
        return orders.filter((order) => 
          order.driverId === user.id || 
          ['ready', 'pickup', 'delivering'].includes(order.status)
        );
      case 'admin':
        return orders;
      default:
        return [];
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrdersByRole,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

function getStatusInArabic(status: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    pending: 'قيد الانتظار',
    confirmed: 'تم التأكيد',
    preparing: 'قيد التحضير',
    ready: 'جاهز للاستلام',
    pickup: 'تم الاستلام',
    delivering: 'قيد التوصيل',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي',
  };
  return statusMap[status] || status;
}
