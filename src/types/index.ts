
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

// تعريف فئات المتاجر الرئيسية
export type StoreCategory = 'grocery' | 'restaurant' | 'other';

// ترجمة فئات المتاجر للعربية
export const storeCategoryNames: Record<StoreCategory, string> = {
  grocery: 'البقالة والسوبرماركت',
  restaurant: 'المطاعم والحلويات',
  other: 'أخرى'
};

export interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string; // صورة واجهة المتجر الرئيسية
  ownerId: string; // Vendor ID
  address: string;
  category: StoreCategory; // فئة المتجر الرئيسية
  sections: StoreSection[]; // أقسام المتجر
  rating?: number;
}

// قسم داخل المتجر
export interface StoreSection {
  id: string;
  name: string;
  coverImage: string;
  storeId: string;
}

export interface Product {
  id: string;
  storeId: string;
  sectionId: string; // القسم الذي ينتمي إليه المنتج
  name: string;
  description: string;
  price: number;
  images: string[]; // مصفوفة من الصور (1-5 صور)
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
