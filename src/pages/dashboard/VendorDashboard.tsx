
import { useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { OrderList } from '@/components/dashboard/OrderList';
import { Package, ShoppingCart, TrendingUp, Plus, Store } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { Statistic } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';

export default function VendorDashboard() {
  const { getOrdersByRole } = useOrders();
  const { user } = useAuth();
  const { stores, addSection, getSectionsByStore } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  const orders = getOrdersByRole();
  
  // Find stores owned by this vendor
  const vendorStores = stores.filter(store => store.ownerId === user?.id);
  const storeId = vendorStores.length > 0 ? vendorStores[0].id : '';
  const sections = getSectionsByStore(storeId);
  
  const totalSales = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);
  
  const pendingOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing'].includes(order.status)
  ).length;
  
  const stats: Statistic[] = [
    {
      title: 'إجمالي المبيعات',
      value: `${totalSales.toLocaleString()} ل.س`,
      change: 12,
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
    },
    {
      title: 'طلبات جديدة',
      value: pendingOrders,
      change: 8,
      icon: <ShoppingCart className="h-5 w-5 text-primary" />,
    },
    {
      title: 'إجمالي الطلبات',
      value: orders.length,
      change: 15,
      icon: <Package className="h-5 w-5 text-primary" />,
    },
  ];

  const CategoryLabel = ({ category }: { category: string }) => {
    const categoryMap: Record<string, string> = {
      'grocery': 'بقالة وسوبرماركت',
      'restaurant': 'مطاعم',
      'sweets': 'حلويات',
      'other': 'أخرى'
    };
    return <span>{categoryMap[category] || category}</span>;
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">لوحة تحكم المتجر</h2>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="store">متجري</TabsTrigger>
          <TabsTrigger value="orders">الطلبات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
          
          {vendorStores.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Store className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-xl font-medium text-gray-900">لا يوجد متجر</h3>
                  <p className="mt-1 text-sm text-gray-500">ليس لديك متجر بعد. يرجى التواصل مع المدير لإنشاء متجر جديد.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>بيانات المتجر</CardTitle>
                </CardHeader>
                <CardContent>
                  {vendorStores.map(store => (
                    <div key={store.id} className="space-y-4">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <img 
                          src={store.logo || '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'} 
                          alt={store.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-lg">{store.name}</h3>
                          <p className="text-sm text-gray-500">{store.description}</p>
                          <p className="text-xs text-primary mt-1">
                            <CategoryLabel category={store.category} />
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-medium mb-2">العنوان</h4>
                        <p className="text-sm">{store.address}</p>
                      </div>
                      
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">الأقسام ({sections.length})</h4>
                          <Button size="sm" variant="outline">
                            <Plus className="h-4 w-4 mr-1" />
                            إضافة قسم
                          </Button>
                        </div>
                        {sections.length === 0 ? (
                          <p className="text-sm text-gray-500">لم تضف أي قسم بعد.</p>
                        ) : (
                          <div className="space-y-2">
                            {sections.map(section => (
                              <div key={section.id} className="border rounded-lg p-2 flex justify-between items-center">
                                <span>{section.name}</span>
                                <Button size="sm" variant="ghost">عرض</Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات المبيعات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium">الأداء</h3>
                      <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>التقييم:</span>
                          <span className="font-medium">{vendorStores[0]?.rating || 0}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span>طلبات هذا الشهر:</span>
                          <span className="font-medium">{orders.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>المبيعات الشهرية:</span>
                          <span className="font-medium">{totalSales.toLocaleString()} ل.س</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium">حالة الطلبات</h3>
                      <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>بانتظار التأكيد:</span>
                          <span className="font-medium">{orders.filter(o => o.status === 'pending').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>قيد التحضير:</span>
                          <span className="font-medium">{orders.filter(o => o.status === 'preparing').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>جاهزة للتوصيل:</span>
                          <span className="font-medium">{orders.filter(o => o.status === 'ready').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="store">
          {vendorStores.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">{vendorStores[0].name}</h3>
                <Button variant="outline">تعديل بيانات المتجر</Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>الأقسام</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end mb-4">
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          إضافة قسم
                        </Button>
                      </div>
                      
                      {sections.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">لم تضف أي قسم بعد</p>
                      ) : (
                        <div className="space-y-2">
                          {sections.map(section => (
                            <Card key={section.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <img 
                                  src={section.image || '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'} 
                                  alt={section.name}
                                  className="h-12 w-12 rounded-md object-cover"
                                />
                                <div>
                                  <h4 className="font-medium">{section.name}</h4>
                                  <p className="text-xs text-gray-500">{section.description}</p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>المنتجات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end mb-4">
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          إضافة منتج
                        </Button>
                      </div>
                      
                      {sections.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">أضف قسم أولاً ثم أضف المنتجات</p>
                      ) : (
                        <p className="text-center py-8 text-gray-500">اختر قسم لعرض المنتجات</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Store className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-xl font-medium text-gray-900">لا يوجد متجر</h3>
                  <p className="mt-1 text-sm text-gray-500">ليس لديك متجر بعد. يرجى التواصل مع المدير لإنشاء متجر جديد.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="orders">
          <OrderList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
