'use client';
import { usePathname, useRouter } from 'next/navigation';
import { getDictionary, Locale } from '@/lib/dictionary';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const current = pathname.split('/')[1] as Locale | undefined;
  const lang: Locale = current === 'ko' ? 'ko' : 'en';
  const t = getDictionary(lang);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Locale;
    const segments = pathname.split('/');
    segments[1] = newLang;
    const newPath = segments.join('/') || '/';
    document.cookie = `locale=${newLang};path=/`;
    router.push(newPath);
  };

  return (
    <select
      value={lang}
      onChange={handleChange}
      className="rounded-md bg-white/10 p-2 text-sm"
    >
      <option value="en" className="bg-black">
        {t.english}
      </option>
      <option value="ko" className="bg-black">
        {t.korean}
      </option>
    </select>
  );
}
