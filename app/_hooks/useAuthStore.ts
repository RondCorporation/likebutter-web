'use client';

import { useAuthStore } from '@/stores/authStore';

// 개별 상태를 위한 선택자들
export const useAuthUser = () => useAuthStore(state => state.user);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useIsInitialized = () => useAuthStore(state => state.isInitialized);
export const useAuthActions = () => useAuthStore(state => ({
  setUser: state.setUser,
  setLoading: state.setLoading,
  login: state.login,
  logout: state.logout,
  initialize: state.initialize,
  hydrate: state.hydrate,
}));