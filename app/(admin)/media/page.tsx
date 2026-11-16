"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type Media = { id: string; url: string; altText?: string; credit?: string };

export default function MediaPage() {
  const [page] = useState(0);
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-media', page],
    queryFn: () => fetchProxy(`/api/v1/admin/media?page=${page}&size=20`),
  });

  if (error) return <div className="p-8 text-red-600">Failed to load media</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
        <button className="bg-black text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Register Asset
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">URL</th>
              <th className="px-6 py-3 font-medium">Alt Text</th>
              <th className="px-6 py-3 font-medium">Credit</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (
              data?.content?.map((m: Media) => (
                <tr key={m.id}>
                  <td className="px-6 py-4 truncate max-w-[300px]">{m.url}</td>
                  <td className="px-6 py-4">{m.altText || '-'}</td>
                  <td className="px-6 py-4">{m.credit || '-'}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:underline mr-4">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
