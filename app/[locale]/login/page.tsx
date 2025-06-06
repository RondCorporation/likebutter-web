'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import SocialButtons from '@/components/SocialButtons';

interface LoginResponse {
  accessToken: { value: string };
  refreshToken: { value: string };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const [lastUsedProvider, setLastUsedProvider] = useState<string | null>(null);

  useEffect(() => {
    const lastProvider = localStorage.getItem('lastUsedSocialLogin');
    if (lastProvider) {
      setLastUsedProvider(
        lastProvider.charAt(0).toUpperCase() + lastProvider.slice(1)
      );
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');

    if (!EMAIL_REGEX.test(email)) {
      setErr('Invalid email format.');
      return;
    }

    try {
      const res = await apiFetch<LoginResponse>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password: pw }),
        },
        false
      );

      if (res.data?.accessToken?.value) {
        const accessToken = res.data.accessToken.value;
        localStorage.setItem('accessToken', accessToken);
        setToken(accessToken);
        router.replace('/studio');
      } else {
        setErr('Invalid email or password.');
      }
    } catch (e: any) {
      setErr('Invalid email or password.');
    }
  }

  return (
    <main className="flex h-screen items-center justify-center bg-black px-4 pt-24 md:pt-28">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-accent">Login</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full rounded-md bg-white/10 p-3 text-sm text-white"
          required
        />
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md bg-white/10 p-3 text-sm text-white"
          required
        />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="w-full rounded-md bg-accent py-2 text-sm font-medium text-black hover:brightness-90">
          Login
        </button>
        <p className="text-sm text-center text-slate-400">
          Don't have an account?{' '}
          <span
            onClick={() => router.push('/signup')}
            className="cursor-pointer text-accent hover:underline"
          >
            Sign up
          </span>
        </p>

        <div className="mt-6 w-full max-w-sm">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-slate-400">
                Or continue with
              </span>
            </div>
          </div>
          {lastUsedProvider && (
            <p className="mb-3 text-center text-xs text-slate-400">
              Recently used:{' '}
              <strong className="font-semibold text-accent">
                {lastUsedProvider}
              </strong>
            </p>
          )}
          <SocialButtons />
        </div>
      </form>
    </main>
  );
}
