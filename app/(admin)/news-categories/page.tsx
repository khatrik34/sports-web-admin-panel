"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type Category = { id: string; name: string; slug: string };

export default function NewsCategoriesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-news-categories'],
    queryFn: () => fetchProxy(`/api/v1/admin/news-categories`),
  });

  if (error) return <div className="p-8 text-red-600">Failed to load categories</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">News Categories</h2>
        <button className="bg-black text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : !data || data.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No categories found.</td></tr>
            ) : (
              (Array.isArray(data) ? data : []).map((cat: Category) => (
                <tr key={cat.id}>
                  <td className="px-6 py-4">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                  <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">Edit</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
