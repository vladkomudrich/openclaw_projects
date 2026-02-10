"use client";

import { useState, useCallback, useMemo } from "react";
import { Slider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { format, subDays, setHours, setMinutes, differenceInMinutes, addDays } from "date-fns";
import { motion } from "framer-motion";

interface SleepEntryFormProps {
  onSubmit: (bedtime: Date, wakeTime: Date) => void;
  initialBedtime?: Date;
  initialWakeTime?: Date;
  date?: string;
}

export function SleepEntryForm({
  onSubmit,
  initialBedtime,
  initialWakeTime,
  date,
}: SleepEntryFormProps) {
  const today = date ? new Date(date) : new Date();
  const yesterday = subDays(today, 1);

  // Default times: 11 PM bedtime, 7 AM wake
  const [bedtimeHour, setBedtimeHour] = useState(initialBedtime ? initialBedtime.getHours() : 23);
  const [bedtimeMinute, setBedtimeMinute] = useState(initialBedtime ? initialBedtime.getMinutes() : 0);
  const [wakeHour, setWakeHour] = useState(initialWakeTime ? initialWakeTime.getHours() : 7);
  const [wakeMinute, setWakeMinute] = useState(initialWakeTime ? initialWakeTime.getMinutes() : 0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Calculate actual dates
  const bedtimeDate = useMemo(() => {
    const baseDate = bedtimeHour >= 12 ? yesterday : today;
    return setMinutes(setHours(baseDate, bedtimeHour), bedtimeMinute);
  }, [bedtimeHour, bedtimeMinute, yesterday, today]);

  const wakeTimeDate = useMemo(() => {
    return setMinutes(setHours(today, wakeHour), wakeMinute);
  }, [wakeHour, wakeMinute, today]);

  // Calculate duration
  const durationMinutes = useMemo(() => {
    let duration = differenceInMinutes(wakeTimeDate, bedtimeDate);
    if (duration < 0) {
      duration = differenceInMinutes(addDays(wakeTimeDate, 1), bedtimeDate);
    }
    return duration;
  }, [bedtimeDate, wakeTimeDate]);

  const durationHours = Math.floor(durationMinutes / 60);
  const durationMins = durationMinutes % 60;

  // Validation
  const isUnusualDuration = durationMinutes < 180 || durationMinutes > 840;
  const durationWarning = durationMinutes < 180 
    ? "That's very short sleep. Are you sure?" 
    : durationMinutes > 840 
    ? "That's a very long sleep. Are you sure?" 
    : null;

  // Sleep quality indicator
  const sleepQuality = useMemo(() => {
    if (durationMinutes >= 420 && durationMinutes <= 540) return { label: "Optimal", color: "var(--success)", icon: "✨" };
    if (durationMinutes >= 360 && durationMinutes <= 600) return { label: "Good", color: "var(--accent-blue)", icon: "👍" };
    if (durationMinutes >= 300) return { label: "Short", color: "var(--warning)", icon: "⚡" };
    return { label: "Very Short", color: "var(--error)", icon: "⚠️" };
  }, [durationMinutes]);

  // Slider values
  const bedtimeSliderValue = useMemo(() => {
    if (bedtimeHour >= 18) return bedtimeHour * 60 + bedtimeMinute;
    return (bedtimeHour + 24) * 60 + bedtimeMinute;
  }, [bedtimeHour, bedtimeMinute]);

  const wakeTimeSliderValue = useMemo(() => {
    return wakeHour * 60 + wakeMinute;
  }, [wakeHour, wakeMinute]);

  const handleBedtimeSliderChange = useCallback((value: number | number[]) => {
    const v = Array.isArray(value) ? value[0] : value;
    const hour = Math.floor(v / 60) % 24;
    const minute = Math.round(v % 60 / 15) * 15;
    setBedtimeHour(hour);
    setBedtimeMinute(minute % 60);
  }, []);

  const handleWakeTimeSliderChange = useCallback((value: number | number[]) => {
    const v = Array.isArray(value) ? value[0] : value;
    const hour = Math.floor(v / 60);
    const minute = Math.round(v % 60 / 15) * 15;
    setWakeHour(hour);
    setWakeMinute(minute % 60);
  }, []);

  const handleSubmit = useCallback(() => {
    if (isUnusualDuration && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    onSubmit(bedtimeDate, wakeTimeDate);
  }, [isUnusualDuration, showConfirmation, bedtimeDate, wakeTimeDate, onSubmit]);

  const formatTimeDisplay = (hour: number, minute: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <motion.div 
      className="space-y-6 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Duration Display */}
      <GlassCard padding="xl" className="text-center">
        <p className="label">Total Sleep</p>
        <motion.div 
          className="flex items-baseline justify-center gap-2 mt-2"
          key={`${durationHours}-${durationMins}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="stat-number-xl gradient-text">{durationHours}</span>
          <span className="text-3xl text-[var(--text-secondary)] font-display">h</span>
          {durationMins > 0 && (
            <>
              <span className="stat-number-xl gradient-text">{durationMins}</span>
              <span className="text-3xl text-[var(--text-secondary)] font-display">m</span>
            </>
          )}
        </motion.div>
        
        {/* Quality indicator */}
        <motion.div 
          className="flex items-center justify-center gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span>{sleepQuality.icon}</span>
          <span 
            className="font-display font-medium"
            style={{ color: sleepQuality.color }}
          >
            {sleepQuality.label}
          </span>
        </motion.div>
      </GlassCard>

      {/* Time Cards */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard padding="md" className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🌙</span>
            <span className="text-sm text-[var(--text-secondary)]">Bedtime</span>
          </div>
          <p className="font-display font-semibold text-xl text-[var(--text-primary)]">
            {formatTimeDisplay(bedtimeHour, bedtimeMinute)}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {format(bedtimeDate, "MMM d")}
          </p>
        </GlassCard>
        
        <GlassCard padding="md" className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">☀️</span>
            <span className="text-sm text-[var(--text-secondary)]">Wake time</span>
          </div>
          <p className="font-display font-semibold text-xl text-[var(--text-primary)]">
            {formatTimeDisplay(wakeHour, wakeMinute)}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {format(wakeTimeDate, "MMM d")}
          </p>
        </GlassCard>
      </div>

      {/* Sliders */}
      <GlassCard padding="lg">
        <div className="space-y-8">
          {/* Bedtime Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                <span>🌙</span>
                Bedtime
              </label>
              <span className="font-display font-medium text-[var(--accent-purple)]">
                {formatTimeDisplay(bedtimeHour, bedtimeMinute)}
              </span>
            </div>
            <Slider
              aria-label="Bedtime"
              step={15}
              minValue={18 * 60}
              maxValue={28 * 60}
              value={bedtimeSliderValue}
              onChange={handleBedtimeSliderChange}
              className="max-w-full"
              classNames={{
                track: "bg-[var(--glass-bg)] h-2",
                filler: "bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-blue)]",
                thumb: "bg-[var(--accent-purple)] border-2 border-[var(--bg-dark)] shadow-[var(--shadow-glow-purple)]",
              }}
              showTooltip={false}
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-2">
              <span>6 PM</span>
              <span>10 PM</span>
              <span>2 AM</span>
            </div>
          </div>

          {/* Wake Time Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                <span>☀️</span>
                Wake time
              </label>
              <span className="font-display font-medium text-[var(--accent-gold)]">
                {formatTimeDisplay(wakeHour, wakeMinute)}
              </span>
            </div>
            <Slider
              aria-label="Wake time"
              step={15}
              minValue={4 * 60}
              maxValue={14 * 60}
              value={wakeTimeSliderValue}
              onChange={handleWakeTimeSliderChange}
              className="max-w-full"
              classNames={{
                track: "bg-[var(--glass-bg)] h-2",
                filler: "bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-gold)]",
                thumb: "bg-[var(--accent-gold)] border-2 border-[var(--bg-dark)] shadow-[var(--shadow-glow-blue)]",
              }}
              showTooltip={false}
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-2">
              <span>4 AM</span>
              <span>9 AM</span>
              <span>2 PM</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Warning */}
      {durationWarning && (
        <motion.div 
          className="glass-sm p-4"
          style={{ 
            background: "var(--warning-muted)",
            borderColor: "var(--warning)"
          }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm font-medium text-[var(--warning)]">
                Unusual Duration
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {durationWarning}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <GlassButton 
        onClick={handleSubmit} 
        fullWidth 
        size="xl"
        icon={<span>✨</span>}
      >
        See My Forecast
      </GlassButton>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={showConfirmation} 
        onClose={() => setShowConfirmation(false)}
        classNames={{
          base: "bg-[var(--bg-dark-elevated)] border border-[var(--glass-border)]",
          header: "border-b border-[var(--glass-border)]",
          body: "py-6",
          footer: "border-t border-[var(--glass-border)]",
        }}
      >
        <ModalContent>
          <ModalHeader className="font-display">
            <span className="flex items-center gap-2">
              <span>⚠️</span>
              Confirm Sleep Duration
            </span>
          </ModalHeader>
          <ModalBody>
            <p className="text-[var(--text-secondary)]">
              You entered <strong className="text-[var(--text-primary)]">{durationHours}h {durationMins}m</strong> of sleep from{" "}
              <strong className="text-[var(--text-primary)]">{formatTimeDisplay(bedtimeHour, bedtimeMinute)}</strong> to{" "}
              <strong className="text-[var(--text-primary)]">{formatTimeDisplay(wakeHour, wakeMinute)}</strong>.
            </p>
            <p className="mt-2 text-sm text-[var(--warning)]">
              {durationWarning}
            </p>
          </ModalBody>
          <ModalFooter>
            <GlassButton 
              variant="ghost" 
              onClick={() => setShowConfirmation(false)}
            >
              Go Back
            </GlassButton>
            <GlassButton 
              onClick={() => {
                setShowConfirmation(false);
                onSubmit(bedtimeDate, wakeTimeDate);
              }}
            >
              Confirm
            </GlassButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  );
}
