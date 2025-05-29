import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from '@/lib/api';

interface User {
  id: string;
  email: string;
  nickname: string;
}
interface AuthState {
  user: User | null;
  token: string | null;
  setToken: (t: string) => void;
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
        get().fetchMe();
      },
      fetchMe: async () => {
        if (!get().token) return;
        try {
          const { data } = await apiFetch<User>('/users/me');
          set({ user: data });
        } catch {
          localStorage.removeItem('accessToken');
          set({ token: null, user: null });
        }
      },
      logout: () => {
        localStorage.removeItem('accessToken');
        set({ token: null, user: null });
      },
    }),
    { name: 'auth' }
  )
);
