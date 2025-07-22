'use client';

import { useTranslation } from 'react-i18next';

export default function StudioHome() {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <p className="text-slate-300 text-xl">{t('studioHomeWelcome')}</p>
    </div>
  );
}
