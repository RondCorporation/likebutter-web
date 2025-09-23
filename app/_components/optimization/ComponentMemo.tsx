'use client';

import { memo, ReactNode } from 'react';

interface MemoWrapperProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const MemoWrapper = memo(({ children, ...props }: MemoWrapperProps) => {
  return <div {...props}>{children}</div>;
});

MemoWrapper.displayName = 'MemoWrapper';

interface MemoTextProps {
  text: string;
  className?: string;
  tag?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const MemoText = memo(
  ({ text, className, tag = 'span' }: MemoTextProps) => {
    const Tag = tag;
    return <Tag className={className}>{text}</Tag>;
  }
);

MemoText.displayName = 'MemoText';

interface MemoIconProps {
  icon: ReactNode;
  className?: string;
}

export const MemoIcon = memo(({ icon, className }: MemoIconProps) => {
  return <span className={className}>{icon}</span>;
});

MemoIcon.displayName = 'MemoIcon';
