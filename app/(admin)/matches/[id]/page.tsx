"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { use } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

type Commentary = { id: string; over: string; kind: string; text: string };

export default function MatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const queryClient = useQueryClient();
  
  const { data: match, isLoading } = useQuery({
    queryKey: ['admin-match', id],
    queryFn: () => fetchProxy(`/api/v1/admin/matches/${id}`),
  });

  const { data: scorecard } = useQuery({
    queryKey: ['admin-scorecard', id],
    queryFn: () => fetchProxy(`/api/v1/admin/matches/${id}/scorecard`).catch(() => ({ innings: [] })),
  });

  const { data: commentary } = useQuery({
    queryKey: ['admin-commentary', id],
    queryFn: () => fetchProxy(`/api/v1/admin/matches/${id}/commentary`).catch(() => []),
  });

  const saveScorecard = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => fetchProxy(`/api/v1/admin/matches/${id}/scorecard`, { method: 'PUT', body: JSON.stringify(payload) }),
    onSuccess: () => {
      alert("Scorecard saved");
      queryClient.invalidateQueries({ queryKey: ['admin-scorecard', id] });
    }
  });

  const { register, handleSubmit, reset } = useForm();
  
  const addCommentary = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => fetchProxy(`/api/v1/admin/matches/${id}/commentary`, { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ['admin-commentary', id] });
    }
  });

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/matches" className="text-blue-600 text-sm hover:underline mb-2 block">&larr; Back to Matches</Link>
        <h2 className="text-2xl font-bold tracking-tight">Match Details</h2>
        <p className="text-gray-500">{match?.team1?.name} vs {match?.team2?.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scorecard */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Scorecard Editor</h3>
          <p className="text-sm text-gray-500 mb-4">Edit innings data (JSON format for advanced control)</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            const val = (e.currentTarget.elements.namedItem("scorecardData") as HTMLTextAreaElement).value;
            try { saveScorecard.mutate(JSON.parse(val)); } catch (err) { alert("Invalid JSON"); }
          }}>
            <textarea 
              name="scorecardData"
              className="w-full h-64 border rounded-md p-2 font-mono text-xs mb-4" 
              defaultValue={JSON.stringify(scorecard || { innings: [] }, null, 2)}
            />
            <button type="submit" disabled={saveScorecard.isPending} className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">Save Scorecard</button>
          </form>
        </div>

        {/* Commentary */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Commentary</h3>
          <form onSubmit={handleSubmit((data) => addCommentary.mutate(data as Record<string, unknown>))} className="mb-6 space-y-4 border-b pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Over</label>
                <input {...register('over')} placeholder="e.g. 14.2" className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Kind</label>
                <input {...register('kind')} placeholder="e.g. FOUR, WICKET" className="w-full border p-2 rounded-md" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Text</label>
              <textarea {...register('text')} className="w-full border p-2 rounded-md" rows={2} />
            </div>
            <button type="submit" disabled={addCommentary.isPending} className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">Add Ball</button>
          </form>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Array.isArray(commentary) && commentary.map((c: Commentary) => (
              <div key={c.id} className="border p-3 rounded-md text-sm">
                <div className="font-bold flex gap-2">
                  <span className="text-blue-600">{c.over}</span>
                  <span className="bg-gray-200 px-1 rounded">{c.kind}</span>
                </div>
                <p className="mt-1">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
