import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function useAuth(required = true) {
  const { token, user, fetchMe } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (token && !user) fetchMe();
    if (required && !token) router.replace('/login');
  }, [token, user, required, fetchMe, router]);

  return { token, user };
}
