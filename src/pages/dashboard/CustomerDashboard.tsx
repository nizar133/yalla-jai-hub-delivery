
import { useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { OrderList } from '@/components/dashboard/OrderList';
import { Package, ShoppingCart, Store } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { Statistic, StoreCategory } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/contexts/StoreContext';

export default function CustomerDashboard() {
  const { getOrdersByRole } = useOrders();
  const orders = getOrdersByRole();
  const { stores } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | 'all'>('all');

  const stats: Statistic[] = [
    {
      title: 'إجمالي الطلبات',
      value: orders.length,
      change: 5,
      icon: <Package className="h-5 w-5 text-primary" />,
    },
    {
      title: 'طلبات قيد التوصيل',
      value: orders.filter(order => 
        ['confirmed', 'preparing', 'ready', 'pickup', 'delivering'].includes(order.status)
      ).length,
      icon: <ShoppingCart className="h-5 w-5 text-primary" />,
    },
    {
      title: 'المتاجر المفضلة',
      value: 3,
      icon: <Store className="h-5 w-5 text-primary" />,
    },
  ];

  // Filter stores by category
  const filteredStores = selectedCategory === 'all' 
    ? stores
    : stores.filter(store => store.category === selectedCategory);

  // Category name mapping in Arabic
  const categoryNames: Record<StoreCategory | 'all', string> = {
    'all': 'الكل',
    'grocery': 'بقالة وسوبرماركت',
    'restaurant': 'مطاعم',
    'sweets': 'حلويات',
    'other': 'أخرى'
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">لوحة التحكم</h2>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="stores">المتاجر</TabsTrigger>
          <TabsTrigger value="orders">طلباتي</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">المتاجر حسب التصنيف</h3>
                  <div className="space-y-2">
                    {(Object.keys(categoryNames) as Array<keyof typeof categoryNames>).map(category => (
                      <div key={category} className="flex justify-between items-center p-2 border rounded-md">
                        <span>{categoryNames[category]}</span>
                        <span className="bg-secondary-light rounded-full px-2 py-0.5 text-sm">
                          {category === 'all' ? stores.length : stores.filter(s => s.category === category).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">الطلبات الأخيرة</h3>
                  {orders.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">لا يوجد طلبات سابقة</p>
                  ) : (
                    <div className="space-y-2">
                      {orders.slice(0, 3).map(order => (
                        <div key={order.id} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{order.storeName}</p>
                            <p className="text-sm text-gray-500">
                              {new Intl.DateTimeFormat('ar-SY', { dateStyle: 'medium' }).format(new Date(order.createdAt))}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{order.total.toLocaleString()} ل.س</p>
                            <p className="text-sm text-primary">
                              {order.status === 'pending' && 'قيد الانتظار'}
                              {order.status === 'confirmed' && 'تم التأكيد'}
                              {order.status === 'preparing' && 'قيد التحضير'}
                              {order.status === 'ready' && 'جاهز للاستلام'}
                              {order.status === 'pickup' && 'تم الاستلام'}
                              {order.status === 'delivering' && 'قيد التوصيل'}
                              {order.status === 'delivered' && 'تم التوصيل'}
                              {order.status === 'cancelled' && 'ملغي'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stores">
          <div className="space-y-6">
            <div className="flex overflow-x-auto pb-2 gap-2">
              <button
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary-light hover:bg-secondary-light/80'
                }`}
                onClick={() => setSelectedCategory('all')}
              >
                الكل
              </button>
              <button
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === 'grocery' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary-light hover:bg-secondary-light/80'
                }`}
                onClick={() => setSelectedCategory('grocery')}
              >
                بقالة وسوبرماركت
              </button>
              <button
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === 'restaurant' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary-light hover:bg-secondary-light/80'
                }`}
                onClick={() => setSelectedCategory('restaurant')}
              >
                مطاعم
              </button>
              <button
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === 'sweets' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary-light hover:bg-secondary-light/80'
                }`}
                onClick={() => setSelectedCategory('sweets')}
              >
                حلويات
              </button>
              <button
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === 'other' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary-light hover:bg-secondary-light/80'
                }`}
                onClick={() => setSelectedCategory('other')}
              >
                أخرى
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Store className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-xl font-medium text-gray-900">لا يوجد متاجر</h3>
                  <p className="mt-1 text-sm text-gray-500">لا يوجد متاجر في هذا التصنيف حالياً</p>
                </div>
              ) : (
                filteredStores.map(store => (
                  <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video w-full relative">
                      <img 
                        src={store.coverImage || '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'} 
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="flex items-center">
                          <img 
                            src={store.logo || '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'} 
                            alt={store.name}
                            className="h-12 w-12 rounded-full object-cover border-2 border-white"
                          />
                          <div className="ml-3 rtl:mr-3 rtl:ml-0">
                            <h3 className="text-white font-medium">{store.name}</h3>
                            <div className="flex items-center text-white/80 text-sm">
                              {store.rating && (
                                <span className="flex items-center">
                                  ⭐ {store.rating}
                                </span>
                              )}
                              <span className="mx-2">•</span>
                              <span>{categoryNames[store.category as StoreCategory]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{store.address}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <OrderList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
