"use client";

import { useMemo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { 
  ProductivityPhase, 
  PHASE_CONFIGS, 
  getPhaseAdvice,
  determinePhase 
} from "@/lib/constants/phaseAdvice";
import { ProductivityPoint, MelatoninWindow, DayInsights } from "@/types";

interface CurrentPhaseHeroProps {
  points: ProductivityPoint[];
  insights: DayInsights;
  melatoninWindow?: MelatoninWindow;
}

interface ScheduleItem {
  icon: string;
  label: string;
  time: string;
  isActive?: boolean;
}

export function CurrentPhaseHero({ 
  points, 
  insights, 
  melatoninWindow 
}: CurrentPhaseHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Determine current phase based on data
  const { currentPhase, config, advice } = useMemo(() => {
    const now = new Date();
    const hourOfDay = now.getHours();
    const currentTime = format(now, "HH:mm");
    
    // Find current and previous point
    let currentPoint: ProductivityPoint | null = null;
    let previousPoint: ProductivityPoint | null = null;
    
    for (let i = 0; i < points.length; i++) {
      const pointTime = points[i].time.includes("T") 
        ? format(parseISO(points[i].time), "HH:mm")
        : points[i].time;
      
      if (pointTime <= currentTime) {
        previousPoint = currentPoint;
        currentPoint = points[i];
      } else {
        break;
      }
    }
    
    // Check if in melatonin window
    let isInMelatoninWindow = false;
    if (melatoninWindow) {
      const windowStart = parseISO(melatoninWindow.startTime);
      const windowEnd = parseISO(melatoninWindow.endTime);
      isInMelatoninWindow = now >= windowStart && now <= windowEnd;
    }
    
    const currentValue = currentPoint?.value ?? insights.currentProductivity;
    const previousValue = previousPoint?.value ?? null;
    
    const phase = determinePhase(
      currentValue,
      previousValue,
      hourOfDay,
      isInMelatoninWindow
    );
    
    return {
      currentPhase: phase,
      config: PHASE_CONFIGS[phase],
      advice: getPhaseAdvice(phase),
    };
  }, [points, insights, melatoninWindow]);

  // Build schedule items
  const scheduleItems = useMemo((): ScheduleItem[] => {
    const items: ScheduleItem[] = [];
    const now = new Date();
    
    // Next peak
    if (insights.peakStartTime) {
      const isPast = isTimePast(insights.peakStartTime, now);
      if (!isPast) {
        items.push({
          icon: "🔺",
          label: "Peak",
          time: insights.peakStartTime,
        });
      }
    }
    
    // Next dip (find from points)
    const nextDip = findNextDip(points, now);
    if (nextDip) {
      items.push({
        icon: "🔻",
        label: "Dip",
        time: nextDip,
      });
    }
    
    // Melatonin window
    if (insights.melatoninWindowStart) {
      items.push({
        icon: "🌙",
        label: "Melatonin",
        time: insights.melatoninWindowStart,
        isActive: currentPhase === "melatonin_window",
      });
    }
    
    return items.slice(0, 3); // Max 3 items
  }, [insights, points, currentPhase]);

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard 
        padding="lg"
        variant="layered"
        className="relative overflow-hidden"
        style={{
          boxShadow: `0 0 50px ${config.glowColor}, 0 8px 32px -8px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Gradient accent line at top */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-[24px]"
          style={{ background: config.gradient }}
          initial={shouldReduceMotion ? {} : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Ambient glow effect */}
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
            filter: "blur(30px)",
            opacity: 0.5,
          }}
          aria-hidden="true"
        />
        
        {/* Main content */}
        <div className="flex items-start gap-4 relative">
          {/* Phase icon with breathing animation */}
          <motion.div 
            className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl relative"
            style={{ background: config.gradient }}
            animate={shouldReduceMotion ? {} : { 
              scale: [1, 1.04, 1],
              filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Inner glow */}
            <div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,255,255,0.25) 0%, transparent 70%)",
              }}
            />
            <span className="relative z-10">{config.icon}</span>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            {/* Phase name */}
            <motion.h2 
              className="font-display font-bold text-xl"
              style={{ 
                background: config.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {config.name}
            </motion.h2>
            
            {/* Advice */}
            <motion.p 
              className="text-[var(--text-secondary)] text-sm mt-1.5 leading-relaxed"
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {advice}
            </motion.p>
            
            {/* Current productivity indicator */}
            <motion.div 
              className="flex items-center gap-2 mt-3"
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.span 
                className="inline-block w-2 h-2 rounded-full bg-[var(--success)]"
                animate={shouldReduceMotion ? {} : { 
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs text-[var(--text-muted)] tracking-wide">
                {insights.currentProductivity}% energy right now
              </span>
            </motion.div>
          </div>
        </div>
        
        {/* Schedule list */}
        <AnimatePresence>
          {scheduleItems.length > 0 && (
            <motion.div 
              className="mt-5 pt-4 border-t border-[var(--glass-border)]"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="label text-[var(--text-muted)] mb-3 tracking-widest">Coming up</p>
              <div className="flex flex-wrap gap-3">
                {scheduleItems.map((item, index) => (
                  <motion.div
                    key={`${item.label}-${index}`}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                      item.isActive 
                        ? "bg-[var(--accent-purple)]/20 border border-[var(--accent-purple)]/40 shadow-[0_0_15px_rgba(123,104,238,0.2)]" 
                        : "bg-[var(--glass-bg)] border border-transparent hover:border-[var(--glass-border)]"
                    }`}
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.55 + index * 0.08,
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm text-[var(--text-secondary)]">
                      {item.label}:
                    </span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {item.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}

// Helper: Check if a time string (HH:mm or h:mm AM/PM) is past current time
function isTimePast(timeStr: string, now: Date): boolean {
  const [timePart, period] = timeStr.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);
  
  if (period) {
    // 12-hour format
    if (period.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (period.toLowerCase() === "am" && hours === 12) hours = 0;
  }
  
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = hours * 60 + (minutes || 0);
  
  return targetMinutes <= currentMinutes;
}

// Helper: Find next dip time from points
function findNextDip(points: ProductivityPoint[], now: Date): string | null {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  let inDip = false;
  
  for (const point of points) {
    const timeStr = point.time.includes("T")
      ? format(parseISO(point.time), "HH:mm")
      : point.time;
    
    const [h, m] = timeStr.split(":").map(Number);
    const pointMinutes = h * 60 + m;
    
    // Skip past times
    if (pointMinutes <= currentMinutes) {
      inDip = point.zone === "low";
      continue;
    }
    
    // Found upcoming dip
    if (point.zone === "low" && !inDip) {
      const hour = Math.floor(pointMinutes / 60);
      const minute = pointMinutes % 60;
      const displayHour = hour % 12 || 12;
      const period = hour >= 12 ? "PM" : "AM";
      return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
    }
    
    inDip = point.zone === "low";
  }
  
  return null;
}
