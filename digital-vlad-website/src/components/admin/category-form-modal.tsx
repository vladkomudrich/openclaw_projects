'use client';

import { useState, FormEvent } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

interface CategoryFormProps {
  onSubmit: (data: { name: string; icon: string }) => Promise<void>;
  category?: Category | null;
  isLoading?: boolean;
  onCancel: () => void;
}

function CategoryForm({ onSubmit, category, isLoading, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '');
  const [icon, setIcon] = useState(category?.icon || '');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, icon });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
          Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
          placeholder="e.g., Productivity"
        />
      </div>

      <div>
        <label htmlFor="icon" className="block text-sm font-medium text-zinc-300 mb-2">
          Icon (emoji or text)
        </label>
        <input
          id="icon"
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
          placeholder="e.g., 🚀"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-4 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; icon: string }) => Promise<void>;
  category?: Category | null;
  isLoading?: boolean;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category,
  isLoading,
}: CategoryFormModalProps) {
  if (!isOpen) return null;

  // Use key to remount form when category changes
  const formKey = category?.id || 'new';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">
          {category ? 'Edit Category' : 'Add Category'}
        </h2>

        <CategoryForm
          key={formKey}
          onSubmit={onSubmit}
          category={category}
          isLoading={isLoading}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
