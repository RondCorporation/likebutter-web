'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, LoginResponse } from '@/stores/authStore';
import { LoaderCircle } from 'lucide-react';
import { ApiResponse } from '@/lib/api';

function AuthRedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('accessToken');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const loginResponse: ApiResponse<LoginResponse> = {
          code: 'SUCCESS',
          msg: 'Login successful',
          data: {
            accessToken: { value: token },
            user,
          },
        };
        login(loginResponse);
        const returnTo = localStorage.getItem('oauthReturnTo') || '/studio';
        localStorage.removeItem('oauthReturnTo');
        router.replace(returnTo);
      } catch (error) {
        console.error('Failed to parse user data from URL', error);
        router.replace('/login?error=auth_failed');
      }
    } else {
      router.replace('/login?error=auth_failed');
    }
  }, [searchParams, router, login]);

  return null;
}

export default function LoginSuccessPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <Suspense
        fallback={
          <LoaderCircle className="h-12 w-12 animate-spin text-accent" />
        }
      >
        <AuthRedirectHandler />
      </Suspense>
    </div>
  );
}
