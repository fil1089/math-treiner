import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LevitatingCharacter } from "./LevitatingCharacter";
import { FloatingSymbols } from "./FloatingSymbols";

const C = {
  purple: "#6272A4",
  orange: "#D87233",
  teal: "#5CA7AD",
};

interface LevelConfig {
  id: number;
  label: string;
  name: string;
  stars: number;
  color: string;
  shadow: string;
  ranges: number[];   // empty = no range picker (level 1)
  rangeLabel: string; // prefix like "до"
}

const levels: LevelConfig[] = [
  { id: 1, label: "Уровень 1", name: "База", stars: 1, color: C.teal, shadow: "rgba(92,167,173,0.45)", ranges: [], rangeLabel: "" },
  { id: 2, label: "Уровень 2", name: "Легко", stars: 2, color: C.teal, shadow: "rgba(92,167,173,0.45)", ranges: [10, 15, 20, 30, 50, 99], rangeLabel: "до" },
  { id: 3, label: "Уровень 3", name: "Средне", stars: 3, color: C.teal, shadow: "rgba(92,167,173,0.45)", ranges: [50, 99], rangeLabel: "до" },
  { id: 4, label: "Уровень 4", name: "Тяжело", stars: 4, color: C.teal, shadow: "rgba(92,167,173,0.45)", ranges: [200, 500, 999], rangeLabel: "до" },
  { id: 5, label: "Уровень 5", name: "Эксперт", stars: 5, color: C.teal, shadow: "rgba(92,167,173,0.45)", ranges: [200, 500, 999], rangeLabel: "до" },
  { id: 6, label: "Уровень 6", name: "Гений", stars: 5, color: C.orange, shadow: "rgba(216,114,51,0.50)", ranges: [2000, 5000, 9999], rangeLabel: "до" },
];

function StarRow({ count, total = 5 }: { count: number; total?: number }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
            fill={i < count ? "#FFD233" : "rgba(255,255,255,0.3)"}
            stroke={i < count ? "#E8B800" : "rgba(255,255,255,0.2)"}
            strokeWidth="1"
          />
        </svg>
      ))}
    </div>
  );
}

interface LevelSelectScreenProps {
  onBack: () => void;
  onSelectLevel: (levelId: number, range: number) => void;
}

