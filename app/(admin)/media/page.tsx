"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Media = { id: string; url: string; altText?: string; credit?: string };

export default function MediaPage() {
  const [page] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-media', page],
    queryFn: () => fetchProxy(`/api/v1/admin/media?page=${page}&size=20`),
  });

  const { register, handleSubmit, reset } = useForm();

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => fetchProxy(`/api/v1/admin/media`, { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      reset();
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => fetchProxy(`/api/v1/admin/media/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-media'] })
  });

  if (error) return <div className="p-8 text-red-600">Failed to load media</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
        <button onClick={() => setShowModal(true)} className="bg-black text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Register Asset
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Register Asset</h3>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">URL (starts with http or /)</label>
                <input {...register('url')} className="w-full border rounded-md px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alt Text</label>
                <input {...register('altText')} className="w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Credit</label>
                <input {...register('credit')} className="w-full border rounded-md px-3 py-2" />
              </div>
              <button type="submit" disabled={saveMutation.isPending} className="w-full bg-black text-white py-2 rounded-md font-medium">Save</button>
            </form>
          </div>
        </div>
      )}

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
                    <button onClick={() => deleteMutation.mutate(m.id)} className="text-red-600 hover:underline">Delete</button>
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
