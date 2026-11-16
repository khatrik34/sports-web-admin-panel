"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { useState } from 'react';
import Link from 'next/link';

type Match = { id: string; team1: { name: string }; team2: { name: string }; tournamentName: string; state: string; hidden: boolean };

export default function MatchesPage() {
  const [page] = useState(0);
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-matches', page],
    queryFn: () => fetchProxy(`/api/v1/admin/matches?page=${page}&size=20`),
  });
  const queryClient = useQueryClient();

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, hidden }: { id: string; hidden: boolean }) => {
      const endpoint = hidden ? `/api/v1/admin/matches/${id}/show` : `/api/v1/admin/matches/${id}/hide`;
      return fetchProxy(endpoint, { method: 'POST' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-matches'] })
  });

  if (error) return <div className="p-8 text-red-600">Failed to load matches</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Fixtures & Matches</h2>
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Match</th>
              <th className="px-6 py-3 font-medium">Tournament</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (
              data?.content?.map((match: Match) => (
                <tr key={match.id}>
                  <td className="px-6 py-4">{match.team1?.name} vs {match.team2?.name}</td>
                  <td className="px-6 py-4">{match.tournamentName}</td>
                  <td className="px-6 py-4">{match.state} {match.hidden && '(Hidden)'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleVisibility.mutate({ id: match.id, hidden: match.hidden })} className="text-blue-600 hover:underline mr-4">{match.hidden ? 'Show' : 'Hide'}</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
