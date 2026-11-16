"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Redirect = { id: string; fromPath: string; toPath?: string; statusCode: number; enabled: boolean };

export default function SeoRedirectsPage() {
  const [page] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-redirects', page],
    queryFn: () => fetchProxy(`/api/v1/admin/redirects?page=${page}&size=20`),
  });

  const { register, handleSubmit, reset } = useForm();

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => fetchProxy(`/api/v1/admin/redirects`, { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      reset();
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ['admin-redirects'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => fetchProxy(`/api/v1/admin/redirects/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-redirects'] })
  });

  if (error) return <div className="p-8 text-red-600">Failed to load redirects</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">SEO Redirects</h2>
        <button onClick={() => setShowModal(true)} className="bg-black text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Redirect
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add Redirect</h3>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit((d) => {
              const payload = {
                ...d,
                statusCode: parseInt(d.statusCode as string, 10),
                enabled: d.enabled === 'true'
              };
              saveMutation.mutate(payload);
            })} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">From Path</label>
                <input {...register('fromPath')} className="w-full border rounded-md px-3 py-2" required placeholder="/old-path" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">To Path</label>
                <input {...register('toPath')} className="w-full border rounded-md px-3 py-2" placeholder="/new-path (empty for 410)" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status Code</label>
                <select {...register('statusCode')} className="w-full border rounded-md px-3 py-2">
                  <option value="301">301 (Moved Permanently)</option>
                  <option value="302">302 (Found)</option>
                  <option value="307">307 (Temporary Redirect)</option>
                  <option value="308">308 (Permanent Redirect)</option>
                  <option value="410">410 (Gone)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Enabled</label>
                <select {...register('enabled')} className="w-full border rounded-md px-3 py-2">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Note</label>
                <input {...register('note')} className="w-full border rounded-md px-3 py-2" />
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
              <th className="px-6 py-3 font-medium">From Path</th>
              <th className="px-6 py-3 font-medium">To Path</th>
              <th className="px-6 py-3 font-medium">Status Code</th>
              <th className="px-6 py-3 font-medium">Enabled</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (
              data?.content?.map((r: Redirect) => (
                <tr key={r.id}>
                  <td className="px-6 py-4">{r.fromPath}</td>
                  <td className="px-6 py-4">{r.toPath || '-'}</td>
                  <td className="px-6 py-4">{r.statusCode}</td>
                  <td className="px-6 py-4">{r.enabled ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => deleteMutation.mutate(r.id)} className="text-red-600 hover:underline">Delete</button>
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
