import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@digitalvlad.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create categories
  const categories = [
    { name: 'Productivity', slug: 'productivity', icon: '🚀' },
    { name: 'Health & Wellness', slug: 'health-wellness', icon: '💪' },
    { name: 'Finance', slug: 'finance', icon: '💰' },
    { name: 'Social', slug: 'social', icon: '👥' },
    { name: 'Utilities', slug: 'utilities', icon: '🔧' },
  ];

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        position: i,
      },
    });
    console.log(`✅ Category created: ${cat.name}`);
  }

  // Get category IDs
  const productivityCat = await prisma.category.findUnique({ where: { slug: 'productivity' } });
  const healthCat = await prisma.category.findUnique({ where: { slug: 'health-wellness' } });
  const financeCat = await prisma.category.findUnique({ where: { slug: 'finance' } });
  const socialCat = await prisma.category.findUnique({ where: { slug: 'social' } });
  const utilitiesCat = await prisma.category.findUnique({ where: { slug: 'utilities' } });

  // Sample apps
  const apps = [
    // Productivity
    {
      title: 'Frise',
      slug: 'frise',
      description: 'Sleep-powered productivity forecast. Discover your peak performance windows based on circadian science. Track sleep, see your energy curve, optimize your day.',
      iconUrl: '/apps/frise-icon.png',
      screenshots: ['/apps/frise-1.png', '/apps/frise-2.png'],
      externalLink: 'https://frise.app',
      categoryId: productivityCat!.id,
      accentColor: '#7B68EE',
      isPublished: true,
      position: 0,
    },
    {
      title: 'FocusFlow',
      slug: 'focusflow',
      description: 'Deep work timer with ambient soundscapes. Block distractions, track focus sessions, and build unbreakable concentration habits. Pomodoro reimagined.',
      iconUrl: '/apps/focusflow-icon.png',
      screenshots: ['/apps/focusflow-1.png'],
      externalLink: 'https://focusflow.app',
      categoryId: productivityCat!.id,
      accentColor: '#5B8DEF',
      isPublished: true,
      position: 1,
    },
    {
      title: 'TaskStack',
      slug: 'taskstack',
      description: 'Minimalist task manager that uses AI to prioritize your day. No complexity, just clarity. Stack your tasks, crush your goals.',
      iconUrl: '/apps/taskstack-icon.png',
      screenshots: [],
      externalLink: 'https://taskstack.io',
      categoryId: productivityCat!.id,
      accentColor: '#10B981',
      isPublished: true,
      position: 2,
    },
    // Health & Wellness
    {
      title: 'FuelTime',
      slug: 'fueltime',
      description: 'Smart eating window tracker. Optimize your nutrition timing based on your body\'s natural rhythms. Intermittent fasting made simple and science-backed.',
      iconUrl: '/apps/fueltime-icon.png',
      screenshots: ['/apps/fueltime-1.png', '/apps/fueltime-2.png'],
      externalLink: 'https://fueltime.app',
      categoryId: healthCat!.id,
      accentColor: '#F59E0B',
      isPublished: true,
      position: 0,
    },
    {
      title: 'BreathSync',
      slug: 'breathsync',
      description: 'Guided breathing exercises with haptic feedback. Reduce stress, improve focus, and master your nervous system in just 5 minutes a day.',
      iconUrl: '/apps/breathsync-icon.png',
      screenshots: [],
      externalLink: 'https://breathsync.app',
      categoryId: healthCat!.id,
      accentColor: '#06B6D4',
      isPublished: true,
      position: 1,
    },
    {
      title: 'MoodMap',
      slug: 'moodmap',
      description: 'Track your emotional patterns and discover what drives your happiness. Beautiful visualizations meet actionable insights.',
      iconUrl: '/apps/moodmap-icon.png',
      screenshots: [],
      externalLink: 'https://moodmap.app',
      categoryId: healthCat!.id,
      accentColor: '#EC4899',
      isPublished: true,
      position: 2,
    },
    // Finance
    {
      title: 'SpendLens',
      slug: 'spendlens',
      description: 'Automatic expense tracking with zero manual input. Connect your accounts, see where your money goes, and find savings you didn\'t know existed.',
      iconUrl: '/apps/spendlens-icon.png',
      screenshots: [],
      externalLink: 'https://spendlens.app',
      categoryId: financeCat!.id,
      accentColor: '#22C55E',
      isPublished: true,
      position: 0,
    },
    {
      title: 'InvestIQ',
      slug: 'investiq',
      description: 'Learn investing through bite-sized lessons and paper trading. Build wealth knowledge without risking a dime.',
      iconUrl: '/apps/investiq-icon.png',
      screenshots: [],
      externalLink: 'https://investiq.app',
      categoryId: financeCat!.id,
      accentColor: '#8B5CF6',
      isPublished: true,
      position: 1,
    },
    // Social
    {
      title: 'KnowMe',
      slug: 'knowme',
      description: 'Couple quiz game that sparks deeper conversations. How well do you really know each other? Find out and grow closer together.',
      iconUrl: '/apps/knowme-icon.png',
      screenshots: [],
      externalLink: 'https://knowme.fun',
      categoryId: socialCat!.id,
      accentColor: '#F43F5E',
      isPublished: true,
      position: 0,
    },
    {
      title: 'DateDeck',
      slug: 'datedeck',
      description: 'Never run out of date ideas again. Swipe through curated experiences based on your location, budget, and vibe.',
      iconUrl: '/apps/datedeck-icon.png',
      screenshots: [],
      externalLink: 'https://datedeck.app',
      categoryId: socialCat!.id,
      accentColor: '#E11D48',
      isPublished: true,
      position: 1,
    },
    // Utilities
    {
      title: 'ClipVault',
      slug: 'clipvault',
      description: 'Cross-device clipboard manager. Copy on your phone, paste on your laptop. Encrypted, instant, and endlessly useful.',
      iconUrl: '/apps/clipvault-icon.png',
      screenshots: [],
      externalLink: 'https://clipvault.app',
      categoryId: utilitiesCat!.id,
      accentColor: '#6366F1',
      isPublished: true,
      position: 0,
    },
    {
      title: 'QRCraft',
      slug: 'qrcraft',
      description: 'Beautiful QR codes that don\'t look like garbage. Custom colors, logos, and styles. Make your links look as good as your brand.',
      iconUrl: '/apps/qrcraft-icon.png',
      screenshots: [],
      externalLink: 'https://qrcraft.app',
      categoryId: utilitiesCat!.id,
      accentColor: '#0EA5E9',
      isPublished: true,
      position: 1,
    },
  ];

  for (const app of apps) {
    await prisma.app.upsert({
      where: { slug: app.slug },
      update: {
        title: app.title,
        description: app.description,
        iconUrl: app.iconUrl,
        screenshots: app.screenshots,
        externalLink: app.externalLink,
        categoryId: app.categoryId,
        accentColor: app.accentColor,
        isPublished: app.isPublished,
        position: app.position,
      },
      create: app,
    });
    console.log(`✅ App created: ${app.title}`);
  }

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
