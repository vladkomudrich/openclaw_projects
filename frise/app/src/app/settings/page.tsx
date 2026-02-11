"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Slider, Switch, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useSleepData } from "@/hooks/useSleepData";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { exportData, importData, clearAllData } from "@/lib/storage";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings } = useSleepData();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const idealSleepHours = settings ? Math.floor(settings.idealSleepDuration / 60) : 8;
  const idealSleepMinutes = settings ? settings.idealSleepDuration % 60 : 0;

  const handleIdealSleepChange = useCallback((value: number | number[]) => {
    const minutes = Array.isArray(value) ? value[0] : value;
    updateSettings({ idealSleepDuration: minutes });
  }, [updateSettings]);

  const handleNotificationsChange = useCallback((enabled: boolean) => {
    updateSettings({ notificationsEnabled: enabled });
    
    if (enabled && "Notification" in window) {
      Notification.requestPermission();
    }
  }, [updateSettings]);

  const handleExport = useCallback(() => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `frise-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = importData(content);
        if (success) {
          setShowImportModal(false);
          setImportError(null);
          router.refresh();
        } else {
          setImportError("Failed to import data. Please check the file format.");
        }
      } catch {
        setImportError("Invalid file format. Please select a valid Frise export file.");
      }
    };
    reader.readAsText(file);
  }, [router]);

  const handleClearData = useCallback(() => {
    clearAllData();
    setShowClearModal(false);
    router.push("/");
  }, [router]);

  if (!settings) {
    return (
      <main className="container max-w-md mx-auto px-4 py-8 md:pt-24">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <GlassCard key={i} padding="lg">
              <div className="h-24 animate-shimmer rounded-lg" />
            </GlassCard>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container max-w-md mx-auto px-4 py-8 md:pt-24">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-display-md gradient-text">Settings</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Customize your experience
          </p>
        </motion.div>

        <motion.div 
          className="space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Ideal Sleep Duration */}
          <motion.div variants={itemVariants}>
            <GlassCard padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-blue)] flex items-center justify-center text-xl">
                  ⏰
                </div>
                <h2 className="font-display font-semibold text-[var(--text-primary)]">
                  Ideal Sleep Duration
                </h2>
              </div>
              
              <div className="text-center mb-5">
                <span className="stat-number gradient-text">
                  {idealSleepHours}h {idealSleepMinutes > 0 ? `${idealSleepMinutes}m` : ""}
                </span>
              </div>
              
              <Slider
                aria-label="Ideal sleep duration"
                step={15}
                minValue={300}
                maxValue={660}
                value={settings.idealSleepDuration}
                onChange={handleIdealSleepChange}
                classNames={{
                  track: "bg-[var(--glass-bg)] h-2",
                  filler: "bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-blue)]",
                  thumb: "bg-[var(--accent-blue)] border-2 border-[var(--bg-dark)]",
                }}
                showTooltip={false}
              />
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-2">
                <span>5h</span>
                <span>8h</span>
                <span>11h</span>
              </div>
              
              <p className="text-sm text-[var(--text-secondary)] mt-4 border-t border-[var(--glass-border)] pt-4">
                Used to calculate your sleep debt and optimal bedtime recommendations.
              </p>
            </GlassCard>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants}>
            <GlassCard padding="lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-purple)] flex items-center justify-center text-xl">
                    🔔
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-[var(--text-primary)]">
                      Morning Reminders
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Get reminded to log your sleep
                    </p>
                  </div>
                </div>
                <Switch
                  isSelected={settings.notificationsEnabled}
                  onValueChange={handleNotificationsChange}
                  classNames={{
                    wrapper: "bg-[var(--glass-bg)] group-data-[selected=true]:bg-[var(--accent-blue)]",
                    thumb: "bg-[var(--text-primary)]",
                  }}
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Data Management */}
          <motion.div variants={itemVariants}>
            <GlassCard padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--info)] flex items-center justify-center text-xl">
                  💾
                </div>
                <h2 className="font-display font-semibold text-[var(--text-primary)]">
                  Data Management
                </h2>
              </div>
              
              <div className="space-y-3">
                <GlassButton 
                  variant="glass" 
                  fullWidth 
                  onClick={handleExport}
                  icon={<span>📤</span>}
                >
                  Export Data
                </GlassButton>
                <GlassButton 
                  variant="glass" 
                  fullWidth 
                  onClick={() => setShowImportModal(true)}
                  icon={<span>📥</span>}
                >
                  Import Data
                </GlassButton>
                <GlassButton 
                  variant="ghost" 
                  fullWidth 
                  onClick={() => setShowClearModal(true)}
                  className="!text-[var(--error)] hover:!bg-[var(--error-muted)]"
                  icon={<span>🗑️</span>}
                >
                  Clear All Data
                </GlassButton>
              </div>
            </GlassCard>
          </motion.div>

          {/* About */}
          <motion.div variants={itemVariants}>
            <GlassCard padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--thermal-low)] to-[var(--accent-purple)] flex items-center justify-center text-xl">
                  🌙
                </div>
                <h2 className="font-display font-semibold text-[var(--text-primary)]">
                  About Frise
                </h2>
              </div>
              
              <p className="text-sm text-[var(--text-secondary)]">
                Frise helps you discover your natural productivity patterns based on sleep science
                and the Two-Process Model of sleep regulation.
              </p>
              
              <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Version</span>
                  <span className="font-display text-[var(--text-secondary)]">1.0.0</span>
                </div>
              </div>
              
              <div className="mt-4 flex gap-4 text-sm">
                <Link 
                  href="/privacy" 
                  className="text-[var(--accent-blue)] hover:text-[var(--accent-blue-light)] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/learn" 
                  className="text-[var(--accent-blue)] hover:text-[var(--accent-blue-light)] transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Import Modal */}
        <Modal 
          isOpen={showImportModal} 
          onClose={() => {
            setShowImportModal(false);
            setImportError(null);
          }}
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
                <span>📥</span>
                Import Data
              </span>
            </ModalHeader>
            <ModalBody>
              <p className="text-[var(--text-secondary)] mb-4">
                Select a Frise export file (.json) to restore your data.
              </p>
              <label className="block">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImport}
                  className="block w-full text-sm text-[var(--text-secondary)]
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[var(--glass-bg)] file:text-[var(--text-primary)]
                    hover:file:bg-[var(--glass-bg-hover)]
                    file:cursor-pointer file:transition-colors"
                />
              </label>
              {importError && (
                <p className="text-[var(--error)] text-sm mt-3">{importError}</p>
              )}
            </ModalBody>
            <ModalFooter>
              <GlassButton variant="ghost" onClick={() => setShowImportModal(false)}>
                Cancel
              </GlassButton>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Clear Data Modal */}
        <Modal 
          isOpen={showClearModal} 
          onClose={() => setShowClearModal(false)}
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
                Clear All Data?
              </span>
            </ModalHeader>
            <ModalBody>
              <p className="text-[var(--text-secondary)]">
                This will permanently delete all your sleep data and settings. 
                This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <GlassButton variant="ghost" onClick={() => setShowClearModal(false)}>
                Cancel
              </GlassButton>
              <GlassButton variant="danger" onClick={handleClearData}>
                Clear All Data
              </GlassButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </main>
  );
}
