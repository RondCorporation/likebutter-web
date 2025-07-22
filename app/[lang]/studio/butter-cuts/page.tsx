'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadCloud, Sparkles } from 'lucide-react';

export default function ButterCutsPage() {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles((prev) => [
        ...prev,
        ...Array.from(e.target.files ?? []),
      ]);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-2 text-xl font-semibold">{t('butterCutsTitle')}</h2>
      <p className="mb-8 text-slate-400">{t('butterCutsSubtitle')}</p>

      <div className="mb-6">
        <label
          htmlFor="cuts-prompt"
          className="mb-3 block text-lg font-medium text-slate-200"
        >
          {t('butterCutsStep1')}
        </label>
        <textarea
          id="cuts-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('butterCutsPromptPlaceholder')}
          rows={3}
          className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-accent focus:ring-0"
        />
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-medium text-slate-200">
          {t('butterCutsStep2')}
        </h3>
        <div className="relative flex min-h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 p-4 text-slate-400 transition-colors hover:border-accent/50 hover:text-accent">
          <UploadCloud size={32} className="mb-2" />
          {uploadedFiles.length > 0 ? (
            <div className="w-full text-center">
              <p className="font-semibold text-white">
                {t('butterCutsFileCount', { count: uploadedFiles.length })}
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 text-left text-xs text-slate-300">
                {uploadedFiles.map((f) => (
                  <li key={f.name} className="truncate">
                    - {f.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>{t('butterCutsUploadPlaceholder')}</p>
          )}
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>

      <button
        disabled={!prompt || uploadedFiles.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3 text-base font-medium text-black transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        <Sparkles size={18} />
        {t('butterCutsButton')}
      </button>
    </div>
  );
}
