import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LangState {
  lang: 'en' | 'ko';
  setLang: (lang: 'en' | 'ko') => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => {
        set({ lang });
        if (typeof document !== 'undefined') {
          document.cookie = `locale=${lang};path=/`;
        }
      },
    }),
    { name: 'lang' }
  )
);