export function LevelSelectScreen({ onBack, onSelectLevel }: LevelSelectScreenProps) {
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<number | null>(null);

  const activeLevel = levels.find(l => l.id === activeLevelId) ?? null;

  const handleLevelTap = (level: LevelConfig) => {
    if (level.ranges.length === 0) {
      // Level 1: start immediately
      onSelectLevel(level.id, 9);
    } else {
      setActiveLevelId(level.id);
      setSelectedRange(null);
    }
  };

  const handlePlay = () => {
    if (!activeLevelId || !selectedRange) return;
    onSelectLevel(activeLevelId, selectedRange);
  };

  return (
    <div
      className="flex flex-col min-h-[100dvh] w-full relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #D8DDE6 0%, #CDD2DA 70%)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Floating symbols */}
      <FloatingSymbols variant="levelSelect" opacity={0.15} />

      {/* Decorative circles */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 240, height: 240, background: "rgba(92,167,173,0.07)", top: -60, right: -70 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 160, height: 160, background: "rgba(216,114,51,0.06)", bottom: 100, left: -50 }} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-2">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: C.teal, boxShadow: "0 3px 10px rgba(92,167,173,0.5)", border: "none", cursor: "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="m-0" style={{ fontSize: 24, fontWeight: 900, color: C.purple, letterSpacing: -0.5 }}>
          Выбор сложности
        </h1>
        <div className="w-10 h-10" />
      </div>

      {/* Character */}
      <div className="flex justify-center pt-1 pb-2">
        <LevitatingCharacter size={150} />
      </div>

      {/* Hint */}
      <p className="m-0 text-center px-6 mb-4" style={{ fontSize: 13, color: C.teal, fontWeight: 700 }}>
        Выбери уровень и начинай!
      </p>

      {/* Level grid */}
      <div className="px-5 flex-1">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {levels.map((level, idx) => {
            const isActive = activeLevelId === level.id;
            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: idx * 0.055, duration: 0.28, ease: "easeOut" }}
                whileTap={{ scale: 0.93 }}
                onClick={() => handleLevelTap(level)}
                className="flex flex-col items-center justify-center gap-1.5 rounded-2xl relative overflow-hidden"
                style={{
                  background: isActive
                    ? `linear-gradient(145deg, ${level.color} 0%, ${level.color}BB 100%)`
                    : `linear-gradient(145deg, ${level.color}CC 0%, ${level.color}99 100%)`,
                  boxShadow: isActive
                    ? `0 8px 24px ${level.shadow}, inset 0 1px 0 rgba(255,255,255,0.3), 0 0 0 3px white`
                    : `0 5px 14px ${level.shadow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
                  border: "none",
                  cursor: "pointer",
                  padding: "14px 8px 12px",
                  aspectRatio: "1 / 1",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
              >
                <div className="absolute -top-4 -right-4 w-14 h-14 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
                {level.id === 6 && (
                  <div className="absolute top-2 right-2.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M3 17l3-8 5 5 5-5 3 8H3z" fill="rgba(255,255,255,0.5)" />
                    </svg>
                  </div>
                )}
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", fontWeight: 700, letterSpacing: 0.2 }}>{level.label}</span>
                <span style={{ fontSize: 18, color: "white", fontWeight: 900, lineHeight: 1 }}>{level.name}</span>
                <StarRow count={level.stars} />
              </motion.button>
            );
          })}
        </div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-4 rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ background: "rgba(255,255,255,0.45)" }}
        >
          <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${C.orange}22` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke={C.orange} strokeWidth="2" />
              <path d="M12 7v5l3 3" stroke={C.orange} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="m-0" style={{ fontSize: 11, color: "#5A6375", fontWeight: 700, lineHeight: 1.4 }}>
            Звёзды — сложность. Гений — самый трудный уровень!
          </p>
        </motion.div>
      </div>

      <div style={{ height: 16 }} />

      {/* ── Range bottom sheet ─────────────────────────── */}
      <AnimatePresence>
        {activeLevel && activeLevel.ranges.length > 0 && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30"
              style={{ background: "rgba(98,114,164,0.35)", backdropFilter: "blur(3px)" }}
              onClick={() => setActiveLevelId(null)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="absolute bottom-0 left-0 right-0 z-40 rounded-t-3xl"
              style={{ background: "white", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
              </div>

              <div className="px-5 pb-8">
                {/* Level info */}
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${activeLevel.color}, ${activeLevel.color}BB)`, boxShadow: `0 4px 12px ${activeLevel.shadow}` }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 900, color: "white" }}>{activeLevel.id}</span>
                  </div>
                  <div>
                    <p className="m-0" style={{ fontSize: 11, color: "#8A929E", fontWeight: 700 }}>{activeLevel.label}</p>
                    <p className="m-0" style={{ fontSize: 18, fontWeight: 900, color: C.purple }}>{activeLevel.name}</p>
                  </div>
                  <div className="ml-auto">
                    <StarRow count={activeLevel.stars} />
                  </div>
                </div>

                {/* Range label */}
                <p className="m-0 mb-3" style={{ fontSize: 12, fontWeight: 800, color: "#6B7A8D", textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Выбери диапазон чисел:
                </p>

                {/* Range pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {/* Option MIX representing all ranges */}
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setSelectedRange(-1)}
                    className="rounded-2xl px-4 py-2.5"
                    style={{
                      background: selectedRange === -1
                        ? `linear-gradient(135deg, ${activeLevel.color}, ${activeLevel.color}CC)`
                        : `${activeLevel.color}15`,
                      border: selectedRange === -1 ? "none" : `1.5px solid ${activeLevel.color}40`,
                      cursor: "pointer",
                      boxShadow: selectedRange === -1 ? `0 4px 12px ${activeLevel.shadow}` : "none",
                      transition: "all 0.18s",
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 900, color: selectedRange === -1 ? "white" : activeLevel.color }}>
                      Все числа (Mix)
                    </span>
                  </motion.button>

                  {activeLevel.ranges.map(r => {
                    const isSelected = selectedRange === r;
                    return (
                      <motion.button
                        key={r}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setSelectedRange(r)}
                        className="rounded-2xl px-4 py-2.5"
                        style={{
                          background: isSelected
                            ? `linear-gradient(135deg, ${activeLevel.color}, ${activeLevel.color}CC)`
                            : `${activeLevel.color}15`,
                          border: isSelected ? "none" : `1.5px solid ${activeLevel.color}40`,
                          cursor: "pointer",
                          boxShadow: isSelected ? `0 4px 12px ${activeLevel.shadow}` : "none",
                          transition: "all 0.18s",
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: 900, color: isSelected ? "white" : activeLevel.color }}>
                          {activeLevel.rangeLabel} {r.toLocaleString("ru")}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Play button */}
                <motion.button
                  whileTap={{ scale: selectedRange ? 0.97 : 1 }}
                  onClick={handlePlay}
                  className="w-full rounded-2xl py-4 flex items-center justify-center gap-2"
                  style={{
                    background: selectedRange
                      ? `linear-gradient(135deg, ${C.orange}, #B85E20)`
                      : "rgba(0,0,0,0.06)",
                    border: "none",
                    cursor: selectedRange ? "pointer" : "not-allowed",
                    boxShadow: selectedRange ? `0 6px 20px rgba(216,114,51,0.45)` : "none",
                    transition: "all 0.2s",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3l14 9-14 9V3z" fill={selectedRange ? "white" : "#9AA0AA"} />
                  </svg>
                  <span style={{ fontSize: 17, fontWeight: 900, color: selectedRange ? "white" : "#9AA0AA", fontFamily: "'Nunito', sans-serif" }}>
                    {selectedRange ? (selectedRange === -1 ? "Играть (Mix)" : `Играть (до ${selectedRange.toLocaleString("ru")})`) : "Выбери диапазон"}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}