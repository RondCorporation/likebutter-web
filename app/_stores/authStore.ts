import { create } from 'zustand';
import { getMe } from '@/app/_lib/apis/user.api';
import { logout as apiLogout } from '@/app/_lib/apis/auth.api';
import { ApiResponse } from '@/app/_types/api';

export interface Subscription {
  id: number;
  status: 'ACTIVE' | 'CANCELED' | 'INACTIVE';
  planName: string;
}

export interface User {
  accountId: number;
  email: string;
  name: string;
  gender: string;
  countryCode: string;
  countryName: string;
  phoneNumber: string | null;
  subscription?: Subscription | null;
}

export interface LoginResponse {
  accessToken: { value: string };
  user: User;
}

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  setLoading: (isLoading: boolean) => void;
  initialize: () => Promise<void>;
  login: (res: ApiResponse<LoginResponse>) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const getAccessTokenCookie = () => {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
  return match ? match[2] : null;
};

const deleteAccessTokenCookie = () => {
  if (typeof window === 'undefined') return;
  document.cookie = 'accessToken=; path=/; max-age=-1;';
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isInitialized: false,
  isLoading: true,
  isAuthenticated: false,

  setLoading: (isLoading) => set({ isLoading }),

  setUser: (user) => set({ user }),

  initialize: async () => {
    if (get().isInitialized) {
      set({ isLoading: false });
      return;
    }
    set({ isLoading: true });

    try {
      // getMe()를 호출합니다.
      // 토큰 존재 여부, 유효성 검사, 재발급은 getMe() 내부의 apiFetch가 모두 처리합니다.
      const { data: user } = await getMe();

      // 성공적으로 사용자 정보를 가져온 경우
      console.log('Authentication successful on initialization.');
      set({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      // getMe() 또는 내부의 토큰 재발급이 최종 실패한 경우.
      // apiFetch 내부에서 이미 쿠키 삭제 및 'auth-failure' 이벤트가 처리되었을 수 있습니다.
      // 여기서 상태를 확실히 정리합니다.
      console.error('Authentication failed during initialization:', error);
      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
      // 모든 경우에 대해 초기화 완료 상태로 설정
      set({
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  login: (res) => {
    if (res.data?.user) {
      const { user } = res.data;
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } else {
      set({ isLoading: false });
    }
  },

  logout: () => {
    // Call the server to invalidate the session, but don't wait for it.
    // The client-side state should be cleared immediately.
    apiLogout().catch((err) =>
      console.error('Server-side logout failed:', err)
    );
    deleteAccessTokenCookie();
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
