# Digital Vlad Website

> Personal website serving as the central hub for the Digital Vlad Empire — portfolio, app marketplace, and services.

**Notion:** https://www.notion.so/Digital-Vlad-Website-Personal-Portfolio-App-Marketplace-2ffe40b473b7812bbecfeff14966fefe

---

## Overview

A modern personal website that showcases who Vlad is, displays all apps from the Digital Vlad ecosystem (Frise, FuelTime, etc.), and lists services offered. Future-proof architecture to support OAuth, blog, and content sections.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Database:** PostgreSQL (via Prisma ORM)
- **Cache:** Redis
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Theme:** next-themes for dark/light mode toggle

---

## Design System

### Dark Theme (Primary)
- Dark background (#0a0a0a or similar)
- Colorful app cards — each app gets unique accent color behind screenshots
- Gold/yellow accent for CTAs and highlights
- Reference: FutureTech style with colorful card twist

### Light Theme (Secondary)
- Clean white background
- Bold black typography
- Colorful project cards (purple, lime, etc.)
- Pill-style navigation
- Reference: Joey® portfolio

---

## MVP Sections (V1)

### 1. Hero Section
- Avatar/profile image
- Tagline ("I build apps and ship fast")
- Social links: Telegram, Instagram, YouTube
- CTA button ("Explore Apps" → scrolls to marketplace)
- **Static content (hardcoded)**

### 2. Digital Vlad Marketplace
- Grid of app cards
- Each card: icon, title, short description, accent color background
- Category filter (tabs or dropdown)
- Click → App detail page
- **Admin managed ✅**

#### App Detail Page
- Title + description (rich text)
- Screenshots gallery
- External link to app
- Category badge
- Back to marketplace link

### 3. Services Section
- Static cards (hardcoded for MVP)
  - Personal Coaching
  - AI Integration Consulting
  - Find Developers & Build Project
- CTA: Email vladkomudrich@gmail.com

### 4. Footer
- Social links (Telegram, Instagram, YouTube)
- Contact email
- Copyright

---

## Admin Panel

Protected routes (`/admin/*`) with simple auth for managing dynamic content.

### App Management
- CRUD for apps
- Fields: title, description, icon, screenshots[], link, category, accent_color, is_published
- Image upload for icons and screenshots
- Reorder apps (drag & drop or position field)

### Category Management
- CRUD for categories
- Fields: name, slug, icon (optional)

---

## Database Schema

### apps
```
id: uuid (PK)
title: string
slug: string (unique)
description: text
icon_url: string
screenshots: string[] (URLs)
external_link: string
category_id: uuid (FK)
accent_color: string (#hex)
is_published: boolean
position: int
created_at: timestamp
updated_at: timestamp
```

### categories
```
id: uuid (PK)
name: string
slug: string (unique)
icon: string (optional)
position: int
created_at: timestamp
```

### admin_users
```
id: uuid (PK)
email: string (unique)
password_hash: string
created_at: timestamp
```

---

## Future Features (V2+)

- [ ] Blog section with rich text editor (SEO optimized)
- [ ] YouTube videos section (iframe embeds, admin managed)
- [ ] Digital Vlad OAuth — SSO for all marketplace apps
- [ ] Services section dynamic (admin managed)
- [ ] App reviews/ratings
- [ ] Analytics dashboard
- [ ] Newsletter signup

---

## Design References

12 reference images provided. Key inspirations:

1. **FutureTech** — Dark theme, gold accents, stats bar, clean nav
2. **Joey®** — Light theme reference, pill nav, colorful project cards
3. **Netfly** — Card layouts, bold typography
4. **Developer portfolios** — Avatar + social links in hero
5. **Video grid layouts** — For future YouTube section
6. **Blog detail pages** — For future blog section

Reference images saved in: `~/.openclaw/media/inbound/file_21-32*.jpg`

---

## Implementation Notes

- Use Next.js 16 App Router with Server Components
- Prisma for database ORM
- Redis for caching app listings
- Tailwind CSS for styling
- next-themes for dark/light mode toggle
- Image uploads: local /public or S3/Cloudflare R2
- Admin auth: simple JWT or NextAuth with credentials provider

---

## Status

🟡 **PLANNING** — Ready for implementation when Vlad gives the go.
