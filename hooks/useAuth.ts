import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function useAuth(required = true) {
  const { token, user, fetchMe, logout, setToken } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken && !token) {
      setToken(storedToken);
    }

    if (required && !storedToken) {
      console.log('Auth required, no token. Redirecting to login.');
      router.replace('/login');
    } else if (storedToken && !user) {
      console.log('Token exists, but no user. Fetching...');
      fetchMe();
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'accessToken' && event.newValue === null) {
        console.log('accessToken removed. Logging out.');
        logout();
        router.replace('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token, user, required, fetchMe, router, logout, pathname, setToken]);

  return { token, user };
}
