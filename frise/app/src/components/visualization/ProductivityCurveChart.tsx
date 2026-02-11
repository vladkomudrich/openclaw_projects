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
  ChartOptions,
  ChartData,
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

const ACCENT_PURPLE = "#7B68EE";
const PAN_THRESHOLD = 5; // index threshold

export default function ProductivityCurveChart({
  allChartData,
  nowIndex,
  initialRange,
  melatoninIndices,
  showAnimation,
  onPanStateChange,
}: ProductivityCurveChartProps) {
  const chartRef = useRef<ChartJS<"line">>(null);
  const initialCenterRef = useRef((initialRange.min + initialRange.max) / 2);

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

  // Handle pan complete
  const handlePanComplete = useCallback(() => {
    const chart = chartRef.current;
    if (!chart) return;
    
    const xScale = chart.scales.x;
    const currentCenter = (xScale.min + xScale.max) / 2;
    const diff = Math.abs(currentCenter - initialCenterRef.current);
    
    onPanStateChange(diff > PAN_THRESHOLD);
  }, [onPanStateChange]);

  // Split data into past and future for different colors
  const { pastData, futureData, labels } = useMemo(() => {
    const l = allChartData.map(d => d.displayTime);
    const past = allChartData.map(d => d.isPast ? d.value : null);
    const future = allChartData.map(d => !d.isPast ? d.value : null);
    return { labels: l, pastData: past, futureData: future };
  }, [allChartData]);

  // Chart data with two datasets (past grey, future colored)
  const chartData: ChartData<"line"> = useMemo(() => ({
    labels,
    datasets: [
      {
        label: "Past",
        data: pastData,
        fill: true,
        tension: 0.4,
        borderColor: "#5A5A62",
        backgroundColor: "rgba(90, 90, 98, 0.2)",
        borderWidth: 2,
        pointRadius: 0,
        spanGaps: false,
      },
      {
        label: "Future",
        data: futureData,
        fill: true,
        tension: 0.4,
        borderColor: ACCENT_PURPLE,
        backgroundColor: "rgba(123, 104, 238, 0.25)",
        borderWidth: 2,
        pointRadius: 0,
        spanGaps: false,
      },
    ],
  }), [labels, pastData, futureData]);

  // Chart options
  const options: ChartOptions<"line"> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: showAnimation ? { duration: 800, easing: "easeOutQuart" } : false,
    interaction: { mode: "index", intersect: false },
    scales: {
      x: {
        type: "category",
        min: initialRange.min,
        max: initialRange.max,
        grid: { display: false },
        ticks: {
          color: "rgba(255, 255, 255, 0.4)",
          font: { size: 9 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 5,
        },
        border: { display: false },
      },
      y: {
        min: 0,
        max: 100,
        display: false,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(20, 20, 25, 0.95)",
        titleColor: "#FFFFFF",
        bodyColor: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (item) => `${Math.round(item.raw as number)}%`,
        },
      },
      annotation: {
        annotations: {
          nowPoint: {
            type: "point",
            xValue: nowIndex,
            yValue: allChartData[nowIndex]?.value ?? 50,
            backgroundColor: ACCENT_PURPLE,
            borderColor: "#0A0A0F",
            borderWidth: 2,
            radius: 5,
          },
          nowLabel: {
            type: "label",
            xValue: nowIndex,
            yValue: Math.min(95, (allChartData[nowIndex]?.value ?? 50) + 10),
            content: ["We're here"],
            color: "rgba(255, 255, 255, 0.5)",
            font: { size: 9 },
          },
          ...(melatoninIndices ? {
            melatoninBox: {
              type: "box",
              xMin: melatoninIndices.startIdx,
              xMax: melatoninIndices.endIdx,
              yMin: 0,
              yMax: 100,
              backgroundColor: "rgba(123, 104, 238, 0.1)",
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
        },
        limits: {
          x: {
            min: 0,
            max: allChartData.length - 1,
            minRange: 15,
          },
        },
      },
    },
  }), [allChartData, nowIndex, initialRange, melatoninIndices, showAnimation, handlePanComplete]);

  if (allChartData.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-[var(--text-muted)]">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]" style={{ touchAction: "pan-x" }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
