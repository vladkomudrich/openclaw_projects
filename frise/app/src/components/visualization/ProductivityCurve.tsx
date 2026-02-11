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

const ZONE_THRESHOLDS = {
  good: 75,
  moderate: 50,
  low: 25,
};

// Window: 4 hours visible (2h before + 2h after now)
const VISIBLE_HOURS = 4;
const SCROLL_THRESHOLD_MINUTES = 15;

function getZone(value: number): string {
  if (value >= ZONE_THRESHOLDS.good) return "peak";
  if (value >= ZONE_THRESHOLDS.moderate) return "good";
  if (value >= ZONE_THRESHOLDS.low) return "moderate";
  return "low";
}

const ADVICE_MESSAGES: Record<string, string[]> = {
  peak: ["🔥 Peak focus!", "💎 Deep work time.", "🎯 Max capacity."],
  good: ["⚡ Great energy.", "✨ Solid focus.", "💪 Complex tasks."],
  moderate: ["💫 Steady energy.", "☕ Break soon?", "📋 Admin tasks."],
  low: ["🌙 Rest period.", "😴 Light work.", "🧘 Take a break."],
};

export function ProductivityCurve({ 
  points, 
  wakeTime,
  melatoninWindow,
  showAnimation = true,
}: ProductivityCurveProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showNowButton, setShowNowButton] = useState(false);
  const initialScrollRef = useRef<number>(0);
  
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

  // Transform all points (every 10 min for smoother curve)
  const allChartData: ChartDataPoint[] = useMemo(() => {
    return points
      .filter((_, index) => index % 2 === 0)
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

  // Calculate data range and chart width
  const { firstMinute, lastMinute, totalMinutes, chartWidthPercent, nowPercent } = useMemo(() => {
    if (allChartData.length === 0) return { 
      firstMinute: 0, lastMinute: 1440, totalMinutes: 1440, 
      chartWidthPercent: 100, nowPercent: 50 
    };
    
    const first = allChartData[0].minutesFromMidnight;
    const last = allChartData[allChartData.length - 1].minutesFromMidnight;
    const total = last - first;
    
    // Chart should be wide enough so 4h fills the viewport
    const visibleMinutes = VISIBLE_HOURS * 60; // 240 minutes
    const widthMultiplier = total / visibleMinutes;
    
    // Where is "now" as a percentage of the data
    const nowPct = ((currentMinutes - first) / total) * 100;
    
    return {
      firstMinute: first,
      lastMinute: last,
      totalMinutes: total,
      chartWidthPercent: Math.max(100, widthMultiplier * 100),
      nowPercent: Math.max(0, Math.min(100, nowPct)),
    };
  }, [allChartData, currentMinutes]);

  // Find the "now" point for the dot marker
  const nowPoint = useMemo(() => {
    let closest = allChartData[0];
    let minDiff = Infinity;
    for (const point of allChartData) {
      const diff = Math.abs(point.minutesFromMidnight - currentMinutes);
      if (diff < minDiff) {
        minDiff = diff;
        closest = point;
      }
    }
    return closest;
  }, [allChartData, currentMinutes]);

  // Split index for gradient (where past meets future)
  const splitIndex = useMemo(() => {
    const idx = allChartData.findIndex(d => !d.isPast);
    return idx === -1 ? allChartData.length : idx;
  }, [allChartData]);

  // Initialize scroll to center on "now"
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    
    // Wait for layout
    requestAnimationFrame(() => {
      const scrollWidth = container.scrollWidth - container.clientWidth;
      // Scroll so "now" is in the center
      const targetScroll = (nowPercent / 100) * scrollWidth;
      container.scrollLeft = targetScroll;
      initialScrollRef.current = targetScroll;
    });
  }, [nowPercent, chartWidthPercent]);

  // Handle scroll
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollDiff = Math.abs(container.scrollLeft - initialScrollRef.current);
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const minutesMoved = (scrollDiff / scrollWidth) * totalMinutes;
    
    setShowNowButton(minutesMoved > SCROLL_THRESHOLD_MINUTES);
  }, [totalMinutes]);

  // Scroll back to "now"
  const scrollToNow = useCallback(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTo({
      left: initialScrollRef.current,
      behavior: "smooth",
    });
    setShowNowButton(false);
  }, []);

  // Custom tooltip
  const CustomTooltip = useCallback(({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDataPoint }> }) => {
    if (!active || !payload || !payload[0]) return null;
    
    const data = payload[0].payload;
    const messages = ADVICE_MESSAGES[data.zone] || ADVICE_MESSAGES.moderate;
    const message = messages[Math.floor(Date.now() / 10000) % messages.length];
    
    return (
      <motion.div 
        className="glass p-3 max-w-[160px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-base font-display font-semibold text-[var(--text-primary)]">
          {data.displayTime}
        </div>
        <div className="text-lg font-bold text-[var(--accent-purple)]">
          {data.value}%
        </div>
        {!data.isPast && (
          <div className="text-xs text-[var(--text-muted)] mt-1 pt-1 border-t border-[var(--glass-border)]">
            {message}
          </div>
        )}
      </motion.div>
    );
  }, []);

  // Melatonin window
  const melatoninStart = useMemo(() => {
    if (!melatoninWindow) return null;
    return format(parseISO(melatoninWindow.startTime), "HH:mm");
  }, [melatoninWindow]);

  const melatoninEnd = useMemo(() => {
    if (!melatoninWindow) return null;
    return format(parseISO(melatoninWindow.endTime), "HH:mm");
  }, [melatoninWindow]);

  return (
    <div className="w-full relative">
      {/* Scrollable container */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div 
          className={showAnimation ? 'animate-draw-in' : ''}
          style={{ width: `${chartWidthPercent}%`, minWidth: '100%' }}
        >
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={allChartData}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  {/* Horizontal split gradient: grey left, color right */}
                  <linearGradient id="splitGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4A4A52" stopOpacity={0.2} />
                    <stop offset={`${Math.max(0, (splitIndex / allChartData.length) * 100)}%`} stopColor="#4A4A52" stopOpacity={0.2} />
                    <stop offset={`${Math.min(100, (splitIndex / allChartData.length) * 100 + 1)}%`} stopColor={THERMAL_COLORS.mid} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={THERMAL_COLORS.high} stopOpacity={0.5} />
                  </linearGradient>
                  
                  {/* Stroke gradient */}
                  <linearGradient id="strokeGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={THERMAL_COLORS.lowMid} />
                    <stop offset="50%" stopColor={THERMAL_COLORS.mid} />
                    <stop offset="100%" stopColor={THERMAL_COLORS.peak} />
                  </linearGradient>

                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                <XAxis 
                  dataKey="displayTime" 
                  tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />

                <YAxis domain={[0, 100]} hide />

                {/* Melatonin overlay */}
                {melatoninStart && melatoninEnd && (
                  <ReferenceArea
                    x1={formatTimeForDisplay(melatoninStart)}
                    x2={formatTimeForDisplay(melatoninEnd)}
                    fill="rgba(123, 104, 238, 0.08)"
                    fillOpacity={1}
                  />
                )}

                {/* Main curve */}
                <Area
                  type="natural"
                  dataKey="value"
                  stroke="url(#strokeGrad)"
                  strokeWidth={2}
                  fill="url(#splitGradient)"
                  animationDuration={showAnimation ? 800 : 0}
                  filter="url(#glow)"
                />

                {/* Now dot marker */}
                {nowPoint && (
                  <ReferenceDot
                    x={nowPoint.displayTime}
                    y={nowPoint.value}
                    r={5}
                    fill="var(--accent-purple)"
                    stroke="var(--bg-dark)"
                    strokeWidth={2}
                    label={{
                      value: "We're here",
                      position: "top",
                      fill: "var(--text-muted)",
                      fontSize: 9,
                      dy: -6,
                    }}
                  />
                )}

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "var(--glass-border)", strokeWidth: 1, strokeDasharray: "3 3" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* "Now" button */}
      <AnimatePresence>
        {showNowButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={scrollToNow}
            className="absolute bottom-3 right-2 px-2.5 py-1 rounded-full text-[10px] font-medium
              bg-[var(--accent-purple)] text-white shadow-lg flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Now
          </motion.button>
        )}
      </AnimatePresence>

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
