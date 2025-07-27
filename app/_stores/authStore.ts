import { create } from 'zustand';
import { apiFetch, ApiResponse } from '@/lib/api';

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
  refreshToken?: { value: string };
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  setToken: (t: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  initialize: () => Promise<void>;
  login: (res: ApiResponse<LoginResponse>) => void;
  logout: () => void;
}

const setCookie = (name: string, value: string | null, days: number = 7) => {
  if (typeof window === 'undefined') return;

  let expires = '';
  if (value) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }

  // For cross-site requests (like returning from a payment gateway),
  // SameSite=None and Secure=true are required.
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  document.cookie = `${name}=${
    value || ''
  }${expires}; path=/; SameSite=None${secure}`;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isInitialized: false,
  isLoading: true,
  isAuthenticated: false,

  setToken: (t: string | null) => {
    set({ token: t });
    if (typeof window !== 'undefined') {
      if (t) {
        localStorage.setItem('accessToken', t);
        setCookie('accessToken', t);
      } else {
        localStorage.removeItem('accessToken');
        setCookie('accessToken', null, -1);
        setCookie('refreshToken', null, -1); // Also clear refreshToken cookie
      }
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  initialize: async () => {
    set({ isLoading: true });

    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken');
    }

    if (token) {
      set({ token });
      try {
        const { data: user } = await apiFetch<User>('/users/me');
        console.log('[AuthStore] Fetched user data on initialize:', user);
        if (user) {
          set({
            user,
            isAuthenticated: true,
            isInitialized: true,
            isLoading: false,
          });
        } else {
          get().setToken(null);
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error(
          'Failed to initialize auth state, token might be invalid:',
          error
        );
        get().setToken(null);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: true,
          isLoading: false,
        });
      }
    } else {
      set({
        isInitialized: true,
        isLoading: false,
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  login: (res) => {
    if (res.data?.accessToken?.value && res.data.user) {
      const { accessToken, refreshToken, user } = res.data;
      console.log('[AuthStore] Setting user data on login:', user);
      get().setToken(accessToken.value);
      if (refreshToken?.value) {
        setCookie('refreshToken', refreshToken.value);
      }
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
    console.log(
      '[AuthStore] Clearing token and user from store, localStorage, and cookies.'
    );
    get().setToken(null);
    set({
      user: null,
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false,
    });
  },
}));
