'use client';

import { useAuthStore } from '@/stores/authStore';

// Simplified useAuth hook for state access only
// Route-based authentication is handled by specific layout guards
export function useAuth() {
  const { user, isInitialized, isLoading } = useAuthStore();
  
  return { 
    user, 
    isLoading: !isInitialized || isLoading,
    isAuthenticated: !!user && isInitialized
  };
}
