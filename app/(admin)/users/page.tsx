"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';

type User = { id: string; email: string; displayName: string; roles: string[] };

export default function UsersPage() {
  const [page] = useState(0);
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; user?: User }>({ isOpen: false, mode: 'add' });
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => fetchProxy(`/api/v1/admin/users?page=${page}&size=20`),
  });

  const { register, handleSubmit, reset } = useForm();

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (modalState.mode === 'add') {
        return fetchProxy(`/api/v1/admin/users`, { method: 'POST', body: JSON.stringify(payload) });
      } else {
        const editPayload = { displayName: payload.displayName, roles: payload.roles };
        return fetchProxy(`/api/v1/admin/users/${modalState.user?.id}`, { method: 'PATCH', body: JSON.stringify(editPayload) });
      }
    },
    onSuccess: () => {
      setModalState({ isOpen: false, mode: 'add' });
      reset();
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err: {detail?: string; message?: string}) => {
      alert(`Error: ${err.detail || err.message}`);
    }
  });

  const openAdd = () => {
    reset({ email: '', password: '', displayName: '', roles: '' });
    setModalState({ isOpen: true, mode: 'add' });
  };

  const openEdit = (user: User) => {
    reset({ email: user.email, displayName: user.displayName, roles: user.roles?.join(', ') });
    setModalState({ isOpen: true, mode: 'edit', user });
  };

  const onSubmit = (d: Record<string, unknown>) => {
    const rolesArray = (d.roles as string).split(',').map(r => r.trim()).filter(Boolean);
    saveMutation.mutate({ ...d, roles: rolesArray });
  };

  if (error) return <div className="p-8 text-red-600">Failed to load users</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Staff Users</h2>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 font-medium text-gray-700">Roles</th>
              <th className="px-6 py-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-900">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : data?.content?.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found.</td></tr>
            ) : (
              data?.content?.map((u: User) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.displayName}</td>
                  <td className="px-6 py-4">
                    {u.roles?.map(r => (
                      <span key={r} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">{r}</span>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEdit(u)} className="text-blue-600 font-medium hover:underline">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        title={modalState.mode === 'add' ? 'Add New User' : 'Edit User'} 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input {...register('email')} disabled={modalState.mode === 'edit'} className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500" required />
          </div>
          {modalState.mode === 'add' && (
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" {...register('password')} className="w-full border rounded-md px-3 py-2" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <input {...register('displayName')} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Roles (comma-separated)</label>
            <input {...register('roles')} placeholder="e.g. ADMIN, EDITOR" className="w-full border rounded-md px-3 py-2" />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setModalState({ ...modalState, isOpen: false })} className="px-4 py-2 border rounded-md font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saveMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
              {saveMutation.isPending ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
