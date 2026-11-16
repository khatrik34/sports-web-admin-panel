"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type Tournament = { id: string; name: string; format: string; status: string; host: string };

export default function TournamentsPage() {
  const [page] = useState(0);
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-tournaments', page],
    queryFn: () => fetchProxy(`/api/v1/admin/tournaments?page=${page}&size=20`),
  });

  if (error) return <div className="p-8 text-red-600">Failed to load series</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Series & Tournaments</h2>
        <button className="bg-black text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Series
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Format</th>
              <th className="px-6 py-3 font-medium">Host</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (
              data?.content?.map((t: Tournament) => (
                <tr key={t.id}>
                  <td className="px-6 py-4 font-medium">{t.name}</td>
                  <td className="px-6 py-4">{t.format}</td>
                  <td className="px-6 py-4">{t.host}</td>
                  <td className="px-6 py-4">{t.status}</td>
                  <td className="px-6 py-4 text-blue-600 cursor-pointer hover:underline">Edit</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
