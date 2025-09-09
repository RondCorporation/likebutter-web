import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StudioContainerProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
  className?: string;
}

export const StudioContainer = ({ 
  children, 
  title, 
  actions, 
  className 
}: StudioContainerProps) => (
  <div className={cn('flex flex-col flex-1 h-full bg-studio-content', className)}>
    {title && (
      <div className="flex-between gap-2 px-12 pt-6 pb-0">
        <h1 className="flex-1 text-studio-text-primary text-xl font-bold font-pretendard">
          {title}
        </h1>
        {actions}
      </div>
    )}
    <div className="flex items-center gap-6 relative flex-1 self-stretch w-full grow px-12 pt-6 pb-12">
      {children}
    </div>
  </div>
);

interface StudioSidebarProps {
  children: ReactNode;
  className?: string;
  width?: 'sm' | 'md' | 'lg';
}

export const StudioSidebar = ({ 
  children, 
  className, 
  width = 'md' 
}: StudioSidebarProps) => {
  const widths = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[440px]',
  };

  return (
    <div 
      className={cn(
        'flex flex-col bg-studio-sidebar border-l border-studio-border-light h-full overflow-y-auto',
        widths[width],
        className
      )}
    >
      {children}
    </div>
  );
};

interface StudioMainProps {
  children: ReactNode;
  className?: string;
}

export const StudioMain = ({ children, className }: StudioMainProps) => (
  <div className={cn('flex-1 flex flex-col', className)}>
    {children}
  </div>
);

interface StudioSectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
  contentClassName?: string;
}

export const StudioSection = ({ 
  children, 
  title, 
  className,
  contentClassName 
}: StudioSectionProps) => (
  <div className={cn('flex flex-col gap-4', className)}>
    {title && (
      <h3 className="text-studio-text-primary font-bold font-pretendard">
        {title}
      </h3>
    )}
    <div className={cn(contentClassName)}>
      {children}
    </div>
  </div>
);