'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuthStore, LoginResponse, User } from '@/stores/authStore';
import { LoaderCircle } from 'lucide-react';
import { apiFetch, ApiResponse } from '@/lib/api';

const BASE = process.env.NEXT_PUBLIC_API_BASE;

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
          // Use the token to fetch user data
          const meResponse = await fetch(`${BASE}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!meResponse.ok) {
            throw new Error('Failed to fetch user data');
          }

          const meApiRes: ApiResponse<User> = await meResponse.json();

          if (!meApiRes.data) {
            throw new Error(meApiRes.msg || 'User data not found');
          }

          const user = meApiRes.data;

          // Construct the LoginResponse and call login
          const loginResponse: ApiResponse<LoginResponse> = {
            status: 200,
            msg: 'Login successful',
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
      // If no token is found, redirect to login with an error
      console.error('No access token found in URL.');
      router.replace(`/${lang}/login?error=auth_failed`);
    }
  }, [searchParams, router, login, lang]);

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
