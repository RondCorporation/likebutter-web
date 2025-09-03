'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SocialButtons from '@/app/_components/SocialButtons';
import { login as apiLogin } from '@/app/_lib/apis/auth.api';
import Logo from '@/app/_components/Logo';
import { Sparkles } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginClientContent({
  lang,
  translations,
}: {
  lang: string;
  translations: any;
}) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false); // 로컬 상태로 로딩 관리
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

    setIsLoading(true);

    try {
      const res = await apiLogin(email, pw);

      if (res.data?.accessToken) {
        // 성공! 백엔드에서 쿠키를 설정했습니다.
        // 가장 확실한 다음 단계는 목적지로 전체 페이지를 이동하는 것입니다.
        // 이렇게 하면 대상 페이지의 레이아웃/페이지에서 올바른 인증 확인이 트리거됩니다.
        const returnTo = searchParams.get('returnTo');
        const redirectUrl = returnTo
          ? decodeURIComponent(returnTo)
          : `/${lang}/studio`;

        // 여기서 initialize()를 호출할 필요 없이, 리디렉션이 모든 것을 처리합니다.
        window.location.href = redirectUrl;
      } else {
        setErr(res.msg || translations.loginErrorInvalidPassword);
        setIsLoading(false);
      }
    } catch (e: any) {
      setErr(e.message || translations.loginErrorInvalidPassword);
      setIsLoading(false);
    }
  }

  // Show loading only during login process
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-butter-yellow mx-auto mb-4"></div>
          <p className="text-slate-400">Logging in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="absolute top-0 left-0 p-8">
        <Link href={`/${lang}`}>
          <Logo />
        </Link>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {translations.loginTitle}
            </h1>
          </div>
          <form onSubmit={submit} className="mt-10 space-y-6">
            <div className="space-y-4">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={translations.loginEmailPlaceholder}
                type="email"
                name="email"
                autoComplete="email"
                className="w-full rounded-xl border-2 border-slate-700 bg-slate-800/50 p-4 text-lg text-white transition-colors duration-300 placeholder:text-slate-400 focus:border-butter-yellow focus:outline-none focus:ring-0"
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
                className="w-full rounded-xl border-2 border-slate-700 bg-slate-800/50 p-4 text-lg text-white transition-colors duration-300 placeholder:text-slate-400 focus:border-butter-yellow focus:outline-none focus:ring-0"
                required
                disabled={isLoading}
              />
            </div>

            {err && <p className="text-sm text-red-400">{err}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-butter-yellow to-butter-orange px-8 py-4 text-lg font-semibold text-black shadow-lg shadow-butter-yellow/20 transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:shadow-butter-yellow/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-butter-yellow disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                translations.loginButtonLoggingIn
              ) : (
                <>
                  <Sparkles size={20} />
                  {translations.loginButton}
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-400">
              {translations.loginSignupPrompt}{' '}
              <Link
                href={`/${lang}/signup`}
                className={`font-medium text-butter-yellow hover:underline ${
                  isLoading ? 'pointer-events-none' : ''
                }`}
              >
                {translations.loginSignupLink}
              </Link>
            </p>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-black px-2 text-slate-400">
                  {translations.loginOrContinueWith}
                </span>
              </div>
            </div>

            <div className="mt-6">
              {lastUsedProvider && (
                <p className="mb-3 text-center text-xs text-slate-400">
                  {translations.loginRecentlyUsed}{' '}
                  <strong className="font-semibold text-butter-yellow">
                    {lastUsedProvider}
                  </strong>
                </p>
              )}
              <SocialButtons />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginClient({
  lang,
  translations,
}: {
  lang: string;
  translations: any;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-butter-yellow"></div>
      </div>
    }>
      <LoginClientContent lang={lang} translations={translations} />
    </Suspense>
  );
}
