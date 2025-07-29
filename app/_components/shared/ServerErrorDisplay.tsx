'use client';

import { useUIStore } from '@/stores/uiStore';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

export default function ServerErrorDisplay() {
  const { serverError, setServerError } = useUIStore();
  const { t } = useTranslation();

  if (!serverError) {
    return null;
  }

  const handleRetry = () => {
    setServerError(null);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg bg-slate-900 border border-red-500/50 p-8 text-center shadow-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
          <AlertTriangle className="h-6 w-6 text-red-500" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">
          {t('serverError.title')}
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          {t('serverError.message')}
        </p>
        <div className="mt-6">
          <button
            onClick={handleRetry}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-90"
          >
            {t('serverError.retry')}
          </button>
        </div>
      </div>
    </div>
  );
}
