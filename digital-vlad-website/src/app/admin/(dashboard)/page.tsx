'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Apps Card */}
        <Link
          href="/admin/apps"
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white group-hover:text-amber-500 transition-colors">
                Apps
              </h2>
              <p className="text-sm text-zinc-400">Manage your apps</p>
            </div>
          </div>
          <p className="text-zinc-500 text-sm">
            Add, edit, and organize apps in your marketplace
          </p>
        </Link>

        {/* Categories Card */}
        <Link
          href="/admin/categories"
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white group-hover:text-amber-500 transition-colors">
                Categories
              </h2>
              <p className="text-sm text-zinc-400">Organize your apps</p>
            </div>
          </div>
          <p className="text-zinc-500 text-sm">Create and manage app categories</p>
        </Link>

        {/* Quick Actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
              <p className="text-sm text-zinc-400">Common tasks</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link
              href="/admin/apps/new"
              className="block px-4 py-2 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700 transition-colors text-sm"
            >
              + Add New App
            </Link>
            <a
              href="/"
              target="_blank"
              className="block px-4 py-2 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700 transition-colors text-sm"
            >
              ↗ View Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
