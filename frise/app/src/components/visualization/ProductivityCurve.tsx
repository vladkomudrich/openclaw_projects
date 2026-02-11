"use client";

import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea
} from "recharts";
import { ProductivityPoint, MelatoninWindow } from "@/types";
import { format, parseISO, addMinutes, subMinutes } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ProductivityCurveProps {
  points: ProductivityPoint[];
  wakeTime: string;
  melatoninWindow?: MelatoninWindow;
  showAnimation?: boolean;
  /** Show 4h window mode with scroll (default: true) */
  focusedMode?: boolean;
}

interface ChartDataPoint {
  time: string;
  displayTime: string;
  value: number;
  zone: string;
  color: string;
  isPast: boolean;
  minutesFromMidnight: number;
}

// Dark theme thermal colors
const THERMAL_COLORS = {
  low: "#4A5568",
  lowMid: "#5B8DEF",
  mid: "#7B68EE",
  high: "#9A8CF5",
  peak: "#FFB347",
};

// Grey colors for past
const GREY_COLORS = {
  low: "#3A3A3A",
  lowMid: "#4A4A4A",
  mid: "#5A5A5A",
  high: "#6A6A6A",
  peak: "#7A7A7A",
};

const ZONE_THRESHOLDS = {
  good: 75,
  moderate: 50,
  low: 25,
};

// Window configuration
const VISIBLE_WINDOW_HOURS = 4; // 4 hour visible window
const HOURS_BEFORE_NOW = 2;
const HOURS_AFTER_NOW = 2;
const SCROLL_THRESHOLD_MINUTES = 30; // Show "Now" button after scrolling 30min away

function getColorForValue(value: number): string {
  if (value >= ZONE_THRESHOLDS.good) return THERMAL_COLORS.peak;
  if (value >= ZONE_THRESHOLDS.moderate) return THERMAL_COLORS.high;
  if (value >= ZONE_THRESHOLDS.low) return THERMAL_COLORS.mid;
  return THERMAL_COLORS.low;
}

const ADVICE_MESSAGES: Record<string, string[]> = {
  peak: [
    "🔥 Peak focus! Tackle your hardest task.",
    "💎 Prime time for deep work.",
    "🎯 Maximum cognitive capacity.",
  ],
  good: [
    "⚡ Great energy for productive work.",
    "✨ Solid focus window.",
    "💪 Good time for complex tasks.",
  ],
  moderate: [
    "💫 Steady energy, good for routine work.",
    "☕ Consider a quick break soon.",
    "📋 Handle admin tasks now.",
  ],
  low: [
    "🌙 Rest period, save hard tasks for later.",
    "😴 Low energy, focus on light work.",
    "🧘 Good time for a break.",
  ],
};

