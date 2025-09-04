'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/app/_lib/utils';
import { LoaderCircle } from 'lucide-react';

interface StudioButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

export default function StudioButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  ...props 
}: StudioButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-butter-yellow/50";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-butter-yellow to-butter-orange text-black shadow-lg shadow-butter-yellow/20 hover:shadow-butter-yellow/40 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg",
    secondary: "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600 hover:border-slate-500 disabled:opacity-70 disabled:cursor-not-allowed",
    ghost: "text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <LoaderCircle size={16} className="animate-spin" />
          {children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}