"use client";

import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceDot,
  ReferenceArea
} from "recharts";
import { ProductivityPoint, MelatoninWindow } from "@/types";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ProductivityCurveProps {
  points: ProductivityPoint[];
  wakeTime: string;
  melatoninWindow?: MelatoninWindow;
  showAnimation?: boolean;
}

interface ChartDataPoint {
  time: string;
  displayTime: string;
  value: number;
  zone: string;
  isPast: boolean;
  minutesFromMidnight: number;
}

// Thermal colors for future
const THERMAL_COLORS = {
  low: "#4A5568",
  lowMid: "#5B8DEF",
  mid: "#7B68EE",
  high: "#9A8CF5",
  peak: "#FFB347",
};

// Grey colors for past
const GREY_COLORS = {
  fill: "rgba(80, 80, 90, 0.3)",
  stroke: "#606068",
};

const ZONE_THRESHOLDS = {
  good: 75,
  moderate: 50,
  low: 25,
};

// Window configuration: 2h before + 2h after = 4h total
const HOURS_BEFORE_NOW = 2;
const HOURS_AFTER_NOW = 2;
const SCROLL_THRESHOLD_MINUTES = 20;

function getZone(value: number): string {
  if (value >= ZONE_THRESHOLDS.good) return "peak";
  if (value >= ZONE_THRESHOLDS.moderate) return "good";
  if (value >= ZONE_THRESHOLDS.low) return "moderate";
  return "low";
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
}: ProductivityCurveProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showNowButton, setShowNowButton] = useState(false);
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Transform all points
  const allChartData: ChartDataPoint[] = useMemo(() => {
    return points
      .filter((_, index) => index % 2 === 0) // Every 10 min
      .map(point => {
        const timeStr = point.time.includes("T")
          ? format(parseISO(point.time), "HH:mm")
          : point.time;
        const [h, m] = timeStr.split(":").map(Number);
        const mins = h * 60 + m;
        
        return {
          time: timeStr,
          displayTime: formatTimeForDisplay(timeStr),
          value: point.value,
          zone: getZone(point.value),
          isPast: mins < currentMinutes,
          minutesFromMidnight: mins,
        };
      });
  }, [points, currentMinutes]);

  // Calculate the visible 4h window centered on now
  const windowStart = currentMinutes - HOURS_BEFORE_NOW * 60;
  const windowEnd = currentMinutes + HOURS_AFTER_NOW * 60;

  // Get data for visible window (for initial view)
  const windowData = useMemo(() => {
    return allChartData.filter(d => 
      d.minutesFromMidnight >= windowStart && 
      d.minutesFromMidnight <= windowEnd
    );
  }, [allChartData, windowStart, windowEnd]);

  // Find the "now" point for the dot marker
  const nowPoint = useMemo(() => {
    // Find closest point to current time
    let closest = windowData[0];
    let minDiff = Infinity;
    for (const point of windowData) {
      const diff = Math.abs(point.minutesFromMidnight - currentMinutes);
      if (diff < minDiff) {
        minDiff = diff;
        closest = point;
      }
    }
    return closest;
  }, [windowData, currentMinutes]);

  // Track scroll position for "Now" button
  const initialScrollRef = useRef<number | null>(null);
  
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    
    if (initialScrollRef.current === null) {
      initialScrollRef.current = container.scrollLeft;
    }
    
    const scrollDiff = Math.abs(container.scrollLeft - (initialScrollRef.current || 0));
    const pixelsPerMinute = container.scrollWidth / allChartData.length / 10; // ~10min per point
    const minutesMoved = scrollDiff / Math.max(pixelsPerMinute, 1);
    
    setShowNowButton(minutesMoved > SCROLL_THRESHOLD_MINUTES);
  }, [allChartData.length]);

  // Scroll to center on "now"
  const scrollToNow = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    
    if (initialScrollRef.current !== null) {
      container.scrollTo({
        left: initialScrollRef.current,
        behavior: "smooth",
      });
    }
    setShowNowButton(false);
  }, []);

  // Initialize scroll position to show "now" in center
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    
    // Calculate position to center the chart
    const totalWidth = container.scrollWidth;
    const viewWidth = container.clientWidth;
    
    // Find where "now" is in the full dataset
    const nowIndex = allChartData.findIndex(d => d.minutesFromMidnight >= currentMinutes);
    const nowPercent = nowIndex / allChartData.length;
    
    // Scroll to center "now"
    const targetScroll = (nowPercent * totalWidth) - (viewWidth / 2);
    container.scrollLeft = Math.max(0, targetScroll);
    initialScrollRef.current = container.scrollLeft;
  }, [allChartData, currentMinutes]);

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
        <div className="text-lg font-display font-semibold text-[var(--text-primary)]">
          {data.displayTime}
        </div>
        <div className="stat-number text-[var(--accent-purple)] mt-0.5">
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

  // Melatonin window times
  const melatoninStart = useMemo(() => {
    if (!melatoninWindow) return null;
    return format(parseISO(melatoninWindow.startTime), "HH:mm");
  }, [melatoninWindow]);

  const melatoninEnd = useMemo(() => {
    if (!melatoninWindow) return null;
    return format(parseISO(melatoninWindow.endTime), "HH:mm");
  }, [melatoninWindow]);

  // Split data into past (grey) and future (colorful)
  const splitIndex = windowData.findIndex(d => !d.isPast);

  // Calculate chart width based on full data for scrolling
  const chartWidthPercent = Math.max(100, (allChartData.length / windowData.length) * 100);

  return (
    <div className="w-full relative">
      {/* Scrollable container */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto"
        onScroll={handleScroll}
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div 
          className={showAnimation ? 'animate-draw-in' : ''}
          style={{ 
            width: `${chartWidthPercent}%`,
            minWidth: '100%',
          }}
        >
          <div className="w-full h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={allChartData}
                margin={{ top: 24, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  {/* Grey gradient for past */}
                  <linearGradient id="greyFill" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#3A3A42" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#5A5A62" stopOpacity={0.25} />
                  </linearGradient>
                  
                  {/* Colorful gradient for future */}
                  <linearGradient id="futureFill" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={THERMAL_COLORS.low} stopOpacity={0.15} />
                    <stop offset="25%" stopColor={THERMAL_COLORS.lowMid} stopOpacity={0.3} />
                    <stop offset="50%" stopColor={THERMAL_COLORS.mid} stopOpacity={0.4} />
                    <stop offset="75%" stopColor={THERMAL_COLORS.high} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={THERMAL_COLORS.peak} stopOpacity={0.7} />
                  </linearGradient>

                  {/* Stroke gradient */}
                  <linearGradient id="strokeGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={THERMAL_COLORS.lowMid} />
                    <stop offset="50%" stopColor={THERMAL_COLORS.mid} />
                    <stop offset="100%" stopColor={THERMAL_COLORS.peak} />
                  </linearGradient>

                  {/* Horizontal split gradient */}
                  <linearGradient id="splitGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4A4A52" stopOpacity={0.2} />
                    <stop offset={`${Math.max(5, (splitIndex / allChartData.length) * 100)}%`} stopColor="#4A4A52" stopOpacity={0.2} />
                    <stop offset={`${Math.min(95, (splitIndex / allChartData.length) * 100 + 2)}%`} stopColor={THERMAL_COLORS.mid} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={THERMAL_COLORS.high} stopOpacity={0.5} />
                  </linearGradient>

                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="blur"/>
                    <feMerge>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <XAxis 
                  dataKey="displayTime" 
                  tick={{ 
                    fontSize: 9, 
                    fill: "var(--text-muted)",
                  }}
                  tickLine={false}
                  axisLine={false}
                  interval={5}
                />

                <YAxis domain={[0, 100]} hide />

                {/* Melatonin overlay */}
                {melatoninStart && melatoninEnd && (
                  <ReferenceArea
                    x1={formatTimeForDisplay(melatoninStart)}
                    x2={formatTimeForDisplay(melatoninEnd)}
                    fill="rgba(123, 104, 238, 0.1)"
                    fillOpacity={1}
                  />
                )}

                {/* Main curve with split coloring - natural for smooth curves */}
                <Area
                  type="natural"
                  dataKey="value"
                  stroke="url(#strokeGrad)"
                  strokeWidth={2}
                  fill="url(#splitGradient)"
                  animationDuration={showAnimation ? 800 : 0}
                  filter="url(#glow)"
                />

                {/* Minimalistic "Now" dot marker */}
                {nowPoint && (
                  <ReferenceDot
                    x={nowPoint.displayTime}
                    y={nowPoint.value}
                    r={4}
                    fill="var(--accent-purple)"
                    stroke="var(--bg-dark)"
                    strokeWidth={2}
                    label={{
                      value: "We're here",
                      position: "top",
                      fill: "var(--text-muted)",
                      fontSize: 9,
                      dy: -8,
                    }}
                  />
                )}

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ 
                    stroke: "var(--glass-border)", 
                    strokeWidth: 1,
                    strokeDasharray: "3 3"
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* "Now" button - appears when scrolled away */}
      <AnimatePresence>
        {showNowButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={scrollToNow}
            className="absolute bottom-4 right-2 px-2.5 py-1 rounded-full text-[10px] font-medium
              bg-[var(--accent-purple)] text-white
              shadow-lg shadow-[var(--accent-purple)]/20
              flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Now
          </motion.button>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex justify-between items-center text-[10px] mt-2 px-1">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A62]" />
          <span className="text-[var(--text-muted)]">Past</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: THERMAL_COLORS.mid }} />
            <span className="text-[var(--text-muted)]">Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: THERMAL_COLORS.peak }} />
            <span className="text-[var(--text-muted)]">Peak</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar { display: none; }
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
