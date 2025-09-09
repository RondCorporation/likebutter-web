'use client';

import { memo, ChangeEvent } from 'react';

interface DescriptionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const DescriptionTextarea = memo(({ 
  value, 
  onChange, 
  placeholder = "원하는 디스크립션을 입력해주세요",
  className 
}: DescriptionTextareaProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`relative self-stretch w-full h-[unset] gap-4 flex-[0_0_auto] bg-studio-sidebar ${className || ''}`}>
      <div className="relative w-[236px] h-[70px] rounded">
        <div className="flex w-[236px] h-[70px] items-center gap-3 px-3 py-2.5 absolute top-0 left-0 rounded overflow-hidden border border-studio-border bg-studio-sidebar">
          <div className="flex items-start gap-2.5 grow relative flex-1 self-stretch">
            <textarea
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              className="mt-[-1px] font-pretendard-medium text-studio-text-secondary text-sm tracking-[0] leading-[19.6px] relative flex-1 self-stretch bg-transparent border-0 resize-none focus:outline-none placeholder-studio-text-secondary"
            />
          </div>
        </div>
        <div className="absolute w-2 h-2 top-[58px] left-56 bg-[url(/img/resizer-1.svg)] bg-[100%_100%]" />
      </div>
    </div>
  );
});

DescriptionTextarea.displayName = 'DescriptionTextarea';

export default DescriptionTextarea;