import { ReactNode } from 'react';
import { MarketingLayoutClient } from './_components/MarketingLayoutClient';
import MarketingLayoutContent from './_components/MarketingLayoutContent';

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <MarketingLayoutClient>
      <MarketingLayoutContent>
        {children}
      </MarketingLayoutContent>
    </MarketingLayoutClient>
  );
}
