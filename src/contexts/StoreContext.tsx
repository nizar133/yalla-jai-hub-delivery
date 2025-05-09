
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Store, StoreSection, StoreCategory, Product, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface StoreContextType {
  stores: Store[];
  storeSections: Record<string, StoreSection[]>;
  storeProducts: Record<string, Product[]>;
  addStore: (store: Omit<Store, 'id'>) => string;
  updateStore: (storeId: string, data: Partial<Store>) => boolean;
  deleteStore: (storeId: string) => boolean;
  getStoresByCategory: (category: StoreCategory) => Store[];
  getStoreById: (id: string) => Store | undefined;
  addSection: (section: Omit<StoreSection, 'id'>) => string;
  updateSection: (sectionId: string, data: Partial<StoreSection>) => boolean;
  deleteSection: (sectionId: string) => boolean;
  getSectionsByStore: (storeId: string) => StoreSection[];
  getSectionById: (id: string) => StoreSection | undefined;
  addProduct: (product: Omit<Product, 'id'>) => string;
  updateProduct: (productId: string, data: Partial<Product>) => boolean;
  deleteProduct: (productId: string) => boolean;
  getProductsBySection: (sectionId: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  userCanManageStore: (userId: string, storeId: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [storeSections, setStoreSections] = useState<Record<string, StoreSection[]>>({});
  const [storeProducts, setStoreProducts] = useState<Record<string, Product[]>>({});

  useEffect(() => {
    // Load saved data from localStorage
    const savedStores = localStorage.getItem('stores');
    const savedSections = localStorage.getItem('store_sections');
    const savedProducts = localStorage.getItem('store_products');
    
    if (savedStores) {
      try {
        setStores(JSON.parse(savedStores));
      } catch (e) {
        console.error('Failed to parse stores:', e);
      }
    } else {
      // Initialize with sample stores
      const sampleStores: Store[] = [
        {
          id: 'store-1',
          name: 'سوبر ماركت الشام',
          description: 'أفضل المنتجات الغذائية والاستهلاكية',
          logo: '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png',
          ownerId: 'vendor-1',
          address: 'شارع الرئيسي، حلب',
          category: 'grocery',
          rating: 4.7
        },
        {
          id: 'store-2',
          name: 'مطعم الشرق',
          description: 'مأكولات شرقية أصيلة',
          logo: '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png',
          ownerId: 'vendor-2',
          address: 'شارع المنصور، دمشق',
          category: 'restaurant',
          rating: 4.5
        },
        {
          id: 'store-3',
          name: 'حلويات السعادة',
          description: 'أشهى الحلويات العربية',
          logo: '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png',
          ownerId: 'vendor-3',
          address: 'شارع الجلاء، حمص',
          category: 'sweets',
          rating: 4.8
        }
      ];
      setStores(sampleStores);
      localStorage.setItem('stores', JSON.stringify(sampleStores));
    }
    
    if (savedSections) {
      try {
        setStoreSections(JSON.parse(savedSections));
      } catch (e) {
        console.error('Failed to parse sections:', e);
      }
    } else {
      // Initialize with sample sections
      const sampleSections: Record<string, StoreSection[]> = {
        'store-1': [
          {
            id: 'section-1',
            storeId: 'store-1',
            name: 'خضار وفواكه',
            description: 'خضار وفواكه طازجة',
            image: '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png',
            order: 1
          },
          {
            id: 'section-2',
            storeId: 'store-1',
            name: 'مواد غذائية',
            description: 'مواد غذائية متنوعة',
            image: '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png',
            order: 2
          }
        ],
        'store-2': [
          {
            id: 'section-3',
            storeId: 'store-2',
            name: 'مشاوي',
            description: 'مشاوي شرقية',
            image: '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png',
            order: 1
          },
          {
            id: 'section-4',
            storeId: 'store-2',
            name: 'مقبلات',
            description: 'مقبلات متنوعة',
            image: '/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png',
            order: 2
          }
        ]
      };
      setStoreSections(sampleSections);
      localStorage.setItem('store_sections', JSON.stringify(sampleSections));
    }
    
    if (savedProducts) {
      try {
        setStoreProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error('Failed to parse products:', e);
      }
    } else {
      // Initialize with sample products
      const sampleProducts: Record<string, Product[]> = {
        'store-1': [
          {
            id: 'product-1',
            storeId: 'store-1',
            sectionId: 'section-1',
            name: 'تفاح أحمر',
            description: 'تفاح أحمر طازج',
            price: 5000,
            currencyType: 'SYP',
            images: ['/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'],
            available: true
          },
          {
            id: 'product-2',
            storeId: 'store-1',
            sectionId: 'section-1',
            name: 'موز',
            description: 'موز طازج',
            price: 7000,
            currencyType: 'SYP',
            images: ['/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'],
            available: true
          },
          {
            id: 'product-3',
            storeId: 'store-1',
            sectionId: 'section-2',
            name: 'أرز',
            description: 'أرز ممتاز',
            price: 15000,
            currencyType: 'SYP',
            images: ['/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'],
            available: true
          }
        ],
        'store-2': [
          {
            id: 'product-4',
            storeId: 'store-2',
            sectionId: 'section-3',
            name: 'شيش طاووق',
            description: 'شيش طاووق على الفحم',
            price: 35000,
            currencyType: 'SYP',
            images: ['/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'],
            available: true
          },
          {
            id: 'product-5',
            storeId: 'store-2',
            sectionId: 'section-4',
            name: 'حمص',
            description: 'حمص بالطحينة',
            price: 20000,
            currencyType: 'SYP',
            images: ['/lovable-uploads/8e1d21d7-1b51-4628-a022-e7616bd803e4.png'],
            available: true
          }
        ]
      };
      setStoreProducts(sampleProducts);
      localStorage.setItem('store_products', JSON.stringify(sampleProducts));
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (stores.length > 0) {
      localStorage.setItem('stores', JSON.stringify(stores));
    }
  }, [stores]);

  useEffect(() => {
    if (Object.keys(storeSections).length > 0) {
      localStorage.setItem('store_sections', JSON.stringify(storeSections));
    }
  }, [storeSections]);

  useEffect(() => {
    if (Object.keys(storeProducts).length > 0) {
      localStorage.setItem('store_products', JSON.stringify(storeProducts));
    }
  }, [storeProducts]);

  // Store operations
  const addStore = (storeData: Omit<Store, 'id'>): string => {
    const newStore: Store = {
      ...storeData,
      id: `store-${Date.now()}`
    };
    setStores(prev => [...prev, newStore]);
    toast({
      title: "تمت الإضافة",
      description: `تم إضافة المتجر ${newStore.name} بنجاح`
    });
    return newStore.id;
  };

  const updateStore = (storeId: string, data: Partial<Store>): boolean => {
    const storeIndex = stores.findIndex(s => s.id === storeId);
    if (storeIndex === -1) return false;

    const updatedStore = { ...stores[storeIndex], ...data };
    const newStores = [...stores];
    newStores[storeIndex] = updatedStore;
    
    setStores(newStores);
    toast({
      title: "تم التحديث",
      description: `تم تحديث بيانات المتجر ${updatedStore.name} بنجاح`
    });
    return true;
  };

  const deleteStore = (storeId: string): boolean => {
    const storeIndex = stores.findIndex(s => s.id === storeId);
    if (storeIndex === -1) return false;

    const storeName = stores[storeIndex].name;
    const newStores = stores.filter(s => s.id !== storeId);
    setStores(newStores);
    
    // Also delete related sections and products
    const newStoreSections = { ...storeSections };
    delete newStoreSections[storeId];
    setStoreSections(newStoreSections);
    
    const newStoreProducts = { ...storeProducts };
    delete newStoreProducts[storeId];
    setStoreProducts(newStoreProducts);
    
    toast({
      title: "تم الحذف",
      description: `تم حذف المتجر ${storeName} بنجاح`
    });
    return true;
  };

  const getStoresByCategory = (category: StoreCategory): Store[] => {
    return stores.filter(s => s.category === category);
  };

  const getStoreById = (id: string): Store | undefined => {
    return stores.find(s => s.id === id);
  };

  // Section operations
  const addSection = (sectionData: Omit<StoreSection, 'id'>): string => {
    const { storeId } = sectionData;
    const newSection: StoreSection = {
      ...sectionData,
      id: `section-${Date.now()}`
    };
    
    setStoreSections(prev => {
      const storeSectionsList = prev[storeId] || [];
      return {
        ...prev,
        [storeId]: [...storeSectionsList, newSection]
      };
    });
    
    toast({
      title: "تمت الإضافة",
      description: `تم إضافة القسم ${newSection.name} بنجاح`
    });
    return newSection.id;
  };

  const updateSection = (sectionId: string, data: Partial<StoreSection>): boolean => {
    let updated = false;
    
    setStoreSections(prev => {
      const newSections = { ...prev };
      
      for (const storeId in newSections) {
        const sectionIndex = newSections[storeId].findIndex(s => s.id === sectionId);
        if (sectionIndex !== -1) {
          const updatedSection = { ...newSections[storeId][sectionIndex], ...data };
          newSections[storeId] = [...newSections[storeId]];
          newSections[storeId][sectionIndex] = updatedSection;
          updated = true;
          
          toast({
            title: "تم التحديث",
            description: `تم تحديث بيانات القسم ${updatedSection.name} بنجاح`
          });
          break;
        }
      }
      
      return newSections;
    });
    
    return updated;
  };

  const deleteSection = (sectionId: string): boolean => {
    let deleted = false;
    let deletedSectionName = '';
    
    setStoreSections(prev => {
      const newSections = { ...prev };
      
      for (const storeId in newSections) {
        const sectionIndex = newSections[storeId].findIndex(s => s.id === sectionId);
        if (sectionIndex !== -1) {
          deletedSectionName = newSections[storeId][sectionIndex].name;
          newSections[storeId] = newSections[storeId].filter(s => s.id !== sectionId);
          deleted = true;
          break;
        }
      }
      
      return newSections;
    });
    
    // Also delete related products
    if (deleted) {
      setStoreProducts(prev => {
        const newProducts = { ...prev };
        
        for (const storeId in newProducts) {
          newProducts[storeId] = newProducts[storeId].filter(p => p.sectionId !== sectionId);
        }
        
        return newProducts;
      });
      
      toast({
        title: "تم الحذف",
        description: `تم حذف القسم ${deletedSectionName} بنجاح`
      });
    }
    
    return deleted;
  };

  const getSectionsByStore = (storeId: string): StoreSection[] => {
    return storeSections[storeId] || [];
  };

  const getSectionById = (id: string): StoreSection | undefined => {
    for (const storeId in storeSections) {
      const found = storeSections[storeId].find(s => s.id === id);
      if (found) return found;
    }
    return undefined;
  };

  // Product operations
  const addProduct = (productData: Omit<Product, 'id'>): string => {
    const { storeId } = productData;
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}`
    };
    
    setStoreProducts(prev => {
      const storeProductsList = prev[storeId] || [];
      return {
        ...prev,
        [storeId]: [...storeProductsList, newProduct]
      };
    });
    
    toast({
      title: "تمت الإضافة",
      description: `تم إضافة المنتج ${newProduct.name} بنجاح`
    });
    return newProduct.id;
  };

  const updateProduct = (productId: string, data: Partial<Product>): boolean => {
    let updated = false;
    
    setStoreProducts(prev => {
      const newProducts = { ...prev };
      
      for (const storeId in newProducts) {
        const productIndex = newProducts[storeId].findIndex(p => p.id === productId);
        if (productIndex !== -1) {
          const updatedProduct = { ...newProducts[storeId][productIndex], ...data };
          newProducts[storeId] = [...newProducts[storeId]];
          newProducts[storeId][productIndex] = updatedProduct;
          updated = true;
          
          toast({
            title: "تم التحديث",
            description: `تم تحديث بيانات المنتج ${updatedProduct.name} بنجاح`
          });
          break;
        }
      }
      
      return newProducts;
    });
    
    return updated;
  };

  const deleteProduct = (productId: string): boolean => {
    let deleted = false;
    let deletedProductName = '';
    
    setStoreProducts(prev => {
      const newProducts = { ...prev };
      
      for (const storeId in newProducts) {
        const productIndex = newProducts[storeId].findIndex(p => p.id === productId);
        if (productIndex !== -1) {
          deletedProductName = newProducts[storeId][productIndex].name;
          newProducts[storeId] = newProducts[storeId].filter(p => p.id !== productId);
          deleted = true;
          break;
        }
      }
      
      return newProducts;
    });
    
    if (deleted) {
      toast({
        title: "تم الحذف",
        description: `تم حذف المنتج ${deletedProductName} بنجاح`
      });
    }
    
    return deleted;
  };

  const getProductsBySection = (sectionId: string): Product[] => {
    const result: Product[] = [];
    
    for (const storeId in storeProducts) {
      const found = storeProducts[storeId].filter(p => p.sectionId === sectionId);
      if (found.length > 0) {
        result.push(...found);
      }
    }
    
    return result;
  };

  const getProductById = (id: string): Product | undefined => {
    for (const storeId in storeProducts) {
      const found = storeProducts[storeId].find(p => p.id === id);
      if (found) return found;
    }
    return undefined;
  };

  // Check if user can manage store
  const userCanManageStore = (userId: string, storeId: string): boolean => {
    if (!user) return false;
    
    // Admin can manage all stores
    if (user.role === 'admin') return true;
    
    // Staff with manage_stores permission can manage all stores
    if (user.role === 'staff' && user.permissions?.includes('manage_stores')) return true;
    
    // Store owner can manage their own store
    const store = getStoreById(storeId);
    return store?.ownerId === userId;
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        storeSections,
        storeProducts,
        addStore,
        updateStore,
        deleteStore,
        getStoresByCategory,
        getStoreById,
        addSection,
        updateSection,
        deleteSection,
        getSectionsByStore,
        getSectionById,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsBySection,
        getProductById,
        userCanManageStore
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
