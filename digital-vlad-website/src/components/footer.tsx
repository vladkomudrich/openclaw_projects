import Link from 'next/link';
import { Container } from './ui/container';
import { SocialLinks } from './ui/social-links';

export function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-border py-12">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <span className="text-black font-bold text-lg">DV</span>
              </div>
              <span className="font-bold text-lg text-foreground">Digital Vlad</span>
            </Link>
            <p className="text-foreground-muted text-sm">
              © {new Date().getFullYear()} Digital Vlad. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <SocialLinks />
            <a
              href="mailto:vladkomudrich@gmail.com"
              className="text-foreground-muted hover:text-foreground text-sm transition-colors"
            >
              vladkomudrich@gmail.com
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
