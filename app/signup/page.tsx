'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SocialButtons from '@/components/SocialButtons';
import { apiFetch, ApiResponse } from '@/lib/api';

const PW_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

interface Country {
  code: string;
  countryEn: string;
  isoCode: string;
}

export default function Signup() {
  const [form, setForm] = useState({
    email: '',
    pw: '',
    pw2: '',
    name: '',
    gender: 'MALE',
    countryCode: '+82',
    phone: '',
  });
  const [err, setErr] = useState<string>('');
  const [countries, setCountries] = useState<Country[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchCountries() {
      try {
        const res: ApiResponse<Country[]> = await apiFetch(
          '/countries',
          {},
          false
        );
        if (res.data) {
          setCountries(res.data);
          // Optionally set a default based on location or just keep KR
        }
      } catch (e: any) {
        setErr('Failed to load countries: ' + e.message);
      }
    }
    fetchCountries();
  }, []);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');

    if (!PW_REGEX.test(form.pw)) {
      setErr(
        'Password must include uppercase, lowercase, number, special character (#?!@$%^&*-) and be at least 8 characters.'
      );
      return;
    }
    if (form.pw !== form.pw2) {
      setErr('Passwords do not match.');
      return;
    }

    try {
      await apiFetch(
        '/auth/sign-up', // Updated endpoint
        {
          method: 'POST',
          body: JSON.stringify({
            email: form.email,
            password: form.pw,
            name: form.name,
            gender: form.gender,
            countryCode: form.countryCode,
            phoneNumber: form.phone || undefined, // Send undefined if empty
          }),
        },
        false
      );
      alert('Sign up successful! Please log in.');
      router.replace('/login');
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-8">
      <form onSubmit={submit} className="grid w-full max-w-md gap-3">
        <h2 className="mb-2 text-2xl font-semibold text-accent">Sign up</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
          className="rounded-md bg-white/10 p-3 text-sm text-white"
        />
        <input
          name="pw"
          type="password"
          placeholder="Password"
          value={form.pw}
          onChange={onChange}
          required
          className="rounded-md bg-white/10 p-3 text-sm text-white"
        />
        <input
          name="pw2"
          type="password"
          placeholder="Confirm Password"
          value={form.pw2}
          onChange={onChange}
          required
          className="rounded-md bg-white/10 p-3 text-sm text-white"
        />
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          required
          className="rounded-md bg-white/10 p-3 text-sm text-white"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={onChange}
          className="rounded-md bg-white/10 p-3 text-sm text-white appearance-none"
        >
          <option value="MALE" className="bg-black">
            Male
          </option>
          <option value="FEMALE" className="bg-black">
            Female
          </option>
          <option value="ETC" className="bg-black">
            Other
          </option>
        </select>

        <div className="flex gap-2">
          <select
            name="countryCode"
            value={form.countryCode}
            onChange={onChange}
            className="rounded-md bg-white/10 p-3 text-sm text-white w-1/3 appearance-none"
          >
            {countries.length === 0 && <option value="">Loading...</option>}
            {countries.map((c) => (
              <option key={c.isoCode} value={c.code} className="bg-black">
                {c.isoCode} ({c.code})
              </option>
            ))}
          </select>
          <input
            name="phone"
            type="tel"
            placeholder="Phone (Optional)"
            value={form.phone}
            onChange={onChange}
            className="rounded-md bg-white/10 p-3 text-sm text-white w-2/3"
          />
        </div>

        {err && <p className="text-xs text-red-400">{err}</p>}

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
