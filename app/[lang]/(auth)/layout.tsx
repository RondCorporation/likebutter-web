import { ReactNode } from 'react';
import AuthLayoutClient from './_components/AuthLayoutClient';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}
