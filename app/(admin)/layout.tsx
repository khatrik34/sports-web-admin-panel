import Link from 'next/link';
import { LayoutDashboard, Users, Trophy, Settings, FileText, Video, Component } from 'lucide-react';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { LogoutButton } from './LogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user;
  const perms: string[] = user.permissions || [];

  const hasPerm = (p: string) => perms.includes(p);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#09090b]">
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 flex flex-col">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold tracking-tight">Sports Web</h1>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          
          {(hasPerm('news:read') || hasPerm('news:write')) && (
            <Link href="/news" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900">
              <FileText className="h-4 w-4" />
              News
            </Link>
          )}

          {(hasPerm('cricket:read') || hasPerm('cricket:write')) && (
            <>
              <Link href="/matches" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900">
                <Trophy className="h-4 w-4" />
                Matches & Series
              </Link>
              <Link href="/teams" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900">
                <Component className="h-4 w-4" />
                Teams & Players
              </Link>
            </>
          )}

          <div className="px-3 py-2 text-sm font-medium rounded-md text-gray-500 cursor-not-allowed opacity-50 flex items-center gap-3" title="Phase 3">
            <Video className="h-4 w-4" />
            Media & Videos
          </div>

          {(hasPerm('users:read') || hasPerm('users:manage') || hasPerm('roles:read')) && (
            <Link href="/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900">
              <Users className="h-4 w-4" />
              Users & Roles
            </Link>
          )}

          {hasPerm('audit:read') && (
            <Link href="/audit" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900">
              <Settings className="h-4 w-4" />
              Audit Logs
            </Link>
          )}
        </nav>

        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-black/50">
        {user.mustChangePassword && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 border-b border-yellow-200 dark:border-yellow-900/50 text-sm text-yellow-800 dark:text-yellow-500 flex justify-center">
            <strong>Security Notice:</strong> You must change your password. (Feature coming soon)
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
