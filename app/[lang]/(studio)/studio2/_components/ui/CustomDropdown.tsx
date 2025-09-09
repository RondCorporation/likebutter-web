'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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
}

export default function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = "선택해주세요",
  className = "" 
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        className="flex w-[236px] h-[38px] items-center gap-3 px-3 py-2.5 relative rounded border border-solid border-studio-border bg-studio-sidebar cursor-pointer hover:border-studio-button-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 relative flex-[0_0_auto] self-stretch w-full">
          <span className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-secondary text-sm tracking-[0] leading-[19.6px] whitespace-nowrap flex-1">
            {selectedOption ? selectedOption.label : placeholder}
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