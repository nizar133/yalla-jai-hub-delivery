
import React, { createContext, useContext, useEffect, useState } from 'react';

type Direction = 'rtl' | 'ltr';

interface DirectionContextType {
  direction: Direction;
  toggleDirection: () => void;
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export const useDirection = () => {
  const context = useContext(DirectionContext);
  if (context === undefined) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
};

export const DirectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [direction, setDirection] = useState<Direction>('rtl'); // Default to RTL for Arabic

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = direction === 'rtl' ? 'ar' : 'en';
  }, [direction]);

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'rtl' ? 'ltr' : 'rtl'));
  };

  return (
    <DirectionContext.Provider value={{ direction, toggleDirection }}>
      {children}
    </DirectionContext.Provider>
  );
};
