import { getSession } from '@/lib/session';
import { Shield, Mail, User, ShieldCheck } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;

  // Render role badges nicely
  const renderRoles = () => {
    if (!user?.roles || user.roles.length === 0) return <span className="text-gray-400">No Roles</span>;
    return user.roles.map((r: Record<string, unknown> | string, idx: number) => {
      const roleName = typeof r === 'string' ? r : r.name || String(r);
      return (
        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
          <ShieldCheck className="w-3.5 h-3.5" />
          {String(roleName)}
        </span>
      );
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-2">Welcome back to the Sports Web Admin Panel.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Display Name</h3>
            <p className="text-gray-600 mt-1">{user?.displayName || 'N/A'}</p>
          </div>
        </div>

        {/* Email Card */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Mail className="w-6 h-6" />
          </div>
          <div className="truncate">
            <h3 className="font-semibold text-gray-900">Email Address</h3>
            <p className="text-gray-600 mt-1 truncate" title={user?.email}>{user?.email || 'N/A'}</p>
          </div>
        </div>

        {/* Roles Card */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-start gap-4 lg:col-span-1 md:col-span-2">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Assigned Roles</h3>
            <div className="flex flex-wrap gap-2">
              {renderRoles()}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Actions</h3>
        <p className="text-gray-500 mb-6">Use the sidebar to navigate to the respective management sections.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <span className="text-sm font-medium px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">Manage News & Categories</span>
          <span className="text-sm font-medium px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">Update Cricket Matches & Scorecards</span>
          <span className="text-sm font-medium px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">Edit Homepage & SEO</span>
        </div>
      </div>
    </div>
  );
}
