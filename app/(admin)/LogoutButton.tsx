"use client";

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-3 py-2.5 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 hover:shadow-sm border border-transparent hover:border-red-100 flex items-center gap-3 transition-all text-left"
    >
      <LogOut className="h-4 w-4 text-red-400" />
      Sign Out
    </button>
  );
}
