
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircle, 
  LogOut, 
  ShoppingCart, 
  Menu 
} from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { useDirection } from '@/components/DirectionProvider';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { direction } = useDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">يج</span>
            </div>
            <h1 className="text-xl font-bold">يلا جاي</h1>
          </a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'customer' && (
                <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              )}

              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-sm font-medium">
                  {user.name || user.phone}
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
