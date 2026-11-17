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

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => fetchProxy(`/api/v1/admin/users?page=${page}&size=20`),
  });

  const { data: rolesData } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => fetchProxy(`/api/v1/admin/roles`),
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
    reset({ email: '', password: '', displayName: '', roles: [] });
    setModalState({ isOpen: true, mode: 'add' });
  };

  const openEdit = (user: User) => {
    let rolesArray: string[] = [];
    if (Array.isArray(user.roles)) {
      rolesArray = user.roles.map(r => typeof r === 'string' ? r : (r as {name?: string}).name || '');
    }
    reset({ email: user.email, displayName: user.displayName, roles: rolesArray });
    setModalState({ isOpen: true, mode: 'edit', user });
  };

  const onSubmit = (d: Record<string, unknown>) => {
    // If roles is empty or undefined, ensure it's an array
    const rolesArray = Array.isArray(d.roles) ? d.roles : (d.roles ? [d.roles] : []);
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

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
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
            ) : usersData?.content?.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found.</td></tr>
            ) : (
              usersData?.content?.map((u: User) => {
                const rolesArray = Array.isArray(u.roles) ? u.roles.map(r => typeof r === 'string' ? r : (r as {name?: string}).name || String(r)) : [];
                return (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{u.displayName}</td>
                    <td className="px-6 py-4">
                      {rolesArray.map((r: string, idx: number) => (
                        <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">{r}</span>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => openEdit(u)} className="text-blue-600 font-medium hover:underline">Edit</button>
                    </td>
                  </tr>
                );
              })
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
            <label className="block text-sm font-medium mb-1">Assign Roles</label>
            <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
              {Array.isArray(rolesData) && rolesData.length > 0 ? (
                rolesData.map((role: { name: string }) => (
                  <label key={role.name} className="flex items-center gap-2">
                    <input type="checkbox" value={role.name} {...register('roles')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm">{role.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">No roles available or loading...</p>
              )}
            </div>
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
