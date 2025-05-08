
export type UserRole = 'customer' | 'vendor' | 'driver' | 'admin';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  ownerId: string; // Vendor ID
  address: string;
  categories: string[];
  rating?: number;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'pending'      // Initial state
  | 'confirmed'    // Vendor confirmed order
  | 'preparing'    // Vendor is preparing order
  | 'ready'        // Ready for pickup by driver
  | 'pickup'       // Driver picked up
  | 'delivering'   // Driver is delivering
  | 'delivered'    // Order delivered
  | 'cancelled';   // Order cancelled

export interface Order {
  id: string;
  customerId: string;
  storeId: string;
  storeName: string;
  driverId?: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  address: string;
}

export interface Statistic {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}
