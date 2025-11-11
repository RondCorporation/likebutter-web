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
  hasTokenFromServer: boolean;
  setLoading: (isLoading: boolean) => void;
  initialize: (force?: boolean) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  hydrate: (preloadedUser: User) => void;
  setHasTokenFromServer: (hasToken: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isInitialized: false,
  isLoading: true,
  isAuthenticated: false,
  hasTokenFromServer: false,

  setLoading: (isLoading) => set({ isLoading }),

  setUser: (user) => set({ user }),

  setHasTokenFromServer: (hasToken) => set({ hasTokenFromServer: hasToken }),

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

    if (state.isInitialized && !force) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      const { data: user } = await getMe();

      if (user) {
        set({
          user,
          isAuthenticated: true,
          isInitialized: true,
          isLoading: false,
        });
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
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
