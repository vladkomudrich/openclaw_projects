import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/sections/hero';
import { Marketplace } from '@/components/sections/marketplace';
import { Services } from '@/components/sections/services';
import { apps, categories } from '@/lib/static-data';

export default function HomePage() {
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
