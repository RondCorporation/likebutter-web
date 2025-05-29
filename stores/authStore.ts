import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from '@/lib/api';

interface User {
  accountId: number;
  email: string;
  name: string;
  gender: string;
  countryCode: string;
  countryName: string;
  phoneNumber: string | null;
}
interface AuthState {
  user: User | null;
  token: string | null;
  setToken: (t: string | null) => void;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setToken: (t) => {
        set({ token: t });
        if (t) {
          get().fetchMe();
        } else {
          set({ user: null });
        }
      },
      fetchMe: async () => {
        if (!get().token) return;
        try {
          console.log('Fetching user data...');
          const { data } = await apiFetch<User>('/users/me');
          set({ user: data });
          console.log('User data fetched:', data?.name);
        } catch (e: any) {
          console.error('Failed to fetch user:', e.message);
        }
      },

      logout: () => {
        console.log('Clearing token and user from store and localStorage.');
        localStorage.removeItem('accessToken');
        set({ token: null, user: null });
      },
    }),
    { name: 'auth' }
  )
);

if (typeof window !== 'undefined') {
  const token = localStorage.getItem('accessToken');
  const currentToken = useAuthStore.getState().token;
  if (token && !currentToken) {
    console.log('Hydrating auth store from localStorage.');
    useAuthStore.getState().setToken(token);
  } else if (!token && currentToken) {
    console.log('Token removed elsewhere, clearing store.');
    useAuthStore.getState().logout();
  }
}
