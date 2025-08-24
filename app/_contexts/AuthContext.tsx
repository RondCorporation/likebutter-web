'use client';

import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  shouldInitializeAuth: boolean;
}

const AuthContext = createContext<AuthContextType>({
  shouldInitializeAuth: true,
});

export function useAuthContext() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
  shouldInitializeAuth: boolean;
}

export function AuthProvider({ children, shouldInitializeAuth }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ shouldInitializeAuth }}>
      {children}
    </AuthContext.Provider>
  );
}