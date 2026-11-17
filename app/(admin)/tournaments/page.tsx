"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';

type Tournament = { id: string; name: string; format: string; status: string; host: string; description?: string };

export default function TournamentsPage() {
  const [page] = useState(0);
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; tournament?: Tournament }>({ isOpen: false, mode: 'add' });
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-tournaments', page],
    queryFn: () => fetchProxy(`/api/v1/admin/tournaments?page=${page}&size=20`),
  });

  const { register, handleSubmit, reset } = useForm();

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (modalState.mode === 'add') {
        return fetchProxy(`/api/v1/admin/tournaments`, { method: 'POST', body: JSON.stringify(payload) });
      } else {
        return fetchProxy(`/api/v1/admin/tournaments/${modalState.tournament?.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      }
    },
    onSuccess: () => {
      setModalState({ isOpen: false, mode: 'add' });
      reset();
      queryClient.invalidateQueries({ queryKey: ['admin-tournaments'] });
    },
    onError: (err: {detail?: string; message?: string}) => alert(`Error: ${err.detail || err.message}`)
  });

  const openAdd = () => {
    reset({ name: '', format: '', status: '', host: '', description: '' });
    setModalState({ isOpen: true, mode: 'add' });
  };

  const openEdit = (tournament: Tournament) => {
    reset({ name: tournament.name, format: tournament.format, status: tournament.status, host: tournament.host, description: tournament.description || '' });
    setModalState({ isOpen: true, mode: 'edit', tournament });
  };

  if (error) return <div className="p-8 text-red-600">Failed to load series</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Series & Tournaments</h2>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Series
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 font-medium text-gray-700">Format</th>
              <th className="px-6 py-3 font-medium text-gray-700">Host</th>
              <th className="px-6 py-3 font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-900">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (
              data?.content?.map((t: Tournament) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{t.name}</td>
                  <td className="px-6 py-4">{t.format}</td>
                  <td className="px-6 py-4">{t.host}</td>
                  <td className="px-6 py-4">{t.status}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEdit(t)} className="text-blue-600 hover:underline font-medium">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        title={modalState.mode === 'add' ? 'Add Series' : 'Edit Series'} 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      >
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input {...register('name')} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Format</label>
            <input {...register('format')} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Host</label>
            <input {...register('host')} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <input {...register('status')} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea {...register('description')} className="w-full border rounded-md px-3 py-2" rows={3} />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setModalState({ ...modalState, isOpen: false })} className="px-4 py-2 border rounded-md font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saveMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
              {saveMutation.isPending ? 'Saving...' : 'Save Series'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
