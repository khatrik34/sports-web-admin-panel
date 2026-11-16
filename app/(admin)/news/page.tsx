"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Article = { id: string; title: string; status: string; publishedAt: string };

function useNews(page = 0, size = 20) {
  return useQuery({
    queryKey: ['admin-news', page, size],
    queryFn: () => fetchProxy(`/api/v1/admin/news?page=${page}&size=${size}`),
  });
}

export default function NewsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useNews(page);

  if (error) {
    return <div className="p-8 text-red-600">Failed to load news: {(error as {detail?: string})?.detail || error.message}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">News Articles</h2>
        <Link href="/news/new" className="bg-black text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Article
        </Link>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : data?.content?.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No articles found.</td></tr>
            ) : (
              data?.content?.map((article: Article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 truncate max-w-[300px]">{article.title}</td>
                  <td className="px-6 py-4">{article.status || 'DRAFT'}</td>
                  <td className="px-6 py-4">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4"><Link href={`/news/${article.id}`} className="text-blue-600 hover:underline">Edit</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
