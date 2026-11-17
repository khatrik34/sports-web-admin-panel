import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user;

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar user={user} />

      <main className="flex-1 overflow-auto flex flex-col relative">
        {user.mustChangePassword && (
          <div className="bg-yellow-50 p-3 border-b border-yellow-200 text-sm text-yellow-800 flex justify-center items-center shadow-sm z-20">
            <strong>Security Notice:</strong>&nbsp;You must change your password.
          </div>
        )}
        <div className="flex-1 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
