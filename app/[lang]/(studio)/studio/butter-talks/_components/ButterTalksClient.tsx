'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Bot,
  Sparkles,
} from 'lucide-react';

export default function ButterTalksClient() {
  const { t } = useTranslation();
  const MEMBERS = [
    { key: 'Jungkook', name: t('butterTalksMemberJungkook') },
    { key: 'V', name: t('butterTalksMemberV') },
    { key: 'Jimin', name: t('butterTalksMemberJimin') },
    { key: 'RM', name: t('butterTalksMemberRM') },
  ];

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);

  const startChat = () => {
    if (selectedMember) {
      setIsChatActive(true);
      setIsMicOn(true);
      setIsWebcamOn(true);
    }
  };

  const endChat = () => {
    setIsChatActive(false);
    setIsMicOn(false);
    setIsWebcamOn(false);
  };

  if (isChatActive) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="relative mb-6 aspect-video w-full max-w-4xl flex-col items-center justify-center rounded-lg border border-white/10 bg-neutral-800">
          <div className="flex h-full items-center justify-center">
            <Bot size={80} className="animate-pulse text-slate-600" />
          </div>
          <p className="absolute left-4 top-4 text-lg font-semibold">
            {selectedMember}
          </p>
          <div className="absolute bottom-4 right-4 h-24 w-40 items-center justify-center rounded-md border border-white/20 bg-black text-xs text-slate-400"></div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMicOn((p) => !p)}
            className={`rounded-full p-3 transition-colors ${
              isMicOn ? 'bg-white/10' : 'bg-red-500'
            }`}
          >
            {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          <button
            onClick={() => setIsWebcamOn((p) => !p)}
            className={`rounded-full p-3 transition-colors ${
              isWebcamOn ? 'bg-white/10' : 'bg-red-500'
            }`}
          >
            {isWebcamOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>
          <button
            onClick={endChat}
            className="rounded-full bg-red-600 p-3 transition-colors hover:bg-red-500"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
      <h3 className="mb-6 text-lg font-medium text-slate-200">
        {t('butterTalksPrompt')}
      </h3>
      <div className="mb-8 grid grid-cols-2 gap-4">
        {MEMBERS.map((member) => (
          <button
            key={member.key}
            onClick={() => setSelectedMember(member.name)}
            className={`rounded-lg border py-3 text-base font-semibold transition-all ${
              selectedMember === member.name
                ? 'border-accent bg-accent text-black'
                : 'border-white/10 bg-white/5 hover:border-accent/50 hover:bg-white/10'
            }`}
          >
            {member.name}
          </button>
        ))}
      </div>
      <button
        onClick={startChat}
        disabled={!selectedMember}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3 text-base font-medium text-black transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        <Sparkles size={18} />
        {t('butterTalksButton')}
      </button>
    </div>
  );
}
