import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { apiServer } from '@/app/_lib/apiServer';
import { User } from '@/app/_types/api';
import dynamic from 'next/dynamic';

const AdminDashboardClient = dynamic(
  () => import('./_components/AdminDashboardClient'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    ),
  }
);

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
