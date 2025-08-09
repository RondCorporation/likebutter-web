
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { apiServer } from '@/app/_lib/apiServer';
import { User } from '@/app/_stores/authStore';

async function getUserProfile(): Promise<User | null> {
  try {
    // apiServer.get returns an ApiResponse object: { status, data, msg }
    const { data: user } = await apiServer.get<User>('/users/me');
    return user || null;
  } catch (error) {
    // Errors are expected if the user is not logged in, so we don't need to log them here.
    // The calling function will handle the null case.
    return null;
  }
}

export default async function AdminPage() {
  console.log('--- Admin Page Access ---');
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  console.log('Retrieved Access Token:', accessToken ? `Bearer ${accessToken.substring(0, 15)}...` : 'Not Found');

  if (!accessToken) {
    console.log('No access token found. Denying access.');
    notFound();
  }

  const user = await getUserProfile();
  console.log('API Response (/users/me):', user);

  if (user?.role !== 'ROLE_ADMIN') {
    console.log(`Access Denied: User role is "${user?.role}", not "ROLE_ADMIN".`);
    notFound();
  }

  console.log('Access Granted: User is an admin.');
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Admin Page</h1>
        <p className="mt-4 text-lg">Welcome, Administrator.</p>
      </div>
    </div>
  );
}
