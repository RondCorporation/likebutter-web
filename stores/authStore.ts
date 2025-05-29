import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch, ApiResponse } from '@/lib/api';

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
          const { data } = await apiFetch<User>('/users/me');
          set({ user: data });
        } catch (e: any) {
          console.error('Failed to fetch user:', e.message);
          // If fetchMe fails, apiFetch handles refresh/logout.
          // We might clear state here as a fallback.
          if (!e.message.includes('Retrying')) {
            get().logout();
          }
        }
      },
      logout: () => {
        localStorage.removeItem('accessToken');
        set({ token: null, user: null });
        // Redirect is usually handled by useAuth or components
      },
    }),
    { name: 'auth' }
  )
);

// Initial check when the app loads (client-side only)
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('accessToken');
  if (token && !useAuthStore.getState().token) {
    useAuthStore.getState().setToken(token);
  }
}
