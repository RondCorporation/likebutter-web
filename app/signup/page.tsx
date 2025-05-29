'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SocialButtons from '@/components/SocialButtons';
import { apiFetch } from '@/lib/api';

const PW_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

export default function Signup() {
  const [form, setForm] = useState({
    email: '',
    pw: '',
    pw2: '',
    name: '',
    nick: '',
    phone: '',
    birth: '',
  });
  const [err, setErr] = useState<string>('');
  const router = useRouter();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!PW_REGEX.test(form.pw) || form.pw !== form.pw2) {
      setErr(
        'Must include uppercase, lowercase, number, special character (#?!@$%^&*-) and be at least 8 characters.'
      );
      return;
    }
    try {
      await apiFetch(
        '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({
            email: form.email,
            password: form.pw,
            name: form.name,
            nickname: form.nick,
            phone: form.phone,
            birthDate: form.birth,
            agreePrivacy: true,
            agreePromotion: false,
          }),
        },
        false
      );
      router.replace('/login');
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <main className="flex h-screen items-center justify-center bg-black px-4">
      <form onSubmit={submit} className="grid w-full max-w-md gap-3">
        <h2 className="mb-2 text-2xl font-semibold text-accent">Sign up</h2>
        {['email', 'pw', 'pw2', 'name', 'nick', 'phone', 'birth'].map((f) => (
          <input
            key={f}
            name={f}
            type={
              f.includes('pw') ? 'password' : f === 'birth' ? 'date' : 'text'
            }
            placeholder={
              f === 'pw2'
                ? 'Confirm Password'
                : f.charAt(0).toUpperCase() + f.slice(1)
            }
            value={(form as any)[f]}
            onChange={onChange}
            className="rounded-md bg-white/10 p-3 text-sm text-white"
          />
        ))}
        {err && <p className="text-xs text-red-400">{err}</p>}
        {/* agreements */}
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input type="checkbox" required className="accent-accent" /> I agree
          to the{' '}
          <a href="/privacy" className="underline text-accent">
            Privacy Policy
          </a>
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input type="checkbox" className="accent-accent" /> I agree to receive
          promotional e-mails
        </label>
        <button className="mt-2 rounded-md bg-accent py-2 text-sm font-medium text-black hover:brightness-90">
          Create account
        </button>
        <p className="text-sm text-center text-slate-400">
          You already have an account?{' '}
          <span
            onClick={() => router.push('/login')}
            className="cursor-pointer text-accent hover:underline"
          >
            Login
          </span>
        </p>

        <div className="mt-10 w-full max-w-md">
          <SocialButtons variant="signup" />
        </div>
      </form>
    </main>
  );
}
