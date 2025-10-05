'use client';

import { useTranslation } from 'react-i18next';

interface StepNavigationProps {
  currentStep: number;
}

export default function StepNavigation({ currentStep }: StepNavigationProps) {
  const { t } = useTranslation(['studio']);

  const steps = [
    { number: 1, title: t('butterCover.steps.artistSelection') },
    { number: 2, title: t('butterCover.steps.songUpload') },
    { number: 3, title: t('butterCover.steps.generateAudio') },
  ];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-9 py-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center sm:gap-3">
          <div
            className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3"
            style={{ minWidth: '80px' }}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-lg text-sm font-medium ${
                step.number <= currentStep
                  ? 'bg-butter-yellow text-studio-main'
                  : 'bg-slate-600 text-slate-400'
              }`}
            >
              {step.number}
            </div>
            <span
              className={`font-medium text-center sm:text-lg ${
                step.number <= currentStep
                  ? 'text-butter-yellow'
                  : 'text-slate-400'
              }`}
              style={{ fontSize: '14px' }}
            >
              {step.title}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div className="w-6 sm:w-9 h-px bg-slate-600 ml-3" />
          )}
        </div>
      ))}
    </div>
  );
}
