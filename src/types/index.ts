
export type UserRole = 'customer' | 'vendor' | 'driver' | 'admin' | 'staff';

export interface User {
  id: string;
  phone?: string;
  name: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  createdAt: Date;
  permissions?: Permission[];
  vendorId?: string; // For vendors/staff associated with a store
}

export type Permission = 
  | 'manage_stores'
  | 'manage_categories' 
  | 'manage_products'
  | 'manage_orders'
  | 'manage_users'
  | 'manage_drivers'
  | 'manage_currency'
  | 'view_reports';

export type StoreCategory = 
  | 'grocery' 
  | 'restaurant' 
  | 'sweets' 
  | 'other';

export interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage?: string;
  ownerId: string; // Vendor ID
  address: string;
  category: StoreCategory;
  rating?: number;
}

export interface StoreSection {
  id: string;
  storeId: string;
  name: string;
  description: string;
  image: string;
  order: number;
}

export type CurrencyType = 'SYP' | 'USD';

export interface Product {
  id: string;
  storeId: string;
  sectionId: string;
  name: string;
  description: string;
  price: number;
  currencyType: CurrencyType;
  images: string[];
  available: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  currencyType: CurrencyType;
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

export interface CurrencyRate {
  id: string;
  rate: number; // Exchange rate USD to SYP
  createdAt: Date;
}
