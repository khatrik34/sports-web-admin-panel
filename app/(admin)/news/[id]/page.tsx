"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { NewsForm } from '@/components/NewsForm';
import { use } from 'react';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const { data, isLoading } = useQuery({
    queryKey: ['admin-news', id],
    queryFn: () => fetchProxy(`/api/v1/admin/news/${id}`),
    enabled: id !== 'new',
  });

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Edit Article</h2>
      <NewsForm articleId={id} initialData={data} />
    </div>
  );
}
