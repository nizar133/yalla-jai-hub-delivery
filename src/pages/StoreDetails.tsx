
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ShoppingCart,
  Package,
} from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StoreDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStoreById, getSectionsByStore, getProductsBySection } = useStore();
  const { convertToSYP } = useCurrency();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  const store = getStoreById(id || '');
  
  if (!store) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-xl font-medium text-gray-900">المتجر غير موجود</h3>
        <p className="mt-1 text-sm text-gray-500">المتجر الذي تبحث عنه غير موجود أو تم حذفه</p>
        <Button onClick={() => navigate(-1)} className="mt-6">العودة للخلف</Button>
      </div>
    );
  }
  
  const sections = getSectionsByStore(store.id);
  
  // Set first section as active if none selected
  if (!activeTab && sections.length > 0) {
    setActiveTab(sections[0].id);
  }
  
  const activeSection = sections.find(s => s.id === activeTab);
  const products = activeSection ? getProductsBySection(activeSection.id) : [];

  // Category name mapping in Arabic
  const categoryNames: Record<string, string> = {
    'grocery': 'بقالة وسوبرماركت',
    'restaurant': 'مطاعم',
    'sweets': 'حلويات',
    'other': 'أخرى'
  };
  
  return (
    <div>
      {/* Store Hero Section */}
      <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6 bg-gray-100">
        {store.coverImage ? (
          <img 
            src={store.coverImage} 
            alt={store.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/20 to-primary/5">
            <Package className="h-16 w-16 text-primary/30" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <img
              src={store.logo}
              alt={store.name}
              className="h-16 w-16 rounded-lg object-cover border-2 border-white shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{store.name}</h1>
              <div className="flex items-center mt-1 text-white/80">
                <span>{categoryNames[store.category] || store.category}</span>
                {store.rating && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">⭐ {store.rating}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto bg-white/90 rounded-full p-2"
          aria-label="العودة"
        >
          <ChevronRight className="h-5 w-5 rtl:rotate-180" />
        </button>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">الوصف</h2>
        <p className="text-gray-700">{store.description}</p>
        <p className="text-gray-500 text-sm mt-2">{store.address}</p>
      </div>
      
      {/* Sections & Products */}
      <div className="mb-6">
        {sections.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">لا يوجد أقسام</h3>
            <p className="mt-2 text-sm text-gray-500">المتجر لم يضف أي أقسام أو منتجات بعد</p>
          </div>
        ) : (
          <Tabs value={activeTab || ''} onValueChange={setActiveTab}>
            <TabsList className="mb-6 w-full overflow-x-auto flex flex-nowrap justify-start">
              {sections.map(section => (
                <TabsTrigger key={section.id} value={section.id} className="whitespace-nowrap">
                  {section.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {sections.map(section => (
              <TabsContent key={section.id} value={section.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getProductsBySection(section.id).length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">لا يوجد منتجات</h3>
                      <p className="mt-2 text-sm text-gray-500">هذا القسم لا يحتوي على منتجات بعد</p>
                    </div>
                  ) : (
                    getProductsBySection(section.id).map(product => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-square w-full relative">
                          <img 
                            src={product.images[0] || '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {!product.available && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-medium px-3 py-1 bg-red-500 rounded-full">
                                غير متوفر
                              </span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                {product.currencyType === 'USD' 
                                  ? convertToSYP(product.price, 'USD').toLocaleString()
                                  : product.price.toLocaleString()} ل.س
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Button className="w-full" disabled={!product.available}>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              أضف إلى السلة
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
