
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Store,
  Settings,
  Users,
  Truck,
  User,
  Layers,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Sidebar() {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  if (!user) {
    return null;
  }

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        name: 'لوحة التحكم',
        path: `/dashboard`,
        icon: LayoutDashboard,
      },
      {
        name: 'الملف الشخصي',
        path: '/profile',
        icon: User,
      },
    ];

    switch (user.role) {
      case 'customer':
        return [
          ...baseItems,
          {
            name: 'المتاجر',
            path: '/stores',
            icon: Store,
          },
          {
            name: 'طلباتي',
            path: '/orders',
            icon: Package,
          },
          {
            name: 'السلة',
            path: '/cart',
            icon: ShoppingCart,
          },
        ];
      case 'vendor':
        return [
          ...baseItems,
          {
            name: 'متجري',
            path: '/my-store',
            icon: Store,
          },
          {
            name: 'أقسام المتجر',
            path: '/store-sections',
            icon: Layers,
          },
          {
            name: 'المنتجات',
            path: '/products',
            icon: Package,
          },
          {
            name: 'الطلبات',
            path: '/orders',
            icon: ShoppingCart,
          },
        ];
      case 'driver':
        return [
          ...baseItems,
          {
            name: 'الطلبات للتوصيل',
            path: '/deliveries',
            icon: Package,
          },
          {
            name: 'سجل التوصيل',
            path: '/delivery-history',
            icon: Truck,
          },
        ];
      case 'admin':
        return [
          ...baseItems,
          {
            name: 'المستخدمين',
            path: '/users',
            icon: Users,
          },
          {
            name: 'المتاجر',
            path: '/stores-management',
            icon: Store,
          },
          {
            name: 'التصنيفات',
            path: '/categories',
            icon: Layers,
          },
          {
            name: 'الطلبات',
            path: '/orders',
            icon: Package,
          },
          {
            name: 'السائقين',
            path: '/drivers',
            icon: Truck,
          },
          {
            name: 'إدارة العملة',
            path: '/currency',
            icon: DollarSign,
          },
          {
            name: 'الإعدادات',
            path: '/settings',
            icon: Settings,
          },
        ];
      case 'staff':
        const staffItems = [...baseItems];
        
        if (hasPermission('manage_stores')) {
          staffItems.push({
            name: 'المتاجر',
            path: '/stores-management',
            icon: Store,
          });
        }
        
        if (hasPermission('manage_orders')) {
          staffItems.push({
            name: 'الطلبات',
            path: '/orders',
            icon: Package,
          });
        }
        
        if (hasPermission('manage_users')) {
          staffItems.push({
            name: 'المستخدمين',
            path: '/users',
            icon: Users,
          });
        }
        
        if (hasPermission('manage_drivers')) {
          staffItems.push({
            name: 'السائقين',
            path: '/drivers',
            icon: Truck,
          });
        }
        
        if (hasPermission('manage_currency')) {
          staffItems.push({
            name: 'إدارة العملة',
            path: '/currency',
            icon: DollarSign,
          });
        }
        
        return staffItems;
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen border-l border-gray-200 bg-white flex flex-col w-64">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png" 
            alt="يلا جاي" 
            className="w-10 h-10 object-contain" 
          />
          <div>
            <h2 className="text-lg font-semibold text-primary">يلا جاي</h2>
            <p className="text-sm text-gray-500">
              {getRoleDisplayName(user.role)}
            </p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-right",
                      location.pathname === item.path && "bg-primary-light text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5 ml-2" />
                    {item.name}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t text-xs text-center text-gray-500">
        © {new Date().getFullYear()} يلا جاي. جميع الحقوق محفوظة
      </div>
    </div>
  );
}

function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'customer':
      return 'زبون';
    case 'vendor':
      return 'صاحب متجر';
    case 'driver':
      return 'سائق توصيل';
    case 'admin':
      return 'مدير النظام';
    case 'staff':
      return 'مساعد إداري';
    default:
      return role;
  }
}
