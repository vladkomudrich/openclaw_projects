"use client";

import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { ProductivityPoint, MelatoninWindow } from "@/types";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// Lazy-load Chart.js to avoid SSR issues
import dynamic from "next/dynamic";

// Dynamic import wrapper for the chart
const ChartComponent = dynamic(() => import("./ProductivityCurveChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[140px] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

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

const ZONE_THRESHOLDS = {
  good: 75,
  moderate: 50,
  low: 25,
};

// Window: 4 hours visible (2h before + 2h after now)
const VISIBLE_HOURS = 4;

function getZone(value: number): string {
  if (value >= ZONE_THRESHOLDS.good) return "peak";
  if (value >= ZONE_THRESHOLDS.moderate) return "good";
  if (value >= ZONE_THRESHOLDS.low) return "moderate";
  return "low";
}

function formatTimeForDisplay(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''} ${period}`;
}

export function ProductivityCurve({ 
  points, 
  wakeTime,
  melatoninWindow,
  showAnimation = true,
}: ProductivityCurveProps) {
  const [showNowButton, setShowNowButton] = useState(false);
  
  // Calculate minutes from midnight, treating 00:00-04:59 as "late night" (add 24h)
  // This keeps the curve continuous from 5AM to 1AM next day
  const getAdjustedMinutes = (date: Date) => {
    const hours = date.getHours();
    const mins = date.getMinutes();
    // Before 5AM = still "yesterday" for the curve (add 24 hours)
    if (hours < 5) {
      return (hours + 24) * 60 + mins;
    }
    return hours * 60 + mins;
  };

  const [currentMinutes, setCurrentMinutes] = useState(() => getAdjustedMinutes(new Date()));

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMinutes(getAdjustedMinutes(new Date()));
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
        // Same adjustment: before 5AM = late night (add 24h)
        const mins = h < 5 ? (h + 24) * 60 + m : h * 60 + m;
        
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

  // Calculate data range info
  const { firstMinute, lastMinute, nowIndex } = useMemo(() => {
    if (allChartData.length === 0) return { 
      firstMinute: 0, lastMinute: 1440, nowIndex: 0 
    };
    
    const first = allChartData[0].minutesFromMidnight;
    const last = allChartData[allChartData.length - 1].minutesFromMidnight;
    
    // Find closest index to "now"
    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < allChartData.length; i++) {
      const diff = Math.abs(allChartData[i].minutesFromMidnight - currentMinutes);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }
    
    return {
      firstMinute: first,
      lastMinute: last,
      nowIndex: closestIdx,
    };
  }, [allChartData, currentMinutes]);

  // Melatonin window indices
  const melatoninIndices = useMemo(() => {
    if (!melatoninWindow) return null;
    
    const startStr = format(parseISO(melatoninWindow.startTime), "HH:mm");
    const endStr = format(parseISO(melatoninWindow.endTime), "HH:mm");
    const [sh, sm] = startStr.split(":").map(Number);
    const [eh, em] = endStr.split(":").map(Number);
    // Same late-night adjustment
    const startMins = sh < 5 ? (sh + 24) * 60 + sm : sh * 60 + sm;
    const endMins = eh < 5 ? (eh + 24) * 60 + em : eh * 60 + em;
    
    let startIdx = 0;
    let endIdx = allChartData.length - 1;
    
    for (let i = 0; i < allChartData.length; i++) {
      if (allChartData[i].minutesFromMidnight >= startMins && startIdx === 0) {
        startIdx = i;
      }
      if (allChartData[i].minutesFromMidnight >= endMins) {
        endIdx = i;
        break;
      }
    }
    
    return { startIdx, endIdx };
  }, [melatoninWindow, allChartData]);

  // Initial visible range (centered on now, 4h window)
  const initialRange = useMemo(() => {
    const visibleMinutes = VISIBLE_HOURS * 60;
    const halfVisible = visibleMinutes / 2;
    
    let minIdx = 0;
    let maxIdx = allChartData.length - 1;
    
    // Find indices that represent ±2h from now
    for (let i = 0; i < allChartData.length; i++) {
      if (allChartData[i].minutesFromMidnight >= currentMinutes - halfVisible && minIdx === 0) {
        minIdx = Math.max(0, i - 1);
      }
      if (allChartData[i].minutesFromMidnight >= currentMinutes + halfVisible) {
        maxIdx = Math.min(allChartData.length - 1, i);
        break;
      }
    }
    
    return { min: minIdx, max: maxIdx };
  }, [allChartData, currentMinutes]);

  // Handle pan state change
  const handlePanStateChange = useCallback((isPannedAway: boolean) => {
    setShowNowButton(isPannedAway);
  }, []);

  return (
    <div className="w-full relative">
      <ChartComponent
        allChartData={allChartData}
        nowIndex={nowIndex}
        initialRange={initialRange}
        melatoninIndices={melatoninIndices}
        firstMinute={firstMinute}
        lastMinute={lastMinute}
        showAnimation={showAnimation}
        onPanStateChange={handlePanStateChange}
      />

      {/* "Now" button */}
      <AnimatePresence>
        {showNowButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => {
              // Trigger reset via event
              window.dispatchEvent(new CustomEvent("resetChartToNow"));
            }}
            className="absolute bottom-3 right-2 px-2.5 py-1 rounded-full text-[10px] font-medium
              bg-[var(--accent-purple)] text-white shadow-lg flex items-center gap-1 z-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Now
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
