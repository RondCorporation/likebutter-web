'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  width?: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  className = '',
  width = 'w-[236px]',
}: CustomDropdownProps) {
  const { t } = useTranslation(['common']);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const finalPlaceholder = placeholder || t('selectPlaceholder');

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`studio-dropdown ${className}`}>
      {/* Dropdown Trigger */}
      <div
        className={`flex ${width} h-[48px] sm:h-[38px] items-center gap-3 px-3 py-2.5 relative rounded border border-solid border-studio-border bg-studio-sidebar cursor-pointer hover:border-studio-button-primary transition-colors`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 relative flex-[0_0_auto] self-stretch w-full">
          <span className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-secondary text-base sm:text-sm tracking-[0] leading-[19.6px] whitespace-nowrap flex-1">
            {selectedOption ? selectedOption.label : finalPlaceholder}
          </span>
          <ChevronDown
            className={`relative w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            color="#A8A8AA"
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      <div className={`studio-dropdown-menu ${isOpen ? 'open' : ''}`}>
        {options.map((option) => (
          <div
            key={option.value}
            className={`studio-dropdown-item font-pretendard-medium ${
              option.value === value ? 'selected' : ''
            }`}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}
