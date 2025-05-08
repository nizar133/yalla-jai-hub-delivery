
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Boxes, Plus, Search, Settings, Share } from "lucide-react";
import { StoreSectionForm } from "@/components/forms/StoreSectionForm";
import { ProductForm } from "@/components/forms/ProductForm";
import { StoreSection, Product } from "@/types";

// بيانات زائفة للعرض
const MOCK_SECTIONS: StoreSection[] = [
  { id: "1", name: "الخضار والفواكه", coverImage: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6", storeId: "store1" },
  { id: "2", name: "المشروبات", coverImage: "https://images.unsplash.com/photo-1596803244618-8dbee47b98ef", storeId: "store1" },
];

const MOCK_PRODUCTS: Product[] = [
  { 
    id: "1", 
    name: "تفاح أخضر", 
    description: "تفاح طازج من المزارع المحلية", 
    price: 15.5, 
    images: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6"], 
    storeId: "store1", 
    sectionId: "1",
    available: true
  },
  { 
    id: "2", 
    name: "موز", 
    description: "موز طازج", 
    price: 12, 
    images: ["https://images.unsplash.com/photo-1543218024-57a70143c369"], 
    storeId: "store1", 
    sectionId: "1",
    available: true
  },
  { 
    id: "3", 
    name: "عصير برتقال", 
    description: "عصير طازج 100%", 
    price: 10, 
    images: ["https://images.unsplash.com/photo-1600271886742-f049cd451bba"], 
    storeId: "store1", 
    sectionId: "2",
    available: true
  },
];

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [sections, setSections] = useState<StoreSection[]>(MOCK_SECTIONS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingSection, setEditingSection] = useState<StoreSection | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // تصفية المنتجات بناءً على البحث والقسم
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.includes(searchTerm) || product.description.includes(searchTerm);
    const matchesSection = sectionFilter === "all" || product.sectionId === sectionFilter;
    return matchesSearch && matchesSection;
  });

  // إضافة قسم جديد
  const handleAddSection = (data: any) => {
    const newSection: StoreSection = {
      id: `section-${Date.now()}`,
      storeId: "store1",
      name: data.name,
      coverImage: data.coverImage,
    };
    setSections([...sections, newSection]);
    setShowAddSection(false);
  };

  // إضافة منتج جديد
  const handleAddProduct = (data: any) => {
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      storeId: "store1",
      name: data.name,
      description: data.description,
      price: data.price,
      images: data.images,
      sectionId: data.sectionId,
      available: data.available,
    };
    setProducts([...products, newProduct]);
    setShowAddProduct(false);
  };

  // تعديل قسم
  const handleUpdateSection = (data: any) => {
    if (!editingSection) return;
    const updatedSections = sections.map(section => 
      section.id === editingSection.id ? { ...section, ...data } : section
    );
    setSections(updatedSections);
    setEditingSection(null);
  };

  // تعديل منتج
  const handleUpdateProduct = (data: any) => {
    if (!editingProduct) return;
    const updatedProducts = products.map(product => 
      product.id === editingProduct.id ? { ...product, ...data } : product
    );
    setProducts(updatedProducts);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
        <Button onClick={() => setShowAddProduct(true)}>
          <Plus className="ml-2 h-4 w-4" /> إضافة منتج
        </Button>
      </div>

      <Tabs 
        defaultValue="products" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">المنتجات</TabsTrigger>
          <TabsTrigger value="sections">الأقسام</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                <CardTitle>المنتجات</CardTitle>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 md:space-x-reverse">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="بحث عن منتج..."
                      className="pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select 
                    value={sectionFilter} 
                    onValueChange={setSectionFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأقسام</SelectItem>
                      {sections.map(section => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{product.name}</h3>
                          <span className="font-medium text-primary">{product.price} ر.س</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {sections.find(s => s.id === product.sectionId)?.name}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.available ? 'متوفر' : 'غير متوفر'}
                          </span>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Share className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">لا توجد منتجات متطابقة مع البحث</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sections" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>أقسام المتجر</CardTitle>
                <Button onClick={() => setShowAddSection(true)}>
                  <Plus className="ml-2 h-4 w-4" /> إضافة قسم
                </Button>
              </div>
              <CardDescription>
                نظم منتجاتك في أقسام لتسهيل التصفح للعملاء
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map(section => (
                  <Card key={section.id} className="overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={section.coverImage} 
                        alt={section.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{section.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          {products.filter(p => p.sectionId === section.id).length} منتج
                        </span>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingSection(section)}
                        >
                          تعديل
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* زر إضافة قسم جديد */}
                <Card className="border border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                    <Boxes className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">إضافة قسم جديد</p>
                    <Button variant="outline" onClick={() => setShowAddSection(true)}>
                      <Plus className="ml-2 h-4 w-4" /> قسم جديد
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* نموذج إضافة قسم */}
      {showAddSection && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>إضافة قسم جديد</CardTitle>
            <CardDescription>
              أضف قسماً جديداً لتنظيم منتجاتك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StoreSectionForm 
              storeId="store1" 
              onSubmit={handleAddSection}
            />
          </CardContent>
        </Card>
      )}

      {/* نموذج تعديل قسم */}
      {editingSection && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>تعديل القسم</CardTitle>
            <CardDescription>
              تعديل بيانات قسم {editingSection.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StoreSectionForm 
              storeId="store1" 
              initialData={editingSection}
              onSubmit={handleUpdateSection}
            />
          </CardContent>
        </Card>
      )}

      {/* نموذج إضافة منتج */}
      {showAddProduct && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>إضافة منتج جديد</CardTitle>
            <CardDescription>
              أضف منتجاً جديداً إلى متجرك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm 
              storeId="store1" 
              sections={sections}
              onSubmit={handleAddProduct}
            />
          </CardContent>
        </Card>
      )}

      {/* نموذج تعديل منتج */}
      {editingProduct && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>تعديل المنتج</CardTitle>
            <CardDescription>
              تعديل بيانات منتج {editingProduct.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm 
              storeId="store1" 
              sections={sections}
              initialData={editingProduct}
              onSubmit={handleUpdateProduct}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
