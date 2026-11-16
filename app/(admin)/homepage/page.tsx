"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { useState } from 'react';

export default function HomepageBuilderPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-homepage'],
    queryFn: () => fetchProxy(`/api/v1/admin/homepage`),
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => fetchProxy(`/api/v1/admin/homepage`, { method: 'PUT', body: JSON.stringify(payload) }),
    onSuccess: () => {
      alert('Homepage config saved');
      queryClient.invalidateQueries({ queryKey: ['admin-homepage'] });
    }
  });

  if (error) return <div className="p-8 text-red-600">Failed to load homepage config</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Homepage Builder</h2>
      <div className="bg-white border p-6 rounded-xl space-y-4">
        <p className="text-sm text-gray-500">Edit the entire homepage configuration below (JSON format).</p>
        {isLoading ? <p>Loading...</p> : (
           <form onSubmit={(e) => {
             e.preventDefault();
             const val = (e.currentTarget.elements.namedItem("configData") as HTMLTextAreaElement).value;
             try {
               saveMutation.mutate(JSON.parse(val));
             } catch(err) {
               alert("Invalid JSON");
             }
           }}>
             <textarea 
               name="configData"
               className="w-full h-96 border rounded-md p-2 font-mono text-xs mb-4" 
               defaultValue={JSON.stringify(data || { sections: [] }, null, 2)}
             />
             <button type="submit" disabled={saveMutation.isPending} className="bg-black text-white px-4 py-2 rounded-md font-medium text-sm">
               Save Configuration
             </button>
           </form>
        )}
      </div>
    </div>
  );
}
