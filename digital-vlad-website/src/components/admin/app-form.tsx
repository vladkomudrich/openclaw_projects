'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from './image-upload';
import { ScreenshotsUpload } from './screenshots-upload';

interface Category {
  id: string;
  name: string;
}

interface AppData {
  id?: string;
  title: string;
  description: string;
  iconUrl: string;
  screenshots: string[];
  externalLink: string;
  categoryId: string;
  accentColor: string;
  isPublished: boolean;
}

interface AppFormProps {
  app?: AppData;
  categories: Category[];
}

const ACCENT_COLORS = [
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
];

export function AppForm({ app, categories }: AppFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState(app?.title || '');
  const [description, setDescription] = useState(app?.description || '');
  const [iconUrl, setIconUrl] = useState(app?.iconUrl || '');
  const [screenshots, setScreenshots] = useState<string[]>(app?.screenshots || []);
  const [externalLink, setExternalLink] = useState(app?.externalLink || '');
  const [categoryId, setCategoryId] = useState(app?.categoryId || '');
  const [accentColor, setAccentColor] = useState(app?.accentColor || '#8b5cf6');
  const [isPublished, setIsPublished] = useState(app?.isPublished ?? false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const data = {
      title,
      description,
      iconUrl,
      screenshots,
      externalLink,
      categoryId,
      accentColor,
      isPublished,
    };

    try {
      const url = app?.id ? `/api/admin/apps/${app.id}` : '/api/admin/apps';
      const method = app?.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/apps');
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to save app');
      }
    } catch {
      setError('Failed to save app');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Info</h3>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="App name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                placeholder="Describe your app..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">External Link *</label>
              <input
                type="url"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <ScreenshotsUpload value={screenshots} onChange={setScreenshots} label="Screenshots" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <ImageUpload value={iconUrl} onChange={setIconUrl} label="App Icon *" />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Appearance</h3>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Accent Color</label>
              <div className="grid grid-cols-4 gap-2">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setAccentColor(color.value)}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      accentColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-zinc-300">Published</span>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isPublished ? 'bg-amber-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    isPublished ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/apps')}
              className="flex-1 py-3 px-4 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : app ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
