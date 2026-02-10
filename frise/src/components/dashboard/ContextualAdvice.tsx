"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

interface ContextualAdviceProps {
  zone: string;
  productivityValue: number;
}

const zoneConfig: Record<string, {
  icon: string;
  title: string;
  gradient: string;
  glowColor: string;
  messages: string[];
}> = {
  peak: {
    icon: "🔥",
    title: "Peak Performance Zone",
    gradient: "linear-gradient(135deg, var(--accent-gold), var(--accent-purple))",
    glowColor: "rgba(255, 179, 71, 0.3)",
    messages: [
      "Your cognitive functions are at their best. Tackle complex problems now.",
      "Perfect time for creative work and strategic thinking.",
      "Maximum focus available. Use it for your most important task.",
      "Your brain is primed for deep work. Minimize distractions.",
    ],
  },
  good: {
    icon: "⚡",
    title: "High Energy Zone",
    gradient: "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
    glowColor: "rgba(123, 104, 238, 0.3)",
    messages: [
      "Great energy levels for productive work.",
      "Good time for collaborative tasks and meetings.",
      "Your focus is strong. Maintain momentum.",
      "Solid performance window. Keep the productivity flowing.",
    ],
  },
  moderate: {
    icon: "💫",
    title: "Steady Energy",
    gradient: "linear-gradient(135deg, var(--accent-blue), var(--info))",
    glowColor: "rgba(91, 141, 239, 0.3)",
    messages: [
      "Energy is steady. Good for routine tasks.",
      "Consider taking short breaks to maintain focus.",
      "A light walk or stretch can boost your energy.",
      "Moderate cognitive load tasks are ideal now.",
    ],
  },
  low: {
    icon: "🌙",
    title: "Rest & Recovery",
    gradient: "linear-gradient(135deg, var(--thermal-low), var(--accent-purple))",
    glowColor: "rgba(74, 85, 104, 0.3)",
    messages: [
      "Your body is signaling rest. Honor it.",
      "Perfect time for light admin tasks or breaks.",
      "Consider a short power nap if possible.",
      "Save complex decisions for your next peak period.",
    ],
  },
};

export function ContextualAdvice({ zone, productivityValue }: ContextualAdviceProps) {
  const config = zoneConfig[zone] || zoneConfig.moderate;
  const randomMessage = config.messages[Math.floor(Math.random() * config.messages.length)];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard 
        padding="lg"
        className="relative overflow-hidden"
        style={{
          boxShadow: `0 0 30px ${config.glowColor}`,
        }}
      >
        {/* Gradient background accent */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-[24px]"
          style={{ background: config.gradient }}
        />
        
        <div className="flex items-start gap-4">
          {/* Icon with gradient background */}
          <motion.div 
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: config.gradient }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {config.icon}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-semibold text-[var(--text-primary)]">
                {config.title}
              </h3>
              <div className="flex items-center gap-2">
                <span 
                  className="font-display font-bold text-xl"
                  style={{ 
                    background: config.gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {productivityValue}%
                </span>
              </div>
            </div>
            
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              {randomMessage}
            </p>
            
            {/* Current time indicator */}
            <div className="flex items-center gap-2 mt-3 text-xs text-[var(--text-muted)]">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--error)] animate-pulse" />
              <span>Right now</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
