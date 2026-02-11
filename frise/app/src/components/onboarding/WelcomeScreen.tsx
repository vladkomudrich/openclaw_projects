"use client";

import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [isAnimated, setIsAnimated] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsAnimated(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1] as const
      }
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Ambient background elements */}
      <div 
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(123,104,238,0.08) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(91,141,239,0.06) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/3 right-0 w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,179,71,0.04) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        variants={shouldReduceMotion ? {} : containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated illustration */}
        <motion.div 
          className="w-full max-w-sm aspect-square mb-10 relative"
          variants={shouldReduceMotion ? {} : itemVariants}
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Enhanced gradients and filters */}
            <defs>
              <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7B68EE" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#5B8DEF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4A5568" />
                <stop offset="20%" stopColor="#5B8DEF" />
                <stop offset="50%" stopColor="#7B68EE" />
                <stop offset="80%" stopColor="#9A8CF5" />
                <stop offset="100%" stopColor="#FFB347" />
              </linearGradient>
              <linearGradient id="peakGlow" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="100%" stopColor="#FFB347" stopOpacity="0.3" />
              </linearGradient>
              <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Background circle with subtle pulse */}
            <motion.circle 
              cx="200" 
              cy="200" 
              r="180" 
              fill="url(#bgGlow)"
              animate={shouldReduceMotion ? {} : { 
                scale: [1, 1.02, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Grid lines (subtle) */}
            <g opacity="0.08" stroke="rgba(255,255,255,0.15)">
              {[100, 150, 200, 250, 300].map(y => (
                <line key={y} x1="50" y1={y} x2="350" y2={y} strokeWidth="1" />
              ))}
            </g>

            {/* Area fill under curve */}
            <path
              d="M 40 280 Q 100 220, 140 250 Q 180 280, 220 180 Q 260 80, 300 140 Q 340 200, 360 220 L 360 350 L 40 350 Z"
              fill="url(#curveGradient)"
              opacity="0.08"
              style={{
                opacity: isAnimated ? 0.08 : 0,
                transition: "opacity 1s ease-in-out 0.5s",
              }}
            />
            
            {/* Main productivity curve - CSS animation for Safari compatibility */}
            <path
              d="M 40 280 Q 100 220, 140 250 Q 180 280, 220 180 Q 260 80, 300 140 Q 340 200, 360 220"
              stroke="url(#curveGradient)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              filter="url(#glow)"
              style={{
                strokeDasharray: 500,
                strokeDashoffset: isAnimated ? 0 : 500,
                transition: "stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />

            {/* Peak glow area */}
            <motion.ellipse
              cx="260"
              cy="80"
              rx="50"
              ry="40"
              fill="url(#peakGlow)"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: isAnimated ? 1 : 0, scale: isAnimated ? 1 : 0.5 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            />
            
            {/* Peak indicator */}
            <motion.g
              initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5, type: "spring", stiffness: 200 }}
            >
              <motion.circle 
                cx="260" 
                cy="80" 
                r="24" 
                fill="#FFB347" 
                opacity="0.2"
                animate={shouldReduceMotion ? {} : { 
                  r: [24, 28, 24],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx="260" cy="80" r="14" fill="#FFB347" filter="url(#softGlow)" />
              <text 
                x="260" 
                y="44" 
                textAnchor="middle" 
                fill="#FFB347" 
                fontSize="11" 
                fontWeight="700"
                letterSpacing="0.05em"
              >
                PEAK
              </text>
            </motion.g>
            
            {/* Moon icon */}
            <motion.g
              initial={shouldReduceMotion ? {} : { x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <circle cx="70" cy="300" r="26" fill="#7B68EE" opacity="0.5" filter="url(#softGlow)" />
              <circle cx="84" cy="290" r="22" fill="#0A0A0F" />
            </motion.g>
            
            {/* Sun icon with rays */}
            <motion.g
              transform="translate(330, 150)"
              initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 1.1, duration: 0.5, type: "spring", stiffness: 200 }}
            >
              <circle cx="0" cy="0" r="16" fill="#FFB347" filter="url(#softGlow)" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <motion.line
                  key={i}
                  x1={Math.cos(angle * Math.PI / 180) * 24}
                  y1={Math.sin(angle * Math.PI / 180) * 24}
                  x2={Math.cos(angle * Math.PI / 180) * 32}
                  y2={Math.sin(angle * Math.PI / 180) * 32}
                  stroke="#FFB347"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.3 + i * 0.04 }}
                />
              ))}
            </motion.g>
          </svg>
        </motion.div>

        {/* Text content */}
        <motion.div 
          className="text-center max-w-md"
          variants={shouldReduceMotion ? {} : itemVariants}
        >
          <h1 className="text-display-lg mb-5">
            <span className="gradient-text font-display">Discover your peak hours</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            Get your personal productivity forecast based on sleep science. 
            Optimize your day around your natural energy peaks.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-10"
          variants={shouldReduceMotion ? {} : itemVariants}
        >
          <GlassButton 
            onClick={onGetStarted} 
            size="xl"
            variant="premium"
            shimmer
            icon={<span>🌙</span>}
          >
            Log Last Night's Sleep
          </GlassButton>
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mt-14"
          variants={shouldReduceMotion ? {} : itemVariants}
        >
          {[
            { icon: "✓", text: "Free forever" },
            { icon: "✓", text: "No account needed" },
            { icon: "✓", text: "Data stays private" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <GlassCard padding="sm" className="!rounded-full !px-4 !py-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--success)]">{item.icon}</span>
                  <span className="text-[var(--text-secondary)]">{item.text}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Science badge */}
        <motion.div 
          className="mt-8"
          variants={shouldReduceMotion ? {} : itemVariants}
        >
          <GlassCard padding="sm" className="text-xs text-[var(--text-muted)] !px-4 !py-2.5">
            <span className="flex items-center gap-2">
              <span>🧬</span>
              <span className="tracking-wide">Powered by the Two-Process Model of sleep regulation</span>
            </span>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
