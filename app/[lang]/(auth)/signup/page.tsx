'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import SocialButtons from '@/components/SocialButtons';
import { signup } from '@/app/_lib/apis/auth.api';
import { getCountries } from '@/app/_lib/apis/country.api';
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
  countryKo: string;
  isoCode: string;
}

export default function Signup() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const router = useRouter();
  const pathname = usePathname();

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [lastUsedProvider, setLastUsedProvider] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await getCountries();
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
          setErr(res.msg || t('signupErrorCountryList'));
        }
      } catch (e: any) {
        setErr(e.message || t('signupErrorCountryListRetry'));
      }
    }
    fetchCountries();

    const lastProvider = localStorage.getItem('lastUsedSocialLogin');
    if (lastProvider) {
      setLastUsedProvider(
        lastProvider.charAt(0).toUpperCase() + lastProvider.slice(1)
      );
    }
  }, [t]);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setIsSubmitting(true);

    if (!EMAIL_REGEX.test(form.email)) {
      setErr(t('signupErrorInvalidEmail'));
      setIsSubmitting(false);
      return;
    }
    if (!PW_REGEX.test(form.pw)) {
      setErr(t('signupErrorPasswordRequirements'));
      setIsSubmitting(false);
      return;
    }
    if (form.pw !== form.pw2) {
      setErr(t('signupErrorPasswordsMismatch'));
      setIsSubmitting(false);
      return;
    }
    if (!form.nationalityIsoCode) {
      setErr(t('signupErrorNationalityRequired'));
      setIsSubmitting(false);
      return;
    }

    let formattedPhoneNumber: string | undefined = undefined;
    if (phoneNumber) {
      if (!isValidPhoneNumber(phoneNumber)) {
        setErr(t('signupErrorInvalidPhone'));
        setIsSubmitting(false);
        return;
      }
      const parsed = parsePhoneNumber(phoneNumber);
      if (parsed) {
        formattedPhoneNumber = parsed.format('E.164');
      }
    }

    try {
      await signup({
        email: form.email,
        password: form.pw,
        name: form.name,
        gender: form.gender,
        countryCode: form.nationalityIsoCode,
        phoneNumber: formattedPhoneNumber,
      });
      alert(t('signupSuccessAlert'));
      router.replace(`/${lang}/login`);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-8 pt-24 md:pt-28">
      <form onSubmit={submit} className="grid w-full max-w-md gap-3">
        <h2 className="mb-2 text-2xl font-semibold text-accent">
          {t('signupTitle')}
        </h2>

        <input
          name="email"
          type="email"
          placeholder={t('signupEmailPlaceholder')}
          value={form.email}
          onChange={onChange}
          required
          className="rounded-md bg-white/10 p-3 text-sm text-white"
        />
        <input
          name="pw"
          type="password"
          placeholder={t('signupPasswordPlaceholder')}
          value={form.pw}
          onChange={onChange}
          required
          className="rounded-md bg-white/10 p-3 text-sm text-white"
        />
        <input
          name="pw2"
          type="password"
          placeholder={t('signupConfirmPasswordPlaceholder')}
          value={form.pw2}
          onChange={onChange}
          required
          className="rounded-md bg-white/10 p-3 text-sm text-white"
        />
        <input
          name="name"
          type="text"
          placeholder={t('signupNamePlaceholder')}
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
            {t('signupGenderMale')}
          </option>
          <option value="FEMALE" className="bg-black">
            {t('signupGenderFemale')}
          </option>
          <option value="ETC" className="bg-black">
            {t('signupGenderOther')}
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
            {t('signupNationalitySelect')}
          </option>
          {countries.length === 0 && !err && (
            <option value="" disabled className="bg-black">
              {t('signupNationalityLoading')}
            </option>
          )}
          {countries.map((c) => (
            <option key={c.isoCode} value={c.isoCode} className="bg-black">
              {lang === 'ko' ? c.countryKo : c.countryEn} ({c.isoCode})
            </option>
          ))}
        </select>

        <PhoneInput
          placeholder={t('signupPhonePlaceholder')}
          value={phoneNumber}
          onChange={setPhoneNumber}
          international
          smartCaret={false}
          defaultCountry={form.nationalityIsoCode as any}
          className="phone-input-custom-signup"
        />

        {err && <p className="text-xs text-red-400">{err}</p>}

        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input type="checkbox" required className="accent-accent" />
          {t('signupAgreePrivacy')}{' '}
          <a href={`/${lang}/privacy`} className="underline text-accent">
            {t('signupPrivacyPolicyLink')}
          </a>
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input type="checkbox" className="accent-accent" />
          {t('signupAgreePromo')}
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-md bg-accent py-2 text-sm font-medium text-black hover:brightness-90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('signupButtonCreating') : t('signupButtonCreate')}
        </button>
        <p className="text-sm text-center text-slate-400">
          {t('signupLoginPrompt')}{' '}
          <span
            onClick={() => router.push(`/${lang}/login`)}
            className="cursor-pointer text-accent hover:underline"
          >
            {t('signupLoginLink')}
          </span>
        </p>

        <div className="mt-10 w-full max-w-md">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-slate-400">
                {t('signupOrSignUpWith')}
              </span>
            </div>
          </div>
          {lastUsedProvider && (
            <p className="mb-3 text-center text-xs text-slate-400">
              {t('loginRecentlyUsed')}{' '}
              <strong className="font-semibold text-accent">
                {lastUsedProvider}
              </strong>
            </p>
          )}
          <SocialButtons variant="signup" />
        </div>
      </form>
    </main>
  );
}
