"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type Video = { id: string; title: string; category: string; visible: boolean; publishedAt: string };

export default function VideosPage() {
  const [page] = useState(0);
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-videos', page],
    queryFn: () => fetchProxy(`/api/v1/admin/videos?page=${page}&size=20`),
  });
  const queryClient = useQueryClient();

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, visible }: { id: string; visible: boolean }) => {
      const endpoint = visible ? `/api/v1/admin/videos/${id}/hide` : `/api/v1/admin/videos/${id}/show`;
      return fetchProxy(endpoint, { method: 'POST' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-videos'] })
  });

  if (error) return <div className="p-8 text-red-600">Failed to load videos</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Videos</h2>
        <button className="bg-black text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Video
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Published At</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (
              data?.content?.map((v: Video) => (
                <tr key={v.id}>
                  <td className="px-6 py-4 truncate max-w-[250px]">{v.title}</td>
                  <td className="px-6 py-4">{v.category}</td>
                  <td className="px-6 py-4">{v.publishedAt ? new Date(v.publishedAt).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4">{v.visible ? 'Visible' : 'Hidden'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleVisibility.mutate({ id: v.id, visible: v.visible })} className="text-blue-600 hover:underline mr-4">
                      {v.visible ? 'Hide' : 'Show'}
                    </button>
                    <button className="text-blue-600 hover:underline">Edit</button>
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
