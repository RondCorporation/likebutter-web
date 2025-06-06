import { useLangStore } from '@/stores/langStore';
import { getDictionary } from '@/lib/dictionary';

export function useLang() {
  const lang = useLangStore((s) => s.lang);
  return { lang, t: getDictionary(lang) };
}
