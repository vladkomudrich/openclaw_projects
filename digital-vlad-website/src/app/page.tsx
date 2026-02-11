import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/sections/hero';
import { Marketplace } from '@/components/sections/marketplace';
import { Services } from '@/components/sections/services';

interface App {
  id: string;
  title: string;
  slug: string;
  description: string;
  iconUrl: string;
  accentColor: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  appCount: number;
}

async function getApps(): Promise<App[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/apps`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/categories`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [apps, categories] = await Promise.all([getApps(), getCategories()]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marketplace apps={apps} categories={categories} />
        <Services />
      </main>
      <Footer />
    </>
  );
}
