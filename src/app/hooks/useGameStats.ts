import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ───────────────────────────────────────────────
export interface GameStats {
  totalSolved: number;
  currentStreak: number;
  bestStreak: number;
  quickAnswers: number;
  levelsCompleted: number[];
  perfectLevels: number[];
  totalScore: number;
  hasPlayed: boolean;
  playerName: string;
  unlockedAchievements: number[];
  avatarId: number;
}

// ─── Persistence ─────────────────────────────────────────
const KEY = "mathtrainer_v2";

const DEFAULTS: GameStats = {
  totalSolved: 0,
  currentStreak: 0,
  bestStreak: 0,
  quickAnswers: 0,
  levelsCompleted: [],
  perfectLevels: [],
  totalScore: 0,
  hasPlayed: false,
  playerName: "Математик",
  unlockedAchievements: [],
  avatarId: 0,
};

function load(): GameStats {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULTS };
}

function save(s: GameStats) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

// ─── Achievement definitions ──────────────────────────────
export const ACHIEVEMENT_CHECKS: { id: number; check: (s: GameStats) => boolean }[] = [
  { id: 1, check: s => s.totalSolved >= 1 },
  { id: 2, check: s => s.totalSolved >= 10 },
  { id: 3, check: s => s.totalSolved >= 50 },
  { id: 4, check: s => s.totalSolved >= 100 },
  { id: 5, check: s => s.bestStreak >= 10 },
  { id: 6, check: s => s.bestStreak >= 20 },
  { id: 7, check: s => s.quickAnswers >= 10 },
  { id: 8, check: s => new Set(s.levelsCompleted).size >= 6 },
  { id: 9, check: s => s.perfectLevels.length >= 1 },
];

export function getAchievementProgress(stats: GameStats, id: number) {
  switch (id) {
    case 1: return { current: Math.min(stats.totalSolved, 1),   max: 1 };
    case 2: return { current: Math.min(stats.totalSolved, 10),  max: 10 };
    case 3: return { current: Math.min(stats.totalSolved, 50),  max: 50 };
    case 4: return { current: Math.min(stats.totalSolved, 100), max: 100 };
    case 5: return { current: Math.min(stats.bestStreak, 10),   max: 10 };
    case 6: return { current: Math.min(stats.bestStreak, 20),   max: 20 };
    case 7: return { current: Math.min(stats.quickAnswers, 10), max: 10 };
    case 8: return { current: Math.min(new Set(stats.levelsCompleted).size, 6), max: 6 };
    case 9: return { current: stats.perfectLevels.length > 0 ? 1 : 0, max: 1 };
    default: return { current: 0, max: 1 };
  }
}

// ─── Hook ────────────────────────────────────────────────
export function useGameStats(onAchievementUnlocked?: (id: number) => void) {
  const [stats, setStats] = useState<GameStats>(load);
  const cbRef = useRef(onAchievementUnlocked);
  cbRef.current = onAchievementUnlocked;

  // Persist on change
  useEffect(() => { save(stats); }, [stats]);

  // Core updater — checks achievements, fires callbacks for new ones
  const apply = useCallback((updater: (s: GameStats) => GameStats) => {
    setStats(prev => {
      const next = updater({ ...prev });
      const newOnes = ACHIEVEMENT_CHECKS
        .filter(a => a.check(next) && !prev.unlockedAchievements.includes(a.id))
        .map(a => a.id);
      if (newOnes.length > 0) {
        next.unlockedAchievements = [...prev.unlockedAchievements, ...newOnes];
        newOnes.forEach((id, i) =>
          setTimeout(() => cbRef.current?.(id), i * 1200)
        );
      }
      return next;
    });
  }, []);

  const recordCorrectAnswer = useCallback((isQuick: boolean) => {
    apply(s => ({
      ...s,
      totalSolved:    s.totalSolved + 1,
      currentStreak:  s.currentStreak + 1,
      bestStreak:     Math.max(s.bestStreak, s.currentStreak + 1),
      quickAnswers:   isQuick ? s.quickAnswers + 1 : s.quickAnswers,
      hasPlayed:      true,
    }));
  }, [apply]);

  const recordWrongAnswer = useCallback(() => {
    apply(s => ({ ...s, totalSolved: s.totalSolved + 1, currentStreak: 0, hasPlayed: true }));
  }, [apply]);

  const recordRoundComplete = useCallback((levelId: number, isPerfect: boolean) => {
    apply(s => ({
      ...s,
      levelsCompleted: s.levelsCompleted.includes(levelId)
        ? s.levelsCompleted
        : [...s.levelsCompleted, levelId],
      perfectLevels: isPerfect && !s.perfectLevels.includes(levelId)
        ? [...s.perfectLevels, levelId]
        : s.perfectLevels,
    }));
  }, [apply]);

  const updateScore = useCallback((newScore: number) => {
    apply(s => ({ ...s, totalScore: newScore }));
  }, [apply]);

  const updatePlayerName = useCallback((name: string) => {
    apply(s => ({ ...s, playerName: name }));
  }, [apply]);

  const updateAvatarId = useCallback((id: number) => {
    apply(s => ({ ...s, avatarId: id }));
  }, [apply]);

  const resetStats = useCallback(() => {
    setStats({ ...DEFAULTS });
    try { localStorage.removeItem(KEY); } catch {}
  }, []);

  return {
    stats,
    recordCorrectAnswer,
    recordWrongAnswer,
    recordRoundComplete,
    updateScore,
    updatePlayerName,
    updateAvatarId,
    resetStats,
  };
}