'use client';

import { useAuthStore } from '@/app/_stores/authStore';

/**
 * 인증 관련 편의 훅
 * 단순하고 신뢰할 수 있는 authStore 기반
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, isInitialized, hasTokenFromServer } = useAuthStore();

  const userId = user?.accountId?.toString();
  const userEmail = user?.email;
  const userRoles = user?.roles ? user.roles.split(',') : [];

  const isAdmin = userRoles.includes('ROLE_ADMIN');

  const displayName = user?.name || userEmail || '';

  return {
    isAuthenticated,
    isLoading,
    isInitialized,
    hasTokenFromServer,

    userId,
    userEmail,
    userRoles,
    isAdmin,
    displayName,

    user,

    hasBasicInfo: !!user,
    hasFullInfo: !!user,
  };
}
