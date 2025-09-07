import { ReactNode } from 'react';
import AdminLayoutClient from './_components/AdminLayoutClient';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
