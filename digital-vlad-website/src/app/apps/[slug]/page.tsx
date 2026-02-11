import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getAppBySlug, apps } from '@/lib/static-data';

export async function generateStaticParams() {
  return apps.map((app) => ({
    slug: app.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    return { title: 'App Not Found' };
  }

  return {
    title: `${app.title} | Digital Vlad`,
    description: app.description,
  };
}

export default async function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    notFound();
  }

  // Placeholder external links
  const externalLink = `https://${app.slug}.app`;

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
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                  {app.title.charAt(0)}
                </div>
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

                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: app.accentColor }}
                >
                  Open App
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </Container>
        </div>

        {/* Coming Soon section instead of screenshots */}
        <section className="py-16 bg-background-secondary">
          <Container>
            <div className="text-center py-12">
              <p className="text-foreground-muted text-lg">Screenshots coming soon</p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
