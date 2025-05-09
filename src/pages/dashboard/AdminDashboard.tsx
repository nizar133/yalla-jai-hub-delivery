
import { useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { OrderList } from '@/components/dashboard/OrderList';
import { Package, Store, Truck, Users, DollarSign } from 'lucide-react';
import { Statistic, StoreCategory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCurrency } from '@/contexts/CurrencyContext';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useStore } from '@/contexts/StoreContext';

export default function AdminDashboard() {
  const { currentRate, updateRate, lastUpdated, canUpdateRate, rateHistory } = useCurrency();
  const { stores } = useStore();
  const [newRate, setNewRate] = useState<string>(currentRate.toString());
  const [activeTab, setActiveTab] = useState('overview');

  const handleUpdateRate = () => {
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate <= 0) {
      return;
    }
    
    if (updateRate(rate)) {
      setNewRate(rate.toString());
    }
  };

  const storeCounts: Record<StoreCategory, number> = {
    grocery: stores.filter(s => s.category === 'grocery').length,
    restaurant: stores.filter(s => s.category === 'restaurant').length,
    sweets: stores.filter(s => s.category === 'sweets').length,
    other: stores.filter(s => s.category === 'other').length
  };

  const stats: Statistic[] = [
    {
      title: 'إجمالي المستخدمين',
      value: 245,
      change: 10,
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      title: 'المتاجر النشطة',
      value: stores.length,
      change: 5,
      icon: <Store className="h-5 w-5 text-primary" />,
    },
    {
      title: 'إجمالي الطلبات',
      value: 324,
      change: 15,
      icon: <Package className="h-5 w-5 text-primary" />,
    },
    {
      title: 'سائقي التوصيل',
      value: 32,
      change: 8,
      icon: <Truck className="h-5 w-5 text-primary" />,
    },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">لوحة تحكم المدير</h2>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="currency">إدارة العملة</TabsTrigger>
          <TabsTrigger value="orders">الطلبات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ملخص المتاجر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <p className="text-sm font-medium">بقالة وسوبرماركت</p>
                      <p className="text-2xl font-bold mt-1">{storeCounts.grocery}</p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-sm font-medium">مطاعم</p>
                      <p className="text-2xl font-bold mt-1">{storeCounts.restaurant}</p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-sm font-medium">حلويات</p>
                      <p className="text-2xl font-bold mt-1">{storeCounts.sweets}</p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-sm font-medium">أخرى</p>
                      <p className="text-2xl font-bold mt-1">{storeCounts.other}</p>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>ملخص النظام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">المستخدمين</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>زبائن:</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span>أصحاب متاجر:</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span>سائقين:</span>
                        <span className="font-medium">32</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مدراء:</span>
                        <span className="font-medium">3</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">إحصائيات اليوم</h3>
                    <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>طلبات جديدة:</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span>طلبات مكتملة:</span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="flex justify-between">
                        <span>إجمالي المبيعات:</span>
                        <span className="font-medium">2,450,000 ل.س</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="currency">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>سعر صرف العملة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">السعر الحالي</p>
                      <div className="flex items-center mt-1">
                        <DollarSign className="h-5 w-5 text-primary mr-1" />
                        <span className="text-2xl font-bold">1 = {currentRate} ل.س</span>
                      </div>
                      {lastUpdated && (
                        <p className="text-xs text-gray-500 mt-1">
                          آخر تحديث: {format(lastUpdated, 'PPpp', { locale: ar })}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Input
                          type="number"
                          value={newRate}
                          onChange={(e) => setNewRate(e.target.value)}
                          placeholder="سعر صرف جديد"
                          className="w-32 text-right"
                          min="1"
                        />
                        <Button 
                          onClick={handleUpdateRate} 
                          disabled={!canUpdateRate}
                        >
                          تحديث
                        </Button>
                      </div>
                      {!canUpdateRate && (
                        <p className="text-xs text-red-500">
                          يجب الإنتظار ساعتين من آخر تحديث
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>تاريخ أسعار الصرف</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {rateHistory.length === 0 ? (
                    <p className="text-gray-500">لا يوجد سجل تاريخي بعد</p>
                  ) : (
                    rateHistory
                      .slice()
                      .reverse()
                      .slice(0, 10)
                      .map((entry) => (
                        <div key={entry.id} className="flex justify-between border-b py-2">
                          <span className="text-sm">
                            {format(entry.createdAt, 'PPpp', { locale: ar })}
                          </span>
                          <span className="font-medium">{entry.rate} ل.س</span>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <OrderList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
