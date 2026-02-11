'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { AppForm } from '@/components/admin/app-form';

interface Category {
  id: string;
  name: string;
}

interface App {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  screenshots: string[];
  externalLink: string;
  categoryId: string;
  accentColor: string;
  isPublished: boolean;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditAppPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [app, setApp] = useState<App | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, appRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch(`/api/admin/apps/${id}`),
        ]);

        if (categoriesRes.ok) {
          const catData = await categoriesRes.json();
          setCategories(catData.data);
        }

        if (appRes.ok) {
          const appData = await appRes.json();
          setApp(appData.data);
        } else {
          setError('App not found');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load app');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
        {error || 'App not found'}
        <button onClick={() => router.push('/admin/apps')} className="ml-4 underline">
          Back to apps
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Edit App</h1>
      <AppForm app={app} categories={categories} />
    </div>
  );
}
