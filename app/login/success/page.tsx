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
      localStorage.setItem('accessToken', token);
      setToken(token);
      router.replace('/studio');
    } else {
      router.replace('/login');
    }
  }, [token, setToken, router]);

  return <p className="p-8 text-white">Redirecting…</p>;
}
