'use client';
import { useSearchParams, usePathname } from 'next/navigation';
import { OAUTH_GOOGLE, OAUTH_FACEBOOK, OAUTH_X } from '@/lib/constants';

const IconGoogle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 48 48"
  >
    <title>Google Logo</title>
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 6.57C34.543 2.921 29.632 1 24 1C10.745 1 0 11.745 0 25s10.745 24 24 24s24-10.745 24-24c0-1.288-.131-2.54-.36-3.753z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691c-1.229 2.193-1.928 4.707-1.928 7.309s.7 5.116 1.928 7.309l-5.656 4.63C.349 30.632 0 27.87 0 25s.349-5.632 1.638-8.948l5.657 3.639z"
    />
    <path
      fill="#4CAF50"
      d="M24 48c5.632 0 10.543-1.921 14.197-5.196l-6.057-4.92c-2.193 1.465-4.842 2.316-7.74 2.316-4.945 0-9.22-2.91-10.82-6.956L1.638 33.948C5.062 42.107 13.845 48 24 48z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.087 5.571l6.057 4.92c3.488-3.218 5.727-7.854 5.727-13.491c0-1.288-.131-2.54-.36-3.753z"
    />
  </svg>
);

const IconFacebook = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const IconX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function SocialButtons({
  variant = 'login',
}: {
  variant?: 'login' | 'signup';
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSocialClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    provider: 'Google' | 'Facebook' | 'X'
  ) => {
    localStorage.setItem('lastUsedSocialLogin', provider.toLowerCase());

    const returnTo = searchParams.get('returnTo');
    if (returnTo) {
      // Ensure the path is absolute, including the language prefix.
      const lang = pathname.split('/')[1] || 'en';
      const absoluteReturnTo = returnTo.startsWith('/')
        ? returnTo
        : `/${lang}/${returnTo}`;
      localStorage.setItem('oauthReturnTo', absoluteReturnTo);
    } else {
      localStorage.removeItem('oauthReturnTo');
    }

    if (provider === 'Facebook' || provider === 'X') {
      e.preventDefault();
      alert(
        `${provider} login is currently unavailable. Please try another method.`
      );
    }
  };

  return (
    <div className="w-full space-y-3">
      <a
        href={OAUTH_GOOGLE}
        onClick={(e) => handleSocialClick(e, 'Google')}
        className="btn-social gap-3 bg-white text-black transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-accent"
      >
        <IconGoogle />
        Continue with Google
      </a>
      <a
        href={OAUTH_FACEBOOK}
        onClick={(e) => handleSocialClick(e, 'Facebook')}
        className="btn-social gap-3 border border-white/30 bg-black text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-accent"
      >
        <IconFacebook />
        Continue with Facebook
      </a>
      <a
        href={OAUTH_X}
        onClick={(e) => handleSocialClick(e, 'X')}
        className="btn-social gap-3 border border-white/30 bg-black text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-accent"
      >
        <IconX />
        Continue with X
      </a>

      {variant === 'signup' && (
        <p className="pt-2 text-center text-xs text-slate-400">
          소셜 계정으로도 간편하게 가입할 수 있습니다.
        </p>
      )}
    </div>
  );
}
