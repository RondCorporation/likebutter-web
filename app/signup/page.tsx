// app/signup/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SocialButtons from '@/components/SocialButtons';
import { apiFetch, ApiResponse } from '@/lib/api';
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PW_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    nationalityIsoCode: '',
  });
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
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
          const defaultCountry = res.data.find((c) => c.isoCode === 'KR');
          if (defaultCountry) {
            setForm((prevForm) => ({
              ...prevForm,
              nationalityIsoCode: defaultCountry.isoCode,
            }));
          }
        } else {
          setErr(res.msg || 'Failed to load country list.');
        }
      } catch (e: any) {
        setErr('Failed to load country list. Please try again later.');
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

    if (!EMAIL_REGEX.test(form.email)) {
      setErr('Invalid email format.');
      return;
    }
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
    if (!form.nationalityIsoCode) {
      setErr('Please select your nationality.');
      return;
    }

    let formattedPhoneNumber: string | undefined = undefined;
    if (phoneNumber) {
      if (!isValidPhoneNumber(phoneNumber)) {
        setErr('Invalid phone number format.');
        return;
      }
      const parsed = parsePhoneNumber(phoneNumber);
      if (parsed) {
        formattedPhoneNumber = parsed.format('E.164');
      }
    }

    try {
      await apiFetch(
        '/auth/sign-up',
        {
          method: 'POST',
          body: JSON.stringify({
            email: form.email,
            password: form.pw,
            name: form.name,
            gender: form.gender,
            countryCode: form.nationalityIsoCode,
            phoneNumber: formattedPhoneNumber,
          }),
        },
        false
      );
      alert('Sign up successful! Please log in.');
      router.replace('/login');
    } catch (e: any) {
      setErr(
        e.message ||
          'Sign up failed. Please check your information and try again.'
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-8 pt-24 md:pt-28">
      {' '}
      {/* pt-24 md:pt-28 추가 */}
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

        <select
          name="nationalityIsoCode"
          value={form.nationalityIsoCode}
          onChange={onChange}
          required
          className="rounded-md bg-white/10 p-3 text-sm text-white appearance-none"
        >
          <option value="" className="bg-black" disabled>
            Select Nationality
          </option>
          {countries.length === 0 && (
            <option value="" disabled className="bg-black">
              Loading nationalities...
            </option>
          )}
          {countries.map((c) => (
            <option key={c.isoCode} value={c.isoCode} className="bg-black">
              {c.countryEn} ({c.isoCode})
            </option>
          ))}
        </select>

        <PhoneInput
          placeholder="Phone (Optional)"
          value={phoneNumber}
          onChange={setPhoneNumber}
          international
          smartCaret={false}
          defaultCountry={form.nationalityIsoCode as any}
          className="phone-input-custom-signup"
        />

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
