import AuthGuard from '@/app/_components/AuthGuard';
import { ReactNode } from 'react';

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
