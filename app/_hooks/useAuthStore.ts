'use client';

// ⚠️ DEPRECATED: This file is deprecated. Use useAuth hook instead.
// This file is kept temporarily for backward compatibility but will be removed.
// 
// Migration guide:
// - Replace useAuthUser() with useAuth().user
// - Replace useAuthLoading() with useAuth().isLoading
// - Replace useIsAuthenticated() with useAuth().isAuthenticated
// - Replace useIsInitialized() with useAuth().isInitialized

import { useAuth } from './useAuth';

// Deprecated hooks - use useAuth() instead
export const useAuthUser = () => {
  console.warn('useAuthUser is deprecated. Use useAuth().user instead');
  return useAuth().user;
};

export const useAuthLoading = () => {
  console.warn('useAuthLoading is deprecated. Use useAuth().isLoading instead');
  return useAuth().isLoading;
};

export const useIsAuthenticated = () => {
  console.warn('useIsAuthenticated is deprecated. Use useAuth().isAuthenticated instead');
  return useAuth().isAuthenticated;
};

export const useIsInitialized = () => {
  console.warn('useIsInitialized is deprecated. Use useAuth().isInitialized instead');
  return useAuth().isInitialized;
};