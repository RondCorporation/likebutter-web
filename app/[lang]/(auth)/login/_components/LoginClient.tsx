'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import SocialButtons from '@/components/SocialButtons';
import { LoginResponse } from '@/stores/authStore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginClient({
  lang,
  translations,
}: {
  lang: string;
  translations: any;
}) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setLoading = useAuthStore((s) => s.setLoading);

  const [lastUsedProvider, setLastUsedProvider] = useState<string | null>(null);

  useEffect(() => {
    const lastProvider = localStorage.getItem('lastUsedSocialLogin');
    if (lastProvider) {
      setLastUsedProvider(
        lastProvider.charAt(0).toUpperCase() + lastProvider.slice(1)
      );
    }

    const reason = searchParams.get('reason');
    if (reason === 'session_expired') {
      setErr(translations.loginSessionExpired);
    }
  }, [searchParams, translations]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');

    if (!EMAIL_REGEX.test(email)) {
      setErr(translations.loginErrorInvalidEmail);
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch<LoginResponse>(
        '/auth/login',
        {
          method: 'POST',
          body: { email, password: pw },
        },
        false
      );

      if (res.data?.accessToken?.value && res.data.user) {
        await login(res);
        const returnTo = searchParams.get('returnTo');
        router.replace(returnTo || `/${lang}/studio`);
      } else {
        setErr(res.msg || translations.loginErrorInvalidPassword);
        setLoading(false);
      }
    } catch (e: any) {
      setErr(e.message);
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen items-center justify-center bg-black px-4 pt-24 md:pt-28">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-accent">
          {translations.loginTitle}
        </h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={translations.loginEmailPlaceholder}
          type="email"
          name="email"
          autoComplete="email"
          className="w-full rounded-md bg-white/10 p-3 text-sm text-white"
          required
          disabled={isLoading}
        />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder={translations.loginPasswordPlaceholder}
          className="w-full rounded-md bg-white/10 p-3 text-sm text-white"
          required
          disabled={isLoading}
        />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-accent py-2 text-sm font-medium text-black transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading
            ? translations.loginButtonLoggingIn
            : translations.loginButton}
        </button>
        <p className="text-sm text-center text-slate-400">
          {translations.loginSignupPrompt}{' '}
          <span
            onClick={() => !isLoading && router.push(`/${lang}/signup`)}
            className={`cursor-pointer text-accent hover:underline ${
              isLoading ? 'pointer-events-none' : ''
            }`}
          >
            {translations.loginSignupLink}
          </span>
        </p>

        <div className="mt-6 w-full max-w-sm">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-slate-400">
                {translations.loginOrContinueWith}
              </span>
            </div>
          </div>
          {lastUsedProvider && (
            <p className="mb-3 text-center text-xs text-slate-400">
              {translations.loginRecentlyUsed}{' '}
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
