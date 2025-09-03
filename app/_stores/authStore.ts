import { create } from 'zustand';
import { getMe } from '@/app/_lib/apis/user.api';
import { clearSession } from '@/app/_lib/apis/auth.api';
import { User } from '@/app/_types/api';

export interface LoginResponse {
  accessToken: { value: string };
  refreshToken: { value: string };
}

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  setLoading: (isLoading: boolean) => void;
  initialize: (force?: boolean) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  hydrate: (preloadedUser: User) => void;
}

// 수동 쿠키 삭제 함수 제거 - 백엔드 API에서 처리

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isInitialized: false,
  isLoading: true,
  isAuthenticated: false,

  setLoading: (isLoading) => set({ isLoading }),

  setUser: (user) => set({ user }),

  hydrate: (preloadedUser) => {
    set({
      user: preloadedUser,
      isAuthenticated: true,
      isInitialized: true,
      isLoading: false,
    });
  },

  initialize: async (force = false) => {
    if (get().isInitialized && !force) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      const { data: user } = await getMe();
      set({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
      });
      // Re-throw error only when force is true to handle login flow failures
      if (force) {
        throw error;
      }
    } finally {
      set({
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  logout: () => {
    // 자동 로그아웃의 경우 토큰이 이미 만료되었으므로 clearSession 사용
    clearSession().catch((err) =>
      console.warn('Failed to clear session:', err)
    );
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
