
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Truck, 
  ArrowRight,
  Store,
  ChevronRight
} from 'lucide-react';
import { StoreCategory } from '@/types';
import { useStore } from '@/contexts/StoreContext';

export default function Index() {
  const { stores, getStoresByCategory } = useStore();
  
  // Get top stores from each category
  const groceryStores = getStoresByCategory('grocery').slice(0, 3);
  const restaurantStores = getStoresByCategory('restaurant').slice(0, 3);
  const sweetsStores = getStoresByCategory('sweets').slice(0, 3);
  
  // Category info
  const categories: {
    id: StoreCategory;
    name: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      id: 'grocery',
      name: 'بقالة وسوبرماركت',
      icon: <ShoppingCart className="h-6 w-6 text-primary" />,
      description: 'تسوق احتياجاتك اليومية من البقالة والمواد الغذائية'
    },
    {
      id: 'restaurant',
      name: 'مطاعم',
      icon: <Store className="h-6 w-6 text-primary" />,
      description: 'اطلب وجباتك المفضلة من أشهر المطاعم'
    },
    {
      id: 'sweets',
      name: 'حلويات',
      icon: <Store className="h-6 w-6 text-primary" />,
      description: 'استمتع بأشهى الحلويات العربية والشرقية'
    }
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gradient-to-br from-primary-light via-white to-white text-center">
        <div className="container mx-auto px-4">
          <img 
            src="/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png" 
            alt="يلا جاي" 
            className="w-32 h-32 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            <span className="text-primary">يلا جاي</span> - توصيل طلباتك بسرعة وسهولة
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
            منصة توصيل تربط المتاجر بالزبائن لتوصيل الطلبات بسرعة ودقة عالية
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/login" className="flex items-center">
                ابدأ الآن
                <ArrowRight className="ml-2 h-5 w-5 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">تصفح حسب التصنيف</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary-light p-4 mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stores Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">متاجر مميزة</h2>
          
          {/* Grocery Stores */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">بقالة وسوبرماركت</h3>
              <Button variant="ghost" asChild>
                <Link to="/category/grocery" className="flex items-center">
                  عرض الكل
                  <ChevronRight className="mr-1 h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {groceryStores.length === 0 ? (
                <div className="col-span-full text-center py-6">
                  <p className="text-gray-500">لا يوجد متاجر في هذا التصنيف حالياً</p>
                </div>
              ) : (
                groceryStores.map(store => (
                  <Link key={store.id} to={`/store/${store.id}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="h-40 bg-gray-100">
                        <img 
                          src={store.coverImage || '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'} 
                          alt={store.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <img 
                            src={store.logo} 
                            alt={store.name} 
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <h4 className="font-semibold">{store.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
          
          {/* Restaurant Stores */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">مطاعم</h3>
              <Button variant="ghost" asChild>
                <Link to="/category/restaurant" className="flex items-center">
                  عرض الكل
                  <ChevronRight className="mr-1 h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {restaurantStores.length === 0 ? (
                <div className="col-span-full text-center py-6">
                  <p className="text-gray-500">لا يوجد متاجر في هذا التصنيف حالياً</p>
                </div>
              ) : (
                restaurantStores.map(store => (
                  <Link key={store.id} to={`/store/${store.id}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="h-40 bg-gray-100">
                        <img 
                          src={store.coverImage || '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'} 
                          alt={store.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <img 
                            src={store.logo} 
                            alt={store.name} 
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <h4 className="font-semibold">{store.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
          
          {/* Sweets Stores */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">حلويات</h3>
              <Button variant="ghost" asChild>
                <Link to="/category/sweets" className="flex items-center">
                  عرض الكل
                  <ChevronRight className="mr-1 h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sweetsStores.length === 0 ? (
                <div className="col-span-full text-center py-6">
                  <p className="text-gray-500">لا يوجد متاجر في هذا التصنيف حالياً</p>
                </div>
              ) : (
                sweetsStores.map(store => (
                  <Link key={store.id} to={`/store/${store.id}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="h-40 bg-gray-100">
                        <img 
                          src={store.coverImage || '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'} 
                          alt={store.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <img 
                            src={store.logo} 
                            alt={store.name} 
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <h4 className="font-semibold">{store.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">كيف يعمل يلا جاي</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">اختر متجرك المفضل</h3>
              <p className="text-gray-600">تصفح المتاجر المتاحة واختر المتجر المفضل لديك</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">أضف المنتجات للسلة</h3>
              <p className="text-gray-600">اختر المنتجات التي تريدها وأضفها إلى سلة التسوق</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">استلم طلبك</h3>
              <p className="text-gray-600">أكّد الطلب وانتظر وصوله إلى باب منزلك</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png" 
                  alt="يلا جاي" 
                  className="w-10 h-10 object-contain mr-2"
                />
                <h3 className="text-xl font-bold">يلا جاي</h3>
              </div>
              <p className="mt-2 max-w-xs">منصة توصيل تربط المتاجر بالزبائن لتوصيل الطلبات بسرعة ودقة عالية</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-3">الشركة</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">عن يلا جاي</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">وظائف</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">تواصل معنا</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">المتاجر</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">بقالة وسوبرماركت</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">مطاعم</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">حلويات</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">الحساب</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">تسجيل الدخول</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">تسجيل جديد</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">المساعدة</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-sm text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} يلا جاي. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
