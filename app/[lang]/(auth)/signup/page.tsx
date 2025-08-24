'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import SocialButtons from '@/components/SocialButtons';
import { signup } from '@/app/_lib/apis/auth.api';
import { getCountries } from '@/app/_lib/apis/country.api';
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Logo from '@/components/Logo';
import { Sparkles } from 'lucide-react';

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

  const inputStyles =
    'w-full rounded-xl border-2 border-slate-700 bg-slate-800/50 p-4 text-lg text-white transition-colors duration-300 placeholder:text-slate-400 focus:border-butter-yellow focus:outline-none focus:ring-0';

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="absolute top-0 left-0 p-8">
        <Link href={`/${lang}`}>
          <Logo />
        </Link>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {t('signupTitle')}
            </h1>
          </div>
          <form onSubmit={submit} className="mt-10 space-y-6">
            <div className="space-y-4">
              <input
                name="email"
                type="email"
                placeholder={t('signupEmailPlaceholder')}
                value={form.email}
                onChange={onChange}
                required
                className={inputStyles}
              />
              <input
                name="pw"
                type="password"
                placeholder={t('signupPasswordPlaceholder')}
                value={form.pw}
                onChange={onChange}
                required
                className={inputStyles}
              />
              <input
                name="pw2"
                type="password"
                placeholder={t('signupConfirmPasswordPlaceholder')}
                value={form.pw2}
                onChange={onChange}
                required
                className={inputStyles}
              />
              <input
                name="name"
                type="text"
                placeholder={t('signupNamePlaceholder')}
                value={form.name}
                onChange={onChange}
                required
                className={inputStyles}
              />
              <select
                name="gender"
                value={form.gender}
                onChange={onChange}
                className={`${inputStyles} appearance-none`}
              >
                <option value="MALE" className="bg-slate-800">
                  {t('signupGenderMale')}
                </option>
                <option value="FEMALE" className="bg-slate-800">
                  {t('signupGenderFemale')}
                </option>
                <option value="ETC" className="bg-slate-800">
                  {t('signupGenderOther')}
                </option>
              </select>
              <select
                name="nationalityIsoCode"
                value={form.nationalityIsoCode}
                onChange={onChange}
                required
                className={`${inputStyles} appearance-none`}
              >
                <option value="" className="bg-slate-800" disabled>
                  {t('signupNationalitySelect')}
                </option>
                {countries.length === 0 && !err && (
                  <option value="" disabled className="bg-slate-800">
                    {t('signupNationalityLoading')}
                  </option>
                )}
                {countries.map((c) => (
                  <option
                    key={c.isoCode}
                    value={c.isoCode}
                    className="bg-slate-800"
                  >
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
                className="phone-input-custom"
              />
            </div>

            {err && <p className="text-sm text-red-400">{err}</p>}

            <div className="space-y-3 text-sm">
              <label className="flex items-center gap-3 text-slate-300">
                <input
                  type="checkbox"
                  required
                  className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-butter-yellow focus:ring-butter-yellow"
                />
                <span>
                  {t('signupAgreePrivacy')}{' '}
                  <Link
                    href={`/${lang}/privacy`}
                    className="font-medium text-butter-yellow hover:underline"
                  >
                    {t('signupPrivacyPolicyLink')}
                  </Link>
                </span>
              </label>
              <label className="flex items-center gap-3 text-slate-300">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-butter-yellow focus:ring-butter-yellow"
                />
                <span>{t('signupAgreePromo')}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-butter-yellow to-butter-orange px-8 py-4 text-lg font-semibold text-black shadow-lg shadow-butter-yellow/20 transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:shadow-butter-yellow/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-butter-yellow disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                t('signupButtonCreating')
              ) : (
                <>
                  <Sparkles size={20} />
                  {t('signupButtonCreate')}
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-400">
              {t('signupLoginPrompt')}{' '}
              <Link
                href={`/${lang}/login`}
                className="font-medium text-butter-yellow hover:underline"
              >
                {t('signupLoginLink')}
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
                  {t('signupOrSignUpWith')}
                </span>
              </div>
            </div>

            <div className="mt-6">
              {lastUsedProvider && (
                <p className="mb-3 text-center text-xs text-slate-400">
                  {t('loginRecentlyUsed')}{' '}
                  <strong className="font-semibold text-butter-yellow">
                    {lastUsedProvider}
                  </strong>
                </p>
              )}
              <SocialButtons variant="signup" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
