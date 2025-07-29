import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { apiFetch } from '@/lib/api';

export function useLogout() {
  const router = useRouter();
  const logoutStore = useAuthStore((s) => s.logout);

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'DELETE' }, true);
      console.log('Server logout successful.');
    } catch (error) {
      console.error(
        'Server logout failed, proceeding with client-side logout:',
        error
      );
    } finally {
      logoutStore();
      router.replace('/login');
    }
  };

  return logout;
}
