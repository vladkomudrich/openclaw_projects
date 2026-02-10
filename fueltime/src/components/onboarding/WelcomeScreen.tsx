"use client";

import { motion } from "framer-motion";
import { FuelTimeIcon } from "../icons/FuelTimeIcon";
import { GlassButton } from "../ui/GlassButton";
import { GlassCard } from "../ui/GlassCard";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[var(--eating-primary)] rounded-full blur-[128px] opacity-20" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-[var(--fasting-primary)] rounded-full blur-[128px] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--accent-orange)] rounded-full blur-[200px] opacity-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
          className="flex justify-center"
        >
          <FuelTimeIcon size={120} />
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 text-4xl font-display font-semibold text-[var(--text-primary)] text-center"
        >
          FuelTime
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-2 text-lg text-[var(--text-secondary)] text-center"
        >
          Science-based meal timing
        </motion.p>

        {/* Hero Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-10 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[var(--text-primary)] leading-tight">
            Eat at the right time,{" "}
            <span className="gradient-text-eating">feel amazing</span>{" "}
            all day
          </h2>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
            Optimize your eating windows for peak energy, mental clarity, and
            metabolic health using chrononutrition science.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {[
            { emoji: "⚡", text: "Stable Energy" },
            { emoji: "🧠", text: "Better Focus" },
            { emoji: "💪", text: "Metabolic Health" },
          ].map((benefit) => (
            <div
              key={benefit.text}
              className="flex items-center gap-2 px-4 py-2 glass rounded-full"
            >
              <span className="text-xl">{benefit.emoji}</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {benefit.text}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12"
        >
          <GlassButton
            variant="eating"
            size="xl"
            fullWidth
            onClick={onGetStarted}
          >
            Get My Eating Schedule
          </GlassButton>
          <p className="mt-3 text-center text-sm text-[var(--text-muted)]">
            Free • No signup required • Takes 30 seconds
          </p>
        </motion.div>

        {/* Science badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-8 flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]"
        >
          <svg
            className="w-4 h-4 text-[var(--eating-primary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Based on chrononutrition research</span>
        </motion.div>
      </div>
    </div>
  );
}
