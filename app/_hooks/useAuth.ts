'use client';

import { useAuthStore } from '@/app/_stores/authStore';

/**
 * 인증 관련 편의 훅
 * 단순하고 신뢰할 수 있는 authStore 기반
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
  } = useAuthStore();

  // 사용자 정보는 user 객체에서만 가져옴
  const userId = user?.accountId?.toString();
  const userEmail = user?.email;
  const userRoles = user?.roles ? user.roles.split(',') : [];

  // 관리자 권한 확인
  const isAdmin = userRoles.includes('ROLE_ADMIN');

  // 사용자 표시명
  const displayName = user?.name || userEmail || '';

  return {
    // 인증 상태
    isAuthenticated,
    isLoading,
    isInitialized,
    
    // 사용자 정보
    userId,
    userEmail,
    userRoles,
    isAdmin,
    displayName,
    
    // 전체 사용자 객체
    user,
    
    // 편의 플래그
    hasBasicInfo: !!user, // user 객체가 있으면 모든 정보를 가지고 있음
    hasFullInfo: !!user,
  };
}