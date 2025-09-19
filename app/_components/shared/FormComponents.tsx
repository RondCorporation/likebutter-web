'use client';

import { ReactNode, SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/_lib/utils';
import { Check, ChevronDown } from 'lucide-react';

// Form Container
interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export function FormGroup({ children, className }: FormGroupProps) {
  return <div className={cn('space-y-6', className)}>{children}</div>;
}

// Form Section
interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-700 bg-slate-800/50 p-6',
        className
      )}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        {description && <p className="text-sm text-slate-400">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// Select Component
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-slate-200">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full appearance-none rounded-xl border-2 border-slate-700 bg-slate-800/50 px-4 py-3 pr-10 text-white transition-colors duration-300 focus:border-butter-yellow focus:outline-none focus:ring-0',
              error && 'border-red-400 focus:border-red-400',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-slate-800"
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Checkbox Component
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  className?: string;
}

export function Checkbox({
  label,
  checked,
  onChange,
  description,
  className,
}: CheckboxProps) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
          checked
            ? 'border-butter-yellow bg-butter-yellow text-black'
            : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
        )}
      >
        {checked && <Check size={14} />}
      </button>
      <div className="space-y-1">
        <label
          className="text-sm font-medium text-slate-200 cursor-pointer"
          onClick={() => onChange(!checked)}
        >
          {label}
        </label>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
    </div>
  );
}

// Radio Group Component
interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  label?: string;
  className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  label,
  className,
}: RadioGroupProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-200">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'mt-0.5 h-4 w-4 rounded-full border-2 transition-colors',
                value === option.value
                  ? 'border-butter-yellow bg-butter-yellow'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              )}
            >
              {value === option.value && (
                <div className="h-full w-full rounded-full bg-black scale-50" />
              )}
            </button>
            <div className="space-y-1">
              <label
                className="text-sm font-medium text-slate-200 cursor-pointer"
                onClick={() => onChange(option.value)}
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-xs text-slate-400">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
