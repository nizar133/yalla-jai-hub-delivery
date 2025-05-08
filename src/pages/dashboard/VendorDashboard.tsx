
import { StatCard } from '@/components/dashboard/StatCard';
import { OrderList } from '@/components/dashboard/OrderList';
import { Package, ShoppingCart, TrendingUp, Store, Boxes } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { Statistic } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreForm } from '@/components/forms/StoreForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VendorDashboard() {
  const { getOrdersByRole } = useOrders();
  const orders = getOrdersByRole();
  const navigate = useNavigate();
  
  // زائفة: البيانات الإحصائية
  const totalSales = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);
  
  const pendingOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing'].includes(order.status)
  ).length;

  // زائفة: بيانات المتجر
  const [storeExists, setStoreExists] = useState(false);
  
  const stats: Statistic[] = [
    {
      title: 'إجمالي المبيعات',
      value: `${totalSales} ر.س`,
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

  // معالج مؤقت لإنشاء متجر
  const handleCreateStore = (data: any) => {
    console.log("تم إنشاء المتجر:", data);
    setStoreExists(true);
    // في التطبيق الحقيقي: سنقوم بإرسال البيانات إلى الخادم
  };

  // معالج مؤقت للانتقال إلى صفحة إدارة المنتجات
  const handleManageProducts = () => {
    navigate('/vendor/products');
    // في التطبيق الحقيقي: سننتقل إلى صفحة إدارة المنتجات
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">لوحة تحكم المتجر</h2>
      
      <Tabs defaultValue={storeExists ? "dashboard" : "store"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">نظرة عامة</TabsTrigger>
          <TabsTrigger value="store">إدارة المتجر</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          {storeExists ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <StatCard key={index} stat={stat} />
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OrderList />
                
                <Card>
                  <CardHeader>
                    <CardTitle>إدارة متجرك</CardTitle>
                    <CardDescription>
                      قم بإدارة منتجاتك وأقسام متجرك بسهولة
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">المنتجات والأقسام</h3>
                        <p className="text-sm text-muted-foreground">
                          أضف وعدل منتجاتك وأقسام المتجر
                        </p>
                      </div>
                      <Button onClick={handleManageProducts}>
                        <Store className="h-4 w-4 ml-2" /> إدارة المنتجات
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">معلومات المتجر</h3>
                        <p className="text-sm text-muted-foreground">
                          تعديل معلومات متجرك الأساسية
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => {}}>
                        تعديل المتجر
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>أنشئ متجرك الآن</CardTitle>
                <CardDescription>
                  لم تقم بإنشاء متجر بعد. أنشئ متجرك الآن للبدء في بيع منتجاتك.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Store className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">متجرك الخاص</h3>
                  <p className="text-muted-foreground mb-4">
                    قم بإنشاء متجرك وإضافة منتجاتك للبدء في استقبال الطلبات
                  </p>
                  <Button 
                    onClick={() => {}}
                    variant="default"
                    className="w-full sm:w-auto"
                  >
                    إنشاء متجر جديد
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{storeExists ? 'تحديث بيانات المتجر' : 'إنشاء متجر جديد'}</CardTitle>
              <CardDescription>
                {storeExists 
                  ? 'يمكنك تعديل بيانات متجرك الأساسية من هنا' 
                  : 'قم بملء البيانات التالية لإنشاء متجرك الخاص'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StoreForm 
                initialData={storeExists ? {
                  name: "متجر نموذجي",
                  description: "هذا وصف مختصر للمتجر النموذجي وخدماته",
                  address: "الرياض، حي النخيل",
                  category: "grocery",
                } : undefined}
                onSubmit={handleCreateStore}
              />
            </CardContent>
          </Card>
          
          {storeExists && (
            <Card>
              <CardHeader>
                <CardTitle>أقسام المتجر</CardTitle>
                <CardDescription>
                  أضف أقساماً لتنظيم منتجاتك وتسهيل التصفح
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* زائفة: عرض أقسام المتجر */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">الخضار والفواكه</h3>
                    <p className="text-sm text-muted-foreground mt-1">24 منتج</p>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">تعديل</Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">المشروبات</h3>
                    <p className="text-sm text-muted-foreground mt-1">12 منتج</p>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">تعديل</Button>
                    </div>
                  </div>
                  
                  {/* زر إضافة قسم جديد */}
                  <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center">
                    <Boxes className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">إضافة قسم جديد</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-4 w-4 ml-2" /> قسم جديد
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleManageProducts}
                  className="w-full"
                >
                  إدارة المنتجات والأقسام
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
