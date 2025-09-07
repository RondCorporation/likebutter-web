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
    const state = get();
    
    // Check if already initialized (but allow force refresh)
    if (state.isInitialized && !force) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      // 서버 세션 확인 - 가장 확실한 방법
      const { data: user } = await getMe();
      
      if (user) {
        // 성공적으로 사용자 정보를 가져온 경우
        set({
          user,
          isAuthenticated: true,
          isInitialized: true,
          isLoading: false,
        });
      } else {
        // API 응답에 data가 없는 비정상적인 경우
        throw new Error('User data not found');
      }
    } catch (error) {
      // getMe() API 호출 실패는 세션이 없거나 만료된 것을 의미
      // 확실하게 로그아웃 상태로 설정
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });
      
      if (force) {
        throw error;
      }
    }
  },

  logout: () => {
    clearSession().catch(() => {});
    
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
