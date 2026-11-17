"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Trophy, Settings, FileText, Video, Component, Shield, Tags, Image as ImageIcon, Link as LinkIcon, Home, ChevronRight } from 'lucide-react';
import { LogoutButton } from '@/app/(admin)/LogoutButton';
import { ElementType } from 'react';

const NavLink = ({ href, icon: Icon, label, nested = false, pathname }: { href: string; icon: ElementType; label: string; nested?: boolean; pathname: string }) => {
  const isActive = pathname.startsWith(href) && (href !== '/' || pathname === '/');
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${nested ? 'ml-6' : ''} ${
        isActive 
          ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
      <span className="flex-1">{label}</span>
      {isActive && !nested && <ChevronRight className="h-4 w-4 text-blue-400 opacity-50" />}
    </Link>
  );
};

export function Sidebar({ user }: { user: Record<string, unknown> }) {
  const pathname = usePathname();
  const perms: string[] = (user?.permissions as string[]) || [];
  const hasPerm = (p: string) => perms.includes(p);

  return (
    <aside className="w-72 border-r bg-white flex flex-col h-full overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      <div className="p-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Sports Web</h1>
        <p className="text-xs text-gray-500 font-medium mt-1 truncate uppercase tracking-wider">{user?.email as string}</p>
      </div>
      
      <nav className="flex-1 px-4 pb-6 space-y-1">
        <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" pathname={pathname} />
        
        {(hasPerm('homepage:read') || hasPerm('homepage:write')) && (
          <div className="pt-2">
            <NavLink href="/homepage" icon={Home} label="Homepage Builder" pathname={pathname} />
          </div>
        )}

        {(hasPerm('news:read') || hasPerm('news:write')) && (
          <div className="pt-4">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Content</p>
            <NavLink href="/news" icon={FileText} label="Articles" pathname={pathname} />
            <NavLink href="/news-categories" icon={Tags} label="Categories" nested pathname={pathname} />
          </div>
        )}

        {(hasPerm('cricket:read') || hasPerm('cricket:write')) && (
          <div className="pt-4">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cricket Data</p>
            <NavLink href="/matches" icon={Trophy} label="Matches & Fixtures" pathname={pathname} />
            <NavLink href="/tournaments" icon={Trophy} label="Series" nested pathname={pathname} />
            <NavLink href="/teams" icon={Component} label="Teams" pathname={pathname} />
            <NavLink href="/players" icon={Users} label="Players" nested pathname={pathname} />
          </div>
        )}

        {((hasPerm('videos:read') || hasPerm('videos:write')) || (hasPerm('media:read') || hasPerm('media:write'))) && (
          <div className="pt-4">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Media</p>
            {(hasPerm('videos:read') || hasPerm('videos:write')) && <NavLink href="/videos" icon={Video} label="Videos" pathname={pathname} />}
            {(hasPerm('media:read') || hasPerm('media:write')) && <NavLink href="/media" icon={ImageIcon} label="Asset Library" pathname={pathname} />}
          </div>
        )}

        {(hasPerm('users:read') || hasPerm('users:manage') || hasPerm('roles:read') || hasPerm('seo:read') || hasPerm('audit:read')) && (
          <div className="pt-4">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">System</p>
            {(hasPerm('seo:read') || hasPerm('seo:write')) && <NavLink href="/seo" icon={LinkIcon} label="SEO Redirects" pathname={pathname} />}
            {(hasPerm('users:read') || hasPerm('users:manage')) && <NavLink href="/users" icon={Users} label="Staff Users" pathname={pathname} />}
            {(hasPerm('roles:read')) && <NavLink href="/roles" icon={Shield} label="Roles" nested pathname={pathname} />}
            {(hasPerm('audit:read')) && <NavLink href="/audit" icon={Settings} label="Audit Logs" pathname={pathname} />}
          </div>
        )}
      </nav>

      <div className="p-4 border-t bg-gray-50/50">
        <Link href="/change-password" className="w-full px-3 py-2.5 text-sm font-medium rounded-xl text-gray-700 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 flex items-center gap-3 transition-all mb-2">
          <Shield className="h-4 w-4 text-gray-400" />
          Security
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
