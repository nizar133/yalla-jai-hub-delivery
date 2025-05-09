
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole, Permission } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Admin credentials
  const ADMIN_EMAIL = 'alqadrynzar06@gmail.com';
  const ADMIN_PASSWORD = '219133';

  // Mock admin user
  const adminUser: User = {
    id: 'admin-1',
    name: 'مدير النظام',
    role: 'admin',
    email: ADMIN_EMAIL,
    createdAt: new Date(),
    permissions: [
      'manage_stores',
      'manage_categories',
      'manage_products',
      'manage_orders',
      'manage_users',
      'manage_drivers',
      'manage_currency',
      'view_reports'
    ]
  };

  // Sample staff user
  const staffUser: User = {
    id: 'staff-1',
    name: 'مساعد مدير',
    role: 'staff',
    email: 'staff@example.com',
    createdAt: new Date(),
    permissions: [
      'manage_orders',
      'view_reports'
    ]
  };

  // Sample vendor user
  const vendorUser: User = {
    id: 'vendor-1',
    name: 'صاحب متجر',
    phone: '0987654321',
    role: 'vendor',
    createdAt: new Date()
  };

  // Sample customer user
  const customerUser: User = {
    id: 'customer-1',
    name: 'زبون',
    phone: '0123456789',
    role: 'customer',
    createdAt: new Date()
  };

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure dates are properly parsed
        if (parsedUser.createdAt) {
          parsedUser.createdAt = new Date(parsedUser.createdAt);
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      toast({
        title: "تم تسجيل الدخول",
        description: "مرحباً بك في لوحة تحكم المدير"
      });
      return true;
    } 
    
    // Staff login (for demo purposes)
    else if (email === 'staff@example.com' && password === 'staff123') {
      setUser(staffUser);
      localStorage.setItem('user', JSON.stringify(staffUser));
      toast({
        title: "تم تسجيل الدخول",
        description: "مرحباً بك في لوحة تحكم المساعد"
      });
      return true;
    }
    
    // Vendor login (for demo purposes)
    else if (email === 'vendor@example.com' || password === 'vendor123') {
      setUser(vendorUser);
      localStorage.setItem('user', JSON.stringify(vendorUser));
      toast({
        title: "تم تسجيل الدخول",
        description: "مرحباً بك في لوحة تحكم المتجر"
      });
      return true;
    }
    
    // Customer login (for demo purposes)
    else if (email === 'customer@example.com' || password === 'customer123') {
      setUser(customerUser);
      localStorage.setItem('user', JSON.stringify(customerUser));
      toast({
        title: "تم تسجيل الدخول",
        description: "مرحباً بك في التطبيق"
      });
      return true;
    }
    
    // Login failed
    else {
      toast({
        title: "فشل تسجيل الدخول",
        description: "بريد إلكتروني أو كلمة مرور غير صحيحة",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "تم تسجيل الخروج",
      description: "نتمنى رؤيتك مجدداً قريباً"
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const hasPermission = (permission: Permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        hasPermission,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
