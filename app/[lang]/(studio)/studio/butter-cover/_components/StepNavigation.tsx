'use client';

interface StepNavigationProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: '아티스트 선택' },
  { number: 2, title: '노래 업로드' },
  { number: 3, title: '음원생성' },
];

export default function StepNavigation({ currentStep }: StepNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-9 py-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-3">
          <div className="flex items-center gap-3">
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
              className={`text-lg font-medium ${
                step.number <= currentStep
                  ? 'text-butter-yellow'
                  : 'text-slate-400'
              }`}
            >
              {step.title}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div className="w-9 h-px bg-slate-600 ml-3" />
          )}
        </div>
      ))}
    </div>
  );
}