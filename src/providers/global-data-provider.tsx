'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { GlobalData } from '@/utils/fetchGlobalData';

interface GlobalDataContextType {
  globalData: GlobalData;
  isLoading: boolean;
}

const GlobalDataContext = createContext<GlobalDataContextType>({
  globalData: {},
  isLoading: true,
});

export const useGlobalData = () => {
  const context = useContext(GlobalDataContext);
  if (!context) {
    throw new Error('useGlobalData must be used within a GlobalDataProvider');
  }
  return context;
};

interface GlobalDataProviderProps {
  children: React.ReactNode;
  initialData?: GlobalData;
}

export const GlobalDataProvider: React.FC<GlobalDataProviderProps> = ({
  children,
  initialData = {},
}) => {
  const [globalData, setGlobalData] = useState<GlobalData>(initialData);
  const [isLoading, setIsLoading] = useState(!Object.keys(initialData).length);

  useEffect(() => {
    // If we have initial data, we don't need to fetch again
    if (Object.keys(initialData).length > 0) {
      setIsLoading(false);
      return;
    }

    // Client-side fetch for fallback (only if no initial data)
    const fetchData = async () => {
      try {
        const response = await fetch('/api/global-data');
        if (response.ok) {
          const data = await response.json();
          setGlobalData(data);
        }
      } catch (error) {
        console.error('Error fetching global data on client:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialData]);

  return (
    <GlobalDataContext.Provider value={{ globalData, isLoading }}>
      {children}
    </GlobalDataContext.Provider>
  );
};
