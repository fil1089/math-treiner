import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconFootprint,
  IconCheckCircle,
  IconBulb,
  IconTrophy,
  IconTarget,
  IconFlame,
  IconLightning,
  IconCrown,
  IconStar,
} from "./icons/AchievementIcons";

// ─── Toast metadata (icons only — no emojis) ─────────────
const TOAST_META: Record<number, { title: string; icon: React.ReactNode; color: string }> = {
  1: { title: "Первый пример",  icon: <IconFootprint  size={24} />, color: "#5CA7AD" },
  2: { title: "10 примеров",    icon: <IconCheckCircle size={24} />, color: "#5CA7AD" },
  3: { title: "50 примеров",    icon: <IconBulb        size={24} />, color: "#5CA7AD" },
  4: { title: "100 примеров",   icon: <IconTrophy      size={24} />, color: "#5CA7AD" },
  5: { title: "Без ошибок 10",  icon: <IconTarget      size={24} />, color: "#6272A4" },
  6: { title: "Серия 20",       icon: <IconFlame       size={24} />, color: "#6272A4" },
  7: { title: "Быстрый ум",     icon: <IconLightning   size={24} />, color: "#6272A4" },
  8: { title: "Мастер счёта",   icon: <IconCrown       size={24} />, color: "#D87233" },
  9: { title: "Безупречный",    icon: <IconStar        size={24} />, color: "#D87233" },
};

// ─── Unlock label icon (replaces 🎉) ─────────────────────
function UnlockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l2.4 5.1L20 8l-4 3.9 0.9 5.6L12 14.9l-4.9 2.6L9 12 5 8l5.6-0.9L12 2z"
        fill="#FFD233" stroke="#D4A017" strokeWidth="1" strokeLinejoin="round"
      />
    </svg>
  );
}

interface AchievementToastProps {
  achievementId: number | null;
  onDismiss: () => void;
}

export function AchievementToast({ achievementId, onDismiss }: AchievementToastProps) {
  const meta = achievementId != null ? TOAST_META[achievementId] : null;

  // Auto-dismiss after 3.2s
  useEffect(() => {
    if (achievementId == null) return;
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [achievementId, onDismiss]);

  return (
    <AnimatePresence>
      {meta && (
        <motion.div
          key={achievementId}
          initial={{ y: -110, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -110, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", bounce: 0.38, duration: 0.55 }}
          className="absolute left-4 right-4 z-[100] pointer-events-none"
          style={{ top: 52 }}
        >
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${meta.color} 0%, ${meta.color}CC 100%)`,
              boxShadow: `0 8px 32px ${meta.color}60, 0 2px 8px rgba(0,0,0,0.15)`,
            }}
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.1, delay: 0.3, ease: "easeInOut" }}
            />

            {/* Icon badge */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.22)", border: "1.5px solid rgba(255,255,255,0.35)" }}
            >
              {meta.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <UnlockIcon />
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.85)", fontFamily: "'Nunito', sans-serif" }}>
                  Ачивка разблокирована!
                </span>
              </div>
              <p className="m-0 text-white" style={{ fontSize: 15, fontWeight: 900, fontFamily: "'Nunito', sans-serif" }}>
                {meta.title}
              </p>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 flex-shrink-0">
              {[0, 1, 2].map(i => (
                <motion.svg
                  key={i}
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 + i * 0.12, type: "spring", bounce: 0.5 }}
                >
                  <path
                    d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
                    fill="#FFD233" stroke="#E8B800" strokeWidth="1"
                  />
                </motion.svg>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
