// Static app data - no database needed

export interface App {
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  appCount: number;
}

export const categories: Category[] = [
  { id: '1', name: 'Productivity', slug: 'productivity', icon: '🚀', appCount: 3 },
  { id: '2', name: 'Health & Wellness', slug: 'health-wellness', icon: '💪', appCount: 3 },
  { id: '3', name: 'Finance', slug: 'finance', icon: '💰', appCount: 2 },
  { id: '4', name: 'Social', slug: 'social', icon: '👥', appCount: 2 },
  { id: '5', name: 'Utilities', slug: 'utilities', icon: '🔧', appCount: 2 },
];

export const apps: App[] = [
  // Productivity
  {
    id: '1',
    title: 'Frise',
    slug: 'frise',
    description: 'Sleep-powered productivity forecast. Discover your peak performance windows based on circadian science.',
    iconUrl: '',
    accentColor: '#7B68EE',
    category: { id: '1', name: 'Productivity', slug: 'productivity' },
  },
  {
    id: '2',
    title: 'FocusFlow',
    slug: 'focusflow',
    description: 'Deep work timer with ambient soundscapes. Block distractions and build unbreakable concentration.',
    iconUrl: '',
    accentColor: '#5B8DEF',
    category: { id: '1', name: 'Productivity', slug: 'productivity' },
  },
  {
    id: '3',
    title: 'TaskStack',
    slug: 'taskstack',
    description: 'Minimalist task manager with AI prioritization. No complexity, just clarity.',
    iconUrl: '',
    accentColor: '#10B981',
    category: { id: '1', name: 'Productivity', slug: 'productivity' },
  },
  // Health & Wellness
  {
    id: '4',
    title: 'FuelTime',
    slug: 'fueltime',
    description: 'Smart eating window tracker. Optimize nutrition timing based on your body\'s natural rhythms.',
    iconUrl: '',
    accentColor: '#F59E0B',
    category: { id: '2', name: 'Health & Wellness', slug: 'health-wellness' },
  },
  {
    id: '5',
    title: 'BreathSync',
    slug: 'breathsync',
    description: 'Guided breathing exercises with haptic feedback. Reduce stress in just 5 minutes.',
    iconUrl: '',
    accentColor: '#06B6D4',
    category: { id: '2', name: 'Health & Wellness', slug: 'health-wellness' },
  },
  {
    id: '6',
    title: 'MoodMap',
    slug: 'moodmap',
    description: 'Track emotional patterns and discover what drives your happiness with beautiful visualizations.',
    iconUrl: '',
    accentColor: '#EC4899',
    category: { id: '2', name: 'Health & Wellness', slug: 'health-wellness' },
  },
  // Finance
  {
    id: '7',
    title: 'SpendLens',
    slug: 'spendlens',
    description: 'Automatic expense tracking with zero manual input. See where your money really goes.',
    iconUrl: '',
    accentColor: '#22C55E',
    category: { id: '3', name: 'Finance', slug: 'finance' },
  },
  {
    id: '8',
    title: 'InvestIQ',
    slug: 'investiq',
    description: 'Learn investing through bite-sized lessons and paper trading. Build wealth knowledge risk-free.',
    iconUrl: '',
    accentColor: '#8B5CF6',
    category: { id: '3', name: 'Finance', slug: 'finance' },
  },
  // Social
  {
    id: '9',
    title: 'KnowMe',
    slug: 'knowme',
    description: 'Couple quiz game that sparks deeper conversations. How well do you really know each other?',
    iconUrl: '',
    accentColor: '#F43F5E',
    category: { id: '4', name: 'Social', slug: 'social' },
  },
  {
    id: '10',
    title: 'DateDeck',
    slug: 'datedeck',
    description: 'Never run out of date ideas. Swipe through curated experiences based on location and vibe.',
    iconUrl: '',
    accentColor: '#E11D48',
    category: { id: '4', name: 'Social', slug: 'social' },
  },
  // Utilities
  {
    id: '11',
    title: 'ClipVault',
    slug: 'clipvault',
    description: 'Cross-device clipboard manager. Copy on phone, paste on laptop. Encrypted and instant.',
    iconUrl: '',
    accentColor: '#6366F1',
    category: { id: '5', name: 'Utilities', slug: 'utilities' },
  },
  {
    id: '12',
    title: 'QRCraft',
    slug: 'qrcraft',
    description: 'Beautiful QR codes that match your brand. Custom colors, logos, and styles.',
    iconUrl: '',
    accentColor: '#0EA5E9',
    category: { id: '5', name: 'Utilities', slug: 'utilities' },
  },
];

export function getApps(): App[] {
  return apps;
}

export function getCategories(): Category[] {
  return categories;
}

export function getAppBySlug(slug: string): App | undefined {
  return apps.find(app => app.slug === slug);
}

export function getAppsByCategory(categorySlug: string): App[] {
  return apps.filter(app => app.category.slug === categorySlug);
}
