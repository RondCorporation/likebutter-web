'use client';

import { createContext, useContext, MutableRefObject, useRef, ReactNode } from 'react';

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

export const ScrollContextProvider = ({ children }: { children: ReactNode }) => {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  return (
    <ScrollContext.Provider value={{ sectionRefs }}>
      {children}
    </ScrollContext.Provider>
  );
};
