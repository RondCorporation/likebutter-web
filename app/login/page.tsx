'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import SocialButtons from '@/components/SocialButtons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await apiFetch<{ accessToken: string }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password: pw }),
        },
        false
      );
      localStorage.setItem('accessToken', data.accessToken);
      setToken(data.accessToken);
      router.replace('/studio');
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <main className="flex h-screen items-center justify-center bg-black px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-accent">Login</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md bg-white/10 p-3 text-sm text-white"
        />
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md bg-white/10 p-3 text-sm text-white"
        />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="w-full rounded-md bg-accent py-2 text-sm font-medium text-black hover:brightness-90">
          Login
        </button>
        <p className="text-sm text-center text-slate-400">
          Don't have an account?
          <span
            onClick={() => router.push('/signup')}
            className="cursor-pointer text-accent hover:underline"
          >
            Sign up
          </span>
        </p>

        <div className="mt-6 w-full max-w-sm">
          <SocialButtons />
        </div>
      </form>
    </main>
  );
}
