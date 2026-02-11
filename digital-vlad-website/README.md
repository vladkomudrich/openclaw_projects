# Digital Vlad Website

Personal portfolio website serving as the central hub for the Digital Vlad Empire — portfolio, app marketplace, and services.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Database:** PostgreSQL (via Prisma ORM)
- **Cache:** Redis
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Theme:** next-themes (dark/light mode)

## 📋 Features

- **Hero Section:** Personal intro with social links
- **App Marketplace:** Browse apps with category filtering
- **App Detail Pages:** Full app info with screenshots
- **Services Section:** Consulting services showcase
- **Admin Panel:** Manage apps and categories
- **Dark/Light Mode:** Theme toggle with smooth transitions

## 🏃 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis (optional, for caching)
- Docker (optional, for local database)

### Installation

1. **Clone and install dependencies:**

```bash
git clone <repo-url>
cd digital-vlad-website
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Start the database (with Docker):**

```bash
docker-compose up -d
```

4. **Run database migrations:**

```bash
npm run db:push
```

5. **Seed the database:**

```bash
npm run seed
```

6. **Start the development server:**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the website.

## 🔐 Admin Panel

Access the admin panel at `/admin/login`.

**Default credentials (from seed):**
- Email: `admin@digitalvlad.com`
- Password: `changeme123`

⚠️ Change these immediately in production!

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panel pages
│   ├── api/                # API routes
│   └── apps/[slug]/        # App detail pages
├── components/
│   ├── admin/              # Admin components
│   ├── sections/           # Page sections
│   └── ui/                 # Reusable UI components
└── lib/                    # Utilities, database, cache
```

## 🗃️ Database

### Models

- **App:** Title, description, icon, screenshots, category, accent color
- **Category:** Name, slug, icon
- **AdminUser:** Email, password hash

### Commands

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Run migrations
npm run db:studio     # Open Prisma Studio
npm run seed          # Seed initial data
```

## 🧪 Testing

```bash
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🎨 Theming

The website supports dark and light themes:

- **Dark Theme (Primary):** FutureTech style with dark background and gold accents
- **Light Theme (Secondary):** Joey-style with clean white background

Each app card has a unique accent color for visual distinction.

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Environment Variables for Production

```
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
JWT_SECRET="your-secure-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
ADMIN_EMAIL="your-admin@email.com"
ADMIN_PASSWORD="secure-password"
```

## 📝 License

Private - All rights reserved.

## 👤 Author

**Digital Vlad**
- Email: vladkomudrich@gmail.com
- Telegram: [@digitalvlad](https://t.me/digitalvlad)
