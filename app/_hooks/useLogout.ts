import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { logout as apiLogout } from '@/lib/apis/auth.api';

export function useLogout() {
  const router = useRouter();
  const logoutStore = useAuthStore((s) => s.logout);

  const logout = async () => {
    try {
      await apiLogout();
      console.log('Server logout successful.');
    } catch (error) {
      console.error(
        'Server logout failed, proceeding with client-side logout:',
        error
      );
    } finally {
      logoutStore();
      // Thoroughly clear the accessToken cookie by setting its expiration to the past.
      // This prevents stale tokens from being sent by the browser, especially for Server Components.
      document.cookie = 'accessToken=; path=/; max-age=-1;';
      router.replace('/login');
    }
  };

  return logout;
}
