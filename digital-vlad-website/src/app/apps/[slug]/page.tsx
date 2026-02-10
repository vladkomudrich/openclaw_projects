import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface App {
  id: string;
  title: string;
  slug: string;
  description: string;
  iconUrl: string;
  screenshots: string[];
  externalLink: string;
  accentColor: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

async function getApp(slug: string): Promise<App | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/apps/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = await getApp(slug);

  if (!app) {
    return { title: 'App Not Found' };
  }

  return {
    title: `${app.title} | Digital Vlad`,
    description: app.description,
    openGraph: {
      title: app.title,
      description: app.description,
      images: app.iconUrl ? [app.iconUrl] : undefined,
    },
  };
}

export default async function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = await getApp(slug);

  if (!app) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">
        {/* Hero section with accent color */}
        <div
          className="py-16"
          style={{
            background: `linear-gradient(to bottom, ${app.accentColor}15, transparent)`,
          }}
        >
          <Container>
            {/* Back link */}
            <Link
              href="/#marketplace"
              className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground mb-8 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Marketplace
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Icon */}
              <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0"
                style={{ backgroundColor: app.accentColor }}
              >
                {app.iconUrl ? (
                  <Image
                    src={app.iconUrl}
                    alt={app.title}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {app.title.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <span
                  className="inline-block px-3 py-1 text-sm rounded-full mb-4"
                  style={{ backgroundColor: app.accentColor + '20', color: app.accentColor }}
                >
                  {app.category.name}
                </span>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{app.title}</h1>

                <p className="text-foreground-muted text-lg mb-6 max-w-2xl">{app.description}</p>

                <Button
                  size="lg"
                  onClick={() => window.open(app.externalLink, '_blank')}
                  style={{ backgroundColor: app.accentColor }}
                  className="hover:opacity-90"
                >
                  Open App
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </Container>
        </div>

        {/* Screenshots */}
        {app.screenshots && app.screenshots.length > 0 && (
          <section className="py-16 bg-background-secondary">
            <Container>
              <h2 className="text-2xl font-bold text-foreground mb-8">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {app.screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-xl overflow-hidden border border-card-border shadow-lg"
                  >
                    <Image
                      src={screenshot}
                      alt={`${app.title} screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
