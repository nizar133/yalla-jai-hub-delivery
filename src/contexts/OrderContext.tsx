
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Order, OrderStatus, OrderItem } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrdersByRole: () => Order[];
  getOrderById: (id: string) => Order | undefined;
  addItemToOrder: (orderId: string, item: OrderItem) => void;
  removeItemFromOrder: (orderId: string, productId: string) => void;
  updateItemQuantity: (orderId: string, productId: string, quantity: number) => void;
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
    // Load saved orders from localStorage
    const savedOrders = localStorage.getItem('orders');
    
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        // Ensure dates are properly parsed
        const ordersWithDates = parsedOrders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt)
        }));
        setOrders(ordersWithDates);
      } catch (e) {
        console.error('Failed to parse orders:', e);
      }
    } else {
      // Initialize with mock orders
      const mockOrders: Order[] = [
        {
          id: 'order-1',
          customerId: 'customer-1',
          storeId: 'store-1',
          storeName: 'سوبر ماركت الشام',
          driverId: 'driver-1',
          items: [
            { productId: 'p1', productName: 'تفاح أحمر', quantity: 2, price: 5000, currencyType: 'SYP' },
            { productId: 'p2', productName: 'موز', quantity: 1, price: 7000, currencyType: 'SYP' },
          ],
          status: 'confirmed',
          total: 17000,
          createdAt: new Date(),
          updatedAt: new Date(),
          address: 'شارع الملك فهد، الرياض',
        },
        {
          id: 'order-2',
          customerId: 'customer-2',
          storeId: 'store-2',
          storeName: 'مطعم الشرق',
          items: [
            { productId: 'p3', productName: 'شيش طاووق', quantity: 1, price: 35000, currencyType: 'SYP' },
            { productId: 'p4', productName: 'حمص', quantity: 2, price: 20000, currencyType: 'SYP' },
          ],
          status: 'pending',
          total: 75000,
          createdAt: new Date(),
          updatedAt: new Date(),
          address: 'شارع التحلية، جدة',
        },
      ];
      setOrders(mockOrders);
      localStorage.setItem('orders', JSON.stringify(mockOrders));
    }
  }, []);

  // Save orders whenever they change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    
    setOrders((prev) => [...prev, newOrder]);
    
    toast({
      title: "تم إنشاء الطلب",
      description: `تم إنشاء الطلب برقم ${newOrder.id} بنجاح`,
    });
    
    return newOrder.id;
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
        return orders.filter((order) => order.storeId === 'store-1'); // Mock vendor store ID
      case 'driver':
        return orders.filter((order) => 
          order.driverId === user.id || 
          ['ready', 'pickup', 'delivering'].includes(order.status)
        );
      case 'admin':
      case 'staff':
        return orders;
      default:
        return [];
    }
  };
  
  const getOrderById = (id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  };
  
  const addItemToOrder = (orderId: string, item: OrderItem) => {
    setOrders(prev => 
      prev.map(order => {
        if (order.id !== orderId) return order;
        
        // Check if item already exists
        const existingItemIndex = order.items.findIndex(i => i.productId === item.productId);
        let updatedItems;
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          updatedItems = [...order.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + item.quantity
          };
        } else {
          // Add new item
          updatedItems = [...order.items, item];
        }
        
        // Recalculate total
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
        
        return {
          ...order,
          items: updatedItems,
          total: newTotal,
          updatedAt: new Date()
        };
      })
    );
  };
  
  const removeItemFromOrder = (orderId: string, productId: string) => {
    setOrders(prev => 
      prev.map(order => {
        if (order.id !== orderId) return order;
        
        const updatedItems = order.items.filter(item => item.productId !== productId);
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
        
        return {
          ...order,
          items: updatedItems,
          total: newTotal,
          updatedAt: new Date()
        };
      })
    );
  };
  
  const updateItemQuantity = (orderId: string, productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(orderId, productId);
      return;
    }
    
    setOrders(prev => 
      prev.map(order => {
        if (order.id !== orderId) return order;
        
        const updatedItems = order.items.map(item => 
          item.productId === productId
            ? { ...item, quantity }
            : item
        );
        
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
        
        return {
          ...order,
          items: updatedItems,
          total: newTotal,
          updatedAt: new Date()
        };
      })
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrdersByRole,
        getOrderById,
        addItemToOrder,
        removeItemFromOrder,
        updateItemQuantity
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
