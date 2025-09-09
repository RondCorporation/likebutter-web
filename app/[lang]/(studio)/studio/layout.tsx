'use client';

import { ReactNode, use } from 'react';
import { Toaster } from 'react-hot-toast';
import StudioAuthGuard from '../_components/StudioAuthGuard';
import { Settings } from 'lucide-react';
import StudioSidebar from './_components/StudioSidebar';
import Logo from '@/components/Logo';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default function StudioLayout({ children, params }: Props) {
  const { lang } = use(params);

  return (
    <StudioAuthGuard>
      <div className="flex flex-col min-h-screen w-full">
        <div className="flex h-16 items-center justify-end gap-2.5 px-8 py-5 w-full bg-[#202020] border-b border-solid border-[#4a4a4b]">
          <Logo className="relative flex-1 mt-[-3.00px] mb-[-1.00px] tracking-[0]" />

          <div className="inline-flex items-center justify-end gap-4 relative flex-[0_0_auto]">
            <div className="inline-flex items-center overflow-hidden rounded-md justify-center relative">
              <div
                className="font-semibold w-fit mt-[-2.00px] tracking-[0] text-sm text-[#ffd83b] leading-[14px] whitespace-nowrap relative"
                style={{ fontFamily: 'Pretendard, Helvetica' }}
              >
                Button text
              </div>
            </div>
            <div className="inline-flex items-center justify-center gap-4 relative flex-[0_0_auto]">
              <Settings className="w-6 h-6" color="#A8A8AA" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 w-full bg-[#323232] overflow-hidden">
          <StudioSidebar lang={lang} />

          <div className="flex-1">{children}</div>
        </div>

        <Toaster position="top-right" />
      </div>
    </StudioAuthGuard>
  );
}
