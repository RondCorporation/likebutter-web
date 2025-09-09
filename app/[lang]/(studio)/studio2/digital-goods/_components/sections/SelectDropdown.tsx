'use client';

import { memo, ChangeEvent } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
}

const SelectDropdown = memo(({ 
  label, 
  value, 
  options, 
  onChange, 
  className 
}: SelectDropdownProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`inline-flex flex-col items-start gap-4 relative flex-[0_0_auto] ${className || ''}`}>
      <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
        {label}
      </div>

      <div className="inline-flex flex-col h-[38px] items-start px-4 py-2 relative rounded-md border border-studio-border bg-studio-sidebar w-[236px]">
        <div className="inline-flex-between gap-2 relative flex-[0_0_auto] self-stretch w-full">
          <select
            value={value}
            onChange={handleChange}
            className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-secondary text-sm tracking-[0] leading-[19.6px] whitespace-nowrap bg-transparent border-0 appearance-none focus:outline-none flex-1"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="relative w-5 h-5" color="#A8A8AA" />
        </div>
      </div>
    </div>
  );
});

SelectDropdown.displayName = 'SelectDropdown';

export default SelectDropdown;