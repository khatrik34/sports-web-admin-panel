"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';

type Player = { id: string; name: string; country: string; role: string; active: boolean };

export default function PlayersPage() {
  const [page] = useState(0);
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; player?: Player }>({ isOpen: false, mode: 'add' });
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-players', page],
    queryFn: () => fetchProxy(`/api/v1/admin/players?page=${page}&size=20`),
  });

  const { register, handleSubmit, reset } = useForm();

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (modalState.mode === 'add') {
        return fetchProxy(`/api/v1/admin/players`, { method: 'POST', body: JSON.stringify(payload) });
      } else {
        return fetchProxy(`/api/v1/admin/players/${modalState.player?.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      }
    },
    onSuccess: () => {
      setModalState({ isOpen: false, mode: 'add' });
      reset();
      queryClient.invalidateQueries({ queryKey: ['admin-players'] });
    },
    onError: (err: {detail?: string; message?: string}) => alert(`Error: ${err.detail || err.message}`)
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const endpoint = active ? `/api/v1/admin/players/${id}/deactivate` : `/api/v1/admin/players/${id}/activate`;
      return fetchProxy(endpoint, { method: 'POST' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-players'] })
  });

  const openAdd = () => {
    reset({ name: '', country: '', role: '' });
    setModalState({ isOpen: true, mode: 'add' });
  };

  const openEdit = (player: Player) => {
    reset({ name: player.name, country: player.country, role: player.role });
    setModalState({ isOpen: true, mode: 'edit', player });
  };

  if (error) return <div className="p-8 text-red-600">Failed to load players</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Players</h2>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Player
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 font-medium text-gray-700">Country</th>
              <th className="px-6 py-3 font-medium text-gray-700">Role</th>
              <th className="px-6 py-3 font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-900">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (
              data?.content?.map((p: Player) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{p.name}</td>
                  <td className="px-6 py-4">{p.country}</td>
                  <td className="px-6 py-4">{p.role}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${p.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus.mutate({ id: p.id, active: p.active })} className="text-blue-600 hover:underline mr-4 font-medium">Toggle Status</button>
                    <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline font-medium">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        title={modalState.mode === 'add' ? 'Add Player' : 'Edit Player'} 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      >
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input {...register('name')} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input {...register('country')} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input {...register('role')} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setModalState({ ...modalState, isOpen: false })} className="px-4 py-2 border rounded-md font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saveMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
              {saveMutation.isPending ? 'Saving...' : 'Save Player'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
