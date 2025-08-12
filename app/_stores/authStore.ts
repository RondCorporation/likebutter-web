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
  roles: string;
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
  hydrate: (preloadedUser: User) => void;
}

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

  hydrate: (preloadedUser) => {
    set({
      user: preloadedUser,
      isAuthenticated: true,
      isInitialized: true,
      isLoading: false,
    });
  },

  initialize: async () => {
    if (get().isInitialized) {
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
      // This is an expected failure if the user is not logged in.
      // The auth-failure event will handle the logout process.
      // No need to log an error here.
      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
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
    apiLogout().catch((err) => console.warn('Server-side logout failed:', err));
    deleteAccessTokenCookie();
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
