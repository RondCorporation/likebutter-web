import { usePathname } from 'next/navigation';
import { getDictionary, Locale } from '@/lib/dictionary';

export function useLang() {
  const pathname = usePathname();
  const current = pathname.split('/')[1] as Locale | undefined;
  const lang: Locale = current === 'ko' ? 'ko' : 'en';
  return { lang, t: getDictionary(lang) };
}
