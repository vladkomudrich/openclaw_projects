'use client';

import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { ProtectedRoute } from '@/components/admin/protected-route';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 flex">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
