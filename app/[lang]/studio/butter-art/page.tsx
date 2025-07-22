'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export default function ButterArtPage() {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-2 text-xl font-semibold">{t('butterArtTitle')}</h2>
      <p className="mb-8 text-slate-400">{t('butterArtSubtitle')}</p>

      <div className="mb-6">
        <label
          htmlFor="art-prompt"
          className="mb-3 block text-lg font-medium text-slate-200"
        >
          {t('butterArtStep1')}
        </label>
        <textarea
          id="art-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('butterArtPromptPlaceholder')}
          rows={4}
          className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-accent focus:ring-0"
        />
      </div>

      <div className="relative my-6 flex items-center">
        <div className="flex-grow border-t border-white/20"></div>
        <span className="mx-4 flex-shrink text-sm text-slate-400">
          {t('butterArtOr')}
        </span>
        <div className="flex-grow border-t border-white/20"></div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-medium text-slate-200">
          {t('butterArtStep2')}
        </h3>
        <div className="relative flex h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 text-slate-400 transition-colors hover:border-accent/50 hover:text-accent">
          <ImageIcon size={32} className="mb-2" />
          {uploadedFile ? (
            <div className="text-center">
              <p className="font-semibold text-white">{uploadedFile.name}</p>
              <p className="text-xs">
                ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          ) : (
            <p>{t('butterArtUploadPlaceholder')}</p>
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>

      <button
        disabled={!prompt && !uploadedFile}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3 text-base font-medium text-black transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        <Sparkles size={18} />
        {t('butterArtButton')}
      </button>
    </div>
  );
}
