import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseClasses = 'inline-flex-center font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-studio-button-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-studio-button-primary text-studio-header hover:bg-studio-button-hover',
      secondary: 'bg-studio-content text-studio-text-primary border border-studio-border hover:bg-studio-border',
      outline: 'border border-studio-button-primary text-studio-button-primary bg-transparent hover:bg-studio-button-primary hover:text-studio-header',
      ghost: 'text-studio-text-primary hover:bg-studio-content',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs h-8 gap-1.5 rounded',
      md: 'px-5 py-2.5 text-sm h-[38px] gap-2 rounded-md',
      lg: 'px-6 py-3 text-base h-12 gap-2.5 rounded-lg',
    };
    
    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          loading && 'opacity-75 cursor-wait',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;