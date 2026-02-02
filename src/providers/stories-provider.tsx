'use client';

import React, { createContext, useContext } from 'react';
import { ISbStoryData } from '@storyblok/react/rsc';

interface StoriesContextType {
  stories: ISbStoryData[];
}

const StoriesContext = createContext<StoriesContextType>({ stories: [] });

export const useStories = () => useContext(StoriesContext);

export const StoriesProvider: React.FC<{
  children: React.ReactNode;
  stories: ISbStoryData[];
}> = ({ children, stories }) => {
  return (
    <StoriesContext.Provider value={{ stories }}>
      {children}
    </StoriesContext.Provider>
  );
};
