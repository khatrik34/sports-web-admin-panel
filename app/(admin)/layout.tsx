import Link from 'next/link';
import { LayoutDashboard, Users, Trophy, Settings, FileText, Video, Component, Shield, Tags, Image as ImageIcon, Link as LinkIcon, Home } from 'lucide-react';
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
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 border-r bg-white p-4 flex flex-col overflow-y-auto">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold tracking-tight">Sports Web</h1>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          {(hasPerm('homepage:read') || hasPerm('homepage:write')) && (
            <Link href="/homepage" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
              <Home className="h-4 w-4" />
              Homepage Builder
            </Link>
          )}
          
          {(hasPerm('news:read') || hasPerm('news:write')) && (
            <>
              <Link href="/news" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                <FileText className="h-4 w-4" />
                News
              </Link>
              <Link href="/news-categories" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 pl-8">
                <Tags className="h-4 w-4" />
                Categories
              </Link>
            </>
          )}

          {(hasPerm('videos:read') || hasPerm('videos:write')) && (
             <Link href="/videos" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
               <Video className="h-4 w-4" />
               Videos
             </Link>
          )}

          {(hasPerm('media:read') || hasPerm('media:write')) && (
             <Link href="/media" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
               <ImageIcon className="h-4 w-4" />
               Media Library
             </Link>
          )}

          {(hasPerm('seo:read') || hasPerm('seo:write')) && (
             <Link href="/seo" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
               <LinkIcon className="h-4 w-4" />
               Redirects
             </Link>
          )}

          {(hasPerm('cricket:read') || hasPerm('cricket:write')) && (
            <>
              <Link href="/matches" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                <Trophy className="h-4 w-4" />
                Matches & Fixtures
              </Link>
              <Link href="/tournaments" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 pl-8">
                <Trophy className="h-4 w-4" />
                Series
              </Link>
              <Link href="/teams" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                <Component className="h-4 w-4" />
                Teams
              </Link>
              <Link href="/players" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 pl-8">
                <Users className="h-4 w-4" />
                Players
              </Link>
            </>
          )}

          {(hasPerm('users:read') || hasPerm('users:manage') || hasPerm('roles:read')) && (
            <>
              <Link href="/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                <Users className="h-4 w-4" />
                Staff Users
              </Link>
              <Link href="/roles" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 pl-8">
                <Shield className="h-4 w-4" />
                Roles
              </Link>
            </>
          )}

          {hasPerm('audit:read') && (
            <Link href="/audit" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
              <Settings className="h-4 w-4" />
              Audit Logs
            </Link>
          )}
        </nav>

        <div className="mt-auto pt-4 border-t">
          <Link href="/change-password" className="w-full px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 flex items-center gap-3 transition-colors text-left mb-2">
            <Shield className="h-4 w-4" />
            Change Password
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-gray-50">
        {user.mustChangePassword && (
          <div className="bg-yellow-50 p-4 border-b border-yellow-200 text-sm text-yellow-800 flex justify-center">
            <strong>Security Notice:</strong> You must change your password.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
