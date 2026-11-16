"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Video = { id: string; title: string; category: string; visible: boolean; publishedAt: string };

export default function VideosPage() {
  const [page] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-videos', page],
    queryFn: () => fetchProxy(`/api/v1/admin/videos?page=${page}&size=20`),
  });

  const { register, handleSubmit, reset } = useForm();

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => fetchProxy(`/api/v1/admin/videos`, { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      reset();
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
    }
  });

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
        <button onClick={() => setShowModal(true)} className="bg-black text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Video
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add Video</h3>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit((d) => {
              const payload = {
                ...d,
                visible: d.visible === 'true',
                duration: d.duration ? parseInt(d.duration as string, 10) : null
              };
              saveMutation.mutate(payload);
            })} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input {...register('title')} className="w-full border rounded-md px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input {...register('category')} className="w-full border rounded-md px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Video URL (Embed)</label>
                  <input {...register('videoUrl')} className="w-full border rounded-md px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                  <input {...register('thumbnailUrl')} className="w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (seconds)</label>
                  <input type="number" {...register('duration')} className="w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Published At</label>
                  <input type="datetime-local" {...register('publishedAt')} className="w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Visible</label>
                  <select {...register('visible')} className="w-full border rounded-md px-3 py-2">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea {...register('description')} className="w-full border rounded-md px-3 py-2" rows={3}></textarea>
              </div>
              <button type="submit" disabled={saveMutation.isPending} className="w-full bg-black text-white py-2 rounded-md font-medium">Save Video</button>
            </form>
          </div>
        </div>
      )}

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
                  <td className="px-6 py-4">{v.publishedAt ? new Date(v.publishedAt).toLocaleString() : '-'}</td>
                  <td className="px-6 py-4">{v.visible ? 'Visible' : 'Hidden'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleVisibility.mutate({ id: v.id, visible: v.visible })} className="text-blue-600 hover:underline">
                      {v.visible ? 'Hide' : 'Show'}
                    </button>
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
