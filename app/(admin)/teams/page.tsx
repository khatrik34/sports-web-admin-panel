"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type Team = { id: string; name: string; shortName: string; active: boolean };

function useTeams(page = 0, size = 20) {
  return useQuery({
    queryKey: ['admin-teams', page, size],
    queryFn: () => fetchProxy(`/api/v1/admin/teams?page=${page}&size=${size}`),
  });
}

export default function TeamsPage() {
  const [page] = useState(0);
  const { data, isLoading, error } = useTeams(page);
  const queryClient = useQueryClient();

  const toggleStatus = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const endpoint = active ? `/api/v1/admin/teams/${id}/deactivate` : `/api/v1/admin/teams/${id}/activate`;
      return fetchProxy(endpoint, { method: 'POST' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-teams'] })
  });

  if (error) return <div className="p-8 text-red-600">Failed to load teams</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Teams</h2>
        <button className="bg-black text-white py-2 px-4 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Team
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Short</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (
              data?.content?.map((team: Team) => (
                <tr key={team.id}>
                  <td className="px-6 py-4">{team.name}</td>
                  <td className="px-6 py-4">{team.shortName}</td>
                  <td className="px-6 py-4">{team.active ? 'Active' : 'Inactive'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus.mutate({ id: team.id, active: team.active })} className="text-blue-600 hover:underline mr-4">Toggle</button>
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
