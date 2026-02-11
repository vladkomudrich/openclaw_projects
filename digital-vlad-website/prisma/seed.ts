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

  // Create sample app (Frise)
  const productivityCategory = await prisma.category.findUnique({
    where: { slug: 'productivity' },
  });

  if (productivityCategory) {
    await prisma.app.upsert({
      where: { slug: 'frise' },
      update: {},
      create: {
        title: 'Frise',
        slug: 'frise',
        description:
          'Sleep productivity tracker that helps you optimize your rest for maximum performance. Track your sleep patterns, set goals, and wake up feeling refreshed.',
        iconUrl: '',
        screenshots: [],
        externalLink: 'https://frise.app',
        categoryId: productivityCategory.id,
        accentColor: '#8b5cf6',
        isPublished: true,
        position: 0,
      },
    });
    console.log('✅ Sample app created: Frise');
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
