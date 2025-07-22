import { ReactNode } from 'react';
import AuthGuard from '@/components/AuthGuard';
import StudioSidebar from './_components/SidebarClient';
import StudioMainClient from './_components/StudioMainClient';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function StudioLayout({ children, params }: Props) {
  const { lang } = await params;
  return (
    <AuthGuard>
      <div className="flex h-screen bg-black text-white">
        <StudioSidebar lang={lang} />
        <StudioMainClient lang={lang}>{children}</StudioMainClient>
      </div>
    </AuthGuard>
  );
}
