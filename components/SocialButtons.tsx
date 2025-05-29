'use client';
import { OAUTH_GOOGLE, OAUTH_APPLE } from '@/lib/constants';

export default function SocialButtons({
  variant = 'login',
}: {
  variant?: 'login' | 'signup';
}) {
  return (
    <div className="space-y-2">
      <a href={OAUTH_GOOGLE} className="btn-social bg-white text-black">
        Continue with Google
      </a>
      <a
        href={OAUTH_APPLE}
        className="btn-social bg-black text-white border border-white"
      >
        Continue with Apple
      </a>
      {variant === 'signup' && (
        <p className="text-center text-xs text-slate-400">
          You can also sign up using social accounts.
        </p>
      )}
    </div>
  );
}
