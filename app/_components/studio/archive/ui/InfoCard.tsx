import { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function InfoCard({
  title,
  children,
  className = '',
}: InfoCardProps) {
  return (
    <div
      className={`bg-studio-sidebar border border-studio-border rounded-xl p-4 ${className}`}
    >
      <h4 className="text-sm font-medium text-studio-text-primary mb-3">
        {title}
      </h4>
      {children}
    </div>
  );
}
