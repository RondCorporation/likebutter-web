'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadCloud, Sparkles } from 'lucide-react';

export default function ButterCoverClient() {
  const { t } = useTranslation();
  const BTS_MEMBERS = [
    t('butterTalksMemberJungkook'),
    t('butterTalksMemberV'),
    t('butterTalksMemberJimin'),
    'Suga',
    'Jin',
    t('butterTalksMemberRM'),
    'J-Hope',
  ];

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const isGenerationDisabled = !selectedMember || !uploadedFile;

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-slate-200">
          {t('butterCoverStep1')}
        </h3>
        <div className="flex flex-wrap gap-3">
          {BTS_MEMBERS.map((member) => (
            <button
              key={member}
              onClick={() => setSelectedMember(member)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
                selectedMember === member
                  ? 'border-accent bg-accent text-black'
                  : 'border-white/10 bg-white/5 hover:border-accent/50 hover:bg-white/10'
              }`}
            >
              {member}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-slate-200">
          {t('butterCoverStep2')}
        </h3>
        <div className="relative flex h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 text-slate-400 transition-colors hover:border-accent/50 hover:text-accent">
          <UploadCloud size={32} className="mb-2" />
          {uploadedFile ? (
            <div className="text-center">
              <p className="font-semibold text-white">{uploadedFile.name}</p>
              <p className="text-xs">
                ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          ) : (
            <p>{t('butterCoverUploadPlaceholder')}</p>
          )}
          <input
            type="file"
            accept="audio/mp3,audio/wav,audio/mpeg"
            onChange={handleFileChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>

      <button
        disabled={isGenerationDisabled}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3 text-base font-medium text-black transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        <Sparkles size={18} />
        {t('butterCoverButton')}
      </button>
    </>
  );
}
