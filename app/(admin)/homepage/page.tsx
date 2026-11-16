"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';

export default function HomepageBuilderPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-homepage'],
    queryFn: () => fetchProxy(`/api/v1/admin/homepage`),
  });

  if (error) return <div className="p-8 text-red-600">Failed to load homepage config</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Homepage Builder</h2>
      <div className="bg-white border p-6 rounded-xl space-y-4">
        <p className="text-sm text-gray-500">Homepage sections editor will be rendered here.</p>
        {isLoading ? <p>Loading...</p> : (
           <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-auto">
             {JSON.stringify(data, null, 2)}
           </pre>
        )}
      </div>
    </div>
  );
}
