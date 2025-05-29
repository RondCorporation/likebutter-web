'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function OauthSuccess() {
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
