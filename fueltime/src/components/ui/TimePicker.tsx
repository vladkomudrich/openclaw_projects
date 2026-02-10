"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface TimePickerProps {
  value: string; // HH:mm format
  onChange: (time: string) => void;
  label?: string;
  is24Hour?: boolean;
  minuteStep?: number;
  minTime?: string;
  maxTime?: string;
}

export function TimePicker({
  value,
  onChange,
  label,
  is24Hour = false,
  minuteStep = 15,
}: TimePickerProps) {
  const [hours, minutes] = value.split(":").map(Number);
  const [isOpen, setIsOpen] = useState(false);

  // Generate hour options
  const hourOptions = useMemo(() => {
    const options: { value: number; label: string }[] = [];
    for (let h = 0; h < 24; h++) {
      let labelStr: string;

      if (is24Hour) {
        labelStr = h.toString().padStart(2, "0");
      } else {
        const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
        const period = h < 12 ? "AM" : "PM";
        labelStr = `${h12} ${period}`;
      }

      options.push({ value: h, label: labelStr });
    }
    return options;
  }, [is24Hour]);

  // Generate minute options
  const minuteOptions = useMemo(() => {
    const options: { value: number; label: string }[] = [];
    for (let m = 0; m < 60; m += minuteStep) {
      options.push({ value: m, label: m.toString().padStart(2, "0") });
    }
    return options;
  }, [minuteStep]);

  const handleHourChange = (newHour: number) => {
    const newTime = `${newHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    onChange(newTime);
  };

  const handleMinuteChange = (newMinute: number) => {
    const newTime = `${hours.toString().padStart(2, "0")}:${newMinute.toString().padStart(2, "0")}`;
    onChange(newTime);
  };

  const formatDisplay = () => {
    if (is24Hour) {
      return value;
    }
    const h12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const period = hours < 12 ? "AM" : "PM";
    return `${h12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <div className="flex gap-3 items-center justify-center">
        {/* Hour selector */}
        <WheelSelector
          options={hourOptions}
          value={hours}
          onChange={handleHourChange}
          className="w-20"
        />
        <span className="text-3xl font-display font-light text-[var(--text-secondary)]">:</span>
        {/* Minute selector */}
        <WheelSelector
          options={minuteOptions}
          value={Math.round(minutes / minuteStep) * minuteStep}
          onChange={handleMinuteChange}
          className="w-20"
        />
      </div>
    </div>
  );
}

interface WheelSelectorProps {
  options: { value: number; label: string }[];
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

function WheelSelector({ options, value, onChange, className = "" }: WheelSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = options.findIndex((opt) => opt.value === value);

  useEffect(() => {
    // Scroll to the selected item on mount
    if (containerRef.current) {
      const itemHeight = 44;
      containerRef.current.scrollTop = currentIndex * itemHeight;
    }
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const itemHeight = 44;
      const scrollTop = containerRef.current.scrollTop;
      const newIndex = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(options.length - 1, newIndex));
      if (options[clampedIndex] && options[clampedIndex].value !== value) {
        onChange(options[clampedIndex].value);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[var(--bg-dark-elevated)] to-transparent z-10 pointer-events-none rounded-t-xl" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[var(--bg-dark-elevated)] to-transparent z-10 pointer-events-none rounded-b-xl" />
      
      {/* Selection highlight */}
      <div className="absolute top-1/2 left-0 right-0 h-11 -translate-y-1/2 bg-[var(--glass-bg)] border-y border-[var(--glass-border)] pointer-events-none" />

      {/* Scrollable list */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-[132px] overflow-y-auto scrollbar-none snap-y snap-mandatory bg-[var(--bg-dark-elevated)] rounded-xl"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {/* Spacer top */}
        <div className="h-11" />
        
        {options.map((option, index) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                w-full h-11 flex items-center justify-center snap-center
                text-lg font-display transition-all
                ${isSelected
                  ? "text-[var(--text-primary)] font-semibold scale-110"
                  : "text-[var(--text-muted)] font-normal"
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
        
        {/* Spacer bottom */}
        <div className="h-11" />
      </div>
    </div>
  );
}

// Simple wheel-style time picker for mobile using native input
export function TimePickerWheel({
  value,
  onChange,
  label,
}: TimePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-4 py-3
          text-xl font-display font-semibold text-center
          bg-[var(--glass-bg)]
          border border-[var(--glass-border)]
          rounded-xl
          text-[var(--text-primary)]
          focus:border-[var(--eating-primary)]
          focus:ring-2 focus:ring-[var(--eating-primary)]/20
          focus:outline-none
          transition-all
          [&::-webkit-calendar-picker-indicator]:filter
          [&::-webkit-calendar-picker-indicator]:invert
        "
      />
    </div>
  );
}

// Styled time display button that opens a picker
interface TimeDisplayButtonProps {
  value: string;
  onClick?: () => void;
  variant?: "default" | "eating" | "fasting";
}

export function TimeDisplayButton({ value, onClick, variant = "default" }: TimeDisplayButtonProps) {
  const [hours, minutes] = value.split(":").map(Number);
  const h12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const period = hours < 12 ? "AM" : "PM";

  const variantClasses = {
    default: "text-[var(--text-primary)]",
    eating: "text-[var(--eating-primary)]",
    fasting: "text-[var(--fasting-primary)]",
  };

  return (
    <button
      onClick={onClick}
      className="flex items-baseline gap-1 group"
    >
      <span className={`text-4xl font-display font-semibold ${variantClasses[variant]} group-hover:opacity-80 transition-opacity`}>
        {h12}:{minutes.toString().padStart(2, "0")}
      </span>
      <span className="text-lg text-[var(--text-secondary)] font-medium">
        {period}
      </span>
    </button>
  );
}
