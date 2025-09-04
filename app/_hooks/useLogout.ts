import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { logout as apiLogout, clearSession } from '@/lib/apis/auth.api';

export function useLogout() {
  const router = useRouter();
  const logoutStore = useAuthStore((s) => s.logout);

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      try {
        await clearSession();
      } catch (clearError) {}
    } finally {
      logoutStore();
      router.replace('/login');
    }
  };

  return logout;
}
