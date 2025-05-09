
import React, { createContext, useState, useContext, useEffect } from 'react';
import { CurrencyRate, CurrencyType } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface CurrencyContextType {
  currentRate: number;
  lastUpdated: Date | null;
  updateRate: (newRate: number) => boolean;
  convertToSYP: (amount: number, currency: CurrencyType) => number;
  canUpdateRate: boolean;
  rateHistory: CurrencyRate[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRate, setCurrentRate] = useState<number>(6500); // Default USD to SYP rate
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [rateHistory, setRateHistory] = useState<CurrencyRate[]>([]);

  useEffect(() => {
    // Load saved rate from localStorage
    const savedRate = localStorage.getItem('currency_rate');
    const savedTimestamp = localStorage.getItem('currency_rate_updated');
    const savedHistory = localStorage.getItem('currency_rate_history');
    
    if (savedRate) {
      setCurrentRate(parseFloat(savedRate));
    }
    
    if (savedTimestamp) {
      setLastUpdated(new Date(savedTimestamp));
    }
    
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        // Convert string dates to Date objects
        const parsedHistory = history.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }));
        setRateHistory(parsedHistory);
      } catch (e) {
        console.error('Failed to parse rate history:', e);
      }
    }
  }, []);

  // Check if rate can be updated (2 hours must have passed)
  const canUpdateRate = () => {
    if (!lastUpdated) return true;
    const now = new Date();
    const diffHours = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    return diffHours >= 2;
  };

  const updateRate = (newRate: number): boolean => {
    // Validate the rate
    if (newRate <= 0) {
      toast({
        title: "خطأ",
        description: "سعر الصرف يجب أن يكون أكبر من الصفر",
        variant: "destructive"
      });
      return false;
    }

    // Check if enough time has passed
    if (!canUpdateRate()) {
      toast({
        title: "غير مسموح",
        description: "يجب أن يمضي ساعتين على الأقل قبل تحديث سعر الصرف مرة أخرى",
        variant: "destructive"
      });
      return false;
    }

    // Update the rate
    const now = new Date();
    setCurrentRate(newRate);
    setLastUpdated(now);
    
    // Add to history
    const newRateEntry: CurrencyRate = {
      id: `rate-${Date.now()}`,
      rate: newRate,
      createdAt: now
    };
    
    const updatedHistory = [...rateHistory, newRateEntry];
    setRateHistory(updatedHistory);
    
    // Save to localStorage
    localStorage.setItem('currency_rate', newRate.toString());
    localStorage.setItem('currency_rate_updated', now.toISOString());
    localStorage.setItem('currency_rate_history', JSON.stringify(updatedHistory));
    
    toast({
      title: "تم التحديث",
      description: `تم تحديث سعر صرف الدولار إلى ${newRate} ل.س`
    });
    
    return true;
  };

  const convertToSYP = (amount: number, currency: CurrencyType): number => {
    if (currency === 'SYP') return amount;
    return amount * currentRate;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentRate,
        lastUpdated,
        updateRate,
        convertToSYP,
        canUpdateRate: canUpdateRate(),
        rateHistory
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
