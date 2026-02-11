"use client";

import { useMemo, useCallback, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  TooltipItem,
  ScriptableLineSegmentContext,
} from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  zoomPlugin,
  annotationPlugin
);

interface ChartDataPoint {
  time: string;
  displayTime: string;
  value: number;
  zone: string;
  isPast: boolean;
  minutesFromMidnight: number;
}

interface ProductivityCurveChartProps {
  allChartData: ChartDataPoint[];
  nowIndex: number;
  initialRange: { min: number; max: number };
  melatoninIndices: { startIdx: number; endIdx: number } | null;
  firstMinute: number;
  lastMinute: number;
  showAnimation: boolean;
  onPanStateChange: (isPannedAway: boolean) => void;
}

// Thermal colors matching globals.css
const THERMAL_COLORS = {
  low: "#4A5568",      // --thermal-low
  lowMid: "#5B8DEF",   // --thermal-low-mid
  mid: "#7B68EE",      // --thermal-mid
  high: "#9A8CF5",     // --thermal-high
  peak: "#FFB347",     // --thermal-peak
};

const GREY_PAST = "#4A4A52";
const ACCENT_PURPLE = "#7B68EE";

const ZONE_THRESHOLDS = {
  good: 75,
  moderate: 50,
  low: 25,
};

const PAN_THRESHOLD_MINUTES = 15;

const ADVICE_MESSAGES: Record<string, string[]> = {
  peak: ["🔥 Peak focus!", "💎 Deep work time.", "🎯 Max capacity."],
  good: ["⚡ Great energy.", "✨ Solid focus.", "💪 Complex tasks."],
  moderate: ["💫 Steady energy.", "☕ Break soon?", "📋 Admin tasks."],
  low: ["🌙 Rest period.", "😴 Light work.", "🧘 Take a break."],
};

export default function ProductivityCurveChart({
  allChartData,
  nowIndex,
  initialRange,
  melatoninIndices,
  firstMinute,
  lastMinute,
  showAnimation,
  onPanStateChange,
}: ProductivityCurveChartProps) {
  const chartRef = useRef<ChartJS<"line">>(null);

  // Listen for reset event from parent
  useEffect(() => {
    const handleReset = () => {
      const chart = chartRef.current;
      if (!chart) return;
      
      chart.zoomScale("x", { min: initialRange.min, max: initialRange.max }, "default");
      onPanStateChange(false);
    };

    window.addEventListener("resetChartToNow", handleReset);
    return () => window.removeEventListener("resetChartToNow", handleReset);
  }, [initialRange, onPanStateChange]);

  // Handle pan to show/hide Now button
  const handlePanComplete = useCallback(() => {
    const chart = chartRef.current;
    if (!chart) return;
    
    const xScale = chart.scales.x;
    const currentCenter = (xScale.min + xScale.max) / 2;
    const nowCenter = nowIndex;
    
    // If panned more than threshold away from now, show button
    const diff = Math.abs(currentCenter - nowCenter);
    const minutesDiff = (diff / allChartData.length) * (lastMinute - firstMinute);
    
    onPanStateChange(minutesDiff > PAN_THRESHOLD_MINUTES);
  }, [nowIndex, allChartData.length, firstMinute, lastMinute, onPanStateChange]);

  // Chart data
  const chartData: ChartData<"line"> = useMemo(() => {
    const labels = allChartData.map(d => d.displayTime);
    const values = allChartData.map(d => d.value);
    
    return {
      labels,
      datasets: [
        {
          label: "Energy",
          data: values,
          fill: true,
          tension: 0.4, // Smooth natural curve
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: ACCENT_PURPLE,
          pointHoverBorderColor: "#0A0A0F",
          pointHoverBorderWidth: 2,
          borderWidth: 2,
          segment: {
            borderColor: (ctx: ScriptableLineSegmentContext) => {
              const index = ctx.p0DataIndex;
              if (allChartData[index]?.isPast) {
                return GREY_PAST;
              }
              // Gradient based on value
              const value = allChartData[index]?.value ?? 50;
              if (value >= ZONE_THRESHOLDS.good) return THERMAL_COLORS.peak;
              if (value >= ZONE_THRESHOLDS.moderate) return THERMAL_COLORS.high;
              if (value >= ZONE_THRESHOLDS.low) return THERMAL_COLORS.mid;
              return THERMAL_COLORS.lowMid;
            },
            backgroundColor: (ctx: ScriptableLineSegmentContext) => {
              const index = ctx.p0DataIndex;
              if (allChartData[index]?.isPast) {
                return "rgba(74, 74, 82, 0.15)";
              }
              const value = allChartData[index]?.value ?? 50;
              if (value >= ZONE_THRESHOLDS.good) return "rgba(255, 179, 71, 0.25)";
              if (value >= ZONE_THRESHOLDS.moderate) return "rgba(154, 140, 245, 0.2)";
              if (value >= ZONE_THRESHOLDS.low) return "rgba(123, 104, 238, 0.15)";
              return "rgba(91, 141, 239, 0.1)";
            },
          },
        },
      ],
    };
  }, [allChartData]);

  // Chart options
  const options: ChartOptions<"line"> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: showAnimation ? {
      duration: 800,
      easing: "easeOutQuart",
    } : false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        type: "category",
        min: initialRange.min,
        max: initialRange.max,
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.4)",
          font: { size: 9 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
        border: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        display: false,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(20, 20, 25, 0.95)",
        titleColor: "#FFFFFF",
        bodyColor: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (items: TooltipItem<"line">[]) => {
            return items[0]?.label || "";
          },
          label: (item: TooltipItem<"line">) => {
            const idx = item.dataIndex;
            const point = allChartData[idx];
            const value = item.raw as number;
            const messages = ADVICE_MESSAGES[point?.zone || "moderate"];
            const message = messages[Math.floor(Date.now() / 10000) % messages.length];
            
            if (point?.isPast) {
              return [`${value}%`];
            }
            return [`${value}%`, "", message];
          },
        },
      },
      annotation: {
        annotations: {
          // "Now" dot marker
          nowPoint: {
            type: "point",
            xValue: nowIndex,
            yValue: allChartData[nowIndex]?.value ?? 50,
            backgroundColor: ACCENT_PURPLE,
            borderColor: "#0A0A0F",
            borderWidth: 2,
            radius: 6,
          },
          // "We're here" label
          nowLabel: {
            type: "label",
            xValue: nowIndex,
            yValue: (allChartData[nowIndex]?.value ?? 50) + 12,
            content: ["We're here"],
            color: "rgba(255, 255, 255, 0.4)",
            font: {
              size: 9,
            },
          },
          // Melatonin window overlay
          ...(melatoninIndices ? {
            melatoninBox: {
              type: "box",
              xMin: melatoninIndices.startIdx,
              xMax: melatoninIndices.endIdx,
              yMin: 0,
              yMax: 100,
              backgroundColor: "rgba(123, 104, 238, 0.08)",
              borderWidth: 0,
            },
          } : {}),
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
          onPanComplete: handlePanComplete,
        },
        zoom: {
          wheel: { enabled: false },
          pinch: { enabled: false },
          drag: { enabled: false },
        },
        limits: {
          x: {
            min: 0,
            max: allChartData.length - 1,
            minRange: Math.min(20, allChartData.length), // At least ~3h visible
          },
        },
      },
    },
  }), [allChartData, nowIndex, initialRange, melatoninIndices, showAnimation, handlePanComplete]);

  return (
    <div 
      className={`w-full h-[300px] ${showAnimation ? 'animate-draw-in' : ''}`}
      style={{ touchAction: "pan-x" }}
    >
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
