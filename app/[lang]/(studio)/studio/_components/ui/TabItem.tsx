'use client';

interface TabItemProps {
  state: 'selected' | 'default';
  text: string;
  className?: string;
}

export default function TabItem({ state, text, className = '' }: TabItemProps) {
  return (
    <div
      className={`inline-flex flex-col items-center gap-[15px] px-6 py-3 justify-center relative border-b border-solid ${
        state === 'default'
          ? 'border-[#4a4a4b] border-b'
          : 'border-[#ffd83b] border-b-2'
      } ${className}`}
    >
      <div
        className={`font-medium text-sm leading-[19.6px] whitespace-nowrap relative ${
          state === 'default'
            ? 'mt-[-1.00px] text-[#a8a8aa]'
            : 'mt-[-2.00px] text-[#ffd83b]'
        }`}
      >
        {text}
      </div>
    </div>
  );
}
