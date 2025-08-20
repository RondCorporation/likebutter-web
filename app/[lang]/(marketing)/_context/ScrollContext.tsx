'use client';

import { createContext, useContext, MutableRefObject } from 'react';

interface ScrollContextType {
  sectionRefs: MutableRefObject<(HTMLElement | null)[]>;
}

export const ScrollContext = createContext<ScrollContextType | null>(null);

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error(
      'useScrollContext must be used within a ScrollContextProvider'
    );
  }
  return context;
};
