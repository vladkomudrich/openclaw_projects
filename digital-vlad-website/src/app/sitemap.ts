import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://digitalvlad.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Dynamic app pages - fetch from API
  try {
    const response = await fetch(`${BASE_URL}/api/apps`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      const apps = data.data || [];

      const appPages: MetadataRoute.Sitemap = apps.map(
        (app: { slug: string; updatedAt?: string }) => ({
          url: `${BASE_URL}/apps/${app.slug}`,
          lastModified: app.updatedAt ? new Date(app.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })
      );

      return [...staticPages, ...appPages];
    }
  } catch {
    // Fallback to just static pages
  }

  return staticPages;
}
