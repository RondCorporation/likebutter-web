import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { apiServer } from '@/app/_lib/apiServer';
import { User } from '@/app/_types/api';

import AdminDashboardClient from './_components/AdminDashboardClient';

async function getUserProfile(): Promise<User | null> {
  try {
    const { data: user } = await apiServer.get<User>('/users/me');
    return user || null;
  } catch (error) {
    return null;
  }
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    notFound();
  }

  const user = await getUserProfile();

  if (!user?.roles.includes('ROLE_ADMIN')) {
    notFound();
  }

  return <AdminDashboardClient />;
}
