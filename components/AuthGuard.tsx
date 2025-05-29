'use client';
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthGuard({ children }: { children: ReactNode }) {
  useAuth(true);
  return <>{children}</>;
}
