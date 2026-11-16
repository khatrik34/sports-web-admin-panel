"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your new password"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<{ code?: string, detail?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/proxy/api/v1/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
      });

      if (!res.ok) {
        let errData;
        try { errData = await res.json(); } catch(e) {}
        setError(errData || { code: 'unknown', detail: 'Failed to change password' });
        setIsLoading(false);
        return;
      }

      // Success revokes every session, clear cookies and send to login
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e: unknown) {
      setError({ detail: (e as Error).message || 'Network error' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Change Password</h1>
          <p className="text-sm text-gray-500 mt-2">You must change your password before continuing.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            <p className="font-semibold">{error.code}</p>
            <p>{error.detail}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input type="password" {...register('currentPassword')} className="w-full px-3 py-2 border rounded-md" />
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input type="password" {...register('newPassword')} className="w-full px-3 py-2 border rounded-md" />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input type="password" {...register('confirmPassword')} className="w-full px-3 py-2 border rounded-md" />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-2 rounded-md font-medium disabled:opacity-50">
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
