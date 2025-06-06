'use client';
import { useLangStore } from '@/stores/langStore';
import { getDictionary } from '@/lib/dictionary';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLangStore();
  const t = getDictionary(lang);

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
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
