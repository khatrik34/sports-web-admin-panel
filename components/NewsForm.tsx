"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().optional(),
  body: z.string().min(1, "Body is required"),
  categoryName: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  coverImageAlt: z.string().optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }).optional(),
});

type NewsFormValues = z.infer<typeof newsSchema>;

export function NewsForm({ initialData, articleId }: { initialData?: Record<string, unknown>; articleId?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: initialData || {
      title: "",
      summary: "",
      body: "",
      categoryName: "",
      coverImageUrl: "",
      coverImageAlt: "",
      seo: { metaTitle: "", metaDescription: "" }
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: NewsFormValues) => {
      const payload = { ...data, bodyFormat: "HTML" };
      if (articleId && articleId !== 'new') {
        return fetchProxy(`/api/v1/admin/news/${articleId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return fetchProxy(`/api/v1/admin/news`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      router.push('/news');
      router.refresh();
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6 max-w-4xl">
      <div className="bg-white border p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-bold">Article Content</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input {...register('title')} className="w-full border rounded-md px-3 py-2" />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input {...register('categoryName')} className="w-full border rounded-md px-3 py-2" placeholder="e.g. Test Cricket" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <textarea {...register('summary')} className="w-full border rounded-md px-3 py-2" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Body (HTML)</label>
          <textarea {...register('body')} className="w-full border rounded-md px-3 py-2 font-mono text-sm" rows={10} />
          {errors.body && <p className="text-red-500 text-xs">{errors.body.message}</p>}
        </div>
      </div>

      <div className="bg-white border p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-bold">Cover Image</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input {...register('coverImageUrl')} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image Alt Text</label>
          <input {...register('coverImageAlt')} className="w-full border rounded-md px-3 py-2" />
        </div>
      </div>

      <div className="bg-white border p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-bold">SEO (For Public Website)</h3>
        <p className="text-sm text-gray-500">These fields help search engines understand the article on your public site.</p>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Title</label>
          <input {...register('seo.metaTitle')} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Description</label>
          <textarea {...register('seo.metaDescription')} className="w-full border rounded-md px-3 py-2" rows={3} />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saveMutation.isPending} className="bg-black text-white px-6 py-2 rounded-md font-medium">
          {saveMutation.isPending ? 'Saving...' : 'Save Draft'}
        </button>
      </div>
    </form>
  );
}
