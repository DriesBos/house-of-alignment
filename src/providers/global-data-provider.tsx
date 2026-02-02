'use client';

import React, { createContext, useContext } from 'react';
import { GlobalData } from '@/utils/fetchGlobalData';

interface GlobalDataContextType {
  globalData: GlobalData;
}

const GlobalDataContext = createContext<GlobalDataContextType>({
  globalData: {},
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
  return (
    <GlobalDataContext.Provider value={{ globalData: initialData }}>
      {children}
    </GlobalDataContext.Provider>
  );
};
