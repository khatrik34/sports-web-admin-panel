import { getSession } from '@/lib/session';

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Welcome, {user?.displayName || user?.email}</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 p-6 rounded-xl flex flex-col justify-center">
          <h3 className="font-medium text-gray-500">Role</h3>
          <p className="text-lg font-bold mt-1">{user?.roles?.join(', ') || 'None'}</p>
        </div>
      </div>
    </div>
  );
}
