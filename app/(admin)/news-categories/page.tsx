"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';

type Category = { id: string; name: string; slug: string; description?: string };

export default function NewsCategoriesPage() {
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; category?: Category }>({ isOpen: false, mode: 'add' });
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-news-categories'],
    queryFn: () => fetchProxy(`/api/v1/admin/news-categories`),
  });

  const { register, handleSubmit, reset } = useForm();

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (modalState.mode === 'add') {
        return fetchProxy(`/api/v1/admin/news-categories`, { method: 'POST', body: JSON.stringify(payload) });
      } else {
        return fetchProxy(`/api/v1/admin/news-categories/${modalState.category?.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      }
    },
    onSuccess: () => {
      setModalState({ isOpen: false, mode: 'add' });
      reset();
      queryClient.invalidateQueries({ queryKey: ['admin-news-categories'] });
    },
    onError: (err: {detail?: string; message?: string}) => {
      alert(`Error: ${err.detail || err.message}`);
    }
  });

  const openAdd = () => {
    reset({ name: '', slug: '', description: '' });
    setModalState({ isOpen: true, mode: 'add' });
  };

  const openEdit = (category: Category) => {
    reset({ name: category.name, slug: category.slug, description: category.description || '' });
    setModalState({ isOpen: true, mode: 'edit', category });
  };

  const onSubmit = (d: Record<string, unknown>) => {
    saveMutation.mutate(d);
  };

  if (error) return <div className="p-8 text-red-600">Failed to load categories</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">News Categories</h2>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 font-medium text-gray-700">Slug</th>
              <th className="px-6 py-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-900">
            {isLoading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : !data || data.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No categories found.</td></tr>
            ) : (
              (Array.isArray(data) ? data : []).map((cat: Category) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEdit(cat)} className="text-blue-600 font-medium hover:underline">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        title={modalState.mode === 'add' ? 'Add Category' : 'Edit Category'} 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input {...register('name')} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input {...register('slug')} className="w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea {...register('description')} className="w-full border rounded-md px-3 py-2" rows={3} />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setModalState({ ...modalState, isOpen: false })} className="px-4 py-2 border rounded-md font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saveMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
              {saveMutation.isPending ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
