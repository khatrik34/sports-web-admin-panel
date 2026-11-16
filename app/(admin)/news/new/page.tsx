import { NewsForm } from '@/components/NewsForm';

export default function NewArticlePage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Create New Article</h2>
      <NewsForm articleId="new" />
    </div>
  );
}
