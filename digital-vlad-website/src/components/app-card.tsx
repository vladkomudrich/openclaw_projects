import Link from 'next/link';
import Image from 'next/image';

interface AppCardProps {
  title: string;
  slug: string;
  description: string;
  iconUrl: string;
  accentColor: string;
  category: string;
}

export function AppCard({ title, slug, description, iconUrl, accentColor, category }: AppCardProps) {
  return (
    <Link
      href={`/apps/${slug}`}
      className="group relative overflow-hidden rounded-2xl bg-card-bg border border-card-border hover:border-zinc-600 transition-all duration-300"
    >
      {/* Accent color background */}
      <div
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative p-6">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl overflow-hidden mb-4 shadow-lg"
          style={{ backgroundColor: accentColor }}
        >
          {iconUrl ? (
            <Image
              src={iconUrl}
              alt={title}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
              {title.charAt(0)}
            </div>
          )}
        </div>

        {/* Category badge */}
        <span className="inline-block px-2 py-1 text-xs rounded-full bg-zinc-800/80 text-zinc-300 mb-3">
          {category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground group-hover:text-amber-500 transition-colors mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-foreground-muted text-sm line-clamp-2">{description}</p>

        {/* Arrow indicator */}
        <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
