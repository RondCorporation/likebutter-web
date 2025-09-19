'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface StudioSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}

export default function StudioSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
}: StudioSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-lg border bg-slate-800 px-3 py-2 text-sm transition-colors ${
          disabled
            ? 'border-slate-700 bg-slate-900 text-slate-500 cursor-not-allowed'
            : 'border-slate-600 text-white hover:border-slate-500 focus:border-butter-yellow focus:outline-none'
        }`}
      >
        <span className={selectedOption ? 'text-white' : 'text-slate-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''} ${
            disabled ? 'text-slate-600' : 'text-slate-400'
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-slate-600 bg-slate-800 shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-slate-700 ${
                  value === option.value
                    ? 'bg-butter-yellow/10 text-butter-yellow'
                    : 'text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
