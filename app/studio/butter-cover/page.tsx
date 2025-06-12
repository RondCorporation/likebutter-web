'use client';

import { useState } from 'react';
import { UploadCloud, Sparkles } from 'lucide-react';

const BTS_MEMBERS = ['Jungkook', 'V', 'Jimin', 'Suga', 'Jin', 'RM', 'J-Hope'];

export default function ButterCoverPage() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const isGenerationDisabled = !selectedMember || !uploadedFile;

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-2 text-xl font-semibold">Create a Butter Cover</h2>
      <p className="mb-8 text-slate-400">
        원하는 BTS 멤버의 목소리를 선택하고, 커버하고 싶은 노래를 업로드하여 AI
        커버를 만들어보세요.
      </p>

      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-slate-200">
          1. Select Member's Voice
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
          2. Upload Your Song
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
            <p>Click to browse or drag & drop your audio file</p>
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
        Generate Cover
      </button>
    </div>
  );
}
