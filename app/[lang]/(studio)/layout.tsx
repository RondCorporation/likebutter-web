import { ReactNode } from 'react';
import StudioLayoutClient from './_components/StudioLayoutClient';

interface StudioLayoutProps {
  children: ReactNode;
}

export default function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <StudioLayoutClient>
      {children}
    </StudioLayoutClient>
  );
}
