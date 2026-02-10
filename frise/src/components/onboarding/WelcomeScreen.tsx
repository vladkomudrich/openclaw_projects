"use client";

import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Animated illustration */}
      <motion.div 
        className="w-full max-w-sm aspect-square mb-8 relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Background glow */}
          <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent-purple)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--thermal-low)" />
              <stop offset="25%" stopColor="var(--accent-blue)" />
              <stop offset="50%" stopColor="var(--accent-purple)" />
              <stop offset="75%" stopColor="var(--accent-purple-light)" />
              <stop offset="100%" stopColor="var(--accent-gold)" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Background circle */}
          <circle cx="200" cy="200" r="180" fill="url(#bgGlow)" />
          
          {/* Grid lines (subtle) */}
          <g opacity="0.1" stroke="var(--glass-border)">
            {[100, 150, 200, 250, 300].map(y => (
              <line key={y} x1="50" y1={y} x2="350" y2={y} strokeWidth="1" />
            ))}
          </g>
          
          {/* Main productivity curve */}
          <motion.path
            d="M 40 280 Q 100 220, 140 250 Q 180 280, 220 180 Q 260 80, 300 140 Q 340 200, 360 220"
            stroke="url(#curveGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
          />
          
          {/* Peak indicator */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.4, type: "spring" }}
          >
            <circle cx="260" cy="80" r="20" fill="var(--accent-gold)" opacity="0.2" />
            <circle cx="260" cy="80" r="12" fill="var(--accent-gold)" />
            <text x="260" y="50" textAnchor="middle" fill="var(--accent-gold)" fontSize="12" fontWeight="600">
              PEAK
            </text>
          </motion.g>
          
          {/* Moon icon */}
          <motion.g
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <circle cx="70" cy="300" r="24" fill="var(--accent-purple)" opacity="0.6" />
            <circle cx="82" cy="292" r="20" fill="var(--bg-dark)" />
          </motion.g>
          
          {/* Sun icon */}
          <motion.g
            transform="translate(330, 150)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.4, type: "spring" }}
          >
            <circle cx="0" cy="0" r="14" fill="var(--accent-gold)" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.line
                key={i}
                x1={Math.cos(angle * Math.PI / 180) * 22}
                y1={Math.sin(angle * Math.PI / 180) * 22}
                x2={Math.cos(angle * Math.PI / 180) * 30}
                y2={Math.sin(angle * Math.PI / 180) * 30}
                stroke="var(--accent-gold)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 + i * 0.05 }}
              />
            ))}
          </motion.g>
        </svg>
      </motion.div>

      {/* Text content */}
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h1 className="text-display-lg gradient-text mb-4">
          Discover your peak hours
        </h1>
        <p className="text-lg text-[var(--text-secondary)] mb-8">
          Get your personal productivity forecast based on sleep science. 
          Optimize your day around your natural energy peaks.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <GlassButton 
          onClick={onGetStarted} 
          size="xl"
          icon={<span>🌙</span>}
        >
          Log Last Night's Sleep
        </GlassButton>
      </motion.div>

      {/* Trust indicators */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4 mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {[
          { icon: "✓", text: "Free forever" },
          { icon: "✓", text: "No account needed" },
          { icon: "✓", text: "Data stays private" },
        ].map((item, i) => (
          <GlassCard key={i} padding="sm" className="!rounded-full !px-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--success)]">{item.icon}</span>
              <span className="text-[var(--text-secondary)]">{item.text}</span>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Science badge */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <GlassCard padding="sm" className="text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-2">
            <span>🧬</span>
            <span>Powered by the Two-Process Model of sleep regulation</span>
          </span>
        </GlassCard>
      </motion.div>
    </div>
  );
}
