"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type Redirect = { id: string; fromPath: string; toPath?: string; statusCode: number; enabled: boolean };

export default function SeoRedirectsPage() {
  const [page] = useState(0);
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-redirects', page],
    queryFn: () => fetchProxy(`/api/v1/admin/redirects?page=${page}&size=20`),
  });

  if (error) return <div className="p-8 text-red-600">Failed to load redirects</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">SEO Redirects</h2>
        <button className="bg-black text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Redirect
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">From Path</th>
              <th className="px-6 py-3 font-medium">To Path</th>
              <th className="px-6 py-3 font-medium">Status Code</th>
              <th className="px-6 py-3 font-medium">Enabled</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (
              data?.content?.map((r: Redirect) => (
                <tr key={r.id}>
                  <td className="px-6 py-4">{r.fromPath}</td>
                  <td className="px-6 py-4">{r.toPath || '-'}</td>
                  <td className="px-6 py-4">{r.statusCode}</td>
                  <td className="px-6 py-4">{r.enabled ? 'Yes' : 'No'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
