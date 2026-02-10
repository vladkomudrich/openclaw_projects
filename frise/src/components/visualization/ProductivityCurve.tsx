"use client";

import { useMemo, useCallback } from "react";
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
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";

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
  color: string;
}

// Dark theme thermal colors
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
  showAnimation = true 
}: ProductivityCurveProps) {
  // Transform points for chart
  const chartData: ChartDataPoint[] = useMemo(() => {
    return points
      .filter((_, index) => index % 3 === 0)
      .map(point => ({
        time: point.time,
        displayTime: formatTimeForDisplay(point.time),
        value: point.value,
        zone: point.zone,
        color: getColorForValue(point.value),
      }));
  }, [points]);

  // Get current time position
  const currentTime = useMemo(() => {
    const now = new Date();
    return format(now, "HH:mm");
  }, []);

  // Custom tooltip
  const CustomTooltip = useCallback(({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDataPoint }> }) => {
    if (!active || !payload || !payload[0]) return null;
    
    const data = payload[0].payload;
    const messages = ADVICE_MESSAGES[data.zone] || ADVICE_MESSAGES.moderate;
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    return (
      <motion.div 
        className="glass p-3 max-w-[180px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <div 
          className="text-lg font-display font-semibold"
          style={{ color: data.color }}
        >
          {data.displayTime}
        </div>
        <div className="stat-number text-[var(--text-primary)] mt-0.5">
          {data.value}%
        </div>
        <div className="text-xs text-[var(--text-secondary)] mt-1 capitalize">
          {data.zone === "peak" ? "Peak Focus" : data.zone} Zone
        </div>
        <div className="text-xs text-[var(--text-muted)] mt-2 border-t border-[var(--glass-border)] pt-2">
          {message}
        </div>
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

  const gradientId = "darkThermalGradient";

  return (
    <div className="w-full">
      <div 
        className={`w-full aspect-[16/9] md:aspect-[2/1] ${showAnimation ? 'animate-draw-in' : ''}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
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
              {/* Glow filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
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
                fontSize: 11, 
                fill: "var(--text-muted)",
                fontFamily: "var(--font-inter)"
              }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tickCount={6}
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
                fill="rgba(123, 104, 238, 0.15)"
                fillOpacity={1}
                label={{
                  value: "🌙 Melatonin Window",
                  position: "top",
                  fill: "var(--accent-purple)",
                  fontSize: 11,
                  fontFamily: "var(--font-display)",
                }}
              />
            )}

            {/* Current time indicator */}
            <ReferenceLine
              x={formatTimeForDisplay(currentTime)}
              stroke="var(--error)"
              strokeWidth={2}
              strokeDasharray="6 4"
              label={{
                value: "NOW",
                position: "top",
                fill: "var(--error)",
                fontSize: 10,
                fontWeight: "bold",
                fontFamily: "var(--font-display)",
              }}
            />

            {/* Main area */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#strokeGradient)"
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              animationDuration={showAnimation ? 1200 : 0}
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

      {/* Zone legend */}
      <div className="flex justify-between items-center text-xs mt-3 px-2">
        <div className="flex items-center gap-1.5">
          <span 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: THERMAL_COLORS.low }}
          />
          <span className="text-[var(--text-muted)]">Low Energy</span>
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
            <span className="text-[var(--text-muted)]">Peak Focus</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeForDisplay(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''} ${period}`;
}
