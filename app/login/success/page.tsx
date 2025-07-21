'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

function SuccessHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    const token = params.get('accessToken');
    if (token) {
      console.log(
        'OAuth Success: Received token, setting and re-initializing...'
      );
      setToken(token);
      initialize().then(() => {
        const returnTo = localStorage.getItem('oauthReturnTo');
        localStorage.removeItem('oauthReturnTo');
        router.replace(returnTo || '/studio');
      });
    } else {
      console.error('OAuth Success: No token received. Redirecting to login.');
      router.replace('/login');
    }
  }, []);

  return (
    <div className="p-8 text-white bg-black h-screen flex items-center justify-center">
      <p>Processing authentication...</p>
    </div>
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
