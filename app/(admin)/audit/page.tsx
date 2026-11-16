"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchProxy } from '@/lib/api/client';
import { useState } from 'react';

type AuditLog = { id: string; timestamp: string; actorEmail: string; action: string; targetType: string; targetId: string };

export default function AuditPage() {
  const [page] = useState(0);
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-audit', page],
    queryFn: () => fetchProxy(`/api/v1/admin/audit-logs?page=${page}&size=50`),
  });

  if (error) return <div className="p-8 text-red-600">Failed to load audit logs</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Audit Logs</h2>
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-6 py-3 font-medium">Actor</th>
              <th className="px-6 py-3 font-medium">Action</th>
              <th className="px-6 py-3 font-medium">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (
              data?.content?.map((log: AuditLog) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4">{log.actorEmail}</td>
                  <td className="px-6 py-4 font-medium">{log.action}</td>
                  <td className="px-6 py-4 text-gray-500">{log.targetType} ({log.targetId})</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
