"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';

type Role = { name: string; permissions: string[] };

export default function RolesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => fetchProxy(`/api/v1/admin/roles`),
  });

  if (error) return <div className="p-8 text-red-600">Failed to load roles</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Roles & Permissions</h2>
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Role Name</th>
              <th className="px-6 py-3 font-medium">Permissions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (
              (Array.isArray(data) ? data : []).map((r: Role) => (
                <tr key={r.name}>
                  <td className="px-6 py-4 font-medium">{r.name}</td>
                  <td className="px-6 py-4 whitespace-normal text-xs text-gray-600">{r.permissions?.join(', ')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
