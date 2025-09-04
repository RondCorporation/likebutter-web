'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/_lib/utils';

interface StudioInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'textarea';
}

interface StudioTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant: 'textarea';
}

type Props = StudioInputProps | StudioTextareaProps;

const StudioInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ label, error, className, variant = 'default', ...props }, ref) => {
    const baseClasses = "w-full rounded-xl border-2 border-slate-700 bg-slate-800/50 px-4 py-3 text-white transition-colors duration-300 placeholder:text-slate-400 focus:border-butter-yellow focus:outline-none focus:ring-0";
    
    const errorClasses = error ? "border-red-400 focus:border-red-400" : "";

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-slate-200">
            {label}
          </label>
        )}
        {variant === 'textarea' ? (
          <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            className={cn(baseClasses, errorClasses, "resize-none", className)}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            className={cn(baseClasses, errorClasses, className)}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

StudioInput.displayName = 'StudioInput';

export default StudioInput;