export function ProductivityCurve({ 
  points, 
  wakeTime,
  melatoninWindow,
  showAnimation = true,
  focusedMode = true,
}: ProductivityCurveProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showNowButton, setShowNowButton] = useState(false);
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Transform all points for chart with past/future marking
  const allChartData: ChartDataPoint[] = useMemo(() => {
    return points
      .filter((_, index) => index % 3 === 0) // Reduce data points
      .map(point => {
        const timeStr = point.time.includes("T")
          ? format(parseISO(point.time), "HH:mm")
          : point.time;
        const [h, m] = timeStr.split(":").map(Number);
        const minutesFromMidnight = h * 60 + m;
        
        return {
          time: timeStr,
          displayTime: formatTimeForDisplay(timeStr),
          value: point.value,
          zone: point.zone,
          color: getColorForValue(point.value),
          isPast: minutesFromMidnight < currentTimeMinutes,
          minutesFromMidnight,
        };
      });
  }, [points, currentTimeMinutes]);

  // Calculate visible window for focused mode
  const { visibleData, totalWidth, initialScrollLeft } = useMemo(() => {
    if (!focusedMode) {
      return {
        visibleData: allChartData,
        totalWidth: 100,
        initialScrollLeft: 0,
      };
    }

    const windowStartMinutes = currentTimeMinutes - HOURS_BEFORE_NOW * 60;
    const windowEndMinutes = currentTimeMinutes + HOURS_AFTER_NOW * 60;
    
    // Find first and last data points
    const firstDataMinutes = allChartData[0]?.minutesFromMidnight ?? 0;
    const lastDataMinutes = allChartData[allChartData.length - 1]?.minutesFromMidnight ?? 1440;
    
    // Calculate total scroll width as percentage (full day vs visible window)
    const totalMinutes = lastDataMinutes - firstDataMinutes;
    const visibleMinutes = VISIBLE_WINDOW_HOURS * 60;
    const widthMultiplier = totalMinutes / visibleMinutes;
    
    // Calculate scroll position to center on "now"
    const nowPositionPercent = (currentTimeMinutes - firstDataMinutes) / totalMinutes;
    const initialScroll = (nowPositionPercent * widthMultiplier * 100) - 50;
    
    return {
      visibleData: allChartData,
      totalWidth: widthMultiplier * 100,
      initialScrollLeft: Math.max(0, initialScroll),
    };
  }, [allChartData, currentTimeMinutes, focusedMode]);

  // Initialize scroll position
  useEffect(() => {
    if (scrollContainerRef.current && focusedMode) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth - container.clientWidth;
      container.scrollLeft = (initialScrollLeft / 100) * scrollWidth;
    }
  }, [initialScrollLeft, focusedMode]);

  // Handle scroll to track position
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !focusedMode) return;
    
    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;
    const scrollPercent = scrollWidth > 0 ? (currentScroll / scrollWidth) * 100 : 0;
    
    setScrollOffset(scrollPercent);
    
    // Check if we're far from "now" position
    const distanceFromInitial = Math.abs(scrollPercent - initialScrollLeft);
    const thresholdPercent = (SCROLL_THRESHOLD_MINUTES / (VISIBLE_WINDOW_HOURS * 60)) * 100;
    setShowNowButton(distanceFromInitial > thresholdPercent);
  }, [initialScrollLeft, focusedMode]);

  // Scroll back to "now"
  const scrollToNow = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const targetScroll = (initialScrollLeft / 100) * scrollWidth;
    
    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
    
    setShowNowButton(false);
  }, [initialScrollLeft]);

  // Get current time for display
  const currentTime = useMemo(() => {
    const now = new Date();
    return format(now, "HH:mm");
  }, []);

  // Custom tooltip
  const CustomTooltip = useCallback(({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDataPoint }> }) => {
    if (!active || !payload || !payload[0]) return null;
    
    const data = payload[0].payload;
    const messages = ADVICE_MESSAGES[data.zone] || ADVICE_MESSAGES.moderate;
    const messageIndex = Math.floor(Date.now() / 10000) % messages.length;
    const message = messages[messageIndex];
    
    return (
      <motion.div 
        className="glass p-3 max-w-[180px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <div 
          className="text-lg font-display font-semibold"
          style={{ color: data.isPast ? GREY_COLORS.peak : data.color }}
        >
          {data.displayTime}
        </div>
        <div className="stat-number text-[var(--text-primary)] mt-0.5">
          {data.value}%
        </div>
        <div className="text-xs text-[var(--text-secondary)] mt-1 capitalize">
          {data.zone === "peak" ? "Peak Focus" : data.zone} Zone
          {data.isPast && " (past)"}
        </div>
        {!data.isPast && (
          <div className="text-xs text-[var(--text-muted)] mt-2 border-t border-[var(--glass-border)] pt-2">
            {message}
          </div>
        )}
      </motion.div>
    );
  }, []);

  // Get melatonin window boundaries for chart
  const melatoninStart = useMemo(() => {
    if (!melatoninWindow) return null;
    const startDate = parseISO(melatoninWindow.startTime);
    return format(startDate, "HH:mm");
  }, [melatoninWindow]);

  const melatoninEnd = useMemo(() => {
    if (!melatoninWindow) return null;
    const endDate = parseISO(melatoninWindow.endTime);
    return format(endDate, "HH:mm");
  }, [melatoninWindow]);

  // Find the index where past meets future for gradient split
  const splitIndex = useMemo(() => {
    return visibleData.findIndex(d => !d.isPast);
  }, [visibleData]);

  return (
    <div className="w-full relative">
      {/* Scrollable container */}
      <div 
        ref={scrollContainerRef}
        className={`w-full ${focusedMode ? 'overflow-x-auto scrollbar-hide' : ''}`}
        onScroll={handleScroll}
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div 
          className={`${showAnimation ? 'animate-draw-in' : ''}`}
          style={{ 
            width: focusedMode ? `${totalWidth}%` : '100%',
            minWidth: focusedMode ? '100%' : undefined,
          }}
        >
          <div className="w-full aspect-[16/9] md:aspect-[2/1]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={visibleData}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
              >
                {/* Gradient definitions */}
                <defs>
                  {/* Grey gradient for past */}
                  <linearGradient id="greyGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={GREY_COLORS.low} stopOpacity={0.15} />
                    <stop offset="50%" stopColor={GREY_COLORS.mid} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={GREY_COLORS.peak} stopOpacity={0.35} />
                  </linearGradient>
                  <linearGradient id="greyStrokeGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={GREY_COLORS.lowMid} />
                    <stop offset="100%" stopColor={GREY_COLORS.peak} />
                  </linearGradient>
                  
                  {/* Colorful gradient for future */}
                  <linearGradient id="thermalGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={THERMAL_COLORS.low} stopOpacity={0.2} />
                    <stop offset="25%" stopColor={THERMAL_COLORS.lowMid} stopOpacity={0.4} />
                    <stop offset="50%" stopColor={THERMAL_COLORS.mid} stopOpacity={0.5} />
                    <stop offset="75%" stopColor={THERMAL_COLORS.high} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={THERMAL_COLORS.peak} stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="strokeGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={THERMAL_COLORS.lowMid} />
                    <stop offset="50%" stopColor={THERMAL_COLORS.mid} />
                    <stop offset="100%" stopColor={THERMAL_COLORS.peak} />
                  </linearGradient>
                  
                  {/* Split gradient for fill - horizontal split at current time */}
                  <linearGradient id="splitFillGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={GREY_COLORS.mid} stopOpacity={0.25} />
                    <stop offset={`${Math.max(0, (splitIndex / visibleData.length) * 100 - 1)}%`} stopColor={GREY_COLORS.mid} stopOpacity={0.25} />
                    <stop offset={`${Math.min(100, (splitIndex / visibleData.length) * 100 + 1)}%`} stopColor={THERMAL_COLORS.mid} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={THERMAL_COLORS.high} stopOpacity={0.6} />
                  </linearGradient>
                  
                  {/* Glow filter */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* X Axis */}
                <XAxis 
                  dataKey="displayTime" 
                  tick={{ 
                    fontSize: 10, 
                    fill: "var(--text-muted)",
                    fontFamily: "var(--font-inter)"
                  }}
                  tickLine={false}
                  axisLine={false}
                  interval={focusedMode ? 3 : "preserveStartEnd"}
                />

                {/* Y Axis (hidden but needed for proper scaling) */}
                <YAxis 
                  domain={[0, 100]}
                  hide
                />

                {/* Melatonin window overlay */}
                {melatoninStart && melatoninEnd && (
                  <ReferenceArea
                    x1={formatTimeForDisplay(melatoninStart)}
                    x2={formatTimeForDisplay(melatoninEnd)}
                    fill="rgba(123, 104, 238, 0.12)"
                    fillOpacity={1}
                    label={{
                      value: "🌙",
                      position: "top",
                      fill: "var(--accent-purple)",
                      fontSize: 14,
                    }}
                  />
                )}

                {/* Minimalistic "Now" marker - subtle vertical line with label */}
                <ReferenceLine
                  x={formatTimeForDisplay(currentTime)}
                  stroke="var(--text-secondary)"
                  strokeWidth={1.5}
                  strokeOpacity={0.6}
                  label={{
                    value: "We're here",
                    position: "top",
                    fill: "var(--text-muted)",
                    fontSize: 9,
                    fontFamily: "var(--font-inter)",
                    dy: -2,
                  }}
                />

                {/* Main area with split coloring */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="url(#strokeGradient)"
                  strokeWidth={2.5}
                  fill="url(#splitFillGradient)"
                  animationDuration={showAnimation ? 1000 : 0}
                  animationEasing="ease-out"
                  filter="url(#glow)"
                />

                {/* Tooltip */}
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ 
                    stroke: "var(--glass-border)", 
                    strokeWidth: 1,
                    strokeDasharray: "4 4"
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* "Now" return button - appears when scrolled away */}
      <AnimatePresence>
        {showNowButton && focusedMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToNow}
            className="absolute bottom-2 right-2 px-3 py-1.5 rounded-full text-xs font-medium
              bg-[var(--glass-bg)] border border-[var(--glass-border)]
              text-[var(--text-secondary)] hover:text-[var(--text-primary)]
              hover:bg-[var(--glass-bg-hover)] transition-colors
              flex items-center gap-1.5 shadow-lg"
          >
            <svg 
              className="w-3 h-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            Now
          </motion.button>
        )}
      </AnimatePresence>

      {/* Zone legend */}
      <div className="flex justify-between items-center text-xs mt-3 px-2">
        <div className="flex items-center gap-1.5">
          <span 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: GREY_COLORS.mid }}
          />
          <span className="text-[var(--text-muted)]">Past</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: THERMAL_COLORS.mid }}
            />
            <span className="text-[var(--text-muted)]">Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <span 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: THERMAL_COLORS.peak }}
            />
            <span className="text-[var(--text-muted)]">Peak</span>
          </div>
        </div>
      </div>

      {/* Scroll hint for focused mode */}
      {focusedMode && (
        <p className="text-center text-[10px] text-[var(--text-muted)] mt-2 opacity-60">
          ← Swipe to explore your day →
        </p>
      )}

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

function formatTimeForDisplay(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''} ${period}`;
}
