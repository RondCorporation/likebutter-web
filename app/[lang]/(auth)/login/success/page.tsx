'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuthStore, LoginResponse, User } from '@/stores/authStore';
import { LoaderCircle } from 'lucide-react';
import { getMe } from '@/lib/apis/user.api';
import { ApiResponse } from '@/lib/apiClient';

function AuthRedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { login } = useAuthStore();
  const lang = pathname.split('/')[1] || 'en';

  useEffect(() => {
    const token = searchParams.get('accessToken');

    if (token) {
      const fetchUser = async () => {
        try {
          const meApiRes = await getMe(token);

          if (!meApiRes.data) {
            throw new Error(meApiRes.error?.message || 'User data not found');
          }

          const user = meApiRes.data;

          const loginResponse: ApiResponse<LoginResponse> = {
            success: true,
            error: null,
            data: {
              accessToken: { value: token },
              user,
            },
          };
          login(loginResponse);

          const returnTo =
            localStorage.getItem('oauthReturnTo') || `/${lang}/studio`;
          localStorage.removeItem('oauthReturnTo');
          router.replace(returnTo);
        } catch (error) {
          console.error('Authentication failed:', error);
          router.replace(`/${lang}/login?error=auth_failed`);
        }
      };

      fetchUser();
    } else {
      console.error('No access token found in URL.');
      router.replace(`/${lang}/login?error=auth_failed`);
    }
  }, [searchParams, router, login, lang]);

  return <LoaderCircle className="h-12 w-12 animate-spin text-accent" />;
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