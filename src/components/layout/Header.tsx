
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircle, 
  LogOut, 
  ShoppingCart, 
  Menu,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { useDirection } from '@/components/DirectionProvider';
import { useCurrency } from '@/contexts/CurrencyContext';

export function Header() {
  const { user, logout } = useAuth();
  const { currentRate } = useCurrency();
  const navigate = useNavigate();
  const { direction } = useDirection();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className={direction === 'rtl' ? 'rtl-flip' : ''} />
              </Button>
            </SheetTrigger>
            <SheetContent side={direction === 'rtl' ? 'right' : 'left'} className="p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>

          <a href="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png" 
              alt="يلا جاي" 
              className="w-10 h-10 object-contain" 
            />
            <h1 className="text-xl font-bold text-primary">يلا جاي</h1>
          </a>
        </div>

        <div className="flex items-center gap-4">
          {/* Currency display */}
          <div className="hidden md:flex items-center text-sm bg-gray-100 rounded-full px-3 py-1">
            <DollarSign className="h-3 w-3 text-primary mr-1" />
            <span>1 = {currentRate} ل.س</span>
          </div>
          
          {user ? (
            <>
              {user.role === 'customer' && (
                <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              )}

              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-sm font-medium">
                  {user.name || user.email || user.phone}
                </span>
                <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                  <UserCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={() => navigate('/login')} className="bg-primary">
              تسجيل الدخول
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
