'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

function SuccessHandler() {
  const params = useSearchParams();
  const token = params.get('accessToken');
  const setToken = useAuthStore((s) => s.setToken);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      console.log('OAuth Success: Received token, setting...');
      localStorage.setItem('accessToken', token);
      setToken(token);
      router.replace('/studio');
    } else {
      console.error('OAuth Success: No token received. Redirecting to login.');
      router.replace('/login');
    }
  }, [token, setToken, router]);

  return (
    <p className="p-8 text-white bg-black h-screen flex items-center justify-center">
      Redirecting…
    </p>
  );
}

export default function OauthSuccessPage() {
  return (
    <Suspense
      fallback={
        <p className="p-8 text-white bg-black h-screen flex items-center justify-center">
          Loading...
        </p>
      }
    >
      <SuccessHandler />
    </Suspense>
  );
}
