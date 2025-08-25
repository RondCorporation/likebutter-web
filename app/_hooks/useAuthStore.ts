'use client';

import { useAuthStore } from '@/stores/authStore';

// 개별 상태를 위한 선택자들
export const useAuthUser = () => useAuthStore(state => state.user);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useIsInitialized = () => useAuthStore(state => state.isInitialized);

// 개별 액션 훅들 - 각각을 분리하여 안정적인 참조 유지
export const useSetUser = () => useAuthStore(state => state.setUser);
export const useSetLoading = () => useAuthStore(state => state.setLoading);
export const useAuthLogin = () => useAuthStore(state => state.login);
export const useAuthLogout = () => useAuthStore(state => state.logout);
export const useAuthInitialize = () => useAuthStore(state => state.initialize);
export const useAuthHydrate = () => useAuthStore(state => state.hydrate);