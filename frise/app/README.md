# Frise 🌙

> Your sleep-powered productivity forecast

Frise is a free, web-based productivity forecasting application that predicts daily productivity peaks and valleys based on your sleep patterns using the Two-Process Model of sleep regulation.

## Features

- 📊 **Productivity Curve** - Visualize your energy levels throughout the day
- 🎯 **Peak Windows** - Know your best times for deep work
- 🌙 **Melatonin Window** - Understand when to start winding down
- 💤 **Sleep Debt Tracking** - Monitor your cumulative sleep balance
- 📱 **PWA Ready** - Install as an app on mobile or desktop
- 🔒 **Privacy First** - All data stored locally, never leaves your device

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **UI**: Hero UI v2 + Tailwind CSS v4
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Storage**: localStorage (no backend required)

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── sleep/             # Sleep entry pages
│   ├── history/           # Sleep history
│   ├── settings/          # User settings
│   ├── learn/             # Educational content
│   └── privacy/           # Privacy policy
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── onboarding/        # Welcome screens
│   ├── sleep/             # Sleep input forms
│   ├── ui/                # Reusable UI components
│   └── visualization/     # Charts and graphs
├── hooks/                 # Custom React hooks
├── lib/
│   ├── calculations/      # Sleep science algorithms
│   ├── constants/         # App configuration
│   └── storage/           # localStorage service
└── types/                 # TypeScript definitions
```

## The Science

Frise uses the **Two-Process Model** developed by Dr. Alexander Borbély in 1982:

- **Process S (Sleep Homeostasis)**: Sleep pressure that builds during waking and dissipates during sleep
- **Process C (Circadian Rhythm)**: 24-hour biological rhythm that cycles independently of sleep

The combination of these processes predicts alertness and productivity throughout the day.

## Deployment

Frise is optimized for deployment on [Vercel](https://vercel.com):

```bash
# Deploy to Vercel
npx vercel
```

Or any static hosting that supports Next.js.

## Environment Variables

No environment variables required - Frise runs entirely client-side.

## Contributing

Contributions are welcome! Please read the contributing guidelines first.

## License

MIT License - see LICENSE for details.

---

Built with 💤 by the Frise team
