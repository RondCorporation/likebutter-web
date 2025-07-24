import { create } from 'zustand';
import { apiFetch, ApiResponse } from '@/lib/api';

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  subscription: {
    id: number;
    planName: string;
    status: 'ACTIVE' | 'CANCELED';
  } | null;
}

export interface LoginResponse {
  accessToken: { value: string };
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
      } else {
        localStorage.removeItem('accessToken');
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
      const { accessToken, user } = res.data;
      get().setToken(accessToken.value);
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
    console.log('Clearing token and user from store and localStorage.');
    get().setToken(null);
    set({
      user: null,
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false,
    });
  },
}));
