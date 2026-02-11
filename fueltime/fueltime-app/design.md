# FuelTime Design System

## Brand Identity

FuelTime is about **optimizing health through timing**. The design reflects:
- **Fresh & Natural** - Greens for eating, blues for fasting
- **Scientific but Friendly** - Clean UI with warm touches
- **Mobile-First** - Designed for on-the-go tracking

## Color Palette

### Primary Colors - Fresh Greens
Used for eating windows, positive actions, and primary UI elements.

| Name | Value | Usage |
|------|-------|-------|
| Green 50 | `#e8f5e9` | Subtle backgrounds |
| Green 100 | `#c8e6c9` | Hover states |
| Green 200 | `#a5d6a7` | Disabled states |
| Green 300 | `#81c784` | Light accents |
| Green 400 | `#66bb6a` | Secondary buttons |
| Green 500 | `#4caf50` | **Primary brand color** |
| Green 600 | `#43a047` | Hover states |
| Green 700 | `#388e3c` | Active states |
| Green 800 | `#2e7d32` | Dark accents |
| Green 900 | `#1b5e20` | Darkest shade |

### Accent Colors - Warm Oranges
Used for energy, sunrise/sunset, and warm accents.

| Name | Value | Usage |
|------|-------|-------|
| Orange 500 | `#ff9800` | **Accent color** |
| Orange 600 | `#fb8c00` | Hover states |

### Fasting Colors - Cool Blues
Used for fasting zones, recovery, and calm states.

| Name | Value | Usage |
|------|-------|-------|
| Blue 500 | `#2196f3` | **Fasting indicator** |
| Blue 600 | `#1e88e5` | Hover states |
| Blue 700 | `#1976d2` | Deep fasting |

### Neutral Palette
Used for text, backgrounds, and borders.

| Name | Value | Usage |
|------|-------|-------|
| Gray 50 | `#fafafa` | Page background |
| Gray 100 | `#f5f5f5` | Card backgrounds |
| Gray 200 | `#eeeeee` | Borders |
| Gray 500 | `#9e9e9e` | Muted text |
| Gray 700 | `#616161` | Secondary text |
| Gray 900 | `#212121` | Primary text |

### Status Colors

| Color | Value | Usage |
|-------|-------|-------|
| Success | `#4caf50` | Positive feedback |
| Warning | `#ff9800` | Caution states |
| Error | `#f44336` | Error states |
| Info | `#2196f3` | Informational |

## Typography

### Font Stack
- **Primary:** Poppins - Used for headings and key UI elements
- **Secondary:** Inter - Used for body text and data

### Scale

| Size | Class | Usage |
|------|-------|-------|
| xs | `text-xs` | Captions, labels |
| sm | `text-sm` | Body text |
| base | `text-base` | Default |
| lg | `text-lg` | Subheadings |
| xl | `text-xl` | Section headings |
| 2xl | `text-2xl` | Page headings |
| 3xl-4xl | `text-3xl/4xl` | Hero text |

### Weights
- **Regular (400):** Body text
- **Medium (500):** Emphasis
- **Semibold (600):** Subheadings, buttons
- **Bold (700):** Headings, key metrics

## Spacing

Based on a 4px grid system:

| Token | Value | Usage |
|-------|-------|-------|
| space-xs | 4px | Tight spacing |
| space-sm | 8px | Between related items |
| space-md | 16px | Default padding |
| space-lg | 24px | Section spacing |
| space-xl | 32px | Large sections |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 6px | Small elements |
| radius-md | 8px | Buttons, inputs |
| radius-lg | 12px | Cards |
| radius-xl | 16px | Large cards |
| radius-2xl | 24px | Feature cards |
| radius-full | 9999px | Pills, avatars |

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| shadow-md | `0 4px 6px rgba(0,0,0,0.1)` | Cards |
| shadow-lg | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |

## Components

### Buttons

```tsx
// Primary Button
<Button className="bg-[var(--fueltime-green-500)] hover:bg-[var(--fueltime-green-600)] text-white font-semibold">
  Log Meal
</Button>

// Secondary Button
<Button variant="bordered" className="border-[var(--fueltime-gray-300)]">
  Cancel
</Button>

// Floating Action Button
<Button
  isIconOnly
  className="w-14 h-14 bg-[var(--fueltime-green-500)] text-white rounded-full shadow-lg"
>
  +
</Button>
```

### Cards

```tsx
// Standard Card
<div className="p-4 bg-white rounded-2xl border border-[var(--fueltime-gray-200)]">
  {content}
</div>

// Colored Card
<div className="p-4 bg-[var(--fueltime-green-50)] rounded-2xl">
  {content}
</div>

// Gradient Card
<div className="p-6 bg-gradient-to-r from-[var(--fueltime-green-500)] to-[var(--fueltime-green-600)] rounded-2xl text-white">
  {content}
</div>
```

### Status Card

```tsx
<div className="p-6 bg-gradient-to-r from-[var(--fueltime-green-500)] to-[var(--fueltime-green-600)] rounded-2xl text-white">
  <div className="flex items-center gap-3">
    <span className="text-3xl">🍽️</span>
    <div>
      <p className="font-bold text-lg">Eating Window Open</p>
      <p className="text-sm text-white/80">6 hours remaining</p>
    </div>
  </div>
</div>
```

### Timeline

The timeline component uses a gradient:
- **Fasting zone:** Blue gradient
- **Eating window:** Green to orange gradient
- **Sleep zone:** Gray

### Insight Cards (2x2 Grid)

```tsx
<div className="grid grid-cols-2 gap-3">
  <InsightCard icon="🍽️" title="Eating Window" value="10h" color="green" />
  <InsightCard icon="🔥" title="Fasting" value="14h" color="blue" />
  <InsightCard icon="🧠" title="Peak Focus" value="9:00 AM" color="orange" />
  <InsightCard icon="🏃" title="Best Workout" value="4:00 PM" color="gray" />
</div>
```

## Animations

Using Framer Motion for smooth animations:

### Page Transitions
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
```

### Staggered Lists
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: index * 0.1 }}
>
```

### Interactive Elements
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

## Accessibility

### Color Contrast
- All text meets WCAG AA contrast ratios
- Never rely on color alone for meaning

### Focus States
- Visible focus rings on interactive elements
- Keyboard navigation support

### Screen Readers
- Proper ARIA labels on all interactive elements
- Semantic HTML structure

### Touch Targets
- Minimum 44x44px touch targets
- Adequate spacing between interactive elements

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile | < 640px | Default (mobile-first) |
| sm | ≥ 640px | Small tablets |
| md | ≥ 768px | Tablets |
| lg | ≥ 1024px | Desktop |
| xl | ≥ 1280px | Large desktop |

## Dark Mode (Future)

When implementing dark mode:
- Invert grays (gray-900 → gray-50)
- Reduce vibrancy of colors
- Use darker backgrounds with lighter text
- Maintain contrast ratios